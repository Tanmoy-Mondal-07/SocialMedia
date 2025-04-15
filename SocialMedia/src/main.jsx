import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import store from './store/store.js'
import { AuthLayout } from './component/index.js'
import {
  Login, Home, Profile, Signup, EditProfile,
  TermsAndPrivacy, CreatPosts, EditPost,
} from './pages'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error)
  })
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      }, {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>)
      }, {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>)
      }, {
        path: "/profile/:slug",
        element: (
          <AuthLayout authentication>
            <Profile />
          </AuthLayout>
        )
      }, {
        path: "/editprofile",
        element: (
          <AuthLayout authentication>
            <EditProfile />
          </AuthLayout>
        )
      }, {
        path: '/creatpost',
        element: <CreatPosts />
      }, {
        path: '/termsandprivacy',
        element: <TermsAndPrivacy />
      }, {
        path: '/editpost/:postId',
        element: <EditPost />
      },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </StrictMode>,
)



// import { StrictMode, Suspense } from 'react'
// import { createRoot } from 'react-dom/client'
// import { Provider } from 'react-redux'
// import { RouterProvider } from 'react-router-dom'
// import store from './store/store'
// import './index.css'
// import router from './Routes'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </StrictMode>
// )

