import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
import userInfo from './appwrite/auth'
import { Container, Footer, Header } from './component'
import { showLoading, hideLoading } from './store/LodingState'
import { Outlet } from 'react-router-dom'
import './App.css'
import appwriteNotificationsService from './appwrite/notificationsConfig'
import { addNotification, getNotification } from './utils/notificationsCacheService'
import getProfilesByCache from './utils/getProfilesThroughache'
import appwritePostConfigService from './appwrite/postConfig'
import { haveNotification } from './store/hasNotiStore'

function App() {
  const dispatch = useDispatch()
  const [lodingComplete, setLlodingComplete] = useState(true)

  useEffect(() => {
    setLlodingComplete(false)
    const checkAuthStatus = async () => {
      dispatch(showLoading())
      try {
        const userData = await userInfo.getCurrentUser()
        if (userData) {
          dispatch(login({ userData }))
          fetchAndCacheNotifications(userData.$id)
        } else {
          dispatch(logout())
          localStorage.setItem("recommendedUserIds", null)
        }
      } catch (err) {
        dispatch(logout())
      } finally {
        // console.log('render');
        dispatch(hideLoading())
        setLlodingComplete(true)
      }
    }

    checkAuthStatus()

    // noti
    const fetchAndCacheNotifications = async (userId) => {
      try {
        const response = await appwriteNotificationsService.getNotifications({ userId })
        const notifications = response?.documents || []
        if (notifications.length > 0) dispatch(haveNotification())

        await Promise.all(notifications.map(processNotification))

      } catch (err) {
        // setError(err.message)
      }
    }

    const processNotification = async (notification) => {
      try {
        const exists = await getNotification(notification.$id)
        if (exists) return

        const relatedUserInfo = await getProfilesByCache(notification.relatedUserId)
        let relatedPostInfo = null

        if (['comment', 'replay'].includes(notification.type)) {
          relatedPostInfo = await appwritePostConfigService.getPost(notification.relatedPostId)
        }

        const cacheData = { ...notification, relatedUserInfo, relatedPostInfo }
        await addNotification(cacheData)

      } catch (err) {
        console.error(`Failed to process notification ${notification.$id}`, err)
      }
    }


  }, [dispatch])

  return lodingComplete && (
    <>
      <Header/>
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
