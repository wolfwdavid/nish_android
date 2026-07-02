"use client"

import { TrendingUp } from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface HeroProgressProps {

    progress_percentage: number

}



export default function HeroProgress({

    progress_percentage,

}: HeroProgressProps) {



    return (

        <RevealWrapper delay={0.1}>

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/10
                    bg-[#0d0d0d]
                    p-6
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        -right-15
                        -top-15
                        h-45
                        w-45
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
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
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                text-orange-400
                            "
                        >

                            <TrendingUp size={22} />

                        </div>



                        <div>

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    uppercase
                                    tracking-[0.2em]
                                    text-zinc-500
                                "
                            >
                                Build Progress
                            </p>

                            <h3
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                {progress_percentage}%
                            </h3>

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
                        Active Build
                    </div>

                </div>



                {/* BAR */}

                <div className="relative z-10 mt-8">

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

                        <span>PROJECT COMPLETION</span>

                        <span
                            className="
                                font-mono
                                text-orange-400
                            "
                        >
                            {progress_percentage}/100
                        </span>

                    </div>



                    <div
                        className="
                            relative
                            h-5
                            overflow-hidden
                            rounded-full
                            border
                            border-white/10
                            bg-white/3
                        "
                    >

                        {/* FILL */}

                        <div
                            style={{
                                width:
                                    `${progress_percentage}%`
                            }}
                            className="
                                relative
                                h-full
                                rounded-full
                                bg-linear-to-r
                                from-orange-700
                                via-orange-500
                                to-orange-400
                                transition-all
                                duration-700
                            "
                        >

                            {/* SHIMMER */}

                            <div
                                className="
                                    absolute
                                    inset-0
                                    animate-pulse
                                    bg-linear-to-r
                                    from-transparent
                                    via-white/20
                                    to-transparent
                                "
                            />

                        </div>

                    </div>

                </div>



                {/* FOOTER */}

                <div
                    className="
                        relative
                        z-10
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    "
                >

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
                        Consistent Progress
                    </div>



                    <div
                        className="
                            rounded-full
                            border
                            border-white/10
                            bg-white/3
                            px-4
                            py-2
                            text-xs
                            font-medium
                            text-zinc-400
                        "
                    >
                        Live Journal Synced
                    </div>

                </div>

            </div>

        </RevealWrapper>
    )
}