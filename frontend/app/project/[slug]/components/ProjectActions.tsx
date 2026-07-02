"use client"

import Link from "next/link"

import {
    Globe,
    Github,
    Star,
    Bookmark,
} from "lucide-react"

import Image from "next/image"


export default function ProjectActions({

    githubUrl,

    liveUrl,

    stars,

    isStarred,

    addProjectStar,

    isBookmarked,

    toggleProjectBookmark,

}: {

    githubUrl: string

    liveUrl: string | null

    stars: number

    isStarred: boolean

    addProjectStar: () => void

    isBookmarked: boolean

    toggleProjectBookmark: () => void
}) {

    return (

        <div
            className="
                fade-up

                mt-10

                flex
                flex-wrap
                items-center

                gap-4
            "
        >

            {/* GITHUB */}

            <Link
                href={githubUrl}

                target="_blank"

                className="
                    flex
                    items-center
                    gap-2

                    rounded-2xl

                    border
                    border-orange-500/20

                    bg-orange-500/10

                    px-6
                    py-3

                    text-sm
                    font-semibold

                    text-orange-300

                    backdrop-blur-xl

                    transition-all

                    hover:scale-[1.03]

                    hover:border-orange-400/40

                    hover:bg-orange-500/20

                    hover:text-orange-200
                "
            >

                <Image
                    src="/github-white.svg"
                    alt="Github"
                    width={28}
                    height={28}
                />
                View Source

            </Link>



            {/* LIVE DEMO */}

            {
                liveUrl && (

                    <Link
                        href={liveUrl}

                        target="_blank"

                        className="
                            flex
                            items-center
                            gap-2

                            rounded-2xl

                            border
                            border-orange-500/20

                            bg-orange-500/10

                            px-6
                            py-3

                            text-sm
                            font-semibold

                            text-orange-300

                            backdrop-blur-xl

                            transition-all

                            hover:scale-[1.03]

                            hover:border-orange-400/40

                            hover:bg-orange-500/20

                            hover:text-orange-200
                        "
                    >

                        <Image
                            src="/globe.svg"
                            alt="Live Url"
                            width={28}
                            height={28}
                        />

                        Live Demo

                    </Link>
                )
            }



            {/* STAR */}

            <div
                className="
                    flex
                    items-center
                    gap-2

                    rounded-2xl

                    border
                    border-yellow-500/20

                    bg-yellow-500/10

                    px-5
                    py-3

                    text-sm
                    font-medium

                    text-yellow-300
                "
            >

                <button

                    onClick={addProjectStar}

                    className="
                        flex
                        items-center
                        gap-2

                        transition

                        hover:scale-105
                    "
                >

                    <Star

                        size={17}

                        className={
                            isStarred
                                ? "fill-yellow-300 text-yellow-300"
                                : "text-yellow-300"
                        }
                    />

                    {stars}

                </button>

            </div>



            {/* BOOKMARK */}
            <div
                className="
                    flex
                    items-center
                    gap-2

                    rounded-2xl

                    border
                    border-yellow-500/20

                    bg-yellow-500/10

                    px-5
                    py-3

                    text-sm
                    font-medium

                    text-yellow-300
                "
            >

            <button

                onClick={toggleProjectBookmark}

                className={`
                    flex
                    items-center
                    justify-center

                    rounded-2xl

                    border

                    px-2
                    py-1

                    backdrop-blur-xl

                    transition-all

                    hover:scale-[1.03]

                    ${
                        isBookmarked
                            ? `
                                border-white/20
                                bg-white/10
                                text-white
                            `
                            : `
                                border-zinc-800
                                bg-zinc-900/60
                                text-zinc-400
                                hover:border-zinc-700
                                hover:text-white
                            `
                    }
                `}
            >

                <Bookmark

                    size={18}

                    className={
                        isBookmarked
                            ? "fill-white"
                            : ""
                    }
                />

            </button>

            </div>

        </div>
    )
}