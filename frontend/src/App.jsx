import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SignUpPage from './page/SignUpPage'
import { useDispatch } from 'react-redux'
import Layout from "./Layout/Layout.jsx"
import { Toaster } from 'react-hot-toast'
import AuthLayout from './components/AuthLayout.jsx'
import AddProblem from './page/AddProblemPage.jsx'
import { currentUser } from './store/Slices/authSlice.js'
import ProblemLayout from './Layout/ProblemLayout.jsx'
import ProblemPage from './page/ProblemPage.jsx'
import ProblemDetails from './page/ProblemDetails.jsx'
import { ProblemDetail } from './components/ProblemDetail.jsx'
import { Testing } from './components/Testing.jsx'
import PlaylistLayout from './Layout/PlaylistLayout.jsx'
import ProblemProgress from './components/Testing2.jsx'
import { ProfileDetails } from './components/ProfileDetails.jsx'

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUser())
  })

  return (
    <div className='flex flex-col items-center justify-center'>
      <Toaster />
      <Routes>
        <Route
          path='/'
          element={<Layout />}>
          <Route path='' element={
            <AuthLayout authentication={false}>
              <HomePage />
            </AuthLayout>
          } />

          <Route 
            path='/profile/:userId'
            element={<ProfileDetails />}
          />
        </Route>
        <Route
          path='/login'
          element={
            <AuthLayout authentication={false}>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path='/signup'
          element={
            <AuthLayout authentication={false}>
              <SignUpPage />
            </AuthLayout>
          }
        />
        <Route
          path='/create-problem'
          element={
            <AuthLayout authentication={true}>
              <AddProblem />
            </AuthLayout>
          }
        />
        <Route path='/problems' element={<ProblemLayout />}>
          <Route path='' element={<ProblemPage />} />
        </Route>

        <Route path='/testing2' element={<ProblemProgress />} />

        <Route path='/' element={<PlaylistLayout />}>
          <Route
            path='playlist/:playlistId'
            element={<Testing />}
          />
        </Route>

        <Route
          path='/problem/:id'
          element={
            <AuthLayout authentication={true}>
              <ProblemDetail />
            </AuthLayout>
          }
        />
      </Routes>
    </div>
  )
}

export default App