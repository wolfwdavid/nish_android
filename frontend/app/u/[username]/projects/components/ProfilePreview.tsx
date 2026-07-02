"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import type {
    ProjectAuthor,
} from "@/app/lib/type/project"

import timeAgo from "@/app/utils/timeAgo"

type ProfilePreviewProps = {
    profile: ProjectAuthor

    created_at: string
}

export default function ProfilePreview({
    profile,
    created_at,
}: ProfilePreviewProps) {
    const router = useRouter()

    const goToProfile = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation()

        if (!profile.username) return

        router.push(`/u/${profile.username}/me`)
    }

    return (
        <button
            type="button"
            onClick={goToProfile}
            className="
                group
                flex
                min-w-0
                items-center
                gap-3
                text-left
                transition-all
                hover:opacity-85
            "
        >
            <div
                className="
                    relative
                    h-12
                    w-12
                    shrink-0
                    overflow-hidden
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    transition-all
                    group-hover:border-orange-500/40
                "
            >
                <Image
                    src={
                        profile.avatar_url ||
                        "/default-avatar.png"
                    }
                    alt={
                        profile.username ||
                        "User avatar"
                    }
                    fill
                    sizes="48px"
                    className="
                        object-cover
                    "
                />
            </div>

            <div
                className="
                    min-w-0
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                    "
                >
                    <p
                        className="
                            truncate
                            font-semibold
                            text-white
                            transition
                            group-hover:text-orange-300
                        "
                    >
                        {profile.username}
                    </p>

                    <p
                        className="
                            shrink-0
                            text-sm
                            text-zinc-400
                        "
                    >
                        • {timeAgo(created_at)}
                    </p>
                </div>

                <p
                    className="
                        truncate
                        text-sm
                        text-zinc-400
                    "
                >
                    {profile.location || "Unknown"}
                </p>
            </div>
        </button>
    )
}