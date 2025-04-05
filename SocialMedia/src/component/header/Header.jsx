import React from 'react'
import '../../App.css'
import {logoTextSvg,logoSvg,settingSvg} from '../../assets'
import Setting from '../../assets/setting.svg'
import Button from '../Button'

function Header() {
    return (
        <div className='topNav'>
            <div className='navLogo'>
                {/* <img src={logo} alt="logo" /> */}
                <img className='logoText' src={logoTextSvg} alt="logo" />
            </div>
            <div className='navbarRight'>
                <Button>Login/Signup</Button>
                <img src={settingSvg} alt="Settings" />
            </div>
        </div>
    )
}

export default Header