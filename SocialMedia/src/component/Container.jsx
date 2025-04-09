import React from 'react'

function Container({ children }) {
  const baseStyle = {
    padding: '1rem 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'nowrap',
    maxWidth: '500px',
    minHeight: '80vh',
    margin: 'auto',
    marginBottom: '4rem',
  }

  return (
    <div style={baseStyle}>
      {children}
    </div>
  )
}

export default Container
