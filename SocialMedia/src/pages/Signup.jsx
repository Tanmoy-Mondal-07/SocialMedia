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
import { Github } from 'lucide-react'

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
          dispatch(authLogin({ userData }))
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

  async function loginWithgit() {
    authService.githubLogin()
    // console.log('clicked');
  }

  return (
    <LoginContainer>
      <div className="w-full flex flex-col items-center gap-2">
        <img src={signUpSvg} alt="Sign Up" className="h-12 object-contain" />

        <div className="h-4 w-full text-center">
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : (
            <>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </>
          )}
          {loading && <BeatLoader color="fground-200" size={8} />}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <Input
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
        />
        <Input
          type="email"
          placeholder="Email Id"
          {...register("email", { required: "Email is required" })}
        />
        <PasswordInputBox
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />

        <Button type="submit" classNameActive="w-full mt-2">
          Sign Up
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

      <Link to="/login" className="text-sm text-center text-fground-200 mt-4">
        Already have an account? <u>Log In</u>
      </Link>
      <Link to='/termsandprivacy' className='pt-0 text-fground-100 text-left mt-4 text-xs'><u>terms/privacy</u></Link>
    </LoginContainer>

  )
}

export default Signup
