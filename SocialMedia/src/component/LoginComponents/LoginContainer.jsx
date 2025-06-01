import React from 'react'

function LoginContainer({ children }) {
  return (
    <div className="flex items-center justify-center bg-body-300 px-4">
      <div className="w-full max-w-sm md:max-w-[22rem] bg-body-0 rounded-lg shadow-md p-6 md:p-6 flex flex-col">
        {/* <div className="text-center">
          <h2 className="text-xl font-medium text-text-color-400">Welcome to Dante</h2>
          <p className="text-sm text-text-color-200 mt-1">We’re glad to have you here. Let’s get you signed in.</p>
        </div> */}
        {children}
      </div>
    </div>
  )
}

export default LoginContainer
