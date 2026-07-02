"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

import {
    Search,
    Users,
    ArrowLeft,
    MapPin,
    FolderKanban,
    UserRound,
    Sparkles,
} from "lucide-react"

import api from "@/app/lib/api"

type SearchUser = {
    id: string

    username: string

    display_name: string | null

    avatar_url: string | null

    bio: string | null

    location: string | null

    followers_count: number

    project_count: number

    is_verified: boolean
}

export default function SearchPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const queryFromUrl =
        searchParams.get("q") || ""

    const type =
        searchParams.get("type") || "users"

    const [query, setQuery] =
        useState(queryFromUrl)

    const [users, setUsers] =
        useState<SearchUser[]>([])

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState("")

    useEffect(() => {
        setQuery(queryFromUrl)
    }, [queryFromUrl])

    useEffect(() => {
        if (type !== "users") return

        const cleanedQuery =
            queryFromUrl.trim()

        if (!cleanedQuery) {
            setUsers([])
            return
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true)
                setError("")

                const res = await api.get(
                    "/search/users",
                    {
                        params: {
                            q: cleanedQuery,
                            limit: 12,
                        },
                    }
                )

                setUsers(res.data)
            } catch (err) {
                console.error(err)

                setError(
                    "Could not search users right now"
                )
            } finally {
                setLoading(false)
            }
        }, 250)

        return () => clearTimeout(timeout)
    }, [queryFromUrl, type])

    const submitSearch = () => {
        const cleanedQuery = query
            .trim()
            .replace(/\s+/g, " ")

        const params = new URLSearchParams()

        params.set("type", "users")

        if (cleanedQuery) {
            params.set("q", cleanedQuery)
        }

        router.push(`/search?${params.toString()}`)
    }

    return (
        <main
            className="
                min-h-screen
                bg-black
                px-4
                py-6
                text-white
                sm:px-6
                lg:px-8
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-3xl
                    flex-col
                    gap-6
                "
            >
                {/* TOP BAR */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="
                            group
                            flex
                            items-center
                            gap-2
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-zinc-400
                            transition
                            hover:border-orange-500/30
                            hover:bg-orange-500/10
                            hover:text-orange-300
                        "
                    >
                        <ArrowLeft
                            size={16}
                            className="
                                transition-transform
                                group-hover:-translate-x-1
                            "
                        />

                        Back
                    </button>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-orange-500/20
                            bg-orange-500/10
                            px-4
                            py-2
                            text-xs
                            font-black
                            uppercase
                            tracking-[0.2em]
                            text-orange-300
                        "
                    >
                        <Sparkles size={14} />
                        Search
                    </div>
                </div>

                {/* HEADER */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-4xl
                        border
                        border-white/10
                        bg-[#090909]
                        p-5
                        shadow-2xl
                        shadow-black/40
                        sm:p-6
                    "
                >
                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-20
                            -top-20
                            h-56
                            w-56
                            rounded-full
                            bg-orange-500/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                        "
                    >
                        <div
                            className="
                                mb-5
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    text-orange-300
                                "
                            >
                                <Users size={22} />
                            </div>

                            <div>
                                <h1
                                    className="
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Search users
                                </h1>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-zinc-500
                                    "
                                >
                                    Find builders by username or display name.
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-black
                                    px-4
                                    py-3
                                    transition
                                    focus-within:border-orange-500/40
                                    focus-within:ring-4
                                    focus-within:ring-orange-500/10
                                "
                            >
                                <Search
                                    size={18}
                                    className="
                                        shrink-0
                                        text-zinc-500
                                    "
                                />

                                <input
                                    value={query}
                                    onChange={(e) =>
                                        setQuery(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            submitSearch()
                                        }
                                    }}
                                    placeholder="Search username..."
                                    className="
                                        w-full
                                        bg-transparent
                                        text-sm
                                        font-medium
                                        text-white
                                        outline-none
                                        placeholder:text-zinc-600
                                    "
                                />
                            </div>

                            <button
                                type="button"
                                onClick={submitSearch}
                                className="
                                    rounded-2xl
                                    bg-linear-to-r
                                    from-orange-500
                                    to-red-500
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    transition
                                    hover:scale-[1.02]
                                    active:scale-[0.98]
                                "
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </section>

                {/* RESULTS */}

                <section
                    className="
                        flex
                        flex-col
                        gap-3
                    "
                >
                    {loading && (
                        <div
                            className="
                                rounded-3xl
                                border
                                border-white/10
                                bg-white/3
                                p-6
                                text-center
                                text-sm
                                text-zinc-400
                            "
                        >
                            Searching builders...
                        </div>
                    )}

                    {error && (
                        <div
                            className="
                                rounded-3xl
                                border
                                border-red-500/20
                                bg-red-500/10
                                p-6
                                text-center
                                text-sm
                                text-red-300
                            "
                        >
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        queryFromUrl &&
                        users.length === 0 && (
                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    p-6
                                    text-center
                                    text-sm
                                    text-zinc-400
                                "
                            >
                                No users found for{" "}
                                <span className="font-bold text-white">
                                    {queryFromUrl}
                                </span>
                                .
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        !queryFromUrl && (
                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    bg-white/3
                                    p-6
                                    text-center
                                    text-sm
                                    text-zinc-400
                                "
                            >
                                Search for a username to see recommendations.
                            </div>
                        )}

                    {users.map((searchedUser) => (
                        <button
                            key={searchedUser.id}
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/u/${searchedUser.username}/me`
                                )
                            }
                            className="
                                group
                                flex
                                items-center
                                gap-4
                                rounded-3xl
                                border
                                border-white/10
                                bg-[#0a0a0a]
                                p-4
                                text-left
                                transition
                                hover:border-orange-500/30
                                hover:bg-orange-500/4
                            "
                        >
                            <div
                                className="
                                    relative
                                    h-14
                                    w-14
                                    shrink-0
                                    overflow-hidden
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/5
                                "
                            >
                                <Image
                                    src={
                                        searchedUser.avatar_url ||
                                        "/default-avatar.png"
                                    }
                                    alt={searchedUser.username}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <p
                                        className="
                                            truncate
                                            font-black
                                            text-white
                                            transition
                                            group-hover:text-orange-300
                                        "
                                    >
                                        {searchedUser.display_name ||
                                            searchedUser.username}
                                    </p>

                                    {searchedUser.is_verified && (
                                        <span
                                            className="
                                                rounded-full
                                                bg-orange-500/10
                                                px-2
                                                py-0.5
                                                text-[10px]
                                                font-black
                                                uppercase
                                                text-orange-300
                                            "
                                        >
                                            Verified
                                        </span>
                                    )}
                                </div>

                                <p
                                    className="
                                        mt-0.5
                                        truncate
                                        text-sm
                                        text-zinc-500
                                    "
                                >
                                    @{searchedUser.username}
                                </p>

                                {searchedUser.bio && (
                                    <p
                                        className="
                                            mt-2
                                            line-clamp-1
                                            text-sm
                                            text-zinc-400
                                        "
                                    >
                                        {searchedUser.bio}
                                    </p>
                                )}

                                <div
                                    className="
                                        mt-2
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-3
                                        text-xs
                                        text-zinc-500
                                    "
                                >
                                    {searchedUser.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin size={13} />
                                            {searchedUser.location}
                                        </span>
                                    )}

                                    <span className="flex items-center gap-1">
                                        <UserRound size={13} />
                                        {searchedUser.followers_count} followers
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <FolderKanban size={13} />
                                        {searchedUser.project_count} projects
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </section>
            </div>
        </main>
    )
}