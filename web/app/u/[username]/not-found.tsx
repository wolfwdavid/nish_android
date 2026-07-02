"use client"

import Link from "next/link"

import { useEffect, useRef } from "react"

import gsap from "gsap"

import {
    ArrowLeft,
    Compass,
    Ghost,
} from "lucide-react"



export default function NotFound() {

    const ghostRef = useRef<HTMLDivElement>(null)

    const glowRef = useRef<HTMLDivElement>(null)



    useEffect(() => {

        gsap.to(

            ghostRef.current,

            {
                y: -14,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
            }

        )



        gsap.to(

            glowRef.current,

            {
                scale: 1.15,
                opacity: 0.9,
                duration: 2.2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
            }

        )

    }, [])



    return (

        <div
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-[#050505]
                px-6
                text-white
            "
        >


            {/* GLOW */}

            <div
                ref={glowRef}
                className="
                    absolute
                    h-105
                    w-105
                    rounded-full
                    bg-orange-500/10
                    blur-3xl
                "
            />



            {/* CONTENT */}

            <div
                className="
                    relative
                    z-10
                    flex
                    max-w-155
                    flex-col
                    items-center
                    text-center
                "
            >


                {/* ICON */}

                <div
                    ref={ghostRef}
                    className="
                        relative
                        flex
                        h-28
                        w-28
                        items-center
                        justify-center
                        rounded-4xl
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
                            rounded-4xl
                            bg-linear-to-br
                            from-orange-500/10
                            to-red-500/10
                        "
                    />



                    <Ghost
                        size={46}
                        className="
                            relative
                            text-orange-400
                        "
                    />

                </div>



                {/* 404 */}

                <p
                    className="
                        mt-10
                        text-sm
                        font-medium
                        uppercase
                        tracking-[0.35em]
                        text-orange-400/80
                    "
                >
                    Error 404
                </p>



                {/* TITLE */}

                <h1
                    className="
                        mt-4
                        text-5xl
                        font-black
                        tracking-tight
                        md:text-6xl
                    "
                >
                    Lost in the build.
                </h1>



                {/* SUBTEXT */}

                <p
                    className="
                        mt-5
                        max-w-130
                        text-base
                        leading-relaxed
                        text-zinc-500
                        md:text-lg
                    "
                >
                    The page you’re looking for either never existed,
                    got renamed, or wandered into production without
                    a proper route.
                </p>



                {/* ACTIONS */}

                <div
                    className="
                        mt-10
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                    "
                >

                    <Link
                        href="/feed"
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-linear-to-r
                            from-red-500
                            to-orange-500
                            px-6
                            py-3
                            font-medium
                            transition-all
                            hover:scale-[1.03]
                            active:scale-95
                        "
                    >

                        <Compass size={18} />

                        Return to Feed

                    </Link>



                    <button
                        onClick={() => window.history.back()}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            px-6
                            py-3
                            font-medium
                            text-zinc-300
                            transition-all
                            hover:bg-white/10
                            hover:text-white
                            active:scale-95
                        "
                    >

                        <ArrowLeft size={18} />

                        Go Back

                    </button>

                </div>



                {/* FOOTER */}

                <p
                    className="
                        mt-14
                        text-xs
                        tracking-wide
                        text-zinc-700
                    "
                >
                    DevManiac • BUILD • SHIP • REPEAT
                </p>

            </div>

        </div>

    )

}