"use client"

import { Circle } from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface StatusOption {

    value: string

    label: string

    color: string

    bg: string

    border: string

}



interface StatusSelectorProps {

    value: string

    onChange: (
        value: string
    ) => void

}



const STATUS_OPTIONS:
    StatusOption[] = [

    {
        value: "active",
        label: "Active",
        color:
            "text-emerald-300",
        bg:
            "bg-emerald-500/10",
        border:
            "border-emerald-500/20",
    },

    {
        value: "paused",
        label: "Paused",
        color:
            "text-yellow-300",
        bg:
            "bg-yellow-500/10",
        border:
            "border-yellow-500/20",
    },

    {
        value: "completed",
        label: "Completed",
        color:
            "text-blue-300",
        bg:
            "bg-blue-500/10",
        border:
            "border-blue-500/20",
    },

    {
        value: "abandoned",
        label: "Abandoned",
        color:
            "text-red-300",
        bg:
            "bg-red-500/10",
        border:
            "border-red-500/20",
    },

]



export default function StatusSelector({

    value,

    onChange,

}: StatusSelectorProps) {



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

                    <div className="mb-6">

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
                            Live State
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
                            Project Status
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
                            Reflect the real state of the
                            build journey publicly.
                        </p>

                    </div>



                    {/* OPTIONS */}

                    <div
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        {STATUS_OPTIONS.map(
                            (status) => {

                                const active =
                                    value ===
                                    status.value

                                return (

                                    <button
                                        key={
                                            status.value
                                        }
                                        onClick={() =>
                                            onChange(
                                                status.value
                                            )
                                        }
                                        className={`
                                            group
                                            relative
                                            overflow-hidden
                                            rounded-[28px]
                                            border
                                            p-5
                                            text-left
                                            transition-all
                                            duration-300
                                            ${
                                                active
                                                    ? `
                                                        ${status.border}
                                                        ${status.bg}
                                                        ${status.color}
                                                      `
                                                    : `
                                                        border-white/10
                                                        bg-white/3
                                                        text-zinc-400
                                                        hover:border-white/20
                                                        hover:bg-white/5
                                                        hover:text-white
                                                      `
                                            }
                                        `}
                                    >

                                        {/* ACTIVE GLOW */}

                                        {active && (

                                            <div
                                                className="
                                                    absolute
                                                    -right-12.5
                                                    -top-12.5
                                                    h-40
                                                    w-40
                                                    rounded-full
                                                    bg-white/10
                                                    blur-3xl
                                                "
                                            />

                                        )}



                                        <div
                                            className="
                                                relative
                                                z-10
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <div>

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    <Circle
                                                        size={
                                                            14
                                                        }
                                                        fill="currentColor"
                                                        strokeWidth={
                                                            0
                                                        }
                                                    />



                                                    <p
                                                        className="
                                                            text-lg
                                                            font-bold
                                                            tracking-tight
                                                        "
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </p>

                                                </div>



                                                <p
                                                    className="
                                                        mt-4
                                                        text-sm
                                                        leading-7
                                                        text-current/70
                                                    "
                                                >

                                                    {status.value ===
                                                        "active" &&
                                                        "Currently being developed and actively progressing."}

                                                    {status.value ===
                                                        "paused" &&
                                                        "Temporarily halted but expected to continue later."}

                                                    {status.value ===
                                                        "completed" &&
                                                        "Main development goals successfully finished."}

                                                    {status.value ===
                                                        "abandoned" &&
                                                        "Development permanently stopped or archived."}

                                                </p>

                                            </div>



                                            {/* CHECK */}

                                            <div
                                                className={`
                                                    flex
                                                    h-12
                                                    w-12
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    border
                                                    transition-all
                                                    ${
                                                        active
                                                            ? `
                                                                border-white/20
                                                                bg-white/10
                                                                text-white
                                                              `
                                                            : `
                                                                border-white/10
                                                                bg-black/20
                                                                text-zinc-600
                                                              `
                                                    }
                                                `}
                                            >

                                                <Circle
                                                    size={16}
                                                    fill={
                                                        active
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />

                                            </div>

                                        </div>

                                    </button>

                                )

                            }
                        )}

                    </div>

                </div>

            </div>

        </RevealWrapper>
    )
}