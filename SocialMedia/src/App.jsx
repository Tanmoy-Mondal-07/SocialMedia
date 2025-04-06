import { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import './App.css'
import userInfo from './appwrite/auth'
import service from './appwrite/UserProfile'
import { Footer, Header } from './component'
import { Outlet } from 'react-router-dom'

function App() {
  const [count, setCount] = useState('')

  // useEffect(() => {
  //   // userInfo.login({email:'aa@gmail.com',password:'aa123456'})
  //   userInfo.getCurrentUser()
  //     .then((data) => service.createUserProfile({ userId: data.$id, username: 'clash', bio: '', avatarUrl: 'url', followersCount: 10, followingCount: 10 }))

  // }, [])


  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default App
