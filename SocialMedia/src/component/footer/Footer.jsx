import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home, Search, User, LogIn, MessageSquare, LucideMessageSquareDot } from 'lucide-react'

function Footer() {
  const [haveMessages, sethaveMessages] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const Messages = useSelector((state) => state.inbox.allMessageRead)

  useEffect(() => {
    if (Messages) {
      const hasMessages = Object.values(Messages).some(msg => msg.count > 0);
      if (hasMessages) sethaveMessages(true);
    }
  }, [Messages])


  const navItems = [
    {
      name: 'Home',
      icon: <Home size={20} />,
      slug: '/',
      active: true
    },
    {
      name: 'Search',
      icon: <Search size={20} />,
      slug: '/search',
      active: true
    },
    {
      name: 'Inbox',
      icon: <MessageSquare size={20} />,
      slug: '/inbox',
      active: (authStatus && !haveMessages)
    }, {
      name: 'Inbox',
      icon: <LucideMessageSquareDot size={20} />,
      slug: '/inbox',
      active: (authStatus && haveMessages)
    },
    {
      name: 'Profile',
      icon: <User size={20} />,
      slug: userData ? `/profile/${userData.$id}` : null,
      active: authStatus
    },
    {
      name: 'Login',
      icon: <LogIn size={20} />,
      slug: '/login',
      active: !authStatus
    }
  ]

  return (
    <div className="fixed bottom-0 max-h-[50px] w-full bg-body-0 border-t border-body-1000 z-50">
      <div className="flex justify-around pb-2">
        {navItems.map((item) =>
          item.active ? (
            <button
              key={item.name}
              onClick={() => navigate(item.slug)}
              className={`flex flex-col items-center text-xs font-medium px-6 py-1 transition-colors duration-150 hover:cursor-pointer md:px-20 sm:px-10 ${location.pathname === item.slug ? 'text-text-color-600' : 'text-text-color-200'
                }`}
            >
              {item.icon}
              <span className="mt-1 ">{item.name}</span>
            </button>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Footer
