import React, { useState, useId } from 'react'
import './loginSignup.css'

function PasswordInputBox({ label, classNameEX = '', ...props }) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)

  const eyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  const eyeOffIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.07 21.07 0 0 1 5.11-5.88M3 3l18 18" />
      <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
    </svg>
  )

  return (
    <div className="inputBox" style={{ position: 'relative' }}>
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        className={`inputFild ${classNameEX}`}
        style={{ paddingRight: '2.5rem' }}
        placeholder='Password'
        {...props}
      />
      <label
        htmlFor={id}
        className="passwordToggleIcon"
        onClick={() => {
          setShowPassword(!showPassword)
        }}
      >
        {showPassword ? eyeOffIcon : eyeIcon}
      </label>
    </div>
  )
}

export default PasswordInputBox
