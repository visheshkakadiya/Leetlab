import React, { useState } from 'react'
import { Logo } from './Logo'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRightFromBracket, faPlus } from '@fortawesome/free-solid-svg-icons'
import { logoutUser } from '../store/Slices/authSlice.js';

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const authUser = useSelector((state) => state.auth?.status)
    const avatar = useSelector((state) => state.auth?.user?.avatar?.url)
    const user = useSelector((state) => state.auth?.user)
    const [toggleMenu, setToggleMenu] = useState(false)

    const toolTipItems = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Visit Profile',
            link: '/profile'
        },
        {
            icon: <FontAwesomeIcon icon={faRightFromBracket} />,
            title: 'Logout',
            link: '/login',
        }
    ]

    const handleLogout = () => {
        dispatch(logoutUser())
        setToggleMenu(false)
        navigate('/login')
    }

    return (
        <div className='w-full bg-[#212529] flex items-center justify-between px-4 py-2 relative z-10 border-1 border-gray-600'>
            <div>
                <Logo />
            </div>

            <div className='text-white'>problems</div>

            {authUser ? (
                <div className='relative mr-7'>
                    <img
                        src={avatar || 'https://avatar.iran.liara.run/public/boy.png'}
                        alt='User Avatar'
                        className='w-9 h-9 object-cover rounded-full cursor-pointer'
                        onClick={() => setToggleMenu(!toggleMenu)}
                    />

                    {toggleMenu && (
                        <div className='absolute right-0 mt-2 w-40 bg-[#222222] shadow-md rounded-md overflow-hidden text-sm'>
                            {user?.role === 'ADMIN' && (
                                <Link
                                    to='/create-problem'
                                    className='flex items-center gap-2 px-4 py-2 text-slate-200 hover:bg-white/10 border-t border-gray-200 hover:cursor-pointer'
                                    onClick={() => setToggleMenu(false)}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    Create Problem
                                </Link>
                            )}
                            {toolTipItems.map((item, index) => (
                                item.title === 'Logout' ? (
                                    <button
                                        key={index}
                                        onClick={handleLogout}
                                        className='flex w-full items-center gap-2 px-4 py-2 text-slate-200 hover:bg-white/10 text-left hover:cursor-pointer'
                                    >
                                        {item.icon}
                                        {item.title}
                                    </button>
                                ) : (
                                    <Link
                                        to={item.link}
                                        key={index}
                                        className='flex items-center gap-2 px-4 py-2 text-slate-200 hover:bg-white/10 hover:cursor-pointer'
                                        onClick={() => setToggleMenu(false)}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </Link>
                                )))}
                        </div>
                    )}
                </div>
            ) : (
                <div className='flex gap-4 text-white'>
                    <Link to='/login'>Login</Link>
                    <Link to='/signup'>Signup</Link>
                </div>
            )}
        </div>
    )
}

export default Navbar
