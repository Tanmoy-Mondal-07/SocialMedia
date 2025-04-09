import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login as authLogin } from '../store/authSlice'
import authService from '../appwrite/auth'
import { LoginContainer, Button, Input, PasswordInputBox } from '../component'
import { loginTextSvg } from '../assets'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BeatLoader } from 'react-spinners'

function Login() {
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
      const session = await authService.login({
        email: data.email,
        password: data.password,
      })
      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin({ userData }))
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
        <img src={loginTextSvg} />
        <div style={{ height: '1rem', width: '15rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {error ? (
            <p style={{ fontSize: '0.5em', color: 'red' }}>{error}</p>
          ) : (
            <>
              {errors.email && (
                <p style={{ color: 'red', fontSize: '0.5em' }}>{errors.email.message}</p>
              )}
              {errors.password && (
                <p style={{ color: 'red', fontSize: '0.5em' }}>{errors.password.message}</p>
              )}
            </>
          )}
          {loading && <BeatLoader color="black" size={8} />}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Input
          type='email'
          placeholder='Email Id'
          {...register('email', { required: 'Email is required' })}
        />

        <PasswordInputBox
          {...register('password', { required: 'Password is required' })}
        />

        <div style={{ padding: '.2em 1rem' }}>
          <Button
            type='submit'
            style={{ minWidth: '10em', width: '100%' }}
          >
            Login
          </Button>
        </div>
      </form>

      <Link style={{ textDecoration: 'none' }} to='/signup'>
        <p style={{ color: 'black', fontSize: '0.8em' }}>
          Don't have an account? <u>Sign Up</u>
        </p>
      </Link>
    </LoginContainer>
  )
}

export default Login