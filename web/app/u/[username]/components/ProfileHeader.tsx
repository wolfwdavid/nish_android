"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useMemo, useState } from "react"

import {
    User,
    MapPin,
    Hammer,
    Pencil,
    Archive,
    X,
    ShieldCheck,
} from "lucide-react"

import { UserFullProfile } from "@/app/lib/type/profileAnalytics"

type ProfileHeaderProps = {
    profileData: UserFullProfile
    loading?: boolean
    error?: string
    isOwner?: boolean
}

function FounderBadge() {
    return (
        <span
            className="
                inline-flex
                items-center
                gap-1
                rounded-full
                border
                border-orange-500/30
                bg-orange-500/10
                px-2.5
                py-1
                text-xs
                font-semibold
                text-orange-300
                shadow-[0_0_18px_rgba(249,115,22,0.18)]
            "
        >
            <ShieldCheck className="h-3.5 w-3.5" />
            Founder
        </span>
    )
}

export default function ProfileHeader({
    profileData,
    loading = false,
    error = "",
    isOwner = false,
}: ProfileHeaderProps) {
    const router = useRouter()

    const [showAvatarViewer, setShowAvatarViewer] = useState(false)
    const [showBannerViewer, setShowBannerViewer] = useState(false)

    const adminClerkIds = useMemo(() => {
        return (
            process.env.NEXT_PUBLIC_ADMIN_CLERK_USER_IDS
                ?.split(",")
                .map((id) => id.trim())
                .filter(Boolean) ?? []
        )
    }, [])

    const isFounder = adminClerkIds.includes(profileData.clerk_user_id)

    const openExternal = (url: string) => {
        if (!url) return "#"

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url
        }

        return `https://${url}`
    }

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-5xl">
                <div className="animate-pulse overflow-hidden rounded-4xl border border-white/10 bg-black">
                    <div className="h-40 bg-white/5" />

                    <div className="px-5 pb-8">
                        <div className="-mt-14 h-24 w-24 rounded-full border-4 border-black bg-white/10" />

                        <div className="mt-6 space-y-3">
                            <div className="h-8 w-64 rounded bg-white/10" />
                            <div className="h-4 w-40 rounded bg-white/5" />
                            <div className="h-4 w-full max-w-md rounded bg-white/5" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400">
                {error}
            </div>
        )
    }

    return (
        <>
            <div className="mx-auto w-full max-w-5xl">
                <section className="overflow-hidden rounded-4xl border border-white/10 bg-black">
                    {/* BANNER */}
                    <button
                        type="button"
                        onClick={() => setShowBannerViewer(true)}
                        className="
                            relative
                            block
                            h-40
                            w-full
                            overflow-hidden
                            bg-linear-to-r
                            from-red-950/90
                            via-red-950/40
                            to-black
                        "
                    >
                        {profileData.banner_url && (
                            <Image
                                src={profileData.banner_url}
                                alt="Banner"
                                fill
                                priority
                                className="object-cover opacity-70"
                            />
                        )}

                        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black" />
                    </button>

                    <div className="px-5 pb-6 md:px-8 md:pb-8">
                        {/* MOBILE */}
                        <div className="md:hidden">
                            <div className="mt-4 flex items-end justify-between gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAvatarViewer(true)}
                                    className="
                                        relative
                                        -mt-14
                                        block
                                        h-24
                                        w-24
                                        shrink-0
                                        overflow-hidden
                                        rounded-full
                                        border-4
                                        border-black
                                        bg-zinc-950
                                        ring-2
                                        ring-orange-500/70
                                        shadow-[0_0_30px_rgba(249,115,22,0.18)]
                                    "
                                >
                                    {profileData.avatar_url ? (
                                        <Image
                                            src={profileData.avatar_url}
                                            alt="Profile"
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <User
                                                size={28}
                                                className="text-zinc-600"
                                            />
                                        </div>
                                    )}
                                </button>

                                <div className="flex flex-1 items-center justify-around pb-2 text-center">
                                    <div>
                                        <p className="text-[22px] font-bold text-zinc-100">
                                            {profileData.posts_count}
                                        </p>
                                        <p className="text-[11px] text-zinc-600">
                                            posts
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[22px] font-bold text-zinc-100">
                                            {profileData.followers_count}
                                        </p>
                                        <p className="text-[11px] text-zinc-600">
                                            followers
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[22px] font-bold text-zinc-100">
                                            {profileData.following_count}
                                        </p>
                                        <p className="text-[11px] text-zinc-600">
                                            following
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 border-t border-white/8" />

                            <div className="mt-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-[22px] font-bold leading-tight tracking-tight text-zinc-100">
                                        {profileData.display_name ||
                                            "Unnamed Builder"}
                                    </h1>

                                    {isFounder && <FounderBadge />}
                                </div>

                                <p className="mt-1 text-[15px] text-zinc-500">
                                    @{profileData.username}
                                </p>
                            </div>

                            <p className="mt-4 text-[14px] leading-6 text-zinc-300">
                                {profileData.bio || "No bio added yet."}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-zinc-500">
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={12} />
                                    <span>
                                        {profileData.location ||
                                            "Brooklyn, NY"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Hammer size={12} />
                                    <span>
                                        {profileData.current_build ||
                                            "Building Devmaniac"}
                                    </span>
                                </div>
                            </div>

                            <p className="mt-2 text-[12px] text-zinc-600">
                                {profileData.joined_date ||
                                    "Joined recently"}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                                {profileData.github_url && (
                                    <a
                                        href={openExternal(
                                            profileData.github_url
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-[13px] text-orange-300"
                                    >
                                        <Image
                                            src="/github-svg.svg"
                                            alt="GitHub"
                                            width={14}
                                            height={14}
                                        />
                                        GitHub
                                    </a>
                                )}

                                {profileData.linkedin_url && (
                                    <a
                                        href={openExternal(
                                            profileData.linkedin_url
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-[13px] text-orange-300"
                                    >
                                        <Image
                                            src="/linkedin-svg.svg"
                                            alt="LinkedIn"
                                            width={14}
                                            height={14}
                                        />
                                        LinkedIn
                                    </a>
                                )}

                                {profileData.portfolio_url && (
                                    <a
                                        href={openExternal(
                                            profileData.portfolio_url
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-[13px] text-orange-300"
                                    >
                                        <Image
                                            src="/portfolio-svg.svg"
                                            alt="Portfolio"
                                            width={14}
                                            height={14}
                                        />
                                        Portfolio
                                    </a>
                                )}
                            </div>

                            {isOwner && (
                                <div className="mt-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(
                                                `/u/${profileData.username}/profile/edit`
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-white/15
                                            px-4
                                            py-2
                                            text-[15px]
                                            font-medium
                                            text-zinc-100
                                            transition-all
                                            hover:border-orange-500/60
                                            hover:bg-orange-500/10
                                            hover:text-orange-300
                                        "
                                    >
                                        <Pencil size={14} />
                                        Edit profile
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* DESKTOP */}
                        <div className="hidden md:flex md:justify-between md:gap-10">
                            <div className="max-w-2xl">
                                <button
                                    type="button"
                                    onClick={() => setShowAvatarViewer(true)}
                                    className="
                                        relative
                                        -mt-16
                                        block
                                        h-32
                                        w-32
                                        overflow-hidden
                                        rounded-full
                                        border-4
                                        border-black
                                        bg-zinc-950
                                        ring-2
                                        ring-orange-500/60
                                        shadow-[0_0_40px_rgba(249,115,22,0.16)]
                                    "
                                >
                                    {profileData.avatar_url ? (
                                        <Image
                                            src={profileData.avatar_url}
                                            alt="Profile"
                                            fill
                                            sizes="128px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <User
                                                size={34}
                                                className="text-zinc-600"
                                            />
                                        </div>
                                    )}
                                </button>

                                <div className="mt-5">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-[42px] font-bold tracking-tight text-zinc-100">
                                            {profileData.display_name ||
                                                "Unnamed Builder"}
                                        </h1>

                                        {isFounder && <FounderBadge />}
                                    </div>

                                    <p className="mt-1 text-[17px] text-zinc-500">
                                        @{profileData.username}
                                    </p>
                                </div>

                                <p className="mt-6 max-w-xl text-[15px] leading-7 text-zinc-300">
                                    {profileData.bio || "No bio added yet."}
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span>
                                            {profileData.location ||
                                                "Brooklyn, NY"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Hammer size={14} />
                                        <span>
                                            {profileData.current_build ||
                                                "Building Devmaniac"}
                                        </span>
                                    </div>

                                    <div>
                                        {profileData.joined_date ||
                                            "Joined recently"}
                                    </div>
                                </div>

                                {isOwner && (
                                    <div className="mt-6 flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    `/u/${profileData.username}/profile/edit`
                                                )
                                            }
                                            className="
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-white/15
                                                px-5
                                                py-2
                                                text-[14px]
                                                font-medium
                                                text-zinc-100
                                                transition-all
                                                hover:border-orange-500/60
                                                hover:bg-orange-500/10
                                                hover:text-orange-300
                                            "
                                        >
                                            <Pencil size={14} />
                                            Edit profile
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    "/profile/archive"
                                                )
                                            }
                                            className="
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-white/10
                                                px-5
                                                py-2
                                                text-[14px]
                                                font-medium
                                                text-zinc-500
                                                transition-all
                                                hover:border-white/20
                                                hover:bg-white/5
                                                hover:text-white
                                            "
                                        >
                                            <Archive size={14} />
                                            View archive
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="min-w-60 border-l border-white/8 pl-8 pt-22">
                                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-700">
                                    Stats
                                </p>

                                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                                    <div>
                                        <p className="text-[30px] font-bold text-zinc-100">
                                            {profileData.posts_count}
                                        </p>
                                        <p className="text-[12px] text-zinc-600">
                                            posts
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[30px] font-bold text-zinc-100">
                                            {profileData.project_count}
                                        </p>
                                        <p className="text-[12px] text-zinc-600">
                                            projects
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[30px] font-bold text-zinc-100">
                                            {profileData.followers_count}
                                        </p>
                                        <p className="text-[12px] text-zinc-600">
                                            followers
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[30px] font-bold text-zinc-100">
                                            {profileData.following_count}
                                        </p>
                                        <p className="text-[12px] text-zinc-600">
                                            following
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-700">
                                        Links
                                    </p>

                                    <div className="space-y-4">
                                        {profileData.github_url && (
                                            <a
                                                href={openExternal(
                                                    profileData.github_url
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 text-sm text-zinc-300 transition-all hover:text-orange-300"
                                            >
                                                <Image
                                                    src="/github-svg.svg"
                                                    alt="GitHub"
                                                    width={16}
                                                    height={16}
                                                />
                                                GitHub
                                            </a>
                                        )}

                                        {profileData.linkedin_url && (
                                            <a
                                                href={openExternal(
                                                    profileData.linkedin_url
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 text-sm text-zinc-300 transition-all hover:text-orange-300"
                                            >
                                                <Image
                                                    src="/linkedin-svg.svg"
                                                    alt="LinkedIn"
                                                    width={16}
                                                    height={16}
                                                />
                                                LinkedIn
                                            </a>
                                        )}

                                        {profileData.portfolio_url && (
                                            <a
                                                href={openExternal(
                                                    profileData.portfolio_url
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 text-sm text-zinc-300 transition-all hover:text-orange-300"
                                            >
                                                <Image
                                                    src="/portfolio-svg.svg"
                                                    alt="Portfolio"
                                                    width={16}
                                                    height={16}
                                                />
                                                Portfolio
                                            </a>
                                        )}

                                        {profileData.email && (
                                            <a
                                                href={`mailto:${profileData.email}`}
                                                className="flex items-center gap-3 text-sm text-zinc-300 transition-all hover:text-orange-300"
                                            >
                                                <Image
                                                    src="/email-svg.svg"
                                                    alt="Email"
                                                    width={16}
                                                    height={16}
                                                />
                                                {profileData.email}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {showAvatarViewer && profileData.avatar_url && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/95 p-6">
                    <button
                        type="button"
                        onClick={() => setShowAvatarViewer(false)}
                        className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/10 p-3"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative aspect-square h-[80vh] max-w-full overflow-hidden rounded-3xl">
                        <Image
                            src={profileData.avatar_url}
                            alt="Fullscreen avatar"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}

            {showBannerViewer && profileData.banner_url && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/95 p-6">
                    <button
                        type="button"
                        onClick={() => setShowBannerViewer(false)}
                        className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/10 p-3"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative h-[80vh] w-full max-w-7xl overflow-hidden rounded-3xl">
                        <Image
                            src={profileData.banner_url}
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