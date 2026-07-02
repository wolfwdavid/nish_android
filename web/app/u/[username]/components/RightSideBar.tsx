"use client"

import Image from "next/image"
import Link from "next/link"

import {
    Flame,
    Code2,
    X,
    User,
    MessageSquareMore,
    LifeBuoy,
} from "lucide-react"

import { useState } from "react"
import BuyMeCoffee from "@/app/components/BuyMeCoffee";

type StackStat = {
    name: string
    count: number
}


type RightSidebarProps = {
    avatarUrl: string | null

    bannerUrl?: string | null

    displayName: string

    username: string

    projectCount?: number

    followersCount?: number

    liveProjectsCount?: number

    buildStreakDays?: number

    stackStats?: StackStat[]
}


export default function RightSidebar({
    avatarUrl,

    bannerUrl,

    displayName,

    username,

    projectCount = 0,

    followersCount = 0,

    liveProjectsCount = 0,

    buildStreakDays = 0,

    stackStats = [],
}: RightSidebarProps) {
    const [
        showAvatarViewer,
        setShowAvatarViewer,
    ] = useState(false)

    const [
        showBannerViewer,
        setShowBannerViewer,
    ] = useState(false)

    const totalBuilds =
        projectCount + liveProjectsCount

    const shippedPercentage =
        totalBuilds > 0
            ? Math.round((projectCount / totalBuilds) * 100)
            : 0

    const maxStackCount =
        stackStats.length > 0
            ? Math.max(...stackStats.map((item) => item.count))
            : 0

    return (
        <>
            <aside
                className="
                    sticky
                    top-0
                    hidden
                    h-screen
                    w-87.5
                    overflow-y-auto
                    p-6
                    xl:block
                "
            >
                <div className="flex min-h-full flex-col">
                    <div className="space-y-6">
                        {/* PROFILE SUMMARY */}

                        <div
                            className="
                                overflow-hidden
                                rounded-3xl
                                border
                                border-white/10
                                bg-white/3
                            "
                        >
                            {/* BANNER */}

                            <button
                                type="button"
                                onClick={() =>
                                    bannerUrl &&
                                    setShowBannerViewer(true)
                                }
                                className="
                                    relative
                                    block
                                    h-28
                                    w-full
                                    overflow-hidden
                                    bg-zinc-900
                                "
                            >
                                {bannerUrl ? (
                                    <Image
                                        src={bannerUrl}
                                        alt="Banner"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div
                                        className="
                                            h-full
                                            w-full
                                            bg-linear-to-r
                                            from-zinc-900
                                            via-zinc-800
                                            to-black
                                        "
                                    />
                                )}
                            </button>

                            {/* CONTENT */}

                            <div className="p-5">
                                {/* AVATAR + USER */}

                                <div
                                    className="
                                        -mt-14
                                        flex
                                        items-end
                                        gap-4
                                    "
                                >
                                    {/* AVATAR */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            avatarUrl &&
                                            setShowAvatarViewer(true)
                                        }
                                        className="
                                            relative
                                            h-24
                                            w-24
                                            overflow-hidden
                                            rounded-full
                                            border-4
                                            border-black
                                            bg-zinc-900
                                            shadow-2xl
                                        "
                                    >
                                        {avatarUrl ? (
                                            <Image
                                                src={avatarUrl}
                                                alt="Profile"
                                                fill
                                                sizes="96px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="
                                                    flex
                                                    h-full
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    bg-zinc-900
                                                "
                                            >
                                                <User
                                                    size={34}
                                                    className="text-zinc-600"
                                                />
                                            </div>
                                        )}
                                    </button>

                                    {/* USER INFO */}

                                    <div className="pb-2">
                                        <p className="text-xl font-bold">
                                            {displayName || "Loading..."}
                                        </p>

                                        <p className="text-sm text-zinc-500">
                                            @{username || "loading"}
                                        </p>
                                    </div>
                                </div>

                                {/* REAL STATS */}

                                <div
                                    className="
                                        mt-6
                                        grid
                                        grid-cols-3
                                        gap-3
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-3xl
                                                font-black
                                            "
                                        >
                                            {projectCount}
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-zinc-500
                                            "
                                        >
                                            projects
                                        </p>
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                text-3xl
                                                font-black
                                            "
                                        >
                                            {followersCount}
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-zinc-500
                                            "
                                        >
                                            followers
                                        </p>
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                text-3xl
                                                font-black
                                            "
                                        >
                                            {shippedPercentage}%
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-zinc-500
                                            "
                                        >
                                            shipped
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BUILD STREAK - REAL ONLY */}

                        {buildStreakDays > 0 && (
                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    p-5
                                "
                            >
                                <div className="flex items-center gap-2">
                                    <Flame
                                        size={18}
                                        className="text-orange-500"
                                    />

                                    <h2 className="font-semibold">
                                        Build Streak
                                    </h2>
                                </div>

                                <div className="mt-5">
                                    <p
                                        className="
                                            text-4xl
                                            font-black
                                            text-orange-500
                                        "
                                    >
                                        {buildStreakDays}
                                    </p>

                                    <p
                                        className="
                                            text-sm
                                            text-zinc-500
                                        "
                                    >
                                        days active
                                    </p>
                                </div>

                                <div
                                    className="
                                        mt-5
                                        flex
                                        gap-1
                                    "
                                >
                                    {Array.from({
                                        length: Math.min(
                                            buildStreakDays,
                                            18
                                        ),
                                    }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="
                                                h-3
                                                flex-1
                                                rounded-full
                                                bg-orange-500
                                            "
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STACK - REAL ONLY */}

                        {stackStats.length > 0 && (
                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    p-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <Code2
                                        size={18}
                                        className="text-orange-500"
                                    />

                                    <h2 className="font-semibold">
                                        Your Stack
                                    </h2>
                                </div>

                                <div
                                    className="
                                        mt-6
                                        space-y-4
                                    "
                                >
                                    {stackStats.map((item) => {
                                        const progress =
                                            maxStackCount > 0
                                                ? Math.round(
                                                      (item.count /
                                                          maxStackCount) *
                                                          100
                                                  )
                                                : 0

                                        return (
                                            <div key={item.name}>
                                                <div
                                                    className="
                                                        mb-2
                                                        flex
                                                        justify-between
                                                        text-sm
                                                    "
                                                >
                                                    <p>{item.name}</p>

                                                    <p
                                                        className="
                                                            text-zinc-500
                                                        "
                                                    >
                                                        {item.count}
                                                    </p>
                                                </div>

                                                <div
                                                    className="
                                                        h-2
                                                        overflow-hidden
                                                        rounded-full
                                                        bg-white/10
                                                    "
                                                >
                                                    <div
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                        className="
                                                            h-full
                                                            rounded-full
                                                            bg-linear-to-r
                                                            from-red-500
                                                            to-orange-500
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BUY ME A COFFEE */}
                        <div className="w-full min-w-0 overflow-hidden">
                            <BuyMeCoffee
                                variant="card"
                                username="nish489"
                                qrImageSrc="/coffeeqr.jpg"
                                title="Fuel the build"
                                description="If DevManiac or my work helped you, support the journey with a coffee."
                                showOfficialButton={false}
                            />
                        </div>

                    {/* BOTTOM FEEDBACK + SUPPORT */}

                    <div className="mt-auto pt-6">
                        <div
                            className="
                                rounded-3xl
                                border
                                border-white/10
                                bg-white/3
                                p-4
                            "
                        >
                            <p
                                className="
                                    px-2
                                    pb-3
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-zinc-500
                                "
                            >
                                Help
                            </p>

                            <div className="space-y-2">
                                <Link
                                    href="/settings/feedback"
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-3
                                        py-3
                                        text-sm
                                        text-zinc-400
                                        transition
                                        hover:bg-orange-500/10
                                        hover:text-orange-300
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            text-zinc-500
                                            transition
                                            group-hover:border-orange-500/30
                                            group-hover:bg-orange-500/10
                                            group-hover:text-orange-300
                                        "
                                    >
                                        <MessageSquareMore size={17} />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-zinc-200">
                                            Feedback
                                        </p>

                                        <p className="text-xs text-zinc-600">
                                            Share ideas or bugs
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    href="/settings/support"
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-3
                                        py-3
                                        text-sm
                                        text-zinc-400
                                        transition
                                        hover:bg-orange-500/10
                                        hover:text-orange-300
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            text-zinc-500
                                            transition
                                            group-hover:border-orange-500/30
                                            group-hover:bg-orange-500/10
                                            group-hover:text-orange-300
                                        "
                                    >
                                        <LifeBuoy size={17} />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-zinc-200">
                                            Support
                                        </p>

                                        <p className="text-xs text-zinc-600">
                                            Get help from DevManiac
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* FULLSCREEN AVATAR VIEWER */}

            {showAvatarViewer && avatarUrl && (
                <div
                    className="
                        fixed
                        inset-0
                        z-100
                        flex
                        items-center
                        justify-center
                        bg-black/95
                        p-6
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            setShowAvatarViewer(false)
                        }
                        className="
                            absolute
                            right-6
                            top-6
                            rounded-full
                            border
                            border-white/10
                            bg-white/10
                            p-3
                            transition
                            hover:bg-white/20
                        "
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="
                            relative
                            h-[80vh]
                            w-[80vh]
                            max-w-full
                            overflow-hidden
                            rounded-3xl
                        "
                    >
                        <Image
                            src={avatarUrl}
                            alt="Fullscreen avatar"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}

            {/* FULLSCREEN BANNER VIEWER */}

            {showBannerViewer && bannerUrl && (
                <div
                    className="
                        fixed
                        inset-0
                        z-100
                        flex
                        items-center
                        justify-center
                        bg-black/95
                        p-6
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            setShowBannerViewer(false)
                        }
                        className="
                            absolute
                            right-6
                            top-6
                            rounded-full
                            border
                            border-white/10
                            bg-white/10
                            p-3
                            transition
                            hover:bg-white/20
                        "
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="
                            relative
                            h-[80vh]
                            w-full
                            max-w-6xl
                            overflow-hidden
                            rounded-3xl
                        "
                    >
                        <Image
                            src={bannerUrl}
                            alt="Fullscreen banner"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    )
}