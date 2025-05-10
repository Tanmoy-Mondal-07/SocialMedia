import React, { forwardRef, useId } from 'react'

const InputBox = forwardRef(
  ({ label, type = 'text', classNameEX = '', ...props }, ref) => {
    const id = useId()

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-color-300">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={`w-full px-3 py-2 rounded-md border border-body-300 focus:outline-none focus:ring-2 focus:ring-body-1000 transition duration-150 ${classNameEX}`}
          {...props}
        />
      </div>
    )
  }
)

export default InputBox
