"use client"

import { useState } from "react"

import { useUser } from "@clerk/nextjs"

import api from "@/app/lib/api"

import type {
    GetLiveProjectJournal,
    JournalEntryType,
    LiveProjectCodeSnippet,
    LiveProjectProblemSolution,
} from "@/app/lib/type/liveproject"



interface UseJournalComposerProps {

    slug: string

    currentDay: number

    baseProgress: number

    onPublish?: (
        entry: GetLiveProjectJournal
    ) => void

}



export default function useJournalComposer({

    slug,

    currentDay,

    baseProgress,

    onPublish,

}: UseJournalComposerProps) {



    const { user } = useUser()



    const [entryType, setEntryType] =
        useState<JournalEntryType>(
            "progress"
        )



    const [content, setContent] =
        useState("")



    const [progress, setProgress] =
        useState(baseProgress)



    const [mediaUrls, setMediaUrls] =
        useState<string[]>([])



    const [
        codeSnippets,
        setCodeSnippets,
    ] =
        useState<LiveProjectCodeSnippet[]>([
            {
                language: "",
                code: "",
            },
        ])



    const [
        problemSolutions,
        setProblemSolutions,
    ] =
        useState<LiveProjectProblemSolution[]>([
            {
                problem: "",
                solution: "",
            },
        ])



    const [loading, setLoading] =
        useState(false)



    const [error, setError] =
        useState("")



    function resetComposer() {

        setEntryType("progress")

        setContent("")

        setProgress(baseProgress)

        setMediaUrls([])

        setCodeSnippets([
            {
                language: "",
                code: "",
            },
        ])

        setProblemSolutions([
            {
                problem: "",
                solution: "",
            },
        ])

        setError("")

    }



    function addCodeSnippet() {

        setCodeSnippets((prev) => [

            ...prev,

            {
                language: "",
                code: "",
            },

        ])

    }



    function removeCodeSnippet(
        index: number
    ) {

        setCodeSnippets((prev) =>
            prev.filter((_, i) => i !== index)
        )

    }



    function updateCodeSnippet(
        index: number,
        field: "language" | "code",
        value: string
    ) {

        setCodeSnippets((prev) =>
            prev.map((snippet, i) => {

                if (i !== index) return snippet

                return {
                    ...snippet,
                    [field]: value,
                }

            })
        )

    }



    function addProblemSolution() {

        setProblemSolutions((prev) => [

            ...prev,

            {
                problem: "",
                solution: "",
            },

        ])

    }



    function removeProblemSolution(
        index: number
    ) {

        setProblemSolutions((prev) =>
            prev.filter((_, i) => i !== index)
        )

    }



    function updateProblemSolution(
        index: number,
        field: "problem" | "solution",
        value: string
    ) {

        setProblemSolutions((prev) =>
            prev.map((item, i) => {

                if (i !== index) return item

                return {
                    ...item,
                    [field]: value,
                }

            })
        )

    }



    function addMediaUrl() {

        setMediaUrls((prev) => [

            ...prev,

            "",

        ])

    }



    function updateMediaUrl(
        index: number,
        value: string
    ) {

        setMediaUrls((prev) =>
            prev.map((url, i) => {

                if (i !== index) return url

                return value

            })
        )

    }



    function removeMediaUrl(
        index: number
    ) {

        setMediaUrls((prev) =>
            prev.filter((_, i) => i !== index)
        )

    }



    async function publishEntry() {

        if (!content.trim()) return

        if (!user?.id) {

            setError(
                "You must be signed in to publish a journal entry."
            )

            return

        }

        try {

            setLoading(true)

            setError("")

            const payload = {

                day_number:
                    currentDay,

                entry_type:
                    entryType,

                content:
                    content.trim(),

                progress_percentage:
                    progress,

                media_urls:
                    mediaUrls.filter(
                        (url) => url.trim() !== ""
                    ),

                code_snippets:
                    codeSnippets.filter(
                        (snippet) =>
                            snippet.code.trim() !== ""
                    ),

                problem_solutions:
                    problemSolutions.filter(
                        (item) =>
                            item.problem.trim() !== "" ||
                            item.solution.trim() !== ""
                    ),

            }

            const res =
                await api.post<GetLiveProjectJournal>(
                    `/live-projects/${slug}/journals`,
                    payload,
                    {
                        params: {
                            clerk_user_id:
                                user.id,
                        },
                    }
                )

            onPublish?.(res.data)

            resetComposer()

        }

        catch (error) {

            console.error(
                "Failed to publish journal entry:",
                error
            )

            setError(
                "Failed to publish journal entry."
            )

        }

        finally {

            setLoading(false)

        }

    }



    return {

        loading,

        error,

        entryType,
        setEntryType,

        content,
        setContent,

        progress,
        setProgress,

        mediaUrls,
        addMediaUrl,
        updateMediaUrl,
        removeMediaUrl,

        codeSnippets,
        addCodeSnippet,
        updateCodeSnippet,
        removeCodeSnippet,

        problemSolutions,
        addProblemSolution,
        updateProblemSolution,
        removeProblemSolution,

        publishEntry,
        resetComposer,

    }

}