'use client'

import React from 'react'
import { motion } from 'motion/react'

export default function Home(){
    return(
        <div className = 'alienShipContianer'>
            <motion.img src = 'https://pngimg.com/d/ufo_PNG71668.png'
            width = "50"
            height = "50"
            animate ={{
                x:300
            }}
            >
                
            </motion.img>
            

        </div>
    )
}