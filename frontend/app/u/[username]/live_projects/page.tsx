"use client"

import { useEffect, useState } from "react"

import api from "@/app/lib/api"

import { FeedEvent }
from "@/app/lib/type/feed"



import {
    Flame,
    Sparkles,
} from "lucide-react"
import FeedEventCard from "./components/FeedEventCard"



export default function FeedPage() {

    const [events, setEvents] =
        useState<FeedEvent[]>([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState("")



    useEffect(() => {

        const fetchFeed =
            async () => {

                try {

                    setLoading(true)

                    const res =
                        await api.get(
                            "/feed-events"
                        )

                    setEvents(res.data)

                } catch (err) {

                    console.error(err)

                    setError(
                        "Failed to load feed"
                    )

                } finally {

                    setLoading(false)

                }

            }

        fetchFeed()

    }, [])



    if (loading) {

        return (

            <main
                className="
                    min-h-screen
                    bg-black
                    px-4
                    py-10
                    text-white
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-3xl
                    "
                >

                    <div
                        className="
                            animate-pulse
                            space-y-5
                        "
                    >

                        {[...Array(4)].map((_, i) => (

                            <div
                                key={i}
                                className="
                                    h-56
                                    rounded-4xl
                                    border
                                    border-zinc-800
                                    bg-[#0d0d0f]
                                "
                            />

                        ))}

                    </div>

                </div>

            </main>

        )

    }



    if (error) {

        return (

            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-black
                    text-red-400
                "
            >

                {error}

            </main>

        )

    }



    return (

        <main
            className="
                min-h-screen
                bg-black
                px-4
                py-8
                text-white
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-3xl
                    flex-col
                "
            >

                {/* HERO */}

                <div
                    className="
                        relative
                        overflow-hidden
                        rounded-[2.5rem]
                        border
                        border-zinc-800
                        bg-[#0d0d0f]
                        p-7
                    "
                >

                    {/* glow */}

                    <div
                        className="
                            absolute
                            right-[-10%]
                            top-[-30%]
                            h-64
                            w-64
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
                                mb-4
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <Flame
                                size={16}
                                className="
                                    text-orange-400
                                "
                            />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.35em]
                                    text-orange-300
                                "
                            >

                                Live Feed

                            </span>

                        </div>



                        <h1
                            className="
                                max-w-2xl
                                text-4xl
                                font-black
                                leading-none
                                tracking-[-0.06em]
                                md:text-5xl
                            "
                        >

                            Watch developers
                            build in public.

                        </h1>



                        <p
                            className="
                                mt-5
                                max-w-2xl
                                text-sm
                                leading-7
                                text-zinc-400
                                md:text-base
                            "
                        >

                            Real engineering logs.
                            Real progress.
                            Real problem solving.

                        </p>



                        <div
                            className="
                                mt-6
                                flex
                                flex-wrap
                                gap-3
                            "
                        >

                            <div
                                className="
                                    rounded-full
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-orange-300
                                "
                            >

                                Journal updates

                            </div>

                            <div
                                className="
                                    rounded-full
                                    border
                                    border-zinc-700
                                    bg-zinc-900
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-zinc-300
                                "
                            >

                                Live builds

                            </div>

                            <div
                                className="
                                    rounded-full
                                    border
                                    border-zinc-700
                                    bg-zinc-900
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-zinc-300
                                "
                            >

                                Shipping streaks

                            </div>

                        </div>

                    </div>

                </div>



                {/* FEED */}

                <div
                    className="
                        mt-7
                        flex
                        flex-col
                        gap-5
                    "
                >

                    {events.length === 0 ? (

                        <div
                            className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                rounded-4xl
                                border
                                border-dashed
                                border-zinc-800
                                bg-[#0d0d0f]
                                px-6
                                py-20
                                text-center
                            "
                        >

                            <Sparkles
                                size={30}
                                className="
                                    mb-4
                                    text-zinc-700
                                "
                            />

                            <h2
                                className="
                                    text-xl
                                    font-bold
                                "
                            >

                                No feed events yet

                            </h2>

                            <p
                                className="
                                    mt-3
                                    max-w-md
                                    text-sm
                                    leading-7
                                    text-zinc-500
                                "
                            >

                                Once developers start
                                publishing journals and
                                building live projects,
                                the feed will appear here.

                            </p>

                        </div>

                    ) : (

                        events.map((event) => (

                            <FeedEventCard
                                key={event.id}
                                event={event}
                            />

                        ))

                    )}

                </div>

            </div>

        </main>

    )

}