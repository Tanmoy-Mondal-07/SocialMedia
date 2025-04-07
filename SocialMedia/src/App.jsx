import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from "./store/authSlice"
import userInfo from './appwrite/auth'
import { Container, Footer, Header} from './component'
import { showLoading,hideLoading } from './store/LodingState'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(showLoading())
    userInfo.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => dispatch(hideLoading()))
  }, [])


  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </>
  )
}

export default App
