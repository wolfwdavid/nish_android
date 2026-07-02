"use client"

import { useState } from "react"

import {
    GetLiveProject,
} from "@/app/lib/type/liveproject"

interface ProblemSolution {

    problem: string

    solution: string

}

interface PublishPayload {

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

interface JournalComposerProps {

    project: GetLiveProject

    onCancel: () => void

    onPublish:
        (
            data: PublishPayload
        ) => Promise<void>

}

const ENTRY_TYPES = [

    "progress",
    "milestone",
    "bugfix",
    "deployment",
    "architecture",
    "announcement",
    "failure",

] as const

export default function JournalComposer({

    project,

    onCancel,

    onPublish,

}: JournalComposerProps) {

    const [content, setContent] =
        useState("")

    const [entryType, setEntryType] =
        useState<
            typeof ENTRY_TYPES[number]
        >("progress")

    const [progress, setProgress] =
        useState(
            project.progress_percentage
        )

    const [codeSnippet, setCodeSnippet] =
        useState("")

    const [problem, setProblem] =
        useState("")

    const [solution, setSolution] =
        useState("")

    const [submitting, setSubmitting] =
        useState(false)



    async function handleSubmit() {

        if (!content.trim()) return

        try {

            setSubmitting(true)

            await onPublish({

                day_number:
                    project.days_count,

                content,

                entry_type: entryType,

                progress_percentage: progress,

                media_urls: [],

                code_snippets:
                    codeSnippet.trim()
                        ? [codeSnippet]
                        : [],

                problem_solutions:
                    problem.trim() &&
                    solution.trim()

                        ? [

                            {
                                problem,
                                solution,
                            },

                        ]

                        : [],

            })



            setContent("")
            setCodeSnippet("")
            setProblem("")
            setSolution("")

        } finally {

            setSubmitting(false)

        }

    }



    return (

        <div
            className="
                rounded-4xl
                border
                border-orange-500/10
                bg-[#0f0f13]
                p-6
            "
        >

            {/* TYPES */}

            <div
                className="
                    mb-5
                    flex
                    flex-wrap
                    gap-2
                "
            >

                {
                    ENTRY_TYPES.map((type) => (

                        <button
                            key={type}
                            onClick={() =>
                                setEntryType(type)
                            }
                            className={`
                                rounded-full
                                border
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                capitalize
                                transition-all

                                ${
                                    entryType === type

                                        ? "border-orange-500 bg-orange-500 text-black"

                                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-orange-500"
                                }
                            `}
                        >

                            {type}

                        </button>

                    ))
                }

            </div>



            {/* CONTENT */}

            <textarea
                value={content}
                onChange={(e) =>
                    setContent(
                        e.target.value
                    )
                }
                rows={6}
                placeholder="
                    What happened today?

                    What did you build?
                    What broke?
                    What did you learn?
                                    "
                className="
                    w-full
                    resize-none
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-black
                    px-5
                    py-4
                    text-sm
                    leading-8
                    text-white
                    outline-none
                    transition
                    focus:border-orange-500
                "
            />



            {/* PROGRESS */}

            <div className="mt-6">

                <div
                    className="
                        mb-2
                        flex
                        items-center
                        justify-between
                    "
                >

                    <p
                        className="
                            text-sm
                            font-medium
                            text-zinc-400
                        "
                    >

                        Progress

                    </p>

                    <p
                        className="
                            text-sm
                            font-bold
                            text-orange-300
                        "
                    >

                        {progress}%

                    </p>

                </div>


                <input
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={(e) =>
                        setProgress(
                            Number(
                                e.target.value
                            )
                        )
                    }
                    className="
                        w-full
                        accent-orange-500
                    "
                />

            </div>



            {/* PROBLEM */}

            <div className="mt-6 grid gap-4 md:grid-cols-2">

                <textarea
                    value={problem}
                    onChange={(e) =>
                        setProblem(
                            e.target.value
                        )
                    }
                    rows={5}
                    placeholder="Problem faced..."
                    className="
                        w-full
                        resize-none
                        rounded-3xl
                        border
                        border-red-500/10
                        bg-red-500/3
                        px-5
                        py-4
                        text-sm
                        leading-7
                        text-white
                        outline-none
                        transition
                        focus:border-red-500
                    "
                />



                <textarea
                    value={solution}
                    onChange={(e) =>
                        setSolution(
                            e.target.value
                        )
                    }
                    rows={5}
                    placeholder="How you solved it..."
                    className="
                        w-full
                        resize-none
                        rounded-3xl
                        border
                        border-emerald-500/10
                        bg-emerald-500/3
                        px-5
                        py-4
                        text-sm
                        leading-7
                        text-white
                        outline-none
                        transition
                        focus:border-emerald-500
                    "
                />

            </div>



            {/* CODE */}

            <textarea
                value={codeSnippet}
                onChange={(e) =>
                    setCodeSnippet(
                        e.target.value
                    )
                }
                rows={8}
                placeholder="Optional code snippet..."
                className="
                    mt-6
                    w-full
                    resize-none
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-black
                    px-5
                    py-4
                    font-mono
                    text-sm
                    leading-7
                    text-zinc-300
                    outline-none
                    transition
                    focus:border-orange-500
                "
            />



            {/* ACTIONS */}

            <div
                className="
                    mt-6
                    flex
                    justify-end
                    gap-3
                "
            >

                <button
                    onClick={onCancel}
                    disabled={submitting}
                    className="
                        rounded-2xl
                        border
                        border-zinc-700
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-zinc-400
                        transition
                        hover:text-white
                    "
                >

                    Cancel

                </button>



                <button
                    onClick={handleSubmit}
                    disabled={
                        submitting ||
                        !content.trim()
                    }
                    className="
                        rounded-2xl
                        bg-orange-500
                        px-6
                        py-3
                        text-sm
                        font-bold
                        text-black
                        transition
                        hover:bg-orange-400
                        disabled:opacity-50
                    "
                >

                    {
                        submitting
                            ? "Publishing..."
                            : "Publish Entry"
                    }

                </button>

            </div>

        </div>

    )

}