'use client'

import React from 'react'
import { motion } from 'motion/react'

export default function Home(){
    return(
        <div className = 'alienhead'>
            <motion.img src = 'https://png.pngtree.com/png-vector/20221006/ourmid/pngtree-simple-design-of-green-alien-head-png-image_6289098.png'
            
            alt = ''
            width = "30"
            height = "30"
            animate ={{
                rotateX:360
               
            }}
            >
                
            </motion.img>
            

        </div>
    )
}