import React, { useState, useId } from 'react'
import {Eye, EyeClosed} from 'lucide-react'

function PasswordInputBox({ label, classNameEX = '', ...props }, ref) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => setShowPassword((prev) => !prev)

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-fground-100 mb-1">
          {label}
        </label>
      )}
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        ref={ref}
        className={`w-full px-3 py-2 pr-10 rounded-md border border-bground-200 focus:outline-none focus:ring-2 focus:ring-fground-200 transition duration-150 ${classNameEX}`}
        placeholder="Password"
        {...props}
      />
      <label htmlFor={id}
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black transition"
        onClick={togglePassword}
      >
        {showPassword ? (
          <Eye width='20px' strokeWidth='1px' />
        ) : (
          <EyeClosed width='20px' strokeWidth='1px' />
        )}
      </label>
    </div>
  )
}

export default React.forwardRef(PasswordInputBox)
