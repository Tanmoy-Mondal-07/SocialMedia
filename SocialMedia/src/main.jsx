import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import store from './store/store.js'
import { AuthLayout } from './component/index.js'
import Test from './Test.jsx'
import {
  Login, Home, Profile, Signup, EditProfile,
  TermsAndPrivacy, CreatPosts, EditPost,
  Posts, Followers, Following, Notifications,
  Report, Feedback,
} from './pages'

if ('serviceWorker' in navigator) {
  // console.log('sw suported');
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(error => console.log(error))
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
        element: (
          <AuthLayout authentication>
            <CreatPosts />
          </AuthLayout>)
      }, {
        path: '/termsandprivacy',
        element: <TermsAndPrivacy />
      }, {
        path: '/editpost/:postId',
        element: (
          <AuthLayout authentication>
            <EditPost />
          </AuthLayout>)
      }, {
        path: '/post/:userId/:postId',
        element: <Posts />
      }, {
        path: '/followers/:userId',
        element: <Followers />
      }, {
        path: '/following/:userId',
        element: <Following />
      }, {
        path: '/test',
        element: <Test />
      }, {
        path: '/notification',
        element: <Notifications />
      }, {
        path: '/report/:postId',
        element: <Report />
      }, {
        path: '/feedback',
        element: <Feedback />
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