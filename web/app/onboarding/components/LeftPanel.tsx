'use client'

import { useEffect, useRef } from 'react'

import { gsap } from 'gsap'

import {
    Sparkles,
    ShieldCheck,
    Code2,
    Layers3,
    UserRound,
    Rocket,
    MapPin,
    MessageSquareMore,
    LifeBuoy,
} from 'lucide-react'


export default function LeftPanel() {

    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        if (!panelRef.current) return

        gsap.fromTo(
            panelRef.current,
            {
                opacity: 0,
                x: -60,
            },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power4.out',
            }
        )

    }, [])


    return (
        <div
            ref={panelRef}
            className="
                hidden
                lg:flex
                flex-col
                justify-center
                relative
            "
        >

            {/* TOP BADGE */}

            <div
                className="
                    inline-flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-white/4
                    px-4
                    py-2
                    text-sm
                    text-zinc-300
                    backdrop-blur-xl
                "
            >
                <Sparkles size={14} />
                onboarding sequence initialized
            </div>


            {/* HERO */}

            <div className="mt-10">

                <h1
                    className="
                        text-6xl
                        font-black
                        leading-[0.92]
                        tracking-[-0.08em]
                    "
                >
                    Build your

                    <span
                        className="
                            block
                            bg-linear-to-r
                            from-red-500
                            via-orange-400
                            to-red-600
                            bg-clip-text
                            text-transparent
                        "
                    >
                        developer identity.
                    </span>

                </h1>


                <p
                    className="
                        mt-8
                        max-w-xl
                        text-lg
                        leading-8
                        text-zinc-400
                    "
                >
                    DevManiac helps you turn your work into proof:
                    finished projects, live build logs, developer links,
                    and a profile that shows what you actually ship.
                </p>

            </div>


            {/* TERMINAL CARD */}

            <div
                className="
                    relative
                    mt-14
                    overflow-hidden
                    rounded-[34px]
                    border
                    border-white/10
                    bg-white/3
                    p-8
                    backdrop-blur-2xl
                    shadow-[0_0_120px_rgba(0,0,0,0.8)]
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-linear-to-br
                        from-red-500/10
                        via-orange-500/5
                        to-transparent
                    "
                />


                {/* TOP DOTS */}

                <div className="relative flex gap-2">

                    <div className="h-3 w-3 rounded-full bg-red-500" />

                    <div className="h-3 w-3 rounded-full bg-yellow-500" />

                    <div className="h-3 w-3 rounded-full bg-green-500" />

                </div>


                {/* TERMINAL TEXT */}

                <div
                    className="
                        relative
                        mt-8
                        space-y-5
                        font-mono
                        text-sm
                    "
                >

                    <div className="flex items-center gap-3 text-zinc-500">
                        <ShieldCheck
                            size={16}
                            className="text-emerald-400"
                        />
                        profile identity ready
                    </div>

                    <div className="flex items-center gap-3 text-zinc-500">
                        <Code2
                            size={16}
                            className="text-orange-400"
                        />
                        developer links waiting
                    </div>

                    <div className="flex items-center gap-3 text-zinc-500">
                        <Layers3
                            size={16}
                            className="text-red-400"
                        />
                        builder workspace preparing
                    </div>

                    <div
                        className="
                            pt-3
                            text-orange-400
                        "
                    >
                        → complete setup to enter DevManiac
                    </div>

                </div>

            </div>


            {/* USEFUL PREVIEW */}

            <div
                className="
                    mt-10
                    grid
                    grid-cols-2
                    gap-4
                "
            >

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        backdrop-blur-xl
                    "
                >
                    <UserRound
                        size={22}
                        className="text-orange-400"
                    />

                    <p
                        className="
                            mt-4
                            text-base
                            font-bold
                            text-white
                        "
                    >
                        Public profile
                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-zinc-500
                        "
                    >
                        Set your username, avatar, bio, links, and current build.
                    </p>
                </div>


                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        backdrop-blur-xl
                    "
                >
                    <Rocket
                        size={22}
                        className="text-orange-400"
                    />

                    <p
                        className="
                            mt-4
                            text-base
                            font-bold
                            text-white
                        "
                    >
                        Ship proof
                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-zinc-500
                        "
                    >
                        Add finished projects and live projects after onboarding.
                    </p>
                </div>


                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        backdrop-blur-xl
                    "
                >
                    <MapPin
                        size={22}
                        className="text-orange-400"
                    />

                    <p
                        className="
                            mt-4
                            text-base
                            font-bold
                            text-white
                        "
                    >
                        Optional location
                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-zinc-500
                        "
                    >
                        Add a city or skip it. Your profile stays under your control.
                    </p>
                </div>


                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        backdrop-blur-xl
                    "
                >
                    <MessageSquareMore
                        size={22}
                        className="text-orange-400"
                    />

                    <p
                        className="
                            mt-4
                            text-base
                            font-bold
                            text-white
                        "
                    >
                        Feedback loop
                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-zinc-500
                        "
                    >
                        Use feedback and support anytime something feels rough.
                    </p>
                </div>

            </div>


            {/* SMALL FOOTER NOTE */}

            <div
                className="
                    mt-6
                    flex
                    items-center
                    gap-3
                    rounded-3xl
                    border
                    border-orange-500/20
                    bg-orange-500/10
                    px-5
                    py-4
                    text-sm
                    leading-6
                    text-orange-100/80
                "
            >
                <LifeBuoy
                    size={18}
                    className="shrink-0 text-orange-300"
                />

                <p>
                    Early production build: your feedback helps shape the next version.
                </p>
            </div>

        </div>
    )
}