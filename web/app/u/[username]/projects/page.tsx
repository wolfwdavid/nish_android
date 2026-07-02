"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

import gsap from "gsap"

import {
    Bookmark,
    MoreHorizontal,
    Github,
    ExternalLink,
    Heart,
    EyeOff,
    Flag,
    UserPlus,
    UserCheck,
     Trash2,
} from "lucide-react"

import api from "@/app/lib/api"

import type {
    GetProject,
} from "@/app/lib/type/project"

import useCurrentUser from "@/app/lib/currentUser"

import ProfilePreview from "./components/ProfilePreview"
import ProjectStar from "./components/ProjectStar"
import AddComment from "./components/CommentSection"
import ShareProject from "./components/ShareProject"
import UserSearchCard from "./components/UserSearchCard"

function normalizeExternalUrl(
    url?: string | null
) {
    if (!url) return ""

    const trimmedUrl = url.trim()

    if (!trimmedUrl) return ""

    if (
        trimmedUrl.startsWith("http://") ||
        trimmedUrl.startsWith("https://")
    ) {
        return trimmedUrl
    }

    return `https://${trimmedUrl}`
}


export default function ProjectsFeed() {
    const router = useRouter()

    const { user, isLoaded } = useUser()

    const { currentUser } = useCurrentUser()

    const [mainLoading, setMainLoading] =
        useState(false)

    const [mainError, setMainError] =
        useState<string>("")

    const [projects, setProjects] =
        useState<GetProject[]>([])

    const [expandedProjects, setExpandedProjects] =
        useState<Record<string, boolean>>({})

    const [savedProjects, setSavedProjects] =
        useState<Record<string, boolean>>({})

    const [hiddenProjects, setHiddenProjects] =
        useState<Record<string, boolean>>({})

    const [openMenuId, setOpenMenuId] =
        useState<string | null>(null)

    const [followingByUsername, setFollowingByUsername] =
        useState<Record<string, boolean>>({})

    const [followLoadingByUsername, setFollowLoadingByUsername] =
        useState<Record<string, boolean>>({})


    const cardRefs =
        useRef<Record<string, HTMLDivElement | null>>({})

    const bookmarkRefs =
        useRef<Record<string, HTMLButtonElement | null>>({})

    const overlayHeartRefs =
        useRef<Record<string, HTMLDivElement | null>>({})

    const lastTapRef =
        useRef<Record<string, number>>({})

    const deleteProject = async (project: GetProject) => {
            if (!isLoaded || !user?.id) return

            const confirmed = window.confirm(
                `Delete "${project.title}"? This cannot be undone.`
            )

            if (!confirmed) return

            try {
                await api.delete(`/projects/${project.slug}`, {
                    params: {
                        clerk_user_id: user.id,
                    },
                })

                setProjects((prev) =>
                    prev.filter((item) => item.id !== project.id)
                )

                setOpenMenuId(null)
            } catch (err) {
                console.error("DELETE PROJECT FAILED:", err)
                alert("Failed to delete project.")
            }
        }

    useEffect(() => {
        const fetchAllProjects = async () => {
            if (!currentUser?.clerk_user_id) return

            try {
                setMainError("")
                setMainLoading(true)

                const res = await api.get(
                    "/projects",
                    {
                        params: {
                            limit: 12,
                            clerk_user_id:
                                currentUser.clerk_user_id,
                        },
                    }
                )

                const items: GetProject[] =
                    res.data.items ?? []

                setProjects(items)

                const initialFollowState:
                    Record<string, boolean> = {}

                for (const project of items) {
                    const username =
                        project.user.username

                    if (!username) continue

                    initialFollowState[username] =
                        Boolean(
                            (project as any)
                                .is_following_author ??
                            (project.user as any)
                                .is_following ??
                            false
                        )
                }

                setFollowingByUsername(
                    initialFollowState
                )

                const usernames = Array.from(
                    new Set(
                        items
                            .map(
                                (project) =>
                                    project.user.username
                            )
                            .filter(Boolean)
                    )
                ).filter(
                    (username) =>
                        username !==
                        currentUser.username
                )

                const statusResults =
                    await Promise.allSettled(
                        usernames.map(
                            async (username) => {
                                const statusRes =
                                    await api.get(
                                        `/users/${username}/follow-status`,
                                        {
                                            params: {
                                                clerk_user_id:
                                                    currentUser.clerk_user_id,
                                            },
                                        }
                                    )

                                return {
                                    username,
                                    is_following:
                                        Boolean(
                                            statusRes
                                                .data
                                                .is_following
                                        ),
                                }
                            }
                        )
                    )

                const realFollowState:
                    Record<string, boolean> = {
                        ...initialFollowState,
                    }

                for (const result of statusResults) {
                    if (
                        result.status ===
                        "fulfilled"
                    ) {
                        realFollowState[
                            result.value.username
                        ] =
                            result.value.is_following
                    }
                }

                setFollowingByUsername(
                    realFollowState
                )
            } catch (err) {
                console.error(err)

                setMainError(
                    "There was a problem fetching projects"
                )
            } finally {
                setMainLoading(false)
            }
        }

        fetchAllProjects()
    }, [
        currentUser?.clerk_user_id,
        currentUser?.username,
    ])

    useEffect(() => {
        if (projects.length <= 0) return

        const cards =
            Object.values(
                cardRefs.current
            ).filter(Boolean)

        gsap.fromTo(
            cards,
            {
                opacity: 0,
                y: 24,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
            }
        )
    }, [projects])



    const toggleExpand = (
        projectId: string
    ) => {
        setExpandedProjects((prev) => ({
            ...prev,
            [projectId]: !prev[projectId],
        }))
    }

    const animateOverlayHeart = (
        projectId: string
    ) => {
        const overlay =
            overlayHeartRefs.current[projectId]

        if (!overlay) return

        gsap.killTweensOf(overlay)

        gsap.set(overlay, {
            scale: 0,
            opacity: 1,
        })

        gsap.to(overlay, {
            scale: 1,
            duration: 0.25,
            ease: "back.out(2)",
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 0,
                    scale: 1.15,
                    duration: 0.4,
                    delay: 0.3,
                    ease: "power2.in",
                })
            },
        })
    }

