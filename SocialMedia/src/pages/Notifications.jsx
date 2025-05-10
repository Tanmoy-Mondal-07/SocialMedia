import React, { useEffect, useState } from 'react'
import { NotificationsCard } from '../component'
import appwriteNotificationsService from '../appwrite/notificationsConfig'
import { useDispatch, useSelector } from 'react-redux'
import { Check } from 'lucide-react'
import {
  addNotification, getNotification, getNotificationsByUser,
  deleteNotification as deleteNotificationFromCache
} from '../utils/notificationsCacheService'
import getProfilesByCache from '../utils/getProfilesThroughache'
import appwritePostConfigService from '../appwrite/postConfig'
import { hideLoading, showLoading } from '../store/LodingState'
import { dontHaveNotification } from '../store/hasNotiStore'

function Notifications() {
  const [cachedNotifications, setCachedNotifications] = useState(null)
  const [error, setError] = useState(null)
  const userId = useSelector((state) => state.auth.userData?.$id)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(dontHaveNotification())
    getCacheNotificationFunction()
    const fetchAndCacheNotifications = async () => {
      dispatch(showLoading())
      try {
        const response = await appwriteNotificationsService.getNotifications({ userId })
        const notifications = response?.documents || []

        await Promise.all(notifications.map(processNotification))

      } catch (err) {
        setError(err.message)
      } finally {
        dispatch(hideLoading())
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
        getCacheNotificationFunction()
        // console.log('render');

      } catch (err) {
        console.error(`Failed to process notification ${notification.$id}`, err)
      }
    }

    if (userId) fetchAndCacheNotifications()

  }, [userId])

  // getCacheNotificationFunction()

  async function getCacheNotificationFunction() {
    // console.log('render');
    await getNotificationsByUser(userId)
      .then((responce) => setCachedNotifications(responce))
  }

  const deleteNotification = async (data) => {
    try {
      const dleted = deleteNotificationFromCache(data)
      // console.log(dleted);
      if (dleted) appwriteNotificationsService.updateNotification(data)
    } catch (error) {
      // console.log(error);
    }
    await getNotificationsByUser(userId)
      .then((responce) => setCachedNotifications(responce))
  }

  function markAllAsRead() {
    try {
      cachedNotifications?.map(async (n) => {
        if (!n.seen) {
          const getData = await getNotification(n.$id)
          const newData = { ...getData, seen: true }
          const marked = await addNotification(newData)
          if (marked) {
            getNotificationsByUser(userId)
              .then((responce) => setCachedNotifications(responce))
            appwriteNotificationsService.updateNotification(n.$id)
          }
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const markAsRead = async (data) => {
    try {
      const getData = await getNotification(data)
      const newData = { ...getData, seen: true }
      const marked = await addNotification(newData)
      if (marked) appwriteNotificationsService.updateNotification(data)
    } catch (error) {
      console.log(error);
    }
    await getNotificationsByUser(userId)
      .then((responce) => setCachedNotifications(responce))
  }

  if (error) return <h1>{error}</h1>

  return cachedNotifications && (
    <div className='bg-body-0 p-4 shadow-md rounded-lg overflow-hidden mb-6 max-w-xl mx-auto'>
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button onClick={markAllAsRead} className="flex items-center text-sm text-body-600 hover:text-text-color-400">
          <Check className="h-4 w-4 mr-1" />
          Mark all as read
        </button>
      </div>
      {cachedNotifications?.map((n) => (
        <NotificationsCard
          key={n.$id}
          notificationsId={n.$id}
          relatedUserId={n.relatedUserInfo.$id}
          relatedUserAvatar={n.relatedUserInfo.profilePic}
          relatedUserName={n.relatedUserInfo.username}
          relatedPostId={n.relatedPostInfo?.$id || null}
          relatedPostAuthorId={n.relatedPostInfo?.userId || null}
          relatedPostTitle={n.relatedPostInfo?.title || null}
          commentText={n.commentText || null}
          contentType={n.type}
          seen={n.seen}
          time={n.$createdAt}
          senddeleteNotification={deleteNotification}
          frowredMarkAsRead={markAsRead}
        />
      ))}
    </div>
  )
}

export default Notifications