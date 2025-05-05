import React, { useState, useEffect, useRef } from 'react'
import { logoTextSvg } from '../../assets'
import { Button, GlobalLoader } from '../'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../../store/LodingState'
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'
import { Bell, BellRing, CirclePlus, Cog } from 'lucide-react'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const hasNotification = useSelector((state) => state.hasNotiStore.active)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const logoutUser = () => {
    dispatch(showLoading())
    authService.logout()
      .then(() => dispatch(logout()))
      .finally(() => dispatch(hideLoading()))
  }

  return (
    <>
      <header className="bg-bground-100 w-full max-h-[60px]">
        <div className="grid grid-cols-2 items-center max-w-7xl mx-auto px-4 pt-2 pb-2">
          <div className="flex items-center gap-2">
            <img
              src={logoTextSvg}
              alt="Logo"
              className="h-[1.6rem] py-[0.2rem]"
            /><h5 className='text-bground-200 border-2 border-bground-200 px-2 text-xs rounded-full'>Test-Server</h5>
          </div>

          <div className="flex items-center justify-end gap-5">
            {!authStatus ? (
              <Link to="/signup" className="no-underline">
                <Button>Signup</Button>
              </Link>
            ) : [(
              <Link to="/creatpost" key="create">
                <div className="h-6 w-6 mr-1.5 cursor-pointer transition-transform duration-250 hover:rotate-40">
                  <CirclePlus className="w-full h-full" />
                </div>
              </Link>
            ),
            (
              <Link to="/notification" key="notify">
                <div className="h-6 w-6 mr-1.5 cursor-pointer transition-transform duration-20 hover:rotate-20">
                  {hasNotification ? <BellRing stroke='#00005f' className="w-full h-full rotate-20" /> : <Bell className="w-full h-full" />}
                </div>
              </Link>
            )
            ]}

            <div className="relative" ref={menuRef}>
              <div
                ref={buttonRef}
                onClick={() => setShowMenu((prev) => !prev)}
                className="h-6 w-6 mr-1.5 cursor-pointer transition-transform duration-250 hover:rotate-40 text-black hover:text-black">
                <Cog className="w-full h-full" />
              </div>

              {/* dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-50 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-sm">
                  <ul className="py-1">
                    {authStatus && <li>
                      <button onClick={() => navigate('/feedback')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        Feedback
                      </button>
                    </li>}
                    {authStatus && <li>
                      <button onClick={() => navigate('/report/null')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        Report a bug
                      </button>
                    </li>}
                    <li>
                      <button onClick={() => navigate('/termsandprivacy')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        Terms and conditions
                      </button>
                    </li>
                    {authStatus && <li>
                      <button onClick={logoutUser} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                        Logout
                      </button>
                    </li>}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <GlobalLoader />
    </>
  )
}

export default Header
