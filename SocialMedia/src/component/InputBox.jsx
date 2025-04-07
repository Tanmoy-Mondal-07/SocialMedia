import React, { useId } from 'react'
import '../App.css'

function InputBox({
    label,
    type = "text",
    classNameEX,
    ...props
}, ref) {
    const id = useId()
    return (
        <div className="inputBox">
            {label && <label
                className="inputBoxLabel"
                htmlFor={id}
            >{label}</label>}
            <input
                type={type}
                className={`inputFild  ${classNameEX}`}
                ref={ref}
                id={id}
                {...props}
            />
        </div>
    )
}

export default InputBox