"use client"

import { useState } from "react"

import {
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    Flame,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface EntryReactionBarProps {

    likes_count: number

    comments_count: number

}



export default function EntryReactionBar({

    likes_count,

    comments_count,

}: EntryReactionBarProps) {



    const [liked, setLiked] =
        useState(false)

    const [saved, setSaved] =
        useState(false)



    const [likes, setLikes] =
        useState(likes_count)



    function handleLike() {

        if (liked) {

            setLikes((prev) => prev - 1)

        }

        else {

            setLikes((prev) => prev + 1)

        }

        setLiked(!liked)

    }



    return (

        <RevealWrapper delay={0.05}>

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-[#0b0b0b]
                    px-5
                    py-4
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        -right-12.5
                        -top-12.5
                        h-35
                        w-35
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />



                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    {/* LEFT */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                        "
                    >

                        {/* LIKE */}

                        <button
                            onClick={handleLike}
                            className={`
                                flex
                                items-center
                                gap-2
                                rounded-2xl
                                border
                                px-4
                                py-3
                                text-sm
                                font-medium
                                transition-all
                                ${
                                    liked
                                        ? `
                                            border-red-500/20
                                            bg-red-500/10
                                            text-red-300
                                          `
                                        : `
                                            border-white/10
                                            bg-white/3
                                            text-zinc-300
                                            hover:border-red-500/20
                                            hover:bg-red-500/10
                                            hover:text-red-300
                                          `
                                }
                            `}
                        >

                            <Heart
                                size={17}
                                fill={
                                    liked
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            {likes}

                        </button>



                        {/* COMMENTS */}

                        <button
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/3
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-zinc-300
                                transition-all
                                hover:border-orange-500/20
                                hover:bg-orange-500/10
                                hover:text-orange-300
                            "
                        >

                            <MessageCircle size={17} />

                            {comments_count}

                        </button>



                        {/* STREAK */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-2xl
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-orange-300
                            "
                        >

                            <Flame size={17} />

                            Active Build

                        </div>

                    </div>



                    {/* RIGHT */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        {/* SAVE */}

                        <button
                            onClick={() =>
                                setSaved(!saved)
                            }
                            className={`
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                transition-all
                                ${
                                    saved
                                        ? `
                                            border-yellow-500/20
                                            bg-yellow-500/10
                                            text-yellow-300
                                          `
                                        : `
                                            border-white/10
                                            bg-white/3
                                            text-zinc-300
                                            hover:border-yellow-500/20
                                            hover:bg-yellow-500/10
                                            hover:text-yellow-300
                                          `
                                }
                            `}
                        >

                            <Bookmark
                                size={18}
                                fill={
                                    saved
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                        </button>



                        {/* SHARE */}

                        <button
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/3
                                text-zinc-300
                                transition-all
                                hover:border-blue-500/20
                                hover:bg-blue-500/10
                                hover:text-blue-300
                            "
                        >

                            <Share2 size={18} />

                        </button>

                    </div>

                </div>

            </div>

        </RevealWrapper>
    )
}