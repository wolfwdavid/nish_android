"use client"

import {
    Eye,
    BookOpen,
    Flame,
    Clock3,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface HeroStatsProps {

    views_count: number

    journal_count: number

    created_at: string

}



export default function HeroStats({

    views_count,

    journal_count,

    created_at,

}: HeroStatsProps) {



    const createdDate =
        new Date(created_at)



    const currentDate =
        new Date()



    const diffTime =
        currentDate.getTime() -
        createdDate.getTime()



    const dayCount =
        Math.max(
            1,
            Math.floor(
                diffTime / (1000 * 60 * 60 * 24)
            )
        )



    const stats = [

        {
            title: "Views",
            value: views_count,
            icon: Eye,
            color:
                "text-blue-300",
            bg:
                "bg-blue-500/10",
            border:
                "border-blue-500/20",
        },

        {
            title: "Journal Entries",
            value: journal_count,
            icon: BookOpen,
            color:
                "text-orange-300",
            bg:
                "bg-orange-500/10",
            border:
                "border-orange-500/20",
        },

        {
            title: "Build Streak",
            value: `${dayCount}d`,
            icon: Flame,
            color:
                "text-red-300",
            bg:
                "bg-red-500/10",
            border:
                "border-red-500/20",
        },

        {
            title: "Active Since",
            value: `${dayCount} days`,
            icon: Clock3,
            color:
                "text-emerald-300",
            bg:
                "bg-emerald-500/10",
            border:
                "border-emerald-500/20",
        },

    ]



    return (

        <RevealWrapper delay={0.15}>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {stats.map((stat, index) => {

                    const Icon =
                        stat.icon

                    return (

                        <div
                            key={stat.title}
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-white/10
                                bg-[#0d0d0d]
                                p-5
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-white/20
                            "
                        >

                            {/* GLOW */}

                            <div
                                className={`
                                    absolute
                                    -right-10
                                    -top-10
                                    h-30
                                    w-30
                                    rounded-full
                                    blur-3xl
                                    transition-opacity
                                    duration-300
                                    group-hover:opacity-100
                                    ${stat.bg}
                                    opacity-60
                                `}
                            />



                            {/* CONTENT */}

                            <div className="relative z-10">

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-[0.2em]
                                                text-zinc-500
                                            "
                                        >
                                            {stat.title}
                                        </p>



                                        <h3
                                            className="
                                                mt-3
                                                text-3xl
                                                font-black
                                                tracking-tight
                                                text-white
                                            "
                                        >
                                            {stat.value}
                                        </h3>

                                    </div>



                                    <div
                                        className={`
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            ${stat.border}
                                            ${stat.bg}
                                            ${stat.color}
                                        `}
                                    >

                                        <Icon size={22} />

                                    </div>

                                </div>



                                {/* BOTTOM */}

                                <div
                                    className="
                                        mt-6
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <div
                                        className="
                                            h-0.5
                                            w-full
                                            overflow-hidden
                                            rounded-full
                                            bg-white/5
                                        "
                                    >

                                        <div
                                            className={`
                                                h-full
                                                w-[65%]
                                                rounded-full
                                                ${stat.bg}
                                            `}
                                        />

                                    </div>



                                    <span
                                        className="
                                            ml-3
                                            text-[10px]
                                            uppercase
                                            tracking-[0.25em]
                                            text-zinc-600
                                        "
                                    >
                                        LIVE
                                    </span>

                                </div>

                            </div>

                        </div>

                    )

                })}

            </div>

        </RevealWrapper>
    )
}