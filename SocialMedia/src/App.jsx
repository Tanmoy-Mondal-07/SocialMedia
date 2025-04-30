import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
import userInfo from './appwrite/auth'
import { Container, Footer, Header } from './component'
import { showLoading, hideLoading } from './store/LodingState'
import { Outlet } from 'react-router-dom'
import './App.css'
// import Loader from './pages/Loding'

function App() {
  const dispatch = useDispatch()
  // const [loding, setloding] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch(showLoading())
      // setloding(true)
      try {
        const userData = await userInfo.getCurrentUser()
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
          localStorage.setItem("recommendedUserIds", null)
        }
      } catch (err) {
        dispatch(logout())
      } finally {
        console.log('render');
        dispatch(hideLoading())
        // setloding(false)
      }
    }

    checkAuthStatus()
  }, [dispatch])

  // if (loding) {
  //   return <Loader/>
  // }

  return (
    <>
      <Header />
      <main className="min-h-[100vh] px-4 sm:px-6 lg:px-8">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default App
