"use client"

import Link from "next/link"

import {
    MapPin,
    Github,
    ExternalLink,
    Sparkles,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface UserMiniCardProps {

    username: string

    display_name?: string | null

    avatar_url?: string | null

    bio?: string | null

    location?: string | null

    github_url?: string | null

    portfolio_url?: string | null

    followers_count?: number

    project_count?: number

}



export default function UserMiniCard({

    username,

    display_name,

    avatar_url,

    bio,

    location,

    github_url,

    portfolio_url,

    followers_count = 0,

    project_count = 0,

}: UserMiniCardProps) {



    return (

        <RevealWrapper delay={0.05}>

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[34px]
                    border
                    border-white/10
                    bg-[#0b0b0b]
                    p-6
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        -right-20
                        -top-20
                        h-55
                        w-55
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />



                {/* GRID */}

                <div
                    className="
                        absolute
                        inset-0
                        opacity-[0.03]
                        bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                        bg-size-[60px_60px]
                    "
                />



                <div className="relative z-10">

                    {/* TOP */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            sm:flex-row
                            sm:items-start
                        "
                    >

                        {/* AVATAR */}

                        <div
                            className="
                                relative
                                h-24
                                w-24
                                shrink-0
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-orange-500/20
                                bg-orange-500/10
                            "
                        >

                            {avatar_url ? (

                                <img
                                    src={avatar_url}
                                    alt={username}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />

                            ) : (

                                <div
                                    className="
                                        flex
                                        h-full
                                        w-full
                                        items-center
                                        justify-center
                                        text-3xl
                                        font-black
                                        text-orange-300
                                    "
                                >
                                    {username
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                            )}



                            {/* ONLINE */}

                            <div
                                className="
                                    absolute
                                    bottom-2
                                    right-2
                                    h-4
                                    w-4
                                    rounded-full
                                    border-2
                                    border-black
                                    bg-emerald-400
                                "
                            />

                        </div>



                        {/* INFO */}

                        <div className="min-w-0 flex-1">

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-orange-300
                                "
                            >

                                <Sparkles size={14} />

                                Builder

                            </div>



                            <div className="mt-5">

                                <Link
                                    href={`/u/${username}`}
                                    className="
                                        text-3xl
                                        font-black
                                        tracking-tight
                                        text-white
                                        transition-colors
                                        hover:text-orange-300
                                    "
                                >
                                    {display_name ||
                                        username}
                                </Link>



                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-zinc-500
                                    "
                                >
                                    @{username}
                                </p>

                            </div>



                            {bio && (

                                <p
                                    className="
                                        mt-5
                                        max-w-2xl
                                        text-sm
                                        leading-8
                                        text-zinc-400
                                    "
                                >
                                    {bio}
                                </p>

                            )}



                            {/* LOCATION */}

                            {location && (

                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-zinc-500
                                    "
                                >

                                    <MapPin
                                        size={16}
                                    />

                                    {location}

                                </div>

                            )}

                        </div>

                    </div>



                    {/* STATS */}

                    <div
                        className="
                            mt-8
                            grid
                            grid-cols-2
                            gap-4
                        "
                    >

                        <div
                            className="
                                rounded-3xl
                                border
                                border-white/10
                                bg-white/3
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-zinc-500
                                "
                            >
                                Followers
                            </p>



                            <h3
                                className="
                                    mt-3
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                {followers_count}
                            </h3>

                        </div>



                        <div
                            className="
                                rounded-3xl
                                border
                                border-white/10
                                bg-white/3
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-zinc-500
                                "
                            >
                                Projects
                            </p>



                            <h3
                                className="
                                    mt-3
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                {project_count}
                            </h3>

                        </div>

                    </div>



                    {/* LINKS */}

                    <div
                        className="
                            mt-8
                            flex
                            flex-wrap
                            gap-3
                        "
                    >

                        {github_url && (

                            <a
                                href={github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    px-5
                                    py-4
                                    text-sm
                                    font-medium
                                    text-zinc-300
                                    transition-all
                                    hover:border-orange-500/20
                                    hover:bg-orange-500/10
                                    hover:text-orange-300
                                "
                            >

                                <Github
                                    size={18}
                                />

                                GitHub

                            </a>

                        )}



                        {portfolio_url && (

                            <a
                                href={portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-emerald-500/20
                                    bg-emerald-500/10
                                    px-5
                                    py-4
                                    text-sm
                                    font-medium
                                    text-emerald-300
                                    transition-all
                                    hover:scale-[1.02]
                                "
                            >

                                <ExternalLink
                                    size={18}
                                />

                                Portfolio

                            </a>

                        )}

                    </div>

                </div>

            </div>

        </RevealWrapper>
    )
}