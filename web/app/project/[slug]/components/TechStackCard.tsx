"use client"

import {
    Code2,
    Sparkles,
} from "lucide-react"



export default function TechStackCard({
    techStack,
}: {
    techStack: string[]
}) {

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

                    <Code2
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

                        Tech Stack

                    </h2>

                    <p
                        className="
                            text-sm
                            text-zinc-500
                        "
                    >

                        Tools & technologies

                    </p>

                </div>

            </div>



            <div className="flex flex-wrap gap-3">

                {
                    techStack.length > 0 ? (

                        techStack.map((tech) => (

                            <div
                                key={tech}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-zinc-700
                                    bg-zinc-800/40
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-zinc-300
                                    transition
                                    hover:border-zinc-500
                                    hover:bg-zinc-700/50
                                    hover:text-white
                                "
                            >

                                <Sparkles
                                    size={14}
                                />

                                {tech}

                            </div>
                        ))

                    ) : (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-dashed
                                border-zinc-700
                                px-4
                                py-4
                                text-sm
                                text-zinc-500
                            "
                        >

                            No tech stack added yet

                        </div>
                    )
                }

            </div>

        </div>
    )
}