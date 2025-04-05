import React from 'react'
import '../App.css'

function Button({
    children,
    svgImage = '',
    type = 'button',
    className='defaultBtn',
}) {
  return (
    <button type={type} className={className}>
        {svgImage && <img src={svgImage} alt={children} style={{height:'1.5rem'}}/>}
        {children}
    </button>
  )
}

export default Button