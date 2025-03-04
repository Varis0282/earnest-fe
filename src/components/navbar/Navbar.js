import { LogoutOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const Navbar = ({ data, search, setSearch, handleSearchChange }) => {

    const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <div className='flex md:flex-row flex-col md:justify-between justify-evenly bg-black min-h-[70px] items-center'>
            <p className='pl-2 justify-end hidden md:inline md:w-[230px] px-1'></p>
            <p className='md:text-2xl text-lg font-bold text-white justify-center items-center '>Earnest Fintech Limited</p>
            <p className='pr-4 md:gap-8 gap-4 flex flex-row md:items-center md:justify-center justify-end w-full md:w-auto'>
                <input
                    type="text"
                    placeholder='Search...'
                    value={search}
                    onChange={(e) => { handleSearchChange(e) }}
                    className='rounded md:h-[42px] h-8 w-32 md:w-[180px] px-4 focus:border-0 focus:ring-0 focus:outline-none'
                />
                <Tooltip title='Logout'>
                    <LogoutOutlined onClick={logOut} className='text-white text-[24px]' />
                </Tooltip>
            </p>
        </div>
    )
}

export default Navbar
