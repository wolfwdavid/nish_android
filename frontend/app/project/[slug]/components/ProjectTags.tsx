"use client"

import { Sparkles } from "lucide-react"



export default function ProjectTags({
    isFeatured,
}: {
    isFeatured: boolean
}) {

    return (

        <div className="fade-up mb-5 flex items-center gap-3">

            <span
                className="
                    rounded-full
                    border
                    border-orange-500/20
                    bg-orange-500/10
                    px-4
                    py-1.5
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-orange-300
                    backdrop-blur-md
                "
            >
                Live Project
            </span>

            {
                isFeatured && (

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-yellow-500/20
                            bg-yellow-500/10
                            px-4
                            py-1.5
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.2em]
                            text-yellow-300
                            backdrop-blur-md
                        "
                    >

                        <Sparkles size={12} />

                        Featured

                    </div>
                )
            }

        </div>
    )
}