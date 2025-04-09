import { createBrowserRouter } from 'react-router-dom'
import { lazy, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from './store/LodingState'
import App from './App'
import { AuthLayout } from './component'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Profile = lazy(() => import('./pages/Profile'))

const SuspenseWithReduxLoading = ({ children }) => {
  const dispatch = useDispatch()
  const [Component, setComponent] = useState(null)

  useEffect(() => {
    let mounted = true
    dispatch(showLoading())

    const load = async () => {
      try {
        const resolved = await children
        if (mounted) setComponent(resolved)
      } finally {
        dispatch(hideLoading())
      }
    }

    load()
    return () => { mounted = false }
  }, [children, dispatch])

  return Component || null
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <SuspenseWithReduxLoading>
            {import('./pages/Home').then(mod => <mod.default />)}
          </SuspenseWithReduxLoading>
        )
      },
      {
        path: '/login',
        element: (
          <SuspenseWithReduxLoading>
            {import('./pages/Login').then(mod => (
              <AuthLayout authentication={false}>
                <mod.default />
              </AuthLayout>
            ))}
          </SuspenseWithReduxLoading>
        )
      },
      {
        path: '/signup',
        element: (
          <SuspenseWithReduxLoading>
            {import('./pages/Signup').then(mod => (
              <AuthLayout authentication={false}>
                <mod.default />
              </AuthLayout>
            ))}
          </SuspenseWithReduxLoading>
        )
      },
      {
        path: '/profile/:slug',
        element: (
          <SuspenseWithReduxLoading>
            {import('./pages/Profile').then(mod => (
              <AuthLayout authentication>
                <mod.default />
              </AuthLayout>
            ))}
          </SuspenseWithReduxLoading>
        )
      }
    ]
  }
])

export default router
