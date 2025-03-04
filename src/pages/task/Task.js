import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../config'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/LoaderReducer'
import { message, Card, Avatar, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Navbar, Modal } from '../../components'
const { Meta } = Card;


const Task = () => {

  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [segregatedTasks, setSegregatedTasks] = useState({
    pending: [],
    inProgress: [],
    completed: []
  });
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${localStorage.getItem("token")}`,
  }

  const handleEdit = (task) => {
    setCurrentTask(task);
    setOpenEdit(true);
  }

  const getTasks = async () => {
    dispatch(setLoading(true))
    try {
      const response = await axios.get(`${baseUrl}/api/task`, { headers })
      if (response.data.success) {
        message.success(response.data.message)
        segregateTasks(response.data.tasks);
        setTask(response.data.tasks)
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Some error occured')
      console.log("Error in getTasks", error);
    }
    dispatch(setLoading(false))
  };

  const convertDate = (date) => {
    let d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()}`
  }

  const convertDateTime = (date) => {
    let d = new Date(date);
    let hours = d.getHours();
    let minutes = String(d.getMinutes()).padStart(2, '0');
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()} at ${hours}:${minutes} ${ampm}`;
  };


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    let filteredData = task.filter((val) => {
      return val.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredTasks(filteredData);
    segregateTasks(filteredData);
  }

  const segregateTasks = (tasks) => {
    let pending = tasks.filter((val) => {
      return val.status === 'Pending';
    });
    let inProgress = tasks.filter((val) => {
      return val.status === 'In Progress';
    });
    let completed = tasks.filter((val) => {
      return val.status === 'Completed';
    });
    setSegregatedTasks({
      pending,
      inProgress,
      completed
    });
  }

  const deleteTask = async (id) => {
    dispatch(setLoading(true))
    try {
      const response = await axios.delete(`${baseUrl}/api/task/${id}`, { headers })
      if (response.data.success) {
        message.success(response.data.message)
        getTasks();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Some error occured')
      console.log("Error in deleteTask", error);
    }
    dispatch(setLoading(false))
  }

  useEffect(() => {
    getTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (search === '') {
      setFilteredTasks(task)
    }
  }, [search, task]);

  return (
    task && (
      <div className='flex flex-col'>
        <Navbar search={search} handleSearchChange={handleSearchChange} />
        <h1 className='flex flex-row justify-between py-8 text-3xl font-bold text-center mb-5'>
          <p className='w-0 md:w-1/3'></p>
          <p className='w-1/2 md:w-1/3'>Tasks</p>
          <p className='w-1/2 md:w-1/3 flex text-[14px] justify-end px-5'>
            <button className='bg-orange-500 rounded text-white px-4' onClick={() => setOpen(true)}>Add Tasks</button>
            <Modal open={open} setOpen={setOpen} type={'add'} getTasks={getTasks} />
          </p>
        </h1>
        <div className='border border-gray-300 rounded mx-4 p-4'>
          <div className='text-left mb-4 text-lg font-semibold border-b pb-2'>
            {filteredTasks.length === 0 ? <span>No tasks found</span> :
              <span>
                {filteredTasks.length} Task found :
                <span className='text-green-500 mx-2 text-[16px] cursor-pointer'>{segregatedTasks.completed.length} Tasks Completed</span>
                <span className='text-blue-500 mx-2 text-[16px] cursor-pointer'>{segregatedTasks.inProgress.length} Tasks In Progress</span>
                <span className='text-yellow-500 mx-2 text-[16px] cursor-pointer'>{segregatedTasks.pending.length} Tasks Pending</span>
              </span>}
          </div>
          <div className='flex min-h-[60vh] md:justify-start justify-center md:flex-nowrap flex-wrap gap-y-3 flex-row items-start gap-x-4'>
            {filteredTasks.map((task, index) => (
              <Card
                style={{
                  width: 300,
                }}
                hoverable
                actions={[
                  <>
                    <EditOutlined key="edit" onClick={() => handleEdit(task)} />
                  </>,
                  <>
                    <DeleteOutlined key="delete"
                      onClick={() => { deleteTask(task._id) }}
                    />
                  </>
                ]}
                // onClick={() => handleEdit(task)}
                key={index}
              >
                <Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={task?.title}
                  description={task?.description}
                />
                <div className={`flex items-center justify-center mt-3 rounded text-white text-[16px] font-medium ${task?.status === 'Pending' ? 'bg-yellow-500' : task?.status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'}`}>
                  {task?.status}
                </div>
                <div className='flex flex-col mt-3 text-[14px]'>
                  <div className='font-medium'>
                    <span>Priority : </span>
                    <span
                      className={`${task?.priority === 'High' ? 'text-red-500' : task?.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}
                    >
                      {task?.priority}
                    </span>
                  </div>
                  <div className='font-medium'>
                    <span>Deadline : </span>
                    <Tooltip title={convertDateTime(task?.deadline)}>
                      {convertDate(task?.deadline)}
                    </Tooltip>
                  </div>
                  <div className='font-medium'>
                    <span>Created at : </span>
                    <Tooltip title={convertDateTime(task?.createdAt)}>
                      {convertDate(task?.createdAt)}
                    </Tooltip>
                  </div>
                  <div className='font-medium'>
                    <span>Completed at : </span>
                    <Tooltip title={convertDateTime(task?.completedAt)}>
                      {convertDate(task?.completedAt)}
                    </Tooltip>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        {currentTask && <Modal open={openEdit} setCurrentTask={setCurrentTask} setOpen={setOpenEdit} type={'edit'} data={currentTask} getTasks={getTasks} />}
      </div>
    )
  )
}

export default Task
