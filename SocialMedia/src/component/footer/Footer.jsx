import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from "react-redux";
import '../../App.css'
import Button from '../Button'
import { inboxSvg, homeSvg, loginSvg, profileSvg, searchSvg } from '../../assets/iconSvg'

function Footer() {
    const navigate = useNavigate()
    const location = useLocation()
    const authStatus = useSelector((state)=>state.auth.status)

    const navItems = [
        {
            name: 'Home',
            svgImage: homeSvg,
            slug: '/',
            active: true
        },
        {
            name: "Search",
            svgImage: searchSvg,
            slug: "/search",
            active: true,
        },
        {
            name: "Inbox",
            svgImage: inboxSvg,
            slug: "/inbox",
            active: authStatus,
        },
        {
            name: "Profile",
            svgImage: profileSvg,
            slug: "/profile",
            active: authStatus,
        },
        {
            name: "Login",
            svgImage: loginSvg,
            slug: "/login",
            active: !authStatus,
        }
    ]
    return (
        <div className='ultimetFooter'>
            <div className='footerParent'>
                {navItems.map((item) =>
                    item.active ? (
                        <Button key={item.name} svgImage={item.svgImage}
                            classNameActive={location.pathname === item.slug ? 'defaultBtnActive' : null}
                            onClick={() => navigate(item.slug)}
                            style={{ backgroundColor: 'white', color: 'black' }}
                        >{item.name}</Button>
                    ) : null
                )}
            </div>
        </div>
    )
}

export default Footer