"use client"

import { useEffect, useRef } from "react"

import gsap from "gsap"

import {
    Sparkles,
    GitCommit,
    Code2,
    Rocket
} from "lucide-react"



export default function Loading() {



    const rootRef =
        useRef<HTMLDivElement | null>(null)



    useEffect(() => {

        if (!rootRef.current) return

        const ctx = gsap.context(() => {

            gsap.fromTo(
                ".cg-loading-card",
                {
                    y: 40,
                    opacity: 0,
                    scale: 0.96,
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power4.out",
                }
            )



            gsap.fromTo(
                ".cg-loading-line",
                {
                    scaleX: 0,
                    transformOrigin: "left",
                },
                {
                    scaleX: 1,
                    duration: 1.8,
                    ease: "power3.inOut",
                    repeat: -1,
                    yoyo: true,
                    stagger: 0.08,
                }
            )



            gsap.to(
                ".cg-orb-1",
                {
                    y: -30,
                    x: 20,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                }
            )



            gsap.to(
                ".cg-orb-2",
                {
                    y: 25,
                    x: -15,
                    duration: 5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                }
            )



            gsap.to(
                ".cg-spin",
                {
                    rotate: 360,
                    duration: 10,
                    repeat: -1,
                    ease: "none",
                }
            )



            gsap.fromTo(
                ".cg-float",
                {
                    y: 0,
                },
                {
                    y: -10,
                    stagger: 0.2,
                    duration: 1.6,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                }
            )

        }, rootRef)

        return () => ctx.revert()

    }, [])



    return (

        <main
            ref={rootRef}
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-[#050505]
                px-4
            "
        >

            {/* BACKGROUND */}

            <div
                className="
                    cg-orb-1
                    absolute
                    -left-30
                    -top-30
                    h-80
                    w-[320px]
                    rounded-full
                    bg-orange-500/20
                    blur-3xl
                "
            />

            <div
                className="
                    cg-orb-2
                    absolute
                    -bottom-30
                    -right-30
                    h-80
                    w-[320px]
                    rounded-full
                    bg-orange-400/10
                    blur-3xl
                "
            />



            {/* GRID */}

            <div
                className="
                    absolute
                    inset-0
                    opacity-[0.04]
                    bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                    bg-size-[60px_60px]
                "
            />



            {/* CARD */}

            <div
                className="
                    cg-loading-card
                    relative
                    w-full
                    max-w-2xl
                    overflow-hidden
                    rounded-4xl
                    border
                    border-white/10
                    bg-white/3
                    p-8
                    backdrop-blur-2xl
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-linear-to-br
                        from-orange-500/10
                        via-transparent
                        to-transparent
                    "
                />



                {/* HEADER */}

                <div
                    className="
                        relative
                        z-10
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        <div
                            className="
                                cg-spin
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-orange-500/30
                                bg-orange-500/10
                                text-orange-400
                            "
                        >

                            <Sparkles size={26} />

                        </div>



                        <div>

                            <h1
                                className="
                                    text-3xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                Loading Live Project
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-zinc-400
                                "
                            >
                                Initializing build console...
                            </p>

                        </div>

                    </div>



                    <div
                        className="
                            rounded-full
                            border
                            border-orange-500/20
                            bg-orange-500/10
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.25em]
                            text-orange-300
                        "
                    >
                        DevManiac
                    </div>

                </div>



                {/* MOCK HERO */}

                <div
                    className="
                        relative
                        z-10
                        mt-10
                        rounded-3xl
                        border
                        border-white/10
                        bg-black/30
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div
                                className="
                                    h-14
                                    w-14
                                    rounded-2xl
                                    bg-orange-500/20
                                "
                            />

                            <div className="space-y-3">

                                <div
                                    className="
                                        cg-loading-line
                                        h-4
                                        w-48
                                        rounded-full
                                        bg-white/15
                                    "
                                />

                                <div
                                    className="
                                        cg-loading-line
                                        h-3
                                        w-32
                                        rounded-full
                                        bg-white/10
                                    "
                                />

                            </div>

                        </div>



                        <div
                            className="
                                rounded-full
                                border
                                border-emerald-500/20
                                bg-emerald-500/10
                                px-4
                                py-2
                                text-xs
                                font-medium
                                text-emerald-300
                            "
                        >
                            ACTIVE
                        </div>

                    </div>



                    <div className="mt-8 space-y-3">

                        <div
                            className="
                                cg-loading-line
                                h-3
                                w-full
                                rounded-full
                                bg-white/10
                            "
                        />

                        <div
                            className="
                                cg-loading-line
                                h-3
                                w-[80%]
                                rounded-full
                                bg-white/10
                            "
                        />

                    </div>



                    {/* PROGRESS */}

                    <div className="mt-8">

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                                text-xs
                                text-zinc-500
                            "
                        >
                            <span>BUILD PROGRESS</span>
                            <span>12%</span>
                        </div>

                        <div
                            className="
                                h-3
                                overflow-hidden
                                rounded-full
                                bg-white/10
                            "
                        >

                            <div
                                className="
                                    h-full
                                    w-[35%]
                                    rounded-full
                                    bg-linear-to-r
                                    from-orange-600
                                    to-orange-400
                                "
                            />

                        </div>

                    </div>

                </div>



                {/* FLOATING ICONS */}

                <div
                    className="
                        relative
                        z-10
                        mt-8
                        flex
                        items-center
                        justify-center
                        gap-8
                    "
                >

                    <div
                        className="
                            cg-float
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/3
                            text-orange-300
                        "
                    >
                        <GitCommit size={22} />
                    </div>

                    <div
                        className="
                            cg-float
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/3
                            text-orange-300
                        "
                    >
                        <Code2 size={22} />
                    </div>

                    <div
                        className="
                            cg-float
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/3
                            text-orange-300
                        "
                    >
                        <Rocket size={22} />
                    </div>

                </div>



                {/* FOOTER */}

                <div
                    className="
                        relative
                        z-10
                        mt-10
                        text-center
                    "
                >

                    <p
                        className="
                            text-sm
                            text-zinc-500
                        "
                    >
                        Hydrating journals, syncing commits,
                        restoring build timeline...
                    </p>

                </div>

            </div>

        </main>
    )
}