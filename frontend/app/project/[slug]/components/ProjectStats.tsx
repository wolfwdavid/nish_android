"use client"

import Image from "next/image"



export default function ProjectStats({

    stars,

    views,

    comments,

}: {

    stars: number

    views: number

    comments: number
}) {

    const stats = [

        {
            icon: "/star.svg",

            label: "Stars",

            value: stars,
        },

        {
            icon: "/eye.svg",

            label: "Views",

            value: views,
        },

        {
            icon: "/comment.svg",

            label: "Comments",

            value: comments,
        },
    ]



    return (

        <div
            className="
                fade-up

                mt-10

                grid
                grid-cols-1

                gap-4

                sm:grid-cols-3
            "
        >

            {
                stats.map((stat) => (

                    <div

                        key={stat.label}

                        className="
                            group

                            relative

                            overflow-hidden

                            rounded-3xl

                            border
                            border-zinc-800/80

                            bg-zinc-900/40

                            p-6

                            backdrop-blur-xl

                            transition-all
                            duration-300

                            hover:border-orange-500/30

                            hover:bg-zinc-900/70
                        "
                    >

                        {/* glow */}

                        <div
                            className="
                                absolute

                                inset-0

                                bg-linear-to-br
                                from-orange-500/0
                                via-orange-500/0
                                to-orange-500/5

                                opacity-0

                                transition-opacity
                                duration-300

                                group-hover:opacity-100
                            "
                        />



                        <div
                            className="
                                relative

                                flex
                                items-center

                                gap-4
                            "
                        >

                            {/* ICON */}

                            <div
                                className="
                                    flex

                                    h-12
                                    w-12

                                    items-center
                                    justify-center

                                    rounded-2xl

                                    border
                                    border-zinc-800

                                    bg-zinc-950/80
                                "
                            >

                                <Image
                                    src={stat.icon}

                                    alt={stat.label}

                                    width={20}

                                    height={20}

                                    className="
                                        opacity-90
                                    "
                                />

                            </div>



                            {/* TEXT */}

                            <div>

                                <p
                                    className="
                                        text-xs

                                        uppercase

                                        tracking-[0.18em]

                                        text-zinc-500
                                    "
                                >

                                    {stat.label}

                                </p>

                                <h3
                                    className="
                                        mt-1

                                        text-3xl
                                        font-black

                                        tracking-tight

                                        text-white
                                    "
                                >

                                    {stat.value}

                                </h3>

                            </div>

                        </div>

                    </div>
                ))
            }

        </div>
    )
}