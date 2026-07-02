"use client"

import {
    Bookmark,
} from "lucide-react"



type BookmarkProjectProps = {

    toggleProjectBookmark: () => void

    isBookmarked: boolean
}



export default function BookmarkProject({

    toggleProjectBookmark,

    isBookmarked,

}: BookmarkProjectProps) {

    return (

        <button

            onClick={toggleProjectBookmark}

            className="
                p-2
                rounded-full

                text-zinc-200

                hover:bg-zinc-900
                hover:text-zinc-400

                active:scale-95

                transition-all
                duration-200
            "
        >

            <Bookmark

                size={26}

                strokeWidth={2}

                className={`
                    transition-all
                    duration-200

                    ${
                        isBookmarked
                            ? "fill-white text-white"
                            : "text-zinc-300 hover:text-white"
                    }
                `}
            />

        </button>
    )
}