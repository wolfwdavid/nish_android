"use client"

import Link from "next/link"

import { ChevronRight } from "lucide-react"



export default function Breadcrumb({
    slug,
    username,
}: {
    slug: string
    username?: string
}) {

    return (

        <div
            className="
                fade-up
                mb-6
                flex
                flex-wrap
                items-center
                gap-2
                text-sm
                text-zinc-500
            "
        >

            <Link
                href="/explore"
                className="
                    transition
                    hover:text-white
                "
            >
                Explore
            </Link>

            <ChevronRight size={14} />

            {
                username && (
                    <>
                        <Link
                            href={`/u/${username}`}
                            className="
                                transition
                                hover:text-white
                            "
                        >
                            {username}
                        </Link>

                        <ChevronRight size={14} />
                    </>
                )
            }

            <span className="text-zinc-300">

                {slug}

            </span>

        </div>
    )
}