"use client"

import Link from "next/link"

import {
    Sparkles,
    ArrowRight,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface EmptyStateProps {

    title: string

    description: string

    buttonText?: string

    buttonHref?: string

    onClick?: () => void

}



export default function EmptyState({

    title,

    description,

    buttonText,

    buttonHref,

    onClick,

}: EmptyStateProps) {



    return (

        <RevealWrapper delay={0.08}>

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[36px]
                    border
                    border-dashed
                    border-white/10
                    bg-[#0b0b0b]
                    px-8
                    py-20
                    text-center
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-65
                        w-65
                        -translate-x-1/2
                        -translate-y-1/2
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
                        opacity-[0.03]
                        bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                        bg-size-[60px_60px]
                    "
                />



                <div className="relative z-10">

                    {/* ICON */}

                    <div
                        className="
                            mx-auto
                            flex
                            h-24
                            w-24
                            items-center
                            justify-center
                            rounded-[30px]
                            border
                            border-orange-500/20
                            bg-orange-500/10
                            text-orange-300
                            shadow-[0_0_40px_rgba(249,115,22,0.15)]
                        "
                    >

                        <Sparkles size={40} />

                    </div>



                    {/* TITLE */}

                    <h2
                        className="
                            mt-8
                            text-4xl
                            font-black
                            tracking-tight
                            text-white
                        "
                    >
                        {title}
                    </h2>



                    {/* DESCRIPTION */}

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-sm
                            leading-8
                            text-zinc-400
                        "
                    >
                        {description}
                    </p>



                    {/* ACTION */}

                    {buttonText && (

                        <div className="mt-10">

                            {buttonHref ? (

                                <Link
                                    href={buttonHref}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-3
                                        rounded-3xl
                                        bg-orange-500
                                        px-6
                                        py-4
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        hover:scale-[1.02]
                                        hover:bg-orange-400
                                    "
                                >

                                    {buttonText}

                                    <ArrowRight
                                        size={18}
                                    />

                                </Link>

                            ) : (

                                <button
                                    onClick={onClick}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-3
                                        rounded-3xl
                                        bg-orange-500
                                        px-6
                                        py-4
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        hover:scale-[1.02]
                                        hover:bg-orange-400
                                    "
                                >

                                    {buttonText}

                                    <ArrowRight
                                        size={18}
                                    />

                                </button>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </RevealWrapper>

    )
}