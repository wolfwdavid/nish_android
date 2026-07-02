"use client"

import { useState } from "react"



const tabs = [
    "Overview",
    "Gallery",
    "Updates",
    "Comments",
]



export default function ProjectTabs() {

    const [activeTab, setActiveTab] =
        useState("Overview")



    return (

        <div
            className="
                fade-up
                mt-12
                flex
                items-center
                gap-3
                overflow-x-auto
                border-b
                border-zinc-800
                pb-4
            "
        >

            {
                tabs.map((tab) => (

                    <button
                        key={tab}
                        onClick={() =>
                            setActiveTab(tab)
                        }
                        className={`
                            whitespace-nowrap
                            rounded-2xl
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            transition-all

                            ${
                                activeTab === tab
                                    ? `
                                        bg-white
                                        text-black
                                      `
                                    : `
                                        bg-zinc-900
                                        text-zinc-400
                                        hover:bg-zinc-800
                                        hover:text-white
                                      `
                            }
                        `}
                    >

                        {tab}

                    </button>
                ))
            }

        </div>
    )
}