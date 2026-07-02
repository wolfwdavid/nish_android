"use client"

import { TrendingUp } from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface ProgressSliderProps {

    value: number

    onChange: (
        value: number
    ) => void

}



export default function ProgressSlider({

    value,

    onChange,

}: ProgressSliderProps) {



    return (

        <RevealWrapper delay={0.05}>

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-4xl
                    border
                    border-white/10
                    bg-[#0b0b0b]
                    p-6
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        -right-20
                        -top-20
                        h-55
                        w-55
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />



                <div className="relative z-10">

                    {/* HEADER */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            md:flex-row
                            md:items-center
                            md:justify-between
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
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    text-orange-300
                                "
                            >

                                <TrendingUp size={24} />

                            </div>



                            <div>

                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
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
                                    Progress Tracking
                                </div>



                                <h3
                                    className="
                                        mt-4
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Project Completion
                                </h3>



                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-7
                                        text-zinc-400
                                    "
                                >
                                    Reflect the real state of
                                    the build journey.
                                </p>

                            </div>

                        </div>



                        {/* VALUE */}

                        <div
                            className="
                                rounded-[28px]
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-6
                                py-5
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-orange-300
                                "
                            >
                                Current
                            </p>



                            <h2
                                className="
                                    mt-2
                                    text-5xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                {value}%
                            </h2>

                        </div>

                    </div>



                    {/* SLIDER */}

                    <div className="mt-10">

                        <div
                            className="
                                mb-4
                                flex
                                items-center
                                justify-between
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-zinc-500
                            "
                        >

                            <span>
                                Build Evolution
                            </span>

                            <span>
                                {value}/100
                            </span>

                        </div>



                        <div className="relative">

                            {/* TRACK */}

                            <div
                                className="
                                    absolute
                                    left-0
                                    top-1/2
                                    h-4
                                    w-full
                                    -translate-y-1/2
                                    rounded-full
                                    bg-white/4
                                "
                            />



                            {/* FILL */}

                            <div
                                style={{
                                    width:
                                        `${value}%`
                                }}
                                className="
                                    absolute
                                    left-0
                                    top-1/2
                                    h-4
                                    -translate-y-1/2
                                    rounded-full
                                    bg-linear-to-r
                                    from-orange-700
                                    via-orange-500
                                    to-orange-400
                                    shadow-[0_0_30px_rgba(249,115,22,0.35)]
                                    transition-all
                                    duration-500
                                "
                            >

                                {/* SHIMMER */}

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        animate-pulse
                                        rounded-full
                                        bg-linear-to-r
                                        from-transparent
                                        via-white/20
                                        to-transparent
                                    "
                                />

                            </div>



                            {/* INPUT */}

                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={value}
                                onChange={(e) =>
                                    onChange(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="
                                    relative
                                    z-10
                                    h-4
                                    w-full
                                    cursor-pointer
                                    appearance-none
                                    bg-transparent
                                    accent-orange-500
                                "
                            />

                        </div>

                    </div>



                    {/* MARKERS */}

                    <div
                        className="
                            mt-8
                            grid
                            grid-cols-5
                            gap-3
                        "
                    >

                        {[0, 25, 50, 75, 100]
                            .map((mark) => (

                                <div
                                    key={mark}
                                    className={`
                                        rounded-2xl
                                        border
                                        px-4
                                        py-3
                                        text-center
                                        text-sm
                                        font-semibold
                                        transition-all
                                        ${
                                            value >= mark
                                                ? `
                                                    border-orange-500/20
                                                    bg-orange-500/10
                                                    text-orange-300
                                                  `
                                                : `
                                                    border-white/10
                                                    bg-white/3
                                                    text-zinc-600
                                                  `
                                        }
                                    `}
                                >

                                    {mark}%

                                </div>

                            ))}

                    </div>

                </div>

            </div>

        </RevealWrapper>
    )
}