import React from 'react'

function LoginContainer({ children }) {
  return (
    <div className="flex items-center justify-center bg-bground-200 px-4">
      <div className="w-full max-w-sm md:max-w-[22rem] bg-bground-100 border border-fground-100 rounded-lg shadow-md p-6 md:p-6 flex flex-col gap-5">
        {/* <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800">Welcome to Dante</h2>
          <p className="text-sm text-gray-500 mt-1">We’re glad to have you here. Let’s get you signed in.</p>
        </div> */}
        {children}
      </div>
    </div>
  )
}

export default LoginContainer
