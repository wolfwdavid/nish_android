"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/app/lib/api"

import LiveProjectHero from "./components/hero/LiveProjectHero"
import LiveProjectSetupPanel from "./components/setup/LiveProjectSetupPanel"
import LatestCommitCard from "./components/commit/LatestCommitCard"
import JournalSection from "./components/journal/JournalSection"
import useCurrentUser from "@/app/lib/currentUser"

import {
    GetLiveProject,
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject"

const emptyProject: GetLiveProject = {
    id: "",
    user_id: "",
    user: {
        id: "",
        username: "",
        display_name: "",
        avatar_url: "",
    },
    title: "",
    slug: "",
    goal: "",
    description: "",
    github_url: "",
    live_url: "",
    demo_video_url: "",
    thumbnail_url: "",
    gallery_urls: [],
    tech_stack: [],
    progress_percentage: 0,
    current_status: "",
    current_goal: "",
    status: "active",
    category: "",
    is_public: true,
    is_featured: false,
    views_count: 0,
    journal_count: 0,
    days_count: 0,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

export default function GetLiveProjectPage() {
    const params = useParams()
    const slug = params.slug as string

    const router = useRouter()

    const { user, isLoaded } = useUser()
    const { currentUser } = useCurrentUser()

    const [project, setProject] =
        useState<GetLiveProject>(emptyProject)

    const [journals, setJournals] =
        useState<GetLiveProjectJournal[]>([])

    const [composerOpen, setComposerOpen] =
        useState(false)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState("")

    const isOwner =
        Boolean(
            currentUser?.id &&
            project.user_id &&
            currentUser.id === project.user_id
        )

    useEffect(() => {
        if (!slug) return

        const getLiveProjectData = async () => {
            try {
                setLoading(true)
                setError("")

                const [projectRes, journalsRes] =
                    await Promise.all([
                        api.get(
                            `/live-projects/${slug}`
                        ),
                        api.get(
                            `/live-projects/${slug}/journals`
                        ),
                    ])

                setProject(projectRes.data)
                setJournals(journalsRes.data)
            } catch (err) {
                console.error(err)

                setError(
                    "There was a problem fetching live project data"
                )
            } finally {
                setLoading(false)
            }
        }

        getLiveProjectData()
    }, [slug])

    async function updateLiveProject(
        data: Partial<GetLiveProject>
    ) {
        if (!isLoaded || !user?.id) {
            throw new Error(
                "User is not loaded or not authenticated"
            )
        }

        if (!isOwner) {
            throw new Error(
                "Only the project owner can update this live project"
            )
        }

        const res = await api.patch(
            `/live-projects/${slug}?clerk_user_id=${user.id}`,
            data
        )

        const updatedProject =
            res.data as GetLiveProject

        setProject((prev) => ({
            ...prev,
            ...updatedProject,
        }))

        return updatedProject
    }

    async function publishEntry(data: {
        day_number: number

        content: string

        entry_type: string

        progress_percentage: number | null

        media_urls: string[]

        code_snippets: string[]

        problem_solutions: any[]
    }) {
        if (!isLoaded || !user?.id) return

        try {
            const res = await api.post(
                `/live-projects/${slug}/journals?clerk_user_id=${user.id}`,
                data
            )

            const newEntry =
                res.data as GetLiveProjectJournal

            setJournals((prev) => [
                newEntry,
                ...prev,
            ])

            setProject((prev) => ({
                ...prev,
                journal_count:
                    prev.journal_count + 1,
                progress_percentage:
                    newEntry.progress_percentage ??
                    prev.progress_percentage,
            }))

            setComposerOpen(false)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-black
                    text-zinc-400
                "
            >
                Loading live project...
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
                    px-4
                    text-center
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
                py-6
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-4xl
                    flex-col
                    gap-5
                "
            >
                <button
                    onClick={() =>
                        router.push(
                            currentUser?.username
                                ? `/u/${currentUser.username}/live_projects`
                                : "/"
                        )
                    }
                    className="
                        group
                        mb-2
                        flex
                        w-fit
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-[#0f0f13]
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-zinc-400
                        transition-all
                        hover:border-orange-500/20
                        hover:bg-orange-500/3
                        hover:text-orange-300
                    "
                >
                    <ArrowLeft
                        size={16}
                        className="
                            transition-transform
                            group-hover:-translate-x-1
                        "
                    />

                    Back
                </button>

                <LiveProjectHero
                    project={project}
                    isOwner={isOwner}
                    onUpdate={updateLiveProject}
                />

                <LiveProjectSetupPanel
                    project={project}
                    setProject={setProject}
                    isOwner={isOwner}
                    onUpdate={updateLiveProject}
                />

                <LatestCommitCard
                    githubUrl={project.github_url}
                />

                <JournalSection
                    project={project}
                    journals={journals}
                    composerOpen={composerOpen}
                    setComposerOpen={
                        setComposerOpen
                    }
                    onPublish={publishEntry}
                    isOwner={isOwner}
                />
            </div>
        </main>
    )
}