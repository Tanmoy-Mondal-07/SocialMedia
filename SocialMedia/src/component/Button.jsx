import React from 'react'
import '../App.css'

function Button({
    children,
    svgImage,
    type = 'button',
    classNameActive,
    ...prop
}) {
  return (
    <button type={type} className={`defaultBtn  ${classNameActive}`} {...prop}>
        {svgImage}
        {children}
    </button>
  )
}

export default Button