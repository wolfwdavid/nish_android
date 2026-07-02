"use client"

import {
    GetLiveProject,
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject"

import JournalComposer from "./JournalComposer"
import JournalEntryCard from "./JournalEntryCard"

type PublishPayload = {

    day_number: number

    content: string

    entry_type: string

    progress_percentage: number | null

    media_urls: string[]

    code_snippets: string[]

    problem_solutions: {
        problem: string
        solution: string
    }[]

}

type Props = {

    project: GetLiveProject

    journals: GetLiveProjectJournal[]

    composerOpen: boolean

    setComposerOpen:
        React.Dispatch<
            React.SetStateAction<boolean>
        >

    onPublish: (
        data: PublishPayload
    ) => Promise<void>

    isOwner: boolean

}

export default function JournalSection({

    project,

    journals,

    composerOpen,

    setComposerOpen,

    onPublish,

    isOwner,

}: Props) {

    return (

        <section
            className="
                overflow-hidden
                rounded-4xl
                border
                border-white/10
                bg-[#0b0b0d]
                backdrop-blur-xl
            "
        >

            {/* TOP HEADER */}

            <div
                className="
                    border-b
                    border-white/5
                    px-6
                    py-5
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                mb-2
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-orange-400
                                "
                            />

                            <p
                                className="
                                    text-[11px]
                                    font-semibold
                                    tracking-[0.3em]
                                    text-orange-300
                                "
                            >

                                BUILD JOURNAL

                            </p>

                        </div>


                        <h2
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-white
                                md:text-3xl
                            "
                        >

                            Development Timeline

                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-7
                                text-zinc-500
                            "
                        >

                            Day {project.days_count}
                            {" · "}
                            {journals.length} engineering logs

                        </p>

                    </div>



                    {/* ACTION */}

                    {isOwner &&           
                    (
                    <button
                        onClick={() =>
                            setComposerOpen(true)
                        }
                        className="
                            group
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-orange-500
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-black
                            transition-all
                            hover:bg-orange-400
                        "
                    >

                        <span
                            className="
                                transition
                                group-hover:-translate-y-0.5
                            "
                        >

                            Log Progress

                        </span>

                        <span
                            className="
                                transition
                                group-hover:translate-x-1
                            "
                        >

                            →

                        </span>

                    </button>
                )}

                </div>

            </div>



            {/* COMPOSER */}

            { isOwner &&
                composerOpen && (

                    <div
                        className="
                            border-b
                            border-white/5
                            bg-orange-500/3
                            p-6
                        "
                    >

                        <JournalComposer
                            project={project}
                            onCancel={() =>
                                setComposerOpen(false)
                            }
                            onPublish={onPublish}
                        />

                    </div>

                )
            }



            {/* BODY */}

            {(<div className="p-6">

                {
                    journals.length > 0 ? (

                        <div className="space-y-5">

                            {
                                journals.map(

                                    (journal) => (

                                        <JournalEntryCard
                                            key={journal.id}
                                            journal={journal}
                                        />

                                    )

                                )
                            }

                        </div>

                    ) : (

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
                                bg-[#0f0f13]
                                px-6
                                py-20
                                text-center
                            "
                        >

                            <div
                                className="
                                    mb-6
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-orange-500/10
                                    bg-orange-500/5
                                "
                            >

                                <div
                                    className="
                                        h-8
                                        w-8
                                        rounded-full
                                        bg-orange-400/70
                                        blur-xl
                                    "
                                />

                            </div>


                            <h3
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-white
                                "
                            >

                                No build logs yet

                            </h3>


                            <p
                                className="
                                    mt-4
                                    max-w-lg
                                    text-sm
                                    leading-8
                                    text-zinc-500
                                "
                            >

                                Document architecture decisions,
                                debugging battles, deployment moments,
                                technical breakthroughs, and lessons
                                learned while building.

                            </p>


                            <button
                                onClick={() =>
                                    setComposerOpen(true)
                                }
                                className="
                                    mt-8
                                    rounded-2xl
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-orange-300
                                    transition
                                    hover:bg-orange-500/20
                                "
                            >

                                Create First Entry

                            </button>

                        </div>

                    )
                }

            </div>)}

        </section>

    )

}