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
import appwriteInboxServicConfig from './appwrite/chatServis'
import { haveNotification } from './store/hasNotiStore'
import { addNewChats, refreshChats } from './store/inboxSlice'
import { Query } from 'appwrite'

function App() {
  const dispatch = useDispatch()
  const [socketLive, setsocketLive] = useState(false)
  const [currentUserData, setcurrentUserData] = useState(null)

  useEffect(() => {
    if (currentUserData && !socketLive) {
      ; (async () => {
        await appwriteInboxServicConfig.subscribeToChat(response => {
          if (response.senderid === currentUserData || response.resiverid === currentUserData) {
            dispatch(addNewChats({ userChats: [response] }))
          }
        })
          .then((res) => res ? setsocketLive(true) : setsocketLive(false))
      })();
    }

    if (currentUserData) {
      const queries = [
        Query.orderDesc("$createdAt"),
        Query.or([
          Query.equal("senderid", currentUserData),
          Query.equal("resiverid", currentUserData)
        ]),
        Query.limit(25)
      ]
      appwriteInboxServicConfig.getChats(queries)
        .then((res) => dispatch(refreshChats({ userChats: res.documents?.reverse() })))
        .catch((error) => console.log(error))
    }

  }, [currentUserData])

  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch(showLoading())
      try {
        const userData = await userInfo.getCurrentUser()
        if (userData) {
          dispatch(login({ userData }))
          setcurrentUserData(userData.$id)
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

  return (
    <>
      <Header />
      <h1 className="hidden text-2xl sm:block">
        This website is optimized for mobile devices only
      </h1>
      <main className="min-h-[calc(100vh-250px)] px-4 sm:px-6 lg:px-8">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default App
