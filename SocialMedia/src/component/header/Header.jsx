import React from 'react'
import '../../App.css'
import {logoTextSvg} from '../../assets'
import {settingSvg} from '../../assets/iconSvg'
import {Button} from '../'

function Header() {
    return (
        <div className='topNav'>
            <div className='navLogo'>
                {/* <img src={logo} alt="logo" /> */}
                <img className='logoText' src={logoTextSvg} alt="logo" />
            </div>
            <div className='navbarRight'>
                <Button>Login/Signup</Button>
                {settingSvg}
            </div>
        </div>
    )
}

export default Header