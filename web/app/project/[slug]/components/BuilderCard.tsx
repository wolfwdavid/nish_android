"use client"

import Link from "next/link"

import Image from "next/image"

import {
    ExternalLink,
    Github,
    Linkedin,
} from "lucide-react"

import type { CurrentUser } from "@/app/lib/type/currentUser"

import linkedin from "@/public/linkedin-svg.svg"






export default function BuilderCard({
    currentUser,
}: {
    currentUser: CurrentUser | null
}) {

    if (!currentUser) return null



    return (

        <div
            className="
                fade-up
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-900/40
                p-6
                backdrop-blur-xl
            "
        >

            <p
                className="
                    mb-5
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-zinc-500
                "
            >

                Builder

            </p>



            <div className="flex flex-col items-center text-center">

                <div
                    className="
                        relative
                        h-24
                        w-24
                        overflow-hidden
                        rounded-3xl
                        border
                        border-zinc-700
                    "
                >

                    <Image
                        src={
                            currentUser.avatar_url ||
                            "/default-avatar.webp"
                        }
                        alt={
                            currentUser.display_name
                        }
                        fill
                        className="object-cover"
                    />

                </div>



                <h2
                    className="
                        mt-5
                        text-xl
                        font-bold
                        text-white
                    "
                >

                    {currentUser.display_name}

                </h2>



                <p
                    className="
                        mt-1
                        text-sm
                        text-zinc-500
                    "
                >

                    @{currentUser.username}

                </p>



                {
                    currentUser.bio && (

                        <p
                            className="
                                mt-4
                                text-sm
                                leading-7
                                text-zinc-400
                            "
                        >

                            {currentUser.bio}

                        </p>
                    )
                }



                <div
                    className="
                        mt-6
                        flex
                        items-center
                        gap-3
                    "
                >

                    {
                        currentUser.github_url && (

                            <Link
                                href={
                                    currentUser.github_url
                                }
                                target="_blank"
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-zinc-700
                                    bg-zinc-800/60
                                    text-zinc-300
                                    transition
                                    hover:border-zinc-500
                                    hover:bg-zinc-700
                                    hover:text-white
                                "
                            >

                                <Image
                                    src="/github-white.svg"
                                    alt="GitHub"
                                    width={28}
                                    height={28}
                                />

                            </Link>
                        )
                    }



                    {
                        currentUser.linkedin_url && (

                            <Link
                                href={
                                    currentUser.linkedin_url
                                }
                                target="_blank"
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-zinc-700
                                    bg-zinc-800/60
                                    text-zinc-300
                                    transition
                                    hover:border-zinc-500
                                    hover:bg-zinc-700
                                    hover:text-white
                                "
                            >

                                <Image
                                    src="/linkedin-svg.svg"
                                    alt="Linkedin"
                                    width={28}
                                    height={28}
                                />

                            </Link>
                        )
                    }



                    {
                        currentUser.portfolio_url && (

                            <Link
                                href={
                                    currentUser.portfolio_url
                                }
                                target="_blank"
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-zinc-700
                                    bg-zinc-800/60
                                    text-zinc-300
                                    transition
                                    hover:border-zinc-500
                                    hover:bg-zinc-700
                                    hover:text-white
                                "
                            >

                                <Image
                                    src="/portfolio-svg.svg"
                                    alt="Portfolio"
                                    width={28}
                                    height={28}
                                />

                            </Link>
                        )
                    }

                </div>



                <Link
                    href={`/u/${currentUser.username}/me`}
                    className="
                        mt-7
                        w-full
                        rounded-2xl
                        bg-orange-400
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-black
                        transition
                        hover:scale-[1.02]
                    "
                >

                    Visit Profile

                </Link>

            </div>

        </div>
    )
}