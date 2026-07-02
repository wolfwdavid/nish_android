"use client"

import Image from "next/image"

import Link from "next/link"

import {
    Star,
    Eye,
    MessageSquare,
    Bookmark,
} from "lucide-react"

import type { GetProject }
from "@/app/lib/type/project"



export default function ProjectCard({

    project,

    onUnbookmark,

}: {

    project: GetProject

    onUnbookmark?: () => void
}){

    return (

        <div
            className="
                group

                overflow-hidden

                rounded-3xl

                border
                border-zinc-900

                bg-zinc-950/40

                backdrop-blur-xl

                transition-all
                duration-300

                hover:border-orange-500/20
                hover:bg-zinc-950/70
            "
        >

            {/* THUMBNAIL */}

            <Link
                href={`/project/${project.slug}`}
            >

                <div
                    className="
                        relative

                        aspect-video
                        w-full

                        overflow-hidden

                        border-b
                        border-zinc-900
                    "
                >

                    <Image
                        src={
                            project.thumbnail_url
                            ||
                            "/default-project.png"
                        }

                        alt={project.title}

                        fill

                        sizes="100vw"

                        className="
                            object-cover

                            transition-transform
                            duration-500

                            group-hover:scale-[1.03]
                        "
                    />



                    {/* overlay */}

                    <div
                        className="
                            absolute
                            inset-0

                            bg-linear-to-t
                            from-black/80
                            via-black/10
                            to-transparent
                        "
                    />



                    {/* featured */}

                    {
                        project.is_bookmarked && (

                            <button

                                onClick={onUnbookmark}

                                className="
                                    absolute
                                    right-4
                                    top-4

                                    rounded-full

                                    bg-black/60

                                    p-2

                                    backdrop-blur-xl

                                    transition-all
                                    duration-200

                                    hover:scale-110
                                    hover:bg-red-500/20
                                "
                            >

                                <Bookmark

                                    size={16}

                                    className="
                                        fill-white
                                        text-white
                                    "
                                />

                            </button>
                        )
                    }



                    {/* bookmark */}

                    {
                        project.is_bookmarked && (

                            <div
                                className="
                                    absolute
                                    right-4
                                    top-4

                                    rounded-full

                                    bg-black/60

                                    p-2

                                    backdrop-blur-xl
                                "
                            >

                                <button

                                    onClick={(e) => {

                                        e.preventDefault()

                                        e.stopPropagation()

                                        onUnbookmark?.()
                                    }}

                                    className="
                                        absolute
                                        right-4
                                        top-4

                                        z-20

                                        rounded-full

                                        bg-black/60

                                        p-2

                                        backdrop-blur-xl

                                        transition-all
                                        duration-200

                                        hover:scale-110
                                        hover:bg-red-500/20
                                    "
                                >

                                    <Bookmark

                                        size={16}

                                        className="
                                            fill-white
                                            text-white
                                        "
                                    />

                                </button>

                            </div>
                        )
                    }

                </div>

            </Link>



            {/* CONTENT */}

            <div
                className="
                    p-6
                "
            >

                {/* AUTHOR */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            relative

                            h-10
                            w-10

                            overflow-hidden

                            rounded-full

                            border
                            border-zinc-800
                        "
                    >

                        <Image
                            src={
                                project.user.avatar_url
                                ||
                                "/default-avatar.png"
                            }

                            alt={
                                project.user.username
                            }

                            fill

                            sizes="40px"

                            className="
                                object-cover
                            "
                        />

                    </div>



                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            {
                                project.user.username
                            }
                        </p>

                        <p
                            className="
                                text-xs
                                text-zinc-500
                            "
                        >
                            {
                                project.user.location
                                ||
                                "Unknown location"
                            }
                        </p>

                    </div>

                </div>



                {/* TITLE */}

                <Link
                    href={`/project/${project.slug}`}
                >

                    <h2
                        className="
                            mt-5

                            line-clamp-2

                            text-2xl
                            font-black

                            tracking-tight

                            text-white

                            transition-colors

                            group-hover:text-orange-300
                        "
                    >

                        {project.title}

                    </h2>

                </Link>



                {/* DESCRIPTION */}

                <p
                    className="
                        mt-3

                        line-clamp-3

                        text-sm
                        leading-relaxed

                        text-zinc-400
                    "
                >

                    {project.description}

                </p>



                {/* TECH STACK */}

                <div
                    className="
                        mt-5

                        flex
                        flex-wrap

                        gap-2
                    "
                >

                    {
                        project.tech_stack
                            .slice(0, 5)
                            .map((tech) => (

                                <span
                                    key={tech}

                                    className="
                                        rounded-full

                                        border
                                        border-zinc-800

                                        bg-zinc-900

                                        px-3
                                        py-1.5

                                        text-xs
                                        font-medium

                                        text-zinc-300
                                    "
                                >

                                    {tech}

                                </span>
                            ))
                    }

                </div>



                {/* STATS */}

                <div
                    className="
                        mt-6

                        flex
                        items-center

                        gap-5

                        border-t
                        border-zinc-900

                        pt-5
                    "
                >

                    {/* stars */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2

                            text-zinc-400
                        "
                    >

                        <Star
                            size={16}
                            className="
                                text-yellow-400
                            "
                        />

                        <span
                            className="
                                text-sm
                                font-medium
                            "
                        >
                            {
                                project.stars_count
                            }
                        </span>

                    </div>



                    {/* views */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2

                            text-zinc-400
                        "
                    >

                        <Eye size={16} />

                        <span
                            className="
                                text-sm
                                font-medium
                            "
                        >
                            {
                                project.views_count
                            }
                        </span>

                    </div>



                    {/* comments */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2

                            text-zinc-400
                        "
                    >

                        <MessageSquare
                            size={16}
                        />

                        <span
                            className="
                                text-sm
                                font-medium
                            "
                        >
                            {
                                project.comments_count
                            }
                        </span>

                    </div>

                </div>

            </div>

        </div>
    )
}