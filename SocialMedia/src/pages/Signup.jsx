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

      <Link to="/login" className="text-sm text-center text-fground-200 mt-4">
        Already have an account? <u>Log In</u>
      </Link>
      <Link to='/termsandprivacy' className='pt-0 text-fground-100 text-left mt-4 text-xs'><u>terms/privacy</u></Link>
    </LoginContainer>

  )
}

export default Signup
