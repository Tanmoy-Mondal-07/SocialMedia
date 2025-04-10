import React from 'react'

function Button({
  children,
  svgImage,
  type = 'button',
  classNameActive = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        flex items-center justify-center gap-2
        px-4 py-2 rounded-md 
        bg-fground-200 text-bground-100 text-sm font-medium 
        hover:bg-fground-100 transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${classNameActive}
      `}
      {...props}
    >
      {svgImage && <span className="flex items-center justify-center">{svgImage}</span>}
      <span className="leading-none">{children}</span>
    </button>
  )
}

export default Button
