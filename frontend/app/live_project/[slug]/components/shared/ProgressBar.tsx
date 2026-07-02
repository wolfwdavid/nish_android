"use client"

import RevealWrapper
from "../animations/RevealWrapper"



interface ProgressBarProps {

    value: number

    max?: number

    label?: string

    showValue?: boolean

    size?: "sm" | "md" | "lg"

}



export default function ProgressBar({

    value,

    max = 100,

    label,

    showValue = true,

    size = "md",

}: ProgressBarProps) {



    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                (value / max) * 100
            )
        )



    const height = {

        sm: "h-2",

        md: "h-4",

        lg: "h-6",

    }



    return (

        <RevealWrapper delay={0.03}>

            <div className="w-full">

                {/* HEADER */}

                {(label || showValue) && (

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        {label && (

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.25em]
                                        text-zinc-500
                                    "
                                >
                                    {label}
                                </p>

                            </div>

                        )}



                        {showValue && (

                            <div
                                className="
                                    rounded-full
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    px-4
                                    py-2
                                    text-xs
                                    font-bold
                                    text-orange-300
                                "
                            >
                                {Math.round(
                                    percentage
                                )}
                                %
                            </div>

                        )}

                    </div>

                )}



                {/* BAR */}

                <div
                    className={`
                        relative
                        overflow-hidden
                        rounded-full
                        border
                        border-white/10
                        bg-white/3
                        ${height[size]}
                    `}
                >

                    {/* FILL */}

                    <div
                        style={{
                            width:
                                `${percentage}%`
                        }}
                        className="
                            relative
                            h-full
                            rounded-full
                            bg-linear-to-r
                            from-orange-700
                            via-orange-500
                            to-orange-400
                            shadow-[0_0_25px_rgba(249,115,22,0.35)]
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



                {/* FOOTER */}

                <div
                    className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        text-zinc-600
                    "
                >

                    <span>
                        Build Progress
                    </span>

                    <span>
                        {value}/{max}
                    </span>

                </div>

            </div>

        </RevealWrapper>
    )
}