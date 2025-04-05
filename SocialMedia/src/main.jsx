import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './component/header/Header.jsx'
import Footer from './component/footer/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Header/>
    <Footer/>
  </StrictMode>,
)