const toggleSave = async (
    project: GetProject
) => {
    if (!isLoaded || !user?.id) return

    const projectId = project.id

    const wasSaved =
        savedProjects[projectId] ?? false

    try {
        setSavedProjects((prev) => ({
            ...prev,
            [projectId]: !wasSaved,
        }))

        const btn =
            bookmarkRefs.current[projectId]

        if (btn) {
            gsap.fromTo(
                btn,
                {
                    scale: 1,
                },
                {
                    scale: 1.25,
                    duration: 0.12,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out",
                }
            )
        }

        if (wasSaved) {
            await api.delete(
                `/projects/${project.slug}/bookmark`,
                {
                    params: {
                        clerk_user_id: user.id,
                    },
                }
            )

            return
        }

        await api.post(
            `/projects/${project.slug}/bookmark`,
            {},
            {
                params: {
                    clerk_user_id: user.id,
                },
            }
        )
    } catch (err: any) {
        if (err.response?.status === 409) {
            setSavedProjects((prev) => ({
                ...prev,
                [projectId]: true,
            }))

            return
        }

        setSavedProjects((prev) => ({
            ...prev,
            [projectId]: wasSaved,
        }))

        console.error("BOOKMARK FAILED:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url,
        })
    }
}

    const toggleProjectStar = async (
        slug: string,
        projectId: string,
        isStarred: boolean
    ) => {
        if (!isLoaded || !user?.id) return

        try {
            if (isStarred) {
                await api.delete(
                    `/projects/${slug}/star`,
                    {
                        params: {
                            clerk_user_id: user.id,
                        },
                    }
                )

                setProjects((prev) =>
                    prev.map((p) =>
                        p.id === projectId
                            ? {
                                  ...p,
                                  is_starred: false,
                                  stars_count:
                                      Math.max(
                                          0,
                                          p.stars_count -
                                              1
                                      ),
                              }
                            : p
                    )
                )

                return
            }

            await api.post(
                `/projects/${slug}/star`,
                {},
                {
                    params: {
                        clerk_user_id: user.id,
                    },
                }
            )

            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId
                        ? {
                              ...p,
                              is_starred: true,
                              stars_count:
                                  p.stars_count + 1,
                          }
                        : p
                )
            )
        } catch (err: any) {
            if (err.response?.status === 409) {
                setProjects((prev) =>
                    prev.map((p) =>
                        p.id === projectId
                            ? {
                                  ...p,
                                  is_starred: true,
                              }
                            : p
                    )
                )

                return
            }

            console.error(err)
        }
    }

    const handleImageTap = (
        projectId: string
    ) => {
        const now = Date.now()

        const last =
            lastTapRef.current[projectId] || 0

        if (now - last < 300) {
            animateOverlayHeart(projectId)
        }

        lastTapRef.current[projectId] = now
    }

    const hideProject = (
        projectId: string
    ) => {
        setHiddenProjects((prev) => ({
            ...prev,
            [projectId]: true,
        }))

        setOpenMenuId(null)
    }

    const reportUser = (p: GetProject) => {
        setOpenMenuId(null)

        const params =
            new URLSearchParams({
                type: "report",
                target: "user",
                username: p.user.username,
                project_slug: p.slug,
                project_title: p.title,
            })

        router.push(
            `/settings/feedback?${params.toString()}`
        )
    }

