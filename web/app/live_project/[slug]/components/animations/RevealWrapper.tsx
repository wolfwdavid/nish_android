"use client"

import { useEffect, useRef } from "react"

import gsap from "gsap"

import type { ReactNode } from "react"



interface RevealWrapperProps {

    children: ReactNode

    delay?: number

    y?: number

    duration?: number

    className?: string

}



export default function RevealWrapper({

    children,

    delay = 0,

    y = 30,

    duration = 1,

    className = "",

}: RevealWrapperProps) {



    const rootRef =
        useRef<HTMLDivElement | null>(null)



    useEffect(() => {

        if (!rootRef.current) return

        gsap.fromTo(
            rootRef.current,
            {
                opacity: 0,
                y,
                scale: 0.98,
                filter: "blur(8px)",
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration,
                delay,
                ease: "power4.out",
            }
        )

    }, [delay, y, duration])



    return (

        <div
            ref={rootRef}
            className={className}
        >

            {children}

        </div>
    )
}