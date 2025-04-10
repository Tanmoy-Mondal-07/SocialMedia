import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
import userInfo from './appwrite/auth'
import { Container, Footer, Header } from './component'
import { showLoading, hideLoading } from './store/LodingState'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch(showLoading())
      try {
        const userData = await userInfo.getCurrentUser()
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      } catch (err) {
        dispatch(logout())
      } finally {
        dispatch(hideLoading())
      }
    }

    checkAuthStatus()
  }, [dispatch])

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-160px)] px-4 sm:px-6 lg:px-8">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default App
