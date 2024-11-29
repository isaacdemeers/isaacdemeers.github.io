'use client'

import { useState } from 'react'
import SideNavBack from './sideNavBack'
import SideNavList from './sideNavList'
import { sideNavPages } from '@/lib/sideNavPages'



export default function SideNav() {
    console.log(sideNavPages.projects)
    return (
        <nav className="flex flex-col rounded-3xl overflow-hidden bg-clr-darker items-start justify-center p-8 gap-4 h-[calc(100vh-2rem)] min-w-[400px]">
            <section className="flex flex-col items-center justify-center">
                <SideNavBack />
            </section>

            <section className="flex  flex-col items-center justify-start gap-4 py-4 rounded-lg w-full h-full overflow-y-scroll">
                <SideNavList page={sideNavPages.projects} />
                {/* <div className='absolute top-0 w-full h-8 bg-gradient-to-b from-clr-dark via-clr-dark to-tyransparent translate-y-[300%]'></div>
                <div className='absolute bottom-0 w-full h-8 bg-gradient-to-t from-clr-dark via-clr-dark to-tyransparent'></div> */}

            </section>
        </nav>


    )
}