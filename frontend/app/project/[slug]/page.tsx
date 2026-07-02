"use client"

import { useEffect, useMemo, useState } from "react"

import gsap from "gsap"

import { useParams } from "next/navigation"

import api from "@/app/lib/api"

import type { GetProject }
from "@/app/lib/type/project"
import type { CurrentUser } from "@/app/lib/type/currentUser"
import type { CommentData } from "@/app/lib/type/comment"
import type { GetComment } from "@/app/lib/type/comment"
import type { ProjectAuthor } from "@/app/lib/type/project"

import useCurrentUser
from "@/app/lib/currentUser"
import BackButton from "./components/BackButton"
import Breadcrumb from "./components/BreadCrumb"
import ProjectTags from "./components/ProjectTags"
import ProjectTitle from "./components/ProjectTitle"
import MobileBuilderCard from "./components/MobileBuilderCard"
import ProjectActions from "./components/ProjectActions"
import ProjectStats from "./components/ProjectStats"
import ProjectTabs from "./components/ProjectTabs"
import ProjectAbout from "./components/ProjectAbout"
import CommentsSection from "./components/CommentsSection"
import BuilderCard from "./components/BuilderCard"
import TechStackCard from "./components/TechStackCard"
import RecentLogsCard from "./components/RecentLogsCard"
import { useRouter } from "next/navigation"


import { useUser } from "@clerk/nextjs"





export default function GetSingleProject() {

    const params = useParams()

    const slug = params.slug as string
    const { user } = useUser()
    const [isStarred, setIsStarred] = useState(false)



    const { currentUser } =
        useCurrentUser()



    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState("")

    const [expanded, setExpanded] =
        useState(false)

    const router = useRouter();




    const [projectData, setProjectData] =
        useState<GetProject>({

            id: "",

            user_id: "",

            title: "",

            slug: "",

            description: "",

            github_url: "",

            live_url: null,

            thumbnail_url: null,

            demo_video_url: null,

            gallery_urls: [],

            tech_stack: [],

            stars_count: 0,

            views_count: 0,

            comments_count: 0,

            is_featured: false,

            created_at: "",

            updated_at: "",

            is_bookmarked: false,

            user: {

                id: "",

                username: "",

                display_name: "",

                avatar_url: null,

                location: null,

            },

            is_starred: false,

        })

    const [commentData, setCommentData] =
    useState<CommentData>({
        content: "",
        parent_id: "",
    })

   const [comments, setComments] =
    useState<GetComment[]>([])

    const isOwner =
        user?.id &&
        currentUser?.clerk_user_id &&
        user.id === currentUser.clerk_user_id

    const projectOwner = {
        id: projectData.user.id,
        username: projectData.user.username,
        display_name: projectData.user.display_name,
        avatar_url: projectData.user.avatar_url,
    }

    useEffect(() => {

        if (!slug) return

        const getSingleProjectData =
            async () => {

                try {

                    setLoading(true)

                    setError("")

                    const res =
                        await api.get(
                            `/projects/${slug}`,
                            {
                                params: {
                                    clerk_user_id: user?.id,
                                },
                            }
                        )

                    setProjectData(
                        res.data
                    )
                    setIsStarred(
                        res.data.is_starred
                    )

                } catch (err) {

                    console.error(err)

                    setError(
                        "There was a problem fetching project"
                    )

                } finally {

                    setLoading(false)
                }
            }

        getSingleProjectData()

    }, [slug, user?.id])



    useEffect(() => {

        gsap.from(".fade-up", {

            opacity: 0,

            y: 30,

            stagger: 0.07,

            duration: 0.7,

            ease: "power3.out",
        })

    }, [])

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault()

        if (!user?.id)
            return

        if (!commentData.content) return;

        try {

            setLoading(true)

            setError("")

            const res = await api.post(
                `/projects/${slug}/comments`,
                {
                    content: commentData.content,
                    parent_id: commentData.parent_id || null,
                },
                {
                    params: {
                        clerk_user_id: user.id,
                    },
                }
            )


            setCommentData({
                content: "",
                parent_id: "",
            })

        } catch (err) {

            console.error(err)

            setError(
                "There was a problem adding comment"
            )

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        if (!slug)
            return

        const getCommentData = async () => {

            try {

                setLoading(true)

                setError("")

                const res = await api.get(
                    `/projects/${slug}/comments`
                )

                setComments(res.data)

            } catch (err) {

                console.error(err)

                setError(
                    "There was a problem fetching comments"
                )

            } finally {

                setLoading(false)
            }
        }

        getCommentData()

    }, [slug])



    const shortDescription =
        useMemo(() => {

            const lines =
                projectData.description
                    ?.split("\n")

            return lines
                ?.slice(0, 10)
                ?.join("\n")

        }, [projectData.description])


    const toggleProjectStar = async () => {

        if (!user?.id)
            return

        try {

            if (isStarred) {

                const result =
                    await api.delete(
                        `/projects/${projectData.slug}/star`,
                        {
                            params: {
                                clerk_user_id: user.id,
                            },
                        }
                    )

                setProjectData(result.data)

                setIsStarred(false)

            } else {

                const result =
                    await api.post(
                        `/projects/${projectData.slug}/star`,
                        {},
                        {
                            params: {
                                clerk_user_id: user.id,
                            },
                        }
                    )

                setProjectData(result.data)

                setIsStarred(true)
            }

        } catch (err) {

            console.error(err)
        }
    }

const toggleProjectBookmark =
    async () => {

        if (!user?.id)
            return

        try {

            if (
                projectData.is_bookmarked
            ) {

                await api.delete(
                    `/projects/${projectData.slug}/bookmark`,
                    {
                        params: {
                            clerk_user_id:
                                user.id,
                        },
                    }
                )

                setProjectData(
                    (prev) => ({

                        ...prev,

                        is_bookmarked:
                            false,
                    })
                )

            } else {

                await api.post(
                    `/projects/${projectData.slug}/bookmark`,
                    {},
                    {
                        params: {
                            clerk_user_id:
                                user.id,
                        },
                    }
                )

                setProjectData(
                    (prev) => ({

                        ...prev,

                        is_bookmarked:
                            true,
                    })
                )
            }

        } catch (err: any) {

            if (
                err.response?.status === 409
            ) {

                setProjectData(
                    (prev) => ({

                        ...prev,

                        is_bookmarked:
                            true,
                    })
                )

                return
            }

            console.error(err)
        }
}

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-black text-white">

                Loading...

            </div>
        )
    }



    if (error) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-black text-red-400">

                {error}

            </div>
        )
    }



    return (

        <div className="min-h-screen bg-black text-white">

            <div className="mx-auto flex max-w-425 gap-8 px-4 py-8">

                <div className="w-full xl:w-[70%]">

                    <BackButton />

                    <Breadcrumb
                        slug={projectData.slug}
                        username={projectData.user.username}
                    />

                    <ProjectTags
                        isFeatured={
                            projectData.is_featured
                        }
                    />

                    <ProjectTitle
                        title={projectData.title}
                    />

                    {/* PROJECT MEDIA */}

                    <div className="fade-up mt-8 overflow-hidden rounded-4xl border border-zinc-800 bg-zinc-950">
                        {projectData.thumbnail_url ? (
                            <img
                                src={projectData.thumbnail_url}
                                alt={projectData.title}
                                className="aspect-video w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-video items-center justify-center bg-zinc-900 text-sm text-zinc-600">
                                No thumbnail added
                            </div>
                        )}
                    </div>

                    {projectData.demo_video_url && (
                        <div className="fade-up mt-6 rounded-4xl border border-zinc-800 bg-zinc-950 p-5">
                            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-orange-400">
                                Demo Video
                            </p>

                            <a
                                href={projectData.demo_video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-zinc-300 underline decoration-orange-500/50 underline-offset-4 hover:text-orange-300"
                            >
                                Watch demo video
                            </a>
                        </div>
                    )}

                    {projectData.gallery_urls.length > 0 && (
                        <div className="fade-up mt-6 rounded-4xl border border-zinc-800 bg-zinc-950 p-5">
                            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-orange-400">
                                Gallery
                            </p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {projectData.gallery_urls.map((url, index) => (
                                    <a
                                        key={`${url}-${index}`}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group overflow-hidden rounded-3xl border border-zinc-800 bg-black"
                                    >
                                        <img
                                            src={url}
                                            alt={`${projectData.title} gallery ${index + 1}`}
                                            className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <MobileBuilderCard
                        currentUser={currentUser}
                    />

                    <ProjectActions
                        githubUrl={projectData.github_url}
                        liveUrl={projectData.live_url}
                        stars={projectData.stars_count}
                        isStarred={isStarred}
                        isBookmarked={projectData.is_bookmarked}
                        addProjectStar={toggleProjectStar}
                        toggleProjectBookmark={toggleProjectBookmark}
                    />

                    {isOwner && (
                        <div className="fade-up mt-5 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => router.push(`/project/${projectData.slug}/edit`)}
                                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-orange-500/50 hover:text-orange-300"
                            >
                                Edit project
                            </button>

                            <button
                                type="button"
                                onClick={async () => {
                                    const confirmed = window.confirm(
                                        `Delete "${projectData.title}"? This cannot be undone.`
                                    )

                                    if (!confirmed || !user?.id) return

                                    await api.delete(`/projects/${projectData.slug}`, {
                                        params: {
                                            clerk_user_id: user.id,
                                        },
                                    })

                                    router.push(`/u/${currentUser?.username}/me`)
                                }}
                                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
                            >
                                Delete project
                            </button>
                        </div>
                    )}

                    <ProjectStats
                        stars={
                            projectData.stars_count
                        }
                        views={
                            projectData.views_count
                        }
                        comments={
                            projectData.comments_count
                        }
                    />

                    <ProjectTabs />

                    <ProjectAbout
                        expanded={expanded}
                        setExpanded={
                            setExpanded
                        }
                        description={
                            projectData.description
                        }
                        shortDescription={
                            shortDescription
                        }
                    />

                    <CommentsSection
                        currentUser={currentUser}
                        handleSubmit={handleSubmit}
                        commentData={commentData}
                        setCommentData={setCommentData}
                        comments={comments}
                    />

                </div>



                <div className="hidden xl:block xl:w-[30%]">

                    <div className="sticky top-6 space-y-5">

                        <BuilderCard
                            currentUser={currentUser}
                        />

                        <TechStackCard
                            techStack={
                                projectData.tech_stack
                            }
                        />

                        {/* <RecentLogsCard /> */}

                    </div>

                </div>

            </div>

        </div>
    )
}