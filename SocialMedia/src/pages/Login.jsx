import React, { useState } from 'react'
import { login as authLogin } from '../store/authSlice'
import authService from '../appwrite/auth'
import { LoginContainer, Button, Input } from '../component'
import { loginTextSvg } from '../assets'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BeatLoader } from 'react-spinners'


function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [error, setError] = useState('')
  const [loding, setloding] = useState(false)

  const login = async (e) => {
    e.preventDefault()
    setError("")
    setloding(true)
    try {
      const session = await authService.login({ email, password })
      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin(userData))
        setloding(false)
        navigate("/")
      }
    } catch (error) {
      setloding(false)
      setError(error.message)
    }
  }

  return (
    <LoginContainer>
      <div>
        <img src={loginTextSvg} />
        <div style={{ height: '1rem', width:'15rem',display:'flex',justifyContent:'center',alignItems:'center' }}>
          {error && <p style={{ fontSize: '0.5em', color: 'red' }}>{error}</p>}
          {loding ? <BeatLoader color="black" size={8}/> : null}
        </div>
      </div>
      <div>
        <form onSubmit={login}>
          <Input value={email} onChange={(e) => setemail(e.target.value)} type='email' placeholder='Email Id' />
          <Input value={password} onChange={(e) => setpassword(e.target.value)} type='password' placeholder='Password' />
          <div style={{ padding: '.2em 1rem', }}>
            <Button type='submit' style={{
              minWidth: '10em',
              width: '100%',
            }}>Login</Button></div>
        </form>
      </div>
      <Link style={{ textDecoration: 'none' }} to='/signup'>
        <p style={{ color: 'black', fontSize: '0.8em' }}>Don't have an account? <u>Sign Up</u></p>
      </Link>
    </LoginContainer>
  )
}

export default Login