import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login as authLogin } from '../store/authSlice'
import authService from '../appwrite/auth'
import userProfileService from '../appwrite/UserProfile'
import { LoginContainer, Button, Input, PasswordInputBox } from '../component'
import { signUpSvg } from '../assets'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BeatLoader } from 'react-spinners'

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    try {
      const user = await authService.createAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (user) {
        const userData = await authService.getCurrentUser()
        if (userData) {
          dispatch(authLogin({userData}))
          await userProfileService.createUserProfile({
            userId: userData.$id,
            username: data.name,
          })
        }
        setLoading(false)
        navigate('/')
      }
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  return (
    <LoginContainer>
      <div>
        <img src={signUpSvg} />
        <div style={{ height: '1.2rem', width: '15rem',textAlign:'justify', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {error ? (
            <p style={{ fontSize: '0.6em', color: 'red' }}>{error}</p>
          ) : (
            <>
              {errors.name && <p style={{ color: 'red', fontSize: '0.6em' }}>{errors.name.message} ...</p>}
              {errors.email && <p style={{ color: 'red', fontSize: '0.6em' }}>{errors.email.message} ...</p>}
              {errors.password && <p style={{ color: 'red', fontSize: '0.6em' }}>{errors.password.message} ...</p>}
            </>
          )}
          {loading && <BeatLoader color="black" size={8} />}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Input
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
        />
        <Input
          type="email"
          placeholder="Email Id"
          {...register('email', { required: 'Email is required' })}
        />
        <PasswordInputBox
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
        />
        <div style={{ padding: '.2em 1rem' }}>
          <Button type="submit" style={{ minWidth: '10em', width: '100%' }}>
            SignUp
          </Button>
        </div>
      </form>

      <Link style={{ textDecoration: 'none' }} to="/login">
        <p style={{ color: 'black', fontSize: '0.8em' }}>
          Already have an account? <u>Log In</u>
        </p>
      </Link>
    </LoginContainer>
  )
}

export default Signup
