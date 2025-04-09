import React from 'react'
import './loginSignup.css'
import Container from '../Container'

function LoginContainer({children}) {
  return (
    <div className='loginContainer'>
        <div className='innerCon'>
        {children}
        </div>
    </div>
  )
}

export default LoginContainer