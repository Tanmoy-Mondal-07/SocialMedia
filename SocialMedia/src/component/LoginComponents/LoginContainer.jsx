import React from 'react'
import './loginSignup.css'
import Container from '../Container'

function LoginContainer({children}) {
  return (
    <Container className='container'>
    <div className='loginContainer'>
        <div className='innerCon'>
        {children}
        </div>
    </div>
    </Container>
  )
}

export default LoginContainer