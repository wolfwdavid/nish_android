"use client"

import {
    AlertTriangle,
    Lightbulb,
    ArrowRight,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface ProblemSolutionBlockProps {

    problem: string

    solution: string

}



export default function ProblemSolutionBlock({

    problem,

    solution,

}: ProblemSolutionBlockProps) {



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
                "
            >

                {/* BACKGROUND */}

                <div
                    className="
                        absolute
                        -right-25
                        -top-25
                        h-65
                        w-65
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />



                <div
                    className="
                        relative
                        z-10
                        grid
                        gap-0
                        lg:grid-cols-2
                    "
                >

                    {/* PROBLEM */}

                    <div
                        className="
                            border-b
                            border-white/10
                            p-7
                            lg:border-b-0
                            lg:border-r
                        "
                    >

                        {/* HEADER */}

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
                                    border-red-500/20
                                    bg-red-500/10
                                    text-red-300
                                "
                            >

                                <AlertTriangle
                                    size={24}
                                />

                            </div>



                            <div>

                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
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
                                    Problem
                                </div>



                                <h3
                                    className="
                                        mt-3
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Build Challenge
                                </h3>

                            </div>

                        </div>



                        {/* CONTENT */}

                        <div className="mt-8">

                            <p
                                className="
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-8
                                    text-zinc-400
                                "
                            >
                                {problem}
                            </p>

                        </div>

                    </div>



                    {/* SOLUTION */}

                    <div
                        className="
                            relative
                            p-7
                        "
                    >

                        {/* CONNECTOR */}

                        <div
                            className="
                                absolute
                                -left-5.5
                                top-1/2
                                hidden
                                h-11
                                w-11
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                text-orange-300
                                backdrop-blur-xl
                                lg:flex
                            "
                        >

                            <ArrowRight size={18} />

                        </div>



                        {/* HEADER */}

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
                                    border-emerald-500/20
                                    bg-emerald-500/10
                                    text-emerald-300
                                "
                            >

                                <Lightbulb
                                    size={24}
                                />

                            </div>



                            <div>

                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-emerald-500/20
                                        bg-emerald-500/10
                                        px-4
                                        py-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.25em]
                                        text-emerald-300
                                    "
                                >
                                    Solution
                                </div>



                                <h3
                                    className="
                                        mt-3
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Engineering Fix
                                </h3>

                            </div>

                        </div>



                        {/* CONTENT */}

                        <div className="mt-8">

                            <p
                                className="
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-8
                                    text-zinc-300
                                "
                            >
                                {solution}
                            </p>

                        </div>



                        {/* FOOTER */}

                        <div
                            className="
                                mt-8
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-emerald-500/20
                                bg-emerald-500/10
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                text-emerald-300
                            "
                        >
                            Resolved
                        </div>

                    </div>

                </div>

            </div>

        </RevealWrapper>
    )
}