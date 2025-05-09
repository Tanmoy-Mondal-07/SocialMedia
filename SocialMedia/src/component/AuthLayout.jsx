import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authStatus = useSelector(state => state.auth.status)

  useEffect(() => {

    if (authentication && !authStatus) {
      try {
        navigate('/login')
      } catch (error) {
        navigate('/')
      }
    } else if (!authentication && authStatus) {
      navigate('/')
    }

  }, [authStatus, authentication, navigate, dispatch])

  return <>{children}</>
}
