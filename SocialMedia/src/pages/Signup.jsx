import React, { useState } from 'react'
import { login } from '../store/authSlice'
import authService from '../appwrite/auth'
import { LoginContainer, Button, Input } from '../component'
import userProfileService from '../appwrite/UserProfile'
import { signUpSvg } from '../assets'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BeatLoader } from 'react-spinners'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [error, setError] = useState('')
    const [name, setname] = useState('')
    const [loding, setloding] = useState(false)

    const create = async (e) => {
        e.preventDefault()
        setError("")
        setloding(true)
        try {
            const userData = await authService.createAccount({ email, password, name })
            if (userData) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    dispatch(login(userData))
                    userProfileService.createUserProfile({
                        userId: userData.$id,
                        username: name,
                    })
                }
                setloding(false)
                navigate("/")
            }
        } catch (error) {
            setloding(false)
            setError(error.massage)
        }
    }

    return (
        <LoginContainer>
            <div>
                <img src={signUpSvg} />
                <div style={{ height: '1rem', width: '15rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {error && <p style={{ fontSize: '0.5em', color: 'red' }}>{error}</p>}
                    {loding ? <BeatLoader color="black" size={8} /> : null}
                </div>
            </div>
            <form onSubmit={create}>
                <Input value={name} onChange={(e) => setname(e.target.value)} placeholder='Name' />
                <Input value={email} onChange={(e) => setemail(e.target.value)} type='email' placeholder='Email Id' />
                <Input value={password} onChange={(e) => setpassword(e.target.value)} type='password' placeholder='Password' />
                <div style={{ padding: '.2em 1rem', }}>
                    <Button type='submit' style={{
                        minWidth: '10em',
                        width: '100%',
                    }}>SignUp</Button></div>
            </form>
            <Link style={{ textDecoration: 'none' }} to='/login'>
                <p style={{ color: 'black', fontSize: '0.8em' }}>Already have an account? <u>Log In</u></p>
            </Link>
        </LoginContainer>
    )
}

export default Signup