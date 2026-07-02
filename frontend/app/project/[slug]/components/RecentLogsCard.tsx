"use client"

import {
    Clock3,
    GitCommitHorizontal,
} from "lucide-react"



const recentLogs = [
    {
        id: 1,
        title:
            "Implemented responsive mobile navigation",
        time: "2 hours ago",
    },
    {
        id: 2,
        title:
            "Added project analytics section",
        time: "Yesterday",
    },
    {
        id: 3,
        title:
            "Optimized API fetching logic",
        time: "3 days ago",
    },
]



export default function RecentLogsCard() {

    return (

        <div
            className="
                fade-up
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-900/40
                p-6
                backdrop-blur-xl
            "
        >

            <div
                className="
                    mb-6
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        bg-zinc-800
                    "
                >

                    <Clock3
                        size={20}
                        className="text-zinc-300"
                    />

                </div>

                <div>

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-white
                        "
                    >

                        Recent Logs

                    </h2>

                    <p
                        className="
                            text-sm
                            text-zinc-500
                        "
                    >

                        Latest project updates

                    </p>

                </div>

            </div>



            <div className="space-y-4">

                {
                    recentLogs.map((log) => (

                        <div
                            key={log.id}
                            className="
                                rounded-2xl
                                border
                                border-zinc-800
                                bg-black/30
                                p-4
                                transition
                                hover:border-zinc-700
                                hover:bg-zinc-900/50
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        mt-0.5
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-zinc-800
                                    "
                                >

                                    <GitCommitHorizontal
                                        size={16}
                                        className="
                                            text-zinc-300
                                        "
                                    />

                                </div>



                                <div className="flex-1">

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-zinc-200
                                        "
                                    >

                                        {log.title}

                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            text-zinc-500
                                        "
                                    >

                                        {log.time}

                                    </p>

                                </div>

                            </div>

                        </div>
                    ))
                }

            </div>

        </div>
    )
}