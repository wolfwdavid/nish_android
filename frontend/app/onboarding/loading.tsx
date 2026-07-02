'use client'

import { useEffect, useRef } from 'react'

import gsap from 'gsap'

import {
    Sparkles,
    Code2,
    Layers3,
} from 'lucide-react'



export default function Loading() {


    const logoRef = useRef<HTMLDivElement>(null)

    const textRef = useRef<HTMLDivElement>(null)

    const glowRef = useRef<HTMLDivElement>(null)

    const dotsRef = useRef<HTMLDivElement>(null)



    useEffect(() => {

        const tl = gsap.timeline({
            repeat: -1,
        })



        // =========================================
        // MAIN LOGO FLOAT
        // =========================================

        gsap.to(

            logoRef.current,

            {
                y: -12,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
            }

        )



        // =========================================
        // GLOW PULSE
        // =========================================

        gsap.to(

            glowRef.current,

            {
                scale: 1.2,
                opacity: 0.6,
                duration: 1.8,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
            }

        )



        // =========================================
        // TEXT FADE
        // =========================================

        gsap.fromTo(

            textRef.current,

            {
                opacity: 0.4,
            },

            {
                opacity: 1,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
            }

        )



        // =========================================
        // DOTS ANIMATION
        // =========================================

        tl.to(
            '.loading-dot',
            {
                y: -8,
                stagger: 0.12,
                duration: 0.4,
                ease: 'power2.out',
            }
        )

        tl.to(
            '.loading-dot',
            {
                y: 0,
                stagger: 0.12,
                duration: 0.4,
                ease: 'power2.in',
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
                text-white
            "
        >


            {/* BACKGROUND GRID */}

            <div
                className="
                    absolute
                    inset-0
                    opacity-[0.04]
                    bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                    bg-size-[60px_60px]
                "
            />



            {/* RADIAL GLOW */}

            <div
                ref={glowRef}
                className="
                    absolute
                    h-125
                    w-125
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


                {/* ICON STACK */}

                <div
                    ref={logoRef}
                    className="
                        relative
                        flex
                        h-40
                        w-40
                        items-center
                        justify-center
                    "
                >


                    {/* OUTER RING */}

                    <div
                        className="
                            absolute
                            inset-0
                            rounded-full
                            border
                            border-orange-500/20
                            backdrop-blur-xl
                        "
                    />


                    {/* INNER GLOW */}

                    <div
                        className="
                            absolute
                            inset-5
                            rounded-full
                            bg-linear-to-br
                            from-red-500/20
                            via-orange-500/10
                            to-transparent
                            blur-2xl
                        "
                    />


                    {/* CENTER ICON */}

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
                            border-white/10
                            bg-white/5
                            backdrop-blur-2xl
                            shadow-[0_0_80px_rgba(249,115,22,0.25)]
                        "
                    >

                        <Code2
                            size={42}
                            className="
                                text-orange-400
                            "
                        />

                    </div>



                    {/* FLOATING ICONS */}

                    <div
                        className="
                            absolute
                            -right-3
                            top-6
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            text-orange-300
                            backdrop-blur-xl
                        "
                    >
                        <Sparkles size={18} />
                    </div>


                    <div
                        className="
                            absolute
                            -left-4
                            bottom-8
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            text-orange-300
                            backdrop-blur-xl
                        "
                    >
                        <Layers3 size={18} />
                    </div>

                </div>



                {/* TEXT */}

                <div
                    ref={textRef}
                    className="
                        mt-14
                        text-center
                    "
                >

                    <h1
                        className="
                            bg-linear-to-r
                            from-white
                            via-orange-200
                            to-orange-500
                            bg-clip-text
                            text-5xl
                            font-black
                            tracking-[-0.08em]
                            text-transparent
                        "
                    >
                        DevManiac
                    </h1>


                    <p
                        className="
                            mt-5
                            text-sm
                            uppercase
                            tracking-[0.35em]
                            text-zinc-500
                        "
                    >
                        Initializing Developer Identity
                    </p>

                </div>



                {/* LOADING DOTS */}

                <div
                    ref={dotsRef}
                    className="
                        mt-12
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
                            bg-orange-400
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
                            bg-orange-400
                        "
                    />

                </div>

            </div>

        </div>
    )
}