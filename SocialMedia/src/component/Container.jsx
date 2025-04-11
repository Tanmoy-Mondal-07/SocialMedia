import React from 'react'

function Container({ children }){
  return (
    <div className="max-w-7xl mb-15  py-5 mx-auto w-full">
      {children}
    </div>
  )
}

export default Container