const toggleFollow = async (
    username: string
) => {
    if (!isLoaded) return

    if (!currentUser?.clerk_user_id) {
        console.error(
            "Missing currentUser.clerk_user_id"
        )
        return
    }

    if (!username) {
        console.error("Missing target username")
        return
    }

    if (username === currentUser.username) {
        console.warn("Cannot follow yourself")
        return
    }

    const wasFollowing =
        followingByUsername[username] ?? false

    setFollowLoadingByUsername((prev) => ({
        ...prev,
        [username]: true,
    }))

    // optimistic UI
    setFollowingByUsername((prev) => ({
        ...prev,
        [username]: !wasFollowing,
    }))

    try {
        const res = wasFollowing
            ? await api.delete(
                  `/users/${username}/follow`,
                  {
                      params: {
                          clerk_user_id:
                              currentUser.clerk_user_id,
                      },
                  }
              )
            : await api.post(
                  `/users/${username}/follow`,
                  {},
                  {
                      params: {
                          clerk_user_id:
                              currentUser.clerk_user_id,
                      },
                  }
              )

        setFollowingByUsername((prev) => ({
            ...prev,
            [username]: Boolean(
                res.data.is_following
            ),
        }))
    } catch (err: any) {
        console.error("FOLLOW FAILED:", {
            message: err?.message,
            status: err?.response?.status,
            data: err?.response?.data,
            url: err?.config?.url,
            params: err?.config?.params,
        })

        // rollback optimistic UI
        setFollowingByUsername((prev) => ({
            ...prev,
            [username]: wasFollowing,
        }))

        alert(
            err?.response?.data?.detail ||
                "Follow action failed."
        )
    } finally {
        setFollowLoadingByUsername((prev) => ({
            ...prev,
            [username]: false,
        }))
    }
}
    if (mainLoading) {
        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-black
                    text-white
                "
            >
                Loading...
            </div>
        )
    }

    if (mainError) {
        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-black
                    text-red-500
                "
            >
                {mainError}
            </div>
        )
    }

    

    return (
        <div
            
            className="
                flex
                min-h-screen
                w-full
                justify-center
                bg-black
                px-4
                py-6
                sm:py-10
            "

        >
            <div
                className="
                    flex
                    w-full
                    max-w-2xl
                    flex-col
                    gap-6
                    sm:gap-8
                "
            >
                <UserSearchCard />

                {projects.map((p) => {
                    if (hiddenProjects[p.id]) {
                        return null
                    }

                    const MAX_LENGTH = 140

                    const expanded =
                        expandedProjects[p.id]

                    const description =
                        p.description || ""

                    const isLong =
                        description.length >
                        MAX_LENGTH

                    const displayedText =
                        expanded
                            ? description
                            : description.slice(
                                  0,
                                  MAX_LENGTH
                              )

                    const isSaved =
                        savedProjects[p.id]

                    const authorUsername =
                        p.user.username

                    const isFollowing =
                        followingByUsername[
                            authorUsername
                        ] ?? false

                    const followLoading =
                        followLoadingByUsername[
                            authorUsername
                        ] ?? false

                    const isOwnProject =
                        currentUser?.id === p.user.id ||
                        currentUser?.username ===
                            authorUsername

                    const githubHref =
                        normalizeExternalUrl(
                            p.github_url
                        )

                    const liveHref =
                        normalizeExternalUrl(
                            p.live_url
                        )

                    return (
                        <div
                            key={p.id}
                            ref={(el) => {
                                cardRefs.current[p.id] = el
                            }}
                           
                            className="
                                cursor-pointer
                                overflow-visible
                                rounded-3xl
                                border
                                border-zinc-900
                                bg-[#0a0a0a]
                                shadow-2xl
                            "
                        >
                            {/* TOP */}

                            <div
                                className="
                                    relative
                                    z-30
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    px-4
                                    py-4
                                    sm:px-5
                                "
                            >
                                <div className="min-w-0">
                                    <ProfilePreview
                                        profile={p.user}
                                        created_at={
                                            p.created_at
                                        }
                                    />
                                </div>

                                <div
                                    className="
                                        flex
                                        shrink-0
                                        items-center
                                        gap-1
                                        sm:gap-2
                                    "
                                >
                                    {!isOwnProject && (
                                        <button
                                            type="button"
                                            disabled={
                                                followLoading
                                            }
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleFollow(authorUsername)
                                            }}
                                            className={`
                                                flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-semibold
                                                transition
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                                sm:px-4
                                                sm:text-sm
                                                ${
                                                    isFollowing
                                                        ? `
                                                            border
                                                            border-white/10
                                                            bg-white/5
                                                            text-zinc-300
                                                            hover:bg-white/10
                                                        `
                                                        : `
                                                            bg-linear-to-r
                                                            from-orange-500
                                                            to-red-500
                                                            text-white
                                                            hover:scale-[1.03]
                                                        `
                                                }
                                            `}
                                        >
                                            {followLoading ? (
                                                "..."
                                            ) : isFollowing ? (
                                                <>
                                                    <UserCheck
                                                        size={
                                                            14
                                                        }
                                                    />
                                                    <span className="hidden xs:inline">
                                                        Following
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus
                                                        size={
                                                            14
                                                        }
                                                    />
                                                    <span>
                                                        Follow
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setOpenMenuId((prev) =>
                                                    prev === p.id ? null : p.id
                                                )
                                            }}
                                            className="
                                                rounded-full
                                                p-2
                                                text-zinc-500
                                                transition
                                                hover:bg-zinc-900
                                                hover:text-white
                                            "
                                        >
                                            <MoreHorizontal
                                                size={20}
                                            />
                                        </button>

                                        {openMenuId === p.id && (
                                            <div
                                                className="
                                                    absolute
                                                    right-0
                                                    top-11
                                                    z-999
                                                    w-56
                                                    overflow-hidden
                                                    rounded-2xl
                                                    border
                                                    border-white/15
                                                    bg-zinc-950
                                                    shadow-2xl
                                                    shadow-black
                                                    ring-1
                                                    ring-black/80
                                                "
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        hideProject(p.id)
                                                    }
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        px-4
                                                        py-3
                                                        text-left
                                                        text-sm
                                                        font-semibold
                                                        text-zinc-200
                                                        transition
                                                        hover:bg-zinc-800
                                                        hover:text-white
                                                    "
                                                >
                                                    <EyeOff size={16} />

                                                    Hide project
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        reportUser(p)
                                                    }
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        px-4
                                                        py-3
                                                        text-left
                                                        text-sm
                                                        font-semibold
                                                        text-red-300
                                                        transition
                                                        hover:bg-red-500/20
                                                        hover:text-red-100
                                                    "
                                                >
                                                    <Flag size={16} />

                                                    Report user
                                                </button>
                                                {isOwnProject && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteProject(p)
                                                        }}
                                                        className="
                                                            flex
                                                            w-full
                                                            items-center
                                                            gap-3
                                                            px-4
                                                            py-3
                                                            text-left
                                                            text-sm
                                                            font-semibold
                                                            text-red-400
                                                            transition
                                                            hover:bg-red-500/20
                                                            hover:text-red-100
                                                        "
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete project
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* HERO */}

                            {p.thumbnail_url && (
                                <div
                                    className="
                                        group
                                        relative
                                        aspect-video
                                        w-full
                                        cursor-pointer
                                        overflow-hidden
                                        bg-zinc-900
                                    "
                                    onClick={(e) => {
                                        e.stopPropagation()

                                        handleImageTap(p.id)

                                        if (!p.slug) {
                                            console.error("Missing project slug:", p)
                                            return
                                        }

                                        router.push(`/project/${p.slug}`)
                                    }}
                                                                        
                                >
                                    <img
                                        src={
                                            p.thumbnail_url
                                        }
                                        alt={p.title}
                                        className="
                                            h-full
                                            w-full
                                            select-none
                                            object-cover
                                            transition-transform
                                            duration-700
                                            group-hover:scale-105
                                        "
                                        draggable={false}
                                    />

                                    <div
                                        ref={(el) => {
                                            overlayHeartRefs
                                                .current[
                                                p.id
                                            ] = el
                                        }}
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-0
                                            flex
                                            items-center
                                            justify-center
                                            opacity-0
                                        "
                                    >
                                        <Heart
                                            size={120}
                                            className="
                                                text-white
                                                drop-shadow-2xl
                                            "
                                            fill="white"
                                            strokeWidth={
                                                1.5
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ACTIONS */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    px-4
                                    pb-2
                                    pt-4
                                    sm:px-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >
                                    <ProjectStar
                                        stars={
                                            p.stars_count
                                        }
                                        isStarred={
                                            p.is_starred
                                        }
                                        toggleProjectStar={() =>
                                            toggleProjectStar(
                                                p.slug,
                                                p.id,
                                                p.is_starred
                                            )
                                        }
                                    />

                                    <AddComment
                                        slug={p.slug}
                                    />

                                    <ShareProject
                                        slug={p.slug}
                                    />
                                </div>

                                <button
                                    ref={(el) => {
                                        bookmarkRefs.current[
                                            p.id
                                        ] = el
                                    }}
                                    onClick={() =>
                                        toggleSave(p)
                                    }
                                    className="
                                        rounded-full
                                        p-2
                                        transition
                                        hover:bg-zinc-900
                                    "
                                >
                                    <Bookmark
                                        size={26}
                                        className={
                                            isSaved
                                                ? "text-white"
                                                : "text-zinc-200 hover:text-zinc-400"
                                        }
                                        fill={
                                            isSaved
                                                ? "currentColor"
                                                : "none"
                                        }
                                        strokeWidth={2}
                                    />
                                </button>
                            </div>

                            {/* BODY */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    px-4
                                    pb-5
                                    pt-3
                                    sm:px-5
                                "
                            >
                                <h1
                                    className="
                                        text-xl
                                        font-bold
                                        text-white
                                    "
                                >
                                    {p.title}
                                </h1>

                                <p
                                    className="
                                        text-sm
                                        leading-relaxed
                                        text-zinc-300
                                    "
                                >
                                    <span
                                        className="
                                            mr-2
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        @{p.user.username}
                                    </span>

                                    {displayedText}

                                    {isLong &&
                                        !expanded &&
                                        "..."}

                                    {isLong && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleExpand(
                                                    p.id
                                                )
                                            }
                                            className="
                                                ml-1
                                                text-zinc-500
                                                hover:text-zinc-300
                                            "
                                        >
                                            {expanded
                                                ? "less"
                                                : "more"}
                                        </button>
                                    )}
                                </p>

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-1.5
                                    "
                                >
                                    {p.tech_stack.map(
                                        (tech) => (
                                            <span
                                                key={tech}
                                                className="
                                                    rounded-md
                                                    bg-zinc-900
                                                    px-2.5
                                                    py-0.5
                                                    text-xs
                                                    text-zinc-400
                                                "
                                            >
                                                #
                                                {tech
                                                    .toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        ""
                                                    )}
                                            </span>
                                        )
                                    )}
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-4
                                        pt-1
                                    "
                                >
                                    {githubHref && (
                                        <a
                                            href={
                                                githubHref
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-xs
                                                font-medium
                                                text-zinc-500
                                                hover:text-white
                                            "
                                        >
                                            <Github
                                                size={14}
                                            />
                                            Code
                                        </a>
                                    )}

                                    {liveHref && (
                                        <a
                                            href={liveHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-xs
                                                font-medium
                                                text-zinc-500
                                                hover:text-white
                                            "
                                        >
                                            <ExternalLink
                                                size={14}
                                            />
                                            Live
                                        </a>
                                    )}

                                    <span
                                        className="
                                            ml-auto
                                            text-xs
                                            text-zinc-600
                                        "
                                    >
                                        {p.views_count.toLocaleString()}{" "}
                                        views
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}