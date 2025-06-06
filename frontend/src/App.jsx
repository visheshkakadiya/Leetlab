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
import { ProblemDetail } from './components/ProblemDetail.jsx'
import { PlaylistDetail } from './components/PlaylistDetail.jsx'
import PlaylistLayout from './Layout/PlaylistLayout.jsx'
import { ProfileDetails } from './components/ProfileDetails.jsx'
import AdminRoute from './components/AdminRoute.jsx'

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUser())
  }, [dispatch])

  return (
    <div className='flex flex-col items-center justify-center'>
      <Toaster
        position="bottom-right"
        reverseOrder={true}
        toastOptions={{
          error: {
            style: { borderRadius: "0", color: "red" },
          },
          success: {
            style: { borderRadius: "0", color: "green" },
          },
          duration: 2000,
        }}
      />
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
            element={
              <AuthLayout authentication>
                <ProfileDetails />
              </AuthLayout>
            }
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
        <Route element={<AdminRoute />}>
          <Route
            path="/create-problem"
            element={<AddProblem />}
          />
        </Route>

        <Route path='/problems' element={<ProblemLayout />}>
          <Route path='' element={
            <AuthLayout authentication>
              <ProblemPage />
            </AuthLayout>
          } />
        </Route>

        <Route path='/' element={<PlaylistLayout />}>
          <Route
            path='playlist/:playlistId'
            element={
              <AuthLayout authentication>
                <PlaylistDetail />
              </AuthLayout>
            }
          />
        </Route>

        <Route
          path='/problem/:id'
          element={
            <AuthLayout authentication>
              <ProblemDetail />
            </AuthLayout>
          }
        />
      </Routes>
    </div>
  )
}

export default App