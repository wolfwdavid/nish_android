"use client"

import { useEffect, useRef } from "react"

import gsap from "gsap"

import {
    AlertTriangle,
    RefreshCw,
    Rocket,
    Bug,
    Terminal,
    ArrowLeft
} from "lucide-react"

import Link from "next/link"



export default function ErrorPage() {



    const rootRef =
        useRef<HTMLDivElement | null>(null)



    useEffect(() => {

        if (!rootRef.current) return

        const ctx = gsap.context(() => {

            gsap.fromTo(
                ".cg-error-card",
                {
                    y: 60,
                    opacity: 0,
                    scale: 0.94,
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power4.out",
                }
            )



            gsap.to(
                ".cg-warning-icon",
                {
                    rotate: 8,
                    duration: 1.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                }
            )



            gsap.fromTo(
                ".cg-scan-line",
                {
                    x: "-120%",
                },
                {
                    x: "220%",
                    duration: 2.8,
                    repeat: -1,
                    ease: "power2.inOut",
                }
            )



            gsap.to(
                ".cg-float",
                {
                    y: -12,
                    duration: 1.8,
                    stagger: 0.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                }
            )



            gsap.to(
                ".cg-orb-1",
                {
                    x: 20,
                    y: -30,
                    duration: 5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                }
            )



            gsap.to(
                ".cg-orb-2",
                {
                    x: -30,
                    y: 20,
                    duration: 6,
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
                    -left-37.5
                    -top-30
                    h-80
                    w-[320px]
                    rounded-full
                    bg-red-500/20
                    blur-3xl
                "
            />

            <div
                className="
                    cg-orb-2
                    absolute
                    -bottom-37.5
                    -right-25
                    h-80
                    w-[320px]
                    rounded-full
                    bg-orange-500/10
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
                    cg-error-card
                    relative
                    w-full
                    max-w-2xl
                    overflow-hidden
                    rounded-[34px]
                    border
                    border-red-500/20
                    bg-white/3
                    p-8
                    backdrop-blur-2xl
                "
            >

                {/* SCAN */}

                <div
                    className="
                        cg-scan-line
                        absolute
                        top-0
                        h-full
                        w-30
                        bg-linear-to-r
                        from-transparent
                        via-red-500/10
                        to-transparent
                        blur-xl
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
                                cg-warning-icon
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-3xl
                                border
                                border-red-500/30
                                bg-red-500/10
                                text-red-400
                                shadow-[0_0_40px_rgba(239,68,68,0.25)]
                            "
                        >

                            <AlertTriangle size={32} />

                        </div>



                        <div>

                            <h1
                                className="
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                Build Console Crashed
                            </h1>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-zinc-400
                                "
                            >
                                Something exploded while loading
                                this live project.
                            </p>

                        </div>

                    </div>



                    <div
                        className="
                            rounded-full
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.25em]
                            text-red-300
                        "
                    >
                        ERROR
                    </div>

                </div>



                {/* TERMINAL */}

                <div
                    className="
                        relative
                        z-10
                        mt-10
                        overflow-hidden
                        rounded-3xl
                        border
                        border-white/10
                        bg-black/50
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            border-b
                            border-white/10
                            px-5
                            py-4
                        "
                    >

                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />

                        <div
                            className="
                                ml-4
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-zinc-500
                            "
                        >
                            <Terminal size={14} />
                            live-project-runtime.log
                        </div>

                    </div>



                    <div
                        className="
                            space-y-4
                            px-5
                            py-6
                            font-mono
                            text-sm
                        "
                    >

                        <div className="text-red-400">
                            ✖ Failed to hydrate live project state
                        </div>

                        <div className="text-zinc-500">
                            at JournalSection.tsx:214
                        </div>

                        <div className="text-zinc-400">
                            Cannot read properties of undefined
                            while rendering timeline entries.
                        </div>

                        <div
                            className="
                                rounded-2xl
                                border
                                border-red-500/20
                                bg-red-500/5
                                p-4
                                text-zinc-300
                            "
                        >
                            The build console encountered a fatal
                            rendering exception while reconstructing
                            the journal timeline state tree.
                        </div>

                    </div>

                </div>



                {/* ICONS */}

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
                            text-red-300
                        "
                    >
                        <Bug size={22} />
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
                            text-red-300
                        "
                    >
                        <Terminal size={22} />
                    </div>

                </div>



                {/* ACTIONS */}

                <div
                    className="
                        relative
                        z-10
                        mt-10
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-4
                    "
                >

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            bg-red-500
                            px-6
                            py-4
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            hover:scale-[1.03]
                            hover:bg-red-400
                        "
                    >

                        <RefreshCw size={18} />

                        Reload Console

                    </button>



                    <Link
                        href="/explore"
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/3
                            px-6
                            py-4
                            text-sm
                            font-semibold
                            text-zinc-300
                            transition-all
                            hover:border-white/20
                            hover:bg-white/6
                            hover:text-white
                        "
                    >

                        <ArrowLeft size={18} />

                        Back to Explore

                    </Link>

                </div>



                {/* FOOTER */}

                <div
                    className="
                        relative
                        z-10
                        mt-8
                        text-center
                    "
                >

                    <p
                        className="
                            text-xs
                            text-zinc-600
                        "
                    >
                        DevManiac Runtime • Live Project Recovery System
                    </p>

                </div>

            </div>

        </main>
    )
}