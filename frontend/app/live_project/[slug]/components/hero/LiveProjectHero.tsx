"use client"

import { useState } from "react"

import {
    Sparkles,
    Circle,
    Pencil,
    Check,
    X,
    Github,
    Lock,
    Link2,
    Video,
} from "lucide-react"

import HeroLinks from "./HeroLinks"
import HeroProgress from "./HeroProgress"
import HeroStats from "./HeroStats"
import RevealWrapper from "../animations/RevealWrapper"

import type {
    GetLiveProject,
} from "@/app/lib/type/liveproject"

interface LiveProjectHeroProps {
    project: GetLiveProject

    isOwner: boolean

    onUpdate: (
        data: Partial<GetLiveProject>
    ) => Promise<GetLiveProject | void>
}

const STATUS = {
    active: {
        label: "Active",
        color: "text-emerald-300",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },

    paused: {
        label: "Paused",
        color: "text-yellow-300",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
    },

    completed: {
        label: "Completed",
        color: "text-blue-300",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
    },

    abandoned: {
        label: "Abandoned",
        color: "text-red-300",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
    },
}

function normalizeExternalUrl(url: string) {
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

export default function LiveProjectHero({
    project,
    isOwner,
    onUpdate,
}: LiveProjectHeroProps) {
    const status =
        STATUS[
            project.status as keyof typeof STATUS
        ] || STATUS.active

    const [editingLinks, setEditingLinks] =
        useState(false)

    const [saving, setSaving] =
        useState(false)

    const [liveUrl, setLiveUrl] =
        useState(project.live_url || "")

    const [demoVideoUrl, setDemoVideoUrl] =
        useState(project.demo_video_url || "")

    const cancelEdit = () => {
        setLiveUrl(project.live_url || "")
        setDemoVideoUrl(project.demo_video_url || "")
        setEditingLinks(false)
    }

const saveLinks = async () => {
    try {
        setSaving(true)

        await onUpdate({
            live_url: normalizeExternalUrl(liveUrl),
            demo_video_url: normalizeExternalUrl(demoVideoUrl),
        })

        setEditingLinks(false)
    } catch (err) {
        console.error(err)
    } finally {
        setSaving(false)
    }
}

    return (
        <div
            className="
                flex
                flex-col
                gap-5
            "
        >
            <RevealWrapper>
                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-[36px]
                        border
                        border-white/10
                        bg-[#0b0b0b]
                        p-7
                        md:p-10
                    "
                >
                    <div
                        className="
                            absolute
                            -right-25
                            -top-25
                            h-80
                            w-[320px]
                            rounded-full
                            bg-orange-500/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-30
                            -left-30
                            h-65
                            w-65
                            rounded-full
                            bg-orange-400/5
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            inset-0
                            opacity-[0.03]
                            bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                            bg-size-[60px_60px]
                        "
                    />

                    <div className="relative z-10">
                        <div
                            className="
                                flex
                                flex-col
                                gap-5
                                lg:flex-row
                                lg:items-start
                                lg:justify-between
                            "
                        >
                            <div>
                                <div
                                    className="
                                        mb-5
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-orange-500/20
                                        bg-orange-500/10
                                        px-4
                                        py-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.25em]
                                        text-orange-300
                                    "
                                >
                                    <Sparkles size={14} />
                                    Live Build
                                </div>

                                <h1
                                    className="
                                        text-5xl
                                        font-black
                                        tracking-tight
                                        text-white
                                        sm:text-6xl
                                    "
                                >
                                    {project.title}
                                </h1>

                                <p
                                    className="
                                        mt-5
                                        max-w-3xl
                                        text-base
                                        leading-relaxed
                                        text-zinc-400
                                        sm:text-lg
                                    "
                                >
                                    {project.goal}
                                </p>

                                <div
                                    className="
                                        mt-7
                                        flex
                                        flex-wrap
                                        gap-3
                                    "
                                >
                                    {project.tech_stack.map(
                                        (tech) => (
                                            <div
                                                key={tech}
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-white/10
                                                    bg-white/3
                                                    px-4
                                                    py-2
                                                    text-sm
                                                    font-medium
                                                    text-zinc-300
                                                    backdrop-blur-xl
                                                "
                                            >
                                                {tech}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div
                                className="
                                    flex
                                    flex-col
                                    items-start
                                    gap-3
                                    lg:items-end
                                "
                            >
                                <div
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        backdrop-blur-xl
                                        ${status.border}
                                        ${status.bg}
                                        ${status.color}
                                    `}
                                >
                                    <Circle
                                        size={10}
                                        fill="currentColor"
                                        strokeWidth={0}
                                    />

                                    {status.label}
                                </div>

                                {isOwner && !editingLinks && (
                                    <button
                                        onClick={() =>
                                            setEditingLinks(true)
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-zinc-300
                                            transition-all
                                            hover:border-orange-500/20
                                            hover:bg-orange-500/10
                                            hover:text-orange-300
                                        "
                                    >
                                        <Pencil size={16} />
                                        Edit links
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-10">
                            {!editingLinks && (
                                <HeroLinks
                                    github_url={
                                        project.github_url
                                    }
                                    live_url={
                                        project.live_url
                                    }
                                    demo_video_url={
                                        project.demo_video_url
                                    }
                                />
                            )}

                            {editingLinks && isOwner && (
                                <div
                                    className="
                                        rounded-3xl
                                        border
                                        border-white/10
                                        bg-black/30
                                        p-5
                                    "
                                >
                                    <div
                                        className="
                                            grid
                                            gap-4
                                        "
                                    >
                                        <div>
                                            <label
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-medium
                                                    text-zinc-400
                                                "
                                            >
                                                <Github size={15} />
                                                Repository
                                                <Lock
                                                    size={14}
                                                    className="
                                                        text-orange-300
                                                    "
                                                />
                                            </label>

                                            <input
                                                value={
                                                    project.github_url ||
                                                    ""
                                                }
                                                disabled
                                                className="
                                                    w-full
                                                    rounded-2xl
                                                    border
                                                    border-white/10
                                                    bg-white/5
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    text-zinc-500
                                                    outline-none
                                                    cursor-not-allowed
                                                "
                                            />

                                            <p
                                                className="
                                                    mt-2
                                                    text-xs
                                                    text-zinc-500
                                                "
                                            >
                                                Repo is locked after project creation.
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-medium
                                                    text-zinc-400
                                                "
                                            >
                                                <Link2 size={15} />
                                                Live URL
                                            </label>

                                            <input
                                                value={liveUrl}
                                                onChange={(e) =>
                                                    setLiveUrl(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="https://your-project.com"
                                                className="
                                                    w-full
                                                    rounded-2xl
                                                    border
                                                    border-white/10
                                                    bg-white/5
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    text-white
                                                    outline-none
                                                    transition
                                                    placeholder:text-zinc-600
                                                    focus:border-orange-500/30
                                                    focus:bg-orange-500/5
                                                "
                                            />
                                        </div>

                                        <div>
                                            <label
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-medium
                                                    text-zinc-400
                                                "
                                            >
                                                <Video size={15} />
                                                Demo Video URL
                                            </label>

                                            <input
                                                value={
                                                    demoVideoUrl
                                                }
                                                onChange={(e) =>
                                                    setDemoVideoUrl(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="https://youtube.com/..."
                                                className="
                                                    w-full
                                                    rounded-2xl
                                                    border
                                                    border-white/10
                                                    bg-white/5
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    text-white
                                                    outline-none
                                                    transition
                                                    placeholder:text-zinc-600
                                                    focus:border-orange-500/30
                                                    focus:bg-orange-500/5
                                                "
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="
                                            mt-5
                                            flex
                                            flex-wrap
                                            gap-3
                                        "
                                    >
                                        <button
                                            onClick={saveLinks}
                                            disabled={saving}
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                rounded-2xl
                                                bg-orange-500
                                                px-5
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-black
                                                transition
                                                hover:bg-orange-400
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        >
                                            <Check size={16} />
                                            {saving
                                                ? "Saving..."
                                                : "Save links"}
                                        </button>

                                        <button
                                            onClick={cancelEdit}
                                            disabled={saving}
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                rounded-2xl
                                                border
                                                border-white/10
                                                bg-white/5
                                                px-5
                                                py-3
                                                text-sm
                                                font-medium
                                                text-zinc-300
                                                transition
                                                hover:bg-white/10
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </RevealWrapper>

            <HeroProgress
                progress_percentage={
                    project.progress_percentage
                }
            />

            <HeroStats
                views_count={project.views_count}
                journal_count={project.journal_count}
                created_at={project.created_at}
            />
        </div>
    )
}