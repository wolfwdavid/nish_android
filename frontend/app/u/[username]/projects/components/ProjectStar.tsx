"use client"

import { Star } from "lucide-react"

type ProjectStarProps = {

    toggleProjectStar: () => void

    stars: number

    isStarred: boolean
}

export default function ProjectStar({

    toggleProjectStar,

    stars,

    isStarred,

}: ProjectStarProps) {

    return (

        <button
            onClick={toggleProjectStar}
            className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-full
                hover:bg-zinc-900
                active:scale-95
                transition-all
                duration-200
            "
        >

            <Star
                size={24}
                strokeWidth={2}

                className={`
                    transition-all
                    duration-200

                    ${
                        isStarred
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-zinc-300 hover:text-yellow-300"
                    }
                `}
            />

            <span
                className="
                    text-sm
                    font-medium
                    text-zinc-300
                "
            >
                {stars}
            </span>

        </button>
    )
}