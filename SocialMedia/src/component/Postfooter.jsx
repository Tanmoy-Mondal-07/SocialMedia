import React from 'react'
import '../App.css'
import { commentSvg, linkCopySvg, likeSvg } from '../assets/iconSvg'
import Button from './Button'

function Postfooter({PostUrl=false,likeColor=''}) {
    return (
        <div className='post-footer'>
            <Button style={{color:`${likeColor}`}} className='post-footer-button' svgImage={likeSvg}></Button>
            <Button className='post-footer-button' svgImage={commentSvg}></Button>
            {PostUrl ? <Button className='post-footer-button' svgImage={linkCopySvg}></Button> : null}
        </div>
    )
}

export default Postfooter