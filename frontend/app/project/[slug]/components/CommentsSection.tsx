"use client"

import Image from "next/image"

import {
    Heart,
    MoreHorizontal,
    Reply,
} from "lucide-react"

import { useState } from "react"

import type {
    CurrentUser,
} from "@/app/lib/type/currentUser"

import type {
    GetComment,
    CommentData,
} from "@/app/lib/type/comment"



export default function CommentsSection({
    currentUser,
    handleSubmit,
    commentData,
    setCommentData,
    comments,
}: {
    currentUser: CurrentUser | null

    handleSubmit: (
        e: React.FormEvent<HTMLFormElement>
    ) => void

    commentData: CommentData

    setCommentData: React.Dispatch<
        React.SetStateAction<CommentData>
    >

    comments: GetComment[]
}) {

    const [openMenuId, setOpenMenuId] =
        useState<string | null>(null)



    return (

        <section
            className="
                mt-10
                space-y-8
                overflow-visible
            "
        >

            {/* ================================================= */}
            {/* COMMENT INPUT */}
            {/* ================================================= */}

            <div
                className="
                    overflow-visible
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-zinc-900/40
                    p-4

                    sm:p-6
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-3

                        sm:gap-4
                    "
                >

                    <Image
                        src={
                            currentUser?.avatar_url ??
                            "/default-avatar.png"
                        }
                        alt="avatar"
                        width={48}
                        height={48}
                        className="
                            h-11
                            w-11
                            rounded-full
                            object-cover

                            sm:h-12
                            sm:w-12
                        "
                    />

                    <form
                        onSubmit={handleSubmit}
                        className="flex-1"
                    >

                        <textarea
                            value={commentData.content}
                            onChange={(e) =>
                                setCommentData({
                                    ...commentData,
                                    content:
                                        e.target.value,
                                })
                            }
                            placeholder="
                                Share your thoughts...
                            "
                            className="
                                min-h-30
                                w-full
                                resize-none
                                rounded-3xl
                                border
                                border-zinc-800
                                bg-black/20
                                p-4
                                text-sm
                                text-white
                                outline-none
                                transition

                                placeholder:text-zinc-500

                                focus:border-orange-500/40

                                sm:text-[15px]
                            "
                        />

                        <div
                            className="
                                mt-4
                                flex
                                justify-end
                            "
                        >

                            <button
                                type="submit"
                                className="
                                    rounded-2xl
                                    bg-orange-500
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition-all

                                    hover:bg-orange-400
                                    hover:scale-[1.02]
                                "
                            >
                                Post Comment
                            </button>

                        </div>

                    </form>

                </div>

            </div>



            {/* ================================================= */}
            {/* COMMENTS */}
            {/* ================================================= */}

            <div
                className="
                    space-y-5
                    overflow-visible
                "
            >

                {
                    comments.map((comment) => (

                        <div
                            key={comment.id}
                            className="
                                relative
                                overflow-visible
                                rounded-3xl
                                border
                                border-zinc-800
                                bg-zinc-900/40
                                p-4
                                backdrop-blur-xl

                                sm:p-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3

                                    sm:gap-4
                                "
                            >

                                <Image
                                    src={
                                        comment.user.avatar_url ??
                                        "/default-avatar.png"
                                    }
                                    alt="avatar"
                                    width={48}
                                    height={48}
                                    className="
                                        h-11
                                        w-11
                                        rounded-full
                                        object-cover

                                        sm:h-12
                                        sm:w-12
                                    "
                                />



                                <div className="flex-1 min-w-0">

                                    {/* ========================= */}
                                    {/* HEADER */}
                                    {/* ========================= */}

                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        "
                                    >

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <h3
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-white

                                                        sm:text-base
                                                    "
                                                >
                                                    {
                                                        comment.user.display_name
                                                    }
                                                </h3>

                                                <span
                                                    className="
                                                        truncate
                                                        text-xs
                                                        text-zinc-500

                                                        sm:text-sm
                                                    "
                                                >
                                                    @
                                                    {
                                                        comment.user.username
                                                    }
                                                </span>

                                            </div>

                                        </div>



                                        {/* ========================= */}
                                        {/* MENU */}
                                        {/* ========================= */}

                                        {
                                            currentUser?.id === comment.user_id && (

                                                <div
                                                    className="
                                                        relative
                                                        shrink-0
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenMenuId(
                                                                openMenuId === comment.id
                                                                    ? null
                                                                    : comment.id
                                                            )
                                                        }
                                                        className="
                                                            rounded-full
                                                            p-2
                                                            text-zinc-500
                                                            transition-all

                                                            hover:bg-zinc-800
                                                            hover:text-white
                                                        "
                                                    >

                                                        <MoreHorizontal
                                                            size={18}
                                                        />

                                                    </button>



                                                    {
                                                        openMenuId === comment.id && (

                                                            <div
                                                                className="
                                                                    absolute
                                                                    right-0
                                                                    top-full
                                                                    mt-2
                                                                    z-9999
                                                                    w-44
                                                                    overflow-hidden
                                                                    rounded-2xl
                                                                    border
                                                                    border-zinc-800
                                                                    bg-zinc-950
                                                                    shadow-2xl
                                                                "
                                                            >

                                                                <button
                                                                    type="button"
                                                                    className="
                                                                        w-full
                                                                        px-4
                                                                        py-3
                                                                        text-left
                                                                        text-sm
                                                                        font-medium
                                                                        text-zinc-200
                                                                        transition

                                                                        hover:bg-zinc-800
                                                                        hover:text-white
                                                                    "
                                                                >
                                                                    Edit Comment
                                                                </button>



                                                                <button
                                                                    type="button"
                                                                    className="
                                                                        w-full
                                                                        px-4
                                                                        py-3
                                                                        text-left
                                                                        text-sm
                                                                        font-medium
                                                                        text-red-400
                                                                        transition

                                                                        hover:bg-zinc-800
                                                                        hover:text-red-300
                                                                    "
                                                                >
                                                                    Delete Comment
                                                                </button>



                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setOpenMenuId(null)
                                                                    }
                                                                    className="
                                                                        w-full
                                                                        border-t
                                                                        border-zinc-800
                                                                        px-4
                                                                        py-3
                                                                        text-left
                                                                        text-sm
                                                                        font-medium
                                                                        text-zinc-500
                                                                        transition

                                                                        hover:bg-zinc-800
                                                                        hover:text-zinc-300
                                                                    "
                                                                >
                                                                    Cancel
                                                                </button>

                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            )
                                        }

                                    </div>



                                    {/* ========================= */}
                                    {/* CONTENT */}
                                    {/* ========================= */}

                                    <p
                                        className="
                                            mt-3
                                            whitespace-pre-wrap
                                            wrap-break-word
                                            text-sm
                                            leading-relaxed
                                            text-zinc-300

                                            sm:text-[15px]
                                        "
                                    >
                                        {comment.content}
                                    </p>



                                    {/* ========================= */}
                                    {/* ACTIONS */}
                                    {/* ========================= */}

                                    <div
                                        className="
                                            mt-5
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-5
                                        "
                                    >

                                        <button
                                            type="button"
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-zinc-400
                                                transition

                                                hover:text-white
                                            "
                                        >

                                            <Heart size={16} />

                                            {
                                                comment.upvotes_count
                                            }

                                        </button>



                                        <button
                                            type="button"
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-zinc-400
                                                transition

                                                hover:text-white
                                            "
                                        >

                                            <Reply size={16} />

                                            Reply

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    ))
                }

            </div>

        </section>
    )
}