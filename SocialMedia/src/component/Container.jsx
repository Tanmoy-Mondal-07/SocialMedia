import React from 'react'

function Container({children}) {
  return (
    <div style={{padding: '1rem 2%',maxWidth:'1000px',margin: 'auto'}}>
        {children}
    </div>
  )
}

export default Container