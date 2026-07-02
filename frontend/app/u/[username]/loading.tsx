"use client"

import { useEffect, useRef } from "react"

import gsap from "gsap"

import {
    Code2,
    Sparkles,
} from "lucide-react"



export default function Loading() {

    const glowRef = useRef<HTMLDivElement>(null)

    const textRef = useRef<HTMLDivElement>(null)

    const dotsRef = useRef<HTMLDivElement>(null)



    useEffect(() => {

        const tl = gsap.timeline({
            repeat: -1,
        })



        tl.to(
            glowRef.current,
            {
                scale: 1.12,
                opacity: 1,
                duration: 1.4,
                ease: "power2.inOut",
            }
        )

        .to(
            glowRef.current,
            {
                scale: 1,
                opacity: 0.7,
                duration: 1.4,
                ease: "power2.inOut",
            }
        )



        gsap.fromTo(

            textRef.current,

            {
                opacity: 0.4,
                y: 8,
            },

            {
                opacity: 1,
                y: 0,
                duration: 1.6,
                ease: "power2.out",
                repeat: -1,
                yoyo: true,
            }

        )



        gsap.to(

            ".loading-dot",

            {
                y: -6,
                duration: 0.5,
                stagger: 0.12,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
            }

        )

    }, [])



    return (

        <div
            className="
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-[#050505]
                text-white
            "
        >


            {/* BACKGROUND GLOW */}

            <div
                ref={glowRef}
                className="
                    absolute
                    h-80
                    w-[320px]
                    rounded-full
                    bg-orange-500/20
                    blur-3xl
                "
            />



            {/* CONTENT */}

            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    items-center
                "
            >


                {/* ICON */}

                <div
                    className="
                        relative
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-3xl
                        border
                        border-orange-500/20
                        bg-white/5
                        backdrop-blur-xl
                    "
                >

                    <div
                        className="
                            absolute
                            inset-0
                            rounded-3xl
                            bg-linear-to-br
                            from-orange-500/10
                            to-red-500/10
                        "
                    />



                    <Code2
                        size={38}
                        className="
                            relative
                            text-orange-400
                        "
                    />

                </div>



                {/* TEXT */}

                <div
                    ref={textRef}
                    className="
                        mt-8
                        text-center
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >

                        <Sparkles
                            size={16}
                            className="text-orange-400"
                        />

                        <p
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                                text-orange-400/80
                            "
                        >
                            DevManiac
                        </p>

                    </div>



                    <h1
                        className="
                            mt-4
                            text-3xl
                            font-black
                            tracking-tight
                        "
                    >
                        Preparing your workspace
                    </h1>



                    <p
                        className="
                            mt-3
                            max-w-105
                            text-sm
                            leading-relaxed
                            text-zinc-500
                        "
                    >
                        Loading your builder environment,
                        activity, and personalized dashboard.
                    </p>

                </div>



                {/* LOADING DOTS */}

                <div
                    ref={dotsRef}
                    className="
                        mt-10
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            loading-dot
                            h-3
                            w-3
                            rounded-full
                            bg-orange-500
                        "
                    />

                    <div
                        className="
                            loading-dot
                            h-3
                            w-3
                            rounded-full
                            bg-orange-400
                        "
                    />

                    <div
                        className="
                            loading-dot
                            h-3
                            w-3
                            rounded-full
                            bg-red-500
                        "
                    />

                </div>

            </div>

        </div>

    )

}