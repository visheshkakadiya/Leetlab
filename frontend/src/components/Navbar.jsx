"use client"
import React, { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRightFromBracket, faPlus } from '@fortawesome/free-solid-svg-icons'
import { currentUser, logoutUser } from '../store/Slices/authSlice.js';
import { Flame } from 'lucide-react'

// ✅ import shadcn dropdown components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authUser = useSelector((state) => state.auth?.status)
  const userId = useSelector((state) => state.auth?.user?.id)
  const avatar = useSelector((state) => state.auth?.user?.imageUrl)
  const user = useSelector((state) => state.auth?.user)
  const [toggleMenu, setToggleMenu] = useState(false)

  const toolTipItems = [
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      title: 'Visit Profile',
      link: `/profile/${userId}`,
    },
    {
      icon: <FontAwesomeIcon icon={faRightFromBracket} />,
      title: 'Logout',
      link: '/login',
    }
  ]

  useEffect(() => {
    if (avatar === undefined) {
      dispatch(currentUser());
    }
  }, [authUser, userId, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <div className='w-full bg-[#222222] flex items-center justify-between px-4 py-2 relative z-10 border-1 border-gray-600'>
      <div className='flex items-center gap-4'>
        <Logo />
        <NavLink
          to="/problems"
          className={({ isActive }) =>
            `text-white text-sm px-3 py-2 rounded-md transition-colors ${
              isActive ? 'bg-white/10 pointer-events-none' : 'hover:bg-white/10 text-white/50'
            }`
          }
        >
          Problems
        </NavLink>
      </div>

      {authUser ? (
        <div className='relative mr-7'>
          <div className='flex gap-4'>
            {avatar === undefined ? (
              <div className='w-9 h-9 bg-gray-600 rounded-full cursor-pointer animate-pulse'></div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    src={avatar || 'https://avatar.iran.liara.run/public/boy.png'}
                    alt='User Avatar'
                    className='w-9 h-9 object-cover rounded-full cursor-pointer'
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/80 text-white border border-neutral-800 z-50 mt-3 mr-5 w-64 p-3 rounded-lg shadow-lg">
                  {user?.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link
                        to='/create-problem'
                        className='flex items-center gap-2 w-full px-2 py-1 hover:bg-white/10 rounded-sm hover:cursor-pointer'
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Create Problem
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {toolTipItems.map((item, index) =>
                    item.title === 'Logout' ? (
                      <DropdownMenuItem key={index} onClick={handleLogout} className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded-sm text-red-700 hover:cursor-pointer">
                        {item.icon}
                        {item.title}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild key={index}>
                        <Link
                          to={item.link}
                          className="flex items-center gap-2 w-full px-2 py-1 hover:bg-white/10 rounded-sm hover:cursor-pointer"
                        >
                          {item.icon}
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
