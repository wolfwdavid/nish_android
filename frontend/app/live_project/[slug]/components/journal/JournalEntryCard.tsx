"use client"

import {
    CalendarDays,
    Code2,
    ImageIcon,
    MessageCircle,
    Rocket,
    Heart,
    Wrench,
} from "lucide-react"

import type {
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject"

import CodeSnippetBlock from "./CodeSnippetBlock"
import ProblemSolutionBlock from "./ProblemSolutionBlock"



interface JournalEntryCardProps {

    journal: GetLiveProjectJournal

}



function formatDate(date: string) {

    try {

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })

    } catch {

        return date

    }

}



function getEntryLabel(type: string) {

    const labels: Record<string, string> = {
        progress: "Progress",
        milestone: "Milestone",
        bugfix: "Bug Fix",
        deployment: "Deployment",
        architecture: "Architecture",
        announcement: "Announcement",
        failure: "Failure",
    }

    return labels[type] || type

}



export default function JournalEntryCard({

    journal,

}: JournalEntryCardProps) {

    const codeSnippets =
        journal.code_snippets ?? []

    const problemSolutions =
        journal.problem_solutions ?? []

    const mediaUrls =
        journal.media_urls ?? []

    const likesCount =
        journal.likes_count ?? 0

    const commentsCount =
        journal.comments_count ?? 0

    return (
        <article
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.035]
                p-5
                shadow-[0_0_40px_rgba(0,0,0,0.25)]
                transition
                duration-300
                hover:border-orange-500/30
                hover:bg-white/5.5
            "
        >
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_35%)]
                    opacity-0
                    transition
                    duration-300
                    group-hover:opacity-100
                "
            />

            <div className="relative z-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    border-orange-500/20
                                    bg-orange-500/10
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-orange-300
                                "
                            >
                                <Rocket className="h-3.5 w-3.5" />
                                Day {journal.day_number}
                            </span>

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/4
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-zinc-300
                                "
                            >
                                {getEntryLabel(journal.entry_type)}
                            </span>

                            {typeof journal.progress_percentage === "number" && (
                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-emerald-500/20
                                        bg-emerald-500/10
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        text-emerald-300
                                    "
                                >
                                    {journal.progress_percentage}% progress
                                </span>
                            )}
                        </div>

                        {journal.title && (
                            <h3 className="mt-4 text-lg font-bold text-white">
                                {journal.title}
                            </h3>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>{formatDate(journal.created_at)}</span>
                        </div>
                    </div>
                </div>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-300">
                    {journal.content}
                </p>

                {codeSnippets.length > 0 && (
                    <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            <Code2 className="h-4 w-4" />
                            Code Notes
                        </div>

                        {codeSnippets.map((snippet, index) => (
                            <CodeSnippetBlock
                                key={`${snippet.language}-${index}`}
                                language={snippet.language}
                                code={snippet.code}
                            />
                        ))}
                    </div>
                )}

                {problemSolutions.length > 0 && (
                    <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            <Wrench className="h-4 w-4" />
                            Problems Solved
                        </div>

                        {problemSolutions.map((item, index) => (
                            <ProblemSolutionBlock
                                key={`${item.problem}-${index}`}
                                problem={item.problem}
                                solution={item.solution}
                            />
                        ))}
                    </div>
                )}

                {mediaUrls.length > 0 && (
                    <div className="mt-5">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            <ImageIcon className="h-4 w-4" />
                            Media
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {mediaUrls.map((url, index) => (
                                <img
                                    key={`${url}-${index}`}
                                    src={url}
                                    alt={`Journal media ${index + 1}`}
                                    className="
                                        h-44
                                        w-full
                                        rounded-2xl
                                        border
                                        border-white/10
                                        object-cover
                                    "
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div
                    className="
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-white/10
                        pt-4
                    "
                >
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1.5">
                            <Heart className="h-4 w-4 text-orange-400" />
                            {likesCount}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <MessageCircle className="h-4 w-4 text-zinc-400" />
                            {commentsCount}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    )

}