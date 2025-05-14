import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SignUpPage from './page/SignUpPage'
import {useDispatch} from 'react-redux'
import { currenUser } from './store/Slices/authSlice.js'

const App = () => {

  const dispatch = useDispatch();

  return (
    <div className='flex flex-col items-center justify-center'>
      <Routes>
        <Route 
          path='/'
          element={<HomePage />}
        />
        <Route 
          path='/login'
          element={<LoginPage />}
        />
        <Route 
          path='/signup'
          element={<SignUpPage />}
        />
      </Routes>
    </div>
  )
}

export default App