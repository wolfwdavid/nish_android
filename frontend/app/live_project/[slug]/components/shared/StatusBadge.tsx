"use client"

import { Circle } from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface StatusBadgeProps {

    status:
        | "active"
        | "paused"
        | "completed"
        | "abandoned"

    size?: "sm" | "md" | "lg"

    pulse?: boolean

}



const STATUS_STYLES = {

    active: {
        label: "Active",
        color:
            "text-emerald-300",
        bg:
            "bg-emerald-500/10",
        border:
            "border-emerald-500/20",
    },

    paused: {
        label: "Paused",
        color:
            "text-yellow-300",
        bg:
            "bg-yellow-500/10",
        border:
            "border-yellow-500/20",
    },

    completed: {
        label: "Completed",
        color:
            "text-blue-300",
        bg:
            "bg-blue-500/10",
        border:
            "border-blue-500/20",
    },

    abandoned: {
        label: "Abandoned",
        color:
            "text-red-300",
        bg:
            "bg-red-500/10",
        border:
            "border-red-500/20",
    },

}



export default function StatusBadge({

    status,

    size = "md",

    pulse = true,

}: StatusBadgeProps) {



    const style =
        STATUS_STYLES[status]



    const sizeStyles = {

        sm: {
            wrapper:
                "px-3 py-1.5 text-xs gap-2 rounded-full",
            icon:
                "h-2 w-2",
        },

        md: {
            wrapper:
                "px-4 py-2 text-sm gap-2 rounded-full",
            icon:
                "h-2.5 w-2.5",
        },

        lg: {
            wrapper:
                "px-5 py-3 text-base gap-3 rounded-2xl",
            icon:
                "h-3 w-3",
        },

    }



    return (

        <RevealWrapper delay={0.03}>

            <div
                className={`
                    relative
                    inline-flex
                    items-center
                    border
                    font-semibold
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    ${style.border}
                    ${style.bg}
                    ${style.color}
                    ${sizeStyles[size].wrapper}
                `}
            >

                {/* GLOW */}

                <div
                    className={`
                        absolute
                        inset-0
                        rounded-inherit
                        opacity-40
                        blur-xl
                        ${style.bg}
                    `}
                />



                {/* CONTENT */}

                <div
                    className="
                        relative
                        z-10
                        flex
                        items-center
                        gap-inherit
                    "
                >

                    <div className="relative">

                        {pulse && (

                            <div
                                className={`
                                    absolute
                                    inset-0
                                    animate-ping
                                    rounded-full
                                    ${style.bg}
                                `}
                            />

                        )}



                        <Circle
                            fill="currentColor"
                            strokeWidth={0}
                            className={`
                                relative
                                z-10
                                ${sizeStyles[size].icon}
                            `}
                        />

                    </div>



                    <span
                        className="
                            tracking-tight
                        "
                    >
                        {style.label}
                    </span>

                </div>

            </div>

        </RevealWrapper>
    )
}