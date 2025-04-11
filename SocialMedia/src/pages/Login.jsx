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
      <div className="flex flex-col items-center gap-2 w-full">
        <img src={loginTextSvg} alt="Login" className="h-16 object-contain" />

        <div className="h-4 min-h-[1rem] w-60 flex justify-center items-center text-xs text-red-500">
          {error ? (
            <p>{error}</p>
          ) : (
            <>
              {errors.email && <p>{errors.email.message}</p>}
              {errors.password && <p>{errors.password.message}</p>}
            </>
          )}
          {loading && <BeatLoader color="fground-200" size={8} />}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Email Id"
          {...register('email', { required: 'Email is required' })}
        />

        <PasswordInputBox
          {...register('password', { required: 'Password is required' })}
        />

        <Button type="submit" classNameActive="w-full mt-2">
          Login
        </Button>
      </form>

      <Link to="/signup" className="text-sm text-center text-fground-200 mt-4">
        Don’t have an account? <u>Sign Up</u>
      </Link>
      <Link to='/termsandprivacy' className='pt-0 text-fground-100 text-left mt-4 text-xs'><u>terms/privacy</u></Link>
    </LoginContainer>
  )
}

export default Login