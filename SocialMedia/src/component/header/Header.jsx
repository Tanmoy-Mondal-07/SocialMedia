import React from 'react'
import '../../App.css'
import { logoTextSvg } from '../../assets'
import { settingSvg } from '../../assets/iconSvg'
import { Button, GlobalLoader } from '../'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading,hideLoading } from '../../store/LodingState'
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'

function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const dispatch = useDispatch()

    const logoutUser = () => {
        dispatch(showLoading())
        authService.logout().then(() => {
            dispatch(logout())
        }).finally(()=>dispatch(hideLoading()))
    }

    return (
        <>
        <div className='topNav'>
            <div className='navLogo'>
                {/* <img src={logo} alt="logo" /> */}
                <img className='logoText' src={logoTextSvg} alt="logo" />
            </div>
            <div className='navbarRight'>
                {!authStatus ? <Link style={{ textDecoration: 'none' }} to='/signup'>
                    <Button>Signup</Button></Link> :
                    <Button onClick={()=>logoutUser()}>Logout</Button>}
                {settingSvg}
            </div>
        </div>
        <GlobalLoader/>
        </>
    )
}

export default Header