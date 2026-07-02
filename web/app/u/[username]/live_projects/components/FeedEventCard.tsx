"use client"

import Link from "next/link"

import {
    ArrowUpRight,
    Clock3,
    Flame,
    Rocket,
    Wrench,
} from "lucide-react"

import type { FeedEvent }
from "@/app/lib/type/feed"
import { useRouter } from "next/navigation"
import useCurrentUser from "@/app/lib/currentUser"

type Props = {

    event: FeedEvent

}



export default function FeedEventCard({

    event,

}: Props) {

    const router = useRouter()

    const { currentUser } = useCurrentUser()



    const renderEventLabel = () => {

        switch (event.event_type) {

            case "journal_published":

                return {

                    text:
                        "published a journal",

                    icon:
                        <Flame
                            size={14}
                            className="
                                text-orange-400
                            "
                        />,

                }

            case "live_project_created":

                return {

                    text:
                        "started a new build",

                    icon:
                        <Rocket
                            size={14}
                            className="
                                text-emerald-400
                            "
                        />,

                }

            case "deployment":

                return {

                    text:
                        "deployed project",

                    icon:
                        <Rocket
                            size={14}
                            className="
                                text-cyan-400
                            "
                        />,

                }

            default:

                return {

                    text:
                        "updated project",

                    icon:
                        <Wrench
                            size={14}
                            className="
                                text-zinc-400
                            "
                        />,

                }

        }

    }



    const eventInfo =
        renderEventLabel()

    console.log(event)
console.log(event.live_project)
console.log(event.live_project?.slug)



    return (

        <div
            className="
                group
                overflow-hidden
                rounded-4xl
                border
                border-zinc-800
                bg-[#0d0d0f]
                transition-all
                duration-300
                hover:border-orange-500/20
                hover:bg-orange-500/2
            "

            onClick={() => router.push(`/live_project/${event.live_project?.slug}`)}
        >

            <div
                className="
                    p-6
                "
            >

                {/* TOP */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                        "

                        onClick={() => router.push(`/u/${event.user.username}/me`)}
                    >

                        {/* avatar */}

                        <img
                            src={
                                event.user.avatar_url ||
                                "/default-avatar.png"
                            }
                            alt=""
                            className="
                                h-12
                                w-12
                                rounded-2xl
                                object-cover
                                ring-1
                                ring-zinc-700
                            "
                        />


                        <div>

                            {/* username */}

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                    text-sm
                                "
                            >

                                <span
                                    className="
                                        font-bold
                                        text-white
                                    "
                                >

                                    {
                                        event.user
                                        .display_name
                                    }

                                </span>

                                <div>

                                    {
                                        eventInfo.icon
                                    }

                                </div>

                                <span
                                    className="
                                        text-zinc-400
                                    "
                                >

                                    {
                                        eventInfo.text
                                    }

                                </span>

                            </div>



                            {/* meta */}

                            <div
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    text-zinc-600
                                "
                            >

                                <Clock3
                                    size={12}
                                />

                                <span>

                                    {
                                        new Date(
                                            event.created_at
                                        ).toLocaleDateString()
                                    }

                                </span>

                            </div>

                        </div>

                    </div>



                    <ArrowUpRight
                        size={18}
                        className="
                            text-zinc-700
                            transition
                            group-hover:-translate-y-1
                            group-hover:translate-x-1
                            group-hover:text-orange-300
                        "
                    />

                </div>



                {/* BODY */}

                <div
                    className="
                        mt-7
                    "
                >

                    <h2
                        className="
                            text-3xl
                            font-black
                            tracking-tighter
                            text-white
                        "
                    >

                        {
                            event.event_type ===
                            "journal_published"

                                ? `DAY ${
                                    event
                                    .event_metadata
                                    ?.day_number || 0
                                  } — ${
                                    event
                                    .live_project
                                    ?.title || ""
                                  }`

                                : event.live_project
                                    ?.title
                        }

                    </h2>



                    {/* content */}

                    <p
                        className="
                            mt-5
                            whitespace-pre-wrap
                            text-sm
                            leading-8
                            text-zinc-300
                            md:text-[15px]
                        "
                    >

                        {event.content}

                    </p>

                </div>



                {/* TECH STACK */}

                {
                    event
                    .event_metadata
                    ?.tech_stack
                    ?.length > 0 && (

                        <div
                            className="
                                mt-6
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            {
                                event
                                .event_metadata
                                .tech_stack
                                .slice(0, 6)
                                .map(
                                    (
                                        tech: string
                                    ) => (

                                        <span
                                            key={tech}
                                            className="
                                                rounded-full
                                                border
                                                border-zinc-700
                                                bg-zinc-900
                                                px-3
                                                py-1
                                                text-xs
                                                font-medium
                                                text-zinc-400
                                            "
                                        >

                                            {tech}

                                        </span>

                                    )
                                )
                            }

                        </div>

                    )
                }



                {/* FOOTER */}

                <div
                    className="
                        mt-7
                        flex
                        items-center
                        justify-between
                        border-t
                        border-zinc-800
                        pt-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        {
                            event
                            .event_metadata
                            ?.progress_percentage && (

                                <div
                                    className="
                                        rounded-full
                                        border
                                        border-orange-500/20
                                        bg-orange-500/10
                                        px-3
                                        py-1
                                        text-xs
                                        font-bold
                                        text-orange-300
                                    "
                                >

                                    {
                                        event
                                        .event_metadata
                                        .progress_percentage
                                    }%

                                </div>

                            )
                        }

                    </div>


                    

                {event.live_project?.slug ? 
                        (
                            <Link
                                href={`/live_project/${event.live_project.slug}`}
                                className="
                                    rounded-2xl
                                    bg-orange-500
                                    px-4
                                    py-3
                                    text-sm
                                    font-bold
                                    text-black
                                "
                            >
                                View Build
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="
                                    rounded-2xl
                                    bg-zinc-800
                                    px-4
                                    py-3
                                    text-sm
                                    font-bold
                                    text-zinc-500
                                "
                            >
                                Missing Slug
                            </button>
                        )}

        

                </div>

            </div>

        </div>

    )

}