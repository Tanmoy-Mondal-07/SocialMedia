import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login as authLogin } from '../store/authSlice'
import authService from '../appwrite/auth'
import { LoginContainer, Button, Input, PasswordInputBox } from '../component'
import { loginTextSvg } from '../assets'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { Github } from 'lucide-react'

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

  async function loginWithgit() {
    authService.githubLogin()
    // console.log('clicked');
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

      <div className="mt-6 flex flex-col items-center">
        {/* Divider */}
        <div className="relative w-full flex items-center mb-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* GitHub Button */}
        <button
          variant="outline"
          className="w-full max-w-sm flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          onClick={loginWithgit}
        >
          <Github className="w-5 h-5" />
          <span>Continue with GitHub</span>
        </button>
      </div>

      <Link to="/signup" className="text-sm text-center text-fground-200 mt-4">
        Don’t have an account? <u>Sign Up</u>
      </Link>
      <Link to='/termsandprivacy' className='pt-0 text-fground-100 text-left mt-4 text-xs'><u>terms/privacy</u></Link>
    </LoginContainer>
  )
}

export default Login