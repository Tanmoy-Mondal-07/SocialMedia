import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { showLoading, hideLoading } from '../store/LodingState'

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authStatus = useSelector(state => state.auth.status)

  useEffect(() => {
    dispatch(showLoading())

    if (authentication && !authStatus) {
      navigate('/login')
    } else if (!authentication && authStatus) {
      navigate('/')
    }

    dispatch(hideLoading())
  }, [authStatus, authentication, navigate, dispatch])

  return <>{children}</>
}
