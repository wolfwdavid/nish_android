"use client"

import {
    Layers3,
    Sparkles,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface TechStackChipsProps {

    tech_stack: string[]

}



export default function TechStackChips({

    tech_stack,

}: TechStackChipsProps) {



    if (
        !tech_stack ||
        tech_stack.length === 0
    ) {
        return null
    }



    return (

        <RevealWrapper delay={0.04}>

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

                                <Layers3 size={24} />

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

                                    <Sparkles size={14} />

                                    Tech Stack

                                </div>



                                <h3
                                    className="
                                        mt-4
                                        text-3xl
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Core Technologies
                                </h3>



                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-sm
                                        leading-7
                                        text-zinc-400
                                    "
                                >
                                    Technologies powering this
                                    live build journey.
                                </p>

                            </div>

                        </div>



                        <div
                            className="
                                rounded-3xl
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-5
                                py-4
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
                                Stack Count
                            </p>



                            <h2
                                className="
                                    mt-2
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                {tech_stack.length}
                            </h2>

                        </div>

                    </div>



                    {/* CHIPS */}

                    <div
                        className="
                            mt-10
                            flex
                            flex-wrap
                            gap-4
                        "
                    >

                        {tech_stack.map(
                            (tech, index) => (

                                <div
                                    key={tech}
                                    className="
                                        group
                                        relative
                                        overflow-hidden
                                        rounded-3xl
                                        border
                                        border-white/10
                                        bg-white/3
                                        px-5
                                        py-4
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-orange-500/20
                                        hover:bg-orange-500/6
                                    "
                                >

                                    {/* HOVER GLOW */}

                                    <div
                                        className="
                                            absolute
                                            -right-10
                                            -top-10
                                            h-30
                                            w-30
                                            rounded-full
                                            bg-orange-500/10
                                            opacity-0
                                            blur-3xl
                                            transition-opacity
                                            duration-300
                                            group-hover:opacity-100
                                        "
                                    />



                                    <div
                                        className="
                                            relative
                                            z-10
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                border
                                                border-orange-500/20
                                                bg-orange-500/10
                                                text-sm
                                                font-black
                                                text-orange-300
                                            "
                                        >
                                            {index + 1}
                                        </div>



                                        <div>

                                            <p
                                                className="
                                                    text-base
                                                    font-bold
                                                    tracking-tight
                                                    text-white
                                                "
                                            >
                                                {tech}
                                            </p>



                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    uppercase
                                                    tracking-[0.2em]
                                                    text-zinc-500
                                                "
                                            >
                                                Active Technology
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>

        </RevealWrapper>
    )
}