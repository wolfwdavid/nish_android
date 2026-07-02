"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {
    Search,
    Users,
    ArrowRight,
    Sparkles,
    X,
} from "lucide-react"

export default function UserSearchCard() {
    const router = useRouter()

    const [query, setQuery] =
        useState("")

    const cleanedQuery = query
        .trim()
        .replace(/\s+/g, " ")

    const handleSearch = () => {
        const params = new URLSearchParams()

        params.set("type", "users")
        params.set("source", "projects_feed")

        if (cleanedQuery) {
            params.set("q", cleanedQuery)
        }

        router.push(`/search?${params.toString()}`)
    }

    const clearQuery = () => {
        setQuery("")
    }

    const quickSearch = (value: string) => {
        const params = new URLSearchParams()

        params.set("type", "users")
        params.set("source", "projects_feed")
        params.set("q", value)

        router.push(`/search?${params.toString()}`)
    }

    return (
        <section
            className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-white/10
                bg-[#090909]
                p-4
                shadow-2xl
                shadow-black/40
                sm:p-5
            "
        >
            {/* GLOW */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-48
                    w-48
                    rounded-full
                    bg-orange-500/10
                    blur-3xl
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-24
                    h-52
                    w-52
                    rounded-full
                    bg-red-500/10
                    blur-3xl
                "
            />

            <div className="relative z-10">
                {/* HEADER */}
                <div
                    className="
                        mb-4
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
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

                        <div className="min-w-0">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <h2
                                    className="
                                        truncate
                                        text-base
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Find builders
                                </h2>

                                <Sparkles
                                    size={15}
                                    className="
                                        shrink-0
                                        text-orange-300
                                    "
                                />
                            </div>

                            <p
                                className="
                                    mt-1
                                    line-clamp-1
                                    text-xs
                                    text-zinc-500
                                    sm:text-sm
                                "
                            >
                                Search users and discover builders.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SEARCH ROW */}
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
                            min-w-0
                            flex-1
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-white/10
                            bg-black/70
                            px-4
                            py-3
                            transition-all
                            focus-within:border-orange-500/40
                            focus-within:bg-orange-500/4
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
                                    handleSearch()
                                }

                                if (e.key === "Escape") {
                                    clearQuery()
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

                        {query.length > 0 && (
                            <button
                                type="button"
                                onClick={clearQuery}
                                className="
                                    flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-zinc-500
                                    transition
                                    hover:bg-white/10
                                    hover:text-white
                                "
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleSearch}
                        className="
                            group
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-linear-to-r
                            from-orange-500
                            to-red-500
                            px-5
                            py-3
                            text-sm
                            font-black
                            text-white
                            shadow-lg
                            shadow-orange-500/10
                            transition-all
                            hover:scale-[1.02]
                            hover:shadow-orange-500/20
                            active:scale-[0.98]
                            sm:w-auto
                        "
                    >
                        Search

                        <ArrowRight
                            size={17}
                            className="
                                transition-transform
                                group-hover:translate-x-0.5
                            "
                        />
                    </button>
                </div>

                {/* QUICK SEARCH CHIPS */}
                <div
                    className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    {[
                        "AI",
                        "FastAPI",
                        "Full-stack",
                        "Next.js",
                    ].map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() =>
                                quickSearch(item)
                            }
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-white/3
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-zinc-400
                                transition
                                hover:border-orange-500/30
                                hover:bg-orange-500/10
                                hover:text-orange-300
                            "
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}