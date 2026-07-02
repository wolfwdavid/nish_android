"use client"

import Link from "next/link"

import Image from "next/image"

import { ExternalLink } from "lucide-react"

import type { CurrentUser } from "@/app/lib/type/currentUser"


type BuilderCardUser = {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
}

type Props = {
    user: BuilderCardUser
}



export default function MobileBuilderCard({
    currentUser,
}: {
    currentUser: CurrentUser | null
}) {

    if (!currentUser) return null

    return (

        <div
            className="
                fade-up
                mt-8
                block
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-900/40
                p-5
                backdrop-blur-xl

                xl:hidden
            "
        >

            <p
                className="
                    mb-4
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-zinc-500
                "
            >
                Builder
            </p>

            <div className="flex items-center gap-4">

                <div
                    className="
                        relative
                        h-14
                        w-14
                        overflow-hidden
                        rounded-2xl
                    "
                >

                    <Image
                        src={
                            currentUser.avatar_url ||
                            "/default-avatar.png"
                        }
                        alt={
                            currentUser.display_name
                        }
                        fill
                        className="object-cover"
                    />

                </div>

                <div className="flex-1">

                    <h3
                        className="
                            text-lg
                            font-semibold
                            text-white
                        "
                    >

                        {currentUser.display_name}

                    </h3>

                    <p
                        className="
                            text-sm
                            text-zinc-400
                        "
                    >

                        @{currentUser.username}

                    </p>

                </div>

                <Link
                    href={`/u/${currentUser.username}`}
                    className="
                        flex
                        items-center
                        gap-1
                        rounded-xl
                        border
                        border-zinc-700
                        px-4
                        py-2
                        text-sm
                        text-zinc-300
                        transition
                        hover:border-zinc-500
                        hover:bg-zinc-800
                        hover:text-white
                    "
                >

                    View

                    <ExternalLink size={15} />

                </Link>

            </div>

        </div>
    )
}