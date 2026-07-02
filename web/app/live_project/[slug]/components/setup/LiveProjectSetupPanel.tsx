"use client"

import { useState } from "react"

import {
    Pencil,
    Check,
    Pause,
    X,
    Rocket,
    Save,
} from "lucide-react"

import RevealWrapper from "../animations/RevealWrapper"

import type {
    GetLiveProject,
} from "@/app/lib/type/liveproject"

interface LiveProjectSetupPanelProps {
    project: GetLiveProject

    setProject: React.Dispatch<
        React.SetStateAction<GetLiveProject>
    >

    isOwner: boolean

    onUpdate: (
        data: Partial<GetLiveProject>
    ) => Promise<GetLiveProject | void>
}

type LiveProjectStatus =
    | "active"
    | "paused"
    | "completed"
    | "abandoned"

const STATUS_OPTIONS: {
    value: LiveProjectStatus
    label: string
    icon: React.ElementType
    color: string
}[] = [
    {
        value: "active",
        label: "Active",
        icon: Rocket,
        color:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },

    {
        value: "paused",
        label: "Paused",
        icon: Pause,
        color:
            "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    },

    {
        value: "completed",
        label: "Completed",
        icon: Check,
        color:
            "border-blue-500/20 bg-blue-500/10 text-blue-300",
    },

    {
        value: "abandoned",
        label: "Abandoned",
        icon: X,
        color:
            "border-red-500/20 bg-red-500/10 text-red-300",
    },
]

export default function LiveProjectSetupPanel({
    project,
    setProject,
    isOwner,
    onUpdate,
}: LiveProjectSetupPanelProps) {
    const [editing, setEditing] =
        useState(false)

    const [saving, setSaving] =
        useState(false)

    const [draftStatus, setDraftStatus] =
        useState<LiveProjectStatus>(
            project.status as LiveProjectStatus
        )

    const startEditing = () => {
        setDraftStatus(
            project.status as LiveProjectStatus
        )
        setEditing(true)
    }

    const cancelEditing = () => {
        setDraftStatus(
            project.status as LiveProjectStatus
        )
        setEditing(false)
    }

    const saveStatus = async () => {
        try {
            setSaving(true)

            setProject((prev) => ({
                ...prev,
                status: draftStatus,
            }))

            await onUpdate({
                status: draftStatus,
            })

            setEditing(false)
        } catch (err) {
            console.error(err)

            setProject((prev) => ({
                ...prev,
                status: project.status,
            }))
        } finally {
            setSaving(false)
        }
    }

    return (
        <RevealWrapper delay={0.1}>
            <section
                className="
                    overflow-hidden
                    rounded-4xl
                    border
                    border-white/10
                    bg-[#0b0b0b]
                "
            >
                <div className="p-6">
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-orange-300
                                "
                            >
                                Live Project Console
                            </p>

                            <h2
                                className="
                                    mt-3
                                    text-2xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                Build Controls
                            </h2>
                        </div>

                        {isOwner && !editing && (
                            <button
                                onClick={startEditing}
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
                                Edit
                            </button>
                        )}

                        {isOwner && editing && (
                            <div
                                className="
                                    flex
                                    gap-2
                                "
                            >
                                <button
                                    onClick={saveStatus}
                                    disabled={saving}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-2xl
                                        bg-orange-500
                                        px-4
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
                                    <Save size={16} />
                                    {saving
                                        ? "Saving..."
                                        : "Save"}
                                </button>

                                <button
                                    onClick={cancelEditing}
                                    disabled={saving}
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
                        )}
                    </div>

                    <div className="mt-8">
                        <p
                            className="
                                mb-4
                                text-sm
                                font-medium
                                text-zinc-400
                            "
                        >
                            Project Status
                        </p>

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-3
                            "
                        >
                            {STATUS_OPTIONS.map(
                                (status) => {
                                    const Icon =
                                        status.icon

                                    const active =
                                        editing
                                            ? draftStatus ===
                                              status.value
                                            : project.status ===
                                              status.value

                                    const disabled =
                                        !isOwner ||
                                        !editing ||
                                        saving

                                    return (
                                        <button
                                            key={
                                                status.value
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onClick={() =>
                                                setDraftStatus(
                                                    status.value
                                                )
                                            }
                                            className={`
                                                flex
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                border
                                                px-4
                                                py-4
                                                text-left
                                                transition-all
                                                ${
                                                    active
                                                        ? status.color
                                                        : `
                                                            border-white/10
                                                            bg-white/3
                                                            text-zinc-400
                                                            ${
                                                                editing &&
                                                                isOwner
                                                                    ? "hover:border-white/20"
                                                                    : ""
                                                            }
                                                        `
                                                }
                                                ${
                                                    disabled
                                                        ? "cursor-not-allowed opacity-70"
                                                        : "cursor-pointer"
                                                }
                                            `}
                                        >
                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-black/20
                                                "
                                            >
                                                <Icon
                                                    size={18}
                                                />
                                            </div>

                                            <div>
                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                    "
                                                >
                                                    {
                                                        status.label
                                                    }
                                                </p>

                                                {active && (
                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            opacity-70
                                                        "
                                                    >
                                                        Current status
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    )
                                }
                            )}
                        </div>

                        {!editing && isOwner && (
                            <p
                                className="
                                    mt-4
                                    text-xs
                                    text-zinc-500
                                "
                            >
                                Click Edit to change project status.
                            </p>
                        )}

                        {!isOwner && (
                            <p
                                className="
                                    mt-4
                                    text-xs
                                    text-zinc-500
                                "
                            >
                                Only the project owner can change status.
                            </p>
                        )}
                    </div>

                    <div className="mt-8">
                        <div
                            className="
                                mb-3
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
                                    font-semibold
                                    text-orange-300
                                "
                            >
                                {
                                    project.progress_percentage
                                }
                                %
                            </p>
                        </div>

                        <div
                            className="
                                h-3
                                overflow-hidden
                                rounded-full
                                bg-white/5
                            "
                        >
                            <div
                                className="
                                    h-full
                                    rounded-full
                                    bg-linear-to-r
                                    from-orange-500
                                    to-orange-400
                                    transition-all
                                "
                                style={{
                                    width: `${project.progress_percentage}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </RevealWrapper>
    )
}