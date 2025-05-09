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
  Posts, Followers, Following, Notifications,
  Report, Feedback, SearchPage, ChatPage,
  FeatureUnavailable, Inbox,
} from './pages'
import GithubLogin from './pages/GithubLogin.jsx'

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
        element: (<AuthLayout authentication><Followers /></AuthLayout>)
      }, {
        path: '/following/:userId',
        element: (<AuthLayout authentication><Following /></AuthLayout>)
      }, {
        path: '/inbox',
        element: (<AuthLayout authentication><Inbox /></AuthLayout>)
      }, {
        path: '/notification',
        element: (<AuthLayout authentication><Notifications /></AuthLayout>)
      }, {
        path: '/report/:postId',
        element: (<AuthLayout authentication><Report /></AuthLayout>)
      }, {
        path: '/feedback',
        element: (<AuthLayout authentication><Feedback /></AuthLayout>)
      }, {
        path: '/search',
        element: <SearchPage />
      }, {
        path: '/gitlogin',
        element: <GithubLogin />
      }
    ]
  },
  {
    path: '/message/:resiverid',
    element: (<AuthLayout authentication><ChatPage /></AuthLayout>)
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