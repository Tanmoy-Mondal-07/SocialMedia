import React from 'react'
import { logoTextSvg } from '../../assets'
import { Button, GlobalLoader } from '../'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../../store/LodingState'
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'
import { Cog } from 'lucide-react'

function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const dispatch = useDispatch()

    const logoutUser = () => {
        dispatch(showLoading())
        authService.logout()
            .then(() => dispatch(logout()))
            .finally(() => dispatch(hideLoading()))
    }

    return (
        <>
            <header className="bg-bground-100 w-full max-h-[60px]">
                <div className="grid grid-cols-2 items-center max-w-7xl mx-auto px-4 pt-2 pb-1 overflow-x-hidden">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img
                            src={logoTextSvg}
                            alt="Logo"
                            className="h-[1.6rem] py-[0.2rem]"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-5">
                        {!authStatus ? (
                            <Link to="/signup" className="no-underline">
                                <Button>Signup</Button>
                            </Link>
                        ) : (
                            <Button onClick={logoutUser}>Logout</Button>
                        )}

                        <div className="h-6 w-6 cursor-pointer transition-transform duration-500 hover:rotate-90 text-black hover:text-black">
                            <Cog className="w-full h-full" />
                        </div>

                    </div>
                </div>
            </header>

            <GlobalLoader />
        </>
    )
}

export default Header
