import React from 'react'

function Container({ children, ...prop }) {
  return (
    <div style={{
      padding: '1rem 2rem',
      display: 'flex',
      maxWidth: '1000px',
      minHeight: '80vh',
      margin: 'auto',
      // backgroundColor: 'green',
      flexFlow: 'column',
      alignItems: 'center',
      flexDirection: 'column',
      flexWrap: 'nowrap',
    }} {...prop}>

      {children}

    </div >
  )
}

export default Container