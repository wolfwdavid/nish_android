"use client"

import { useEffect, useState } from "react"

import api from "@/app/lib/api"

import type {
    GetLiveProject,
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject"



interface UseLiveProjectProps {

    slug: string

}



export default function useLiveProject({

    slug,

}: UseLiveProjectProps) {



    const [project, setProject] =
        useState<GetLiveProject | null>(
            null
        )



    const [journals, setJournals] =
        useState<GetLiveProjectJournal[]>(
            []
        )



    const [loading, setLoading] =
        useState(true)



    const [error, setError] =
        useState("")



    async function fetchProject() {

        if (!slug) return

        try {

            setLoading(true)

            setError("")

            const [projectRes, journalsRes] =
                await Promise.all([

                    api.get<GetLiveProject>(
                        `/live-projects/${slug}`
                    ),

                    api.get<GetLiveProjectJournal[]>(
                        `/live-projects/${slug}/journals`
                    ),

                ])

            setProject(projectRes.data)

            setJournals(journalsRes.data)

        }

        catch (error) {

            console.error(
                "Failed to fetch live project:",
                error
            )

            setProject(null)

            setJournals([])

            setError(
                "Failed to load live project."
            )

        }

        finally {

            setLoading(false)

        }

    }



    useEffect(() => {

        fetchProject()

    }, [slug])



    function addJournalEntry(
        entry: GetLiveProjectJournal
    ) {

        setJournals((prev) => [

            entry,

            ...prev,

        ])



        setProject((prev) => {

            if (!prev) return prev

            return {

                ...prev,

                progress_percentage:
                    entry.progress_percentage ??
                    prev.progress_percentage,

                journal_count:
                    prev.journal_count + 1,

            }

        })

    }



    function updateProject(
        data: Partial<GetLiveProject>
    ) {

        setProject((prev) => {

            if (!prev) return prev

            return {

                ...prev,

                ...data,

            }

        })

    }



    return {

        project,

        journals,

        loading,

        error,

        fetchProject,

        setProject,

        updateProject,

        setJournals,

        addJournalEntry,

    }

}