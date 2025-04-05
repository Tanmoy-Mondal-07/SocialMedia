import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'
import Button from '../Button'
import {homeSvg,inboxSvg,loginSvg,profileSvg,searchSvg} from '../../assets'

function Footer() {
    // const navigate = useNavigate()
    const authStatus = true

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
            svgImage:profileSvg,
            slug: "/profile",
            active: authStatus,
        },
        {
            name: "Login",
            svgImage:loginSvg,
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
                            onClick={() => navigate(item.slug)}
                        >{item.name}</Button>
                    ) : null
                )}
            </div>
        </div>
    )
}

export default Footer