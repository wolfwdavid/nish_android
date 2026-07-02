export const PROJECT_STATUS = {

    active: {
        label: "Active",
        color:
            "text-emerald-300",
        bg:
            "bg-emerald-500/10",
        border:
            "border-emerald-500/20",
        ring:
            "ring-emerald-500/20",
        glow:
            "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    },

    paused: {
        label: "Paused",
        color:
            "text-yellow-300",
        bg:
            "bg-yellow-500/10",
        border:
            "border-yellow-500/20",
        ring:
            "ring-yellow-500/20",
        glow:
            "shadow-[0_0_30px_rgba(234,179,8,0.2)]",
    },

    completed: {
        label: "Completed",
        color:
            "text-blue-300",
        bg:
            "bg-blue-500/10",
        border:
            "border-blue-500/20",
        ring:
            "ring-blue-500/20",
        glow:
            "shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    },

    abandoned: {
        label: "Abandoned",
        color:
            "text-red-300",
        bg:
            "bg-red-500/10",
        border:
            "border-red-500/20",
        ring:
            "ring-red-500/20",
        glow:
            "shadow-[0_0_30px_rgba(239,68,68,0.2)]",
    },

} as const



export type ProjectStatus =
    keyof typeof PROJECT_STATUS



export function getProjectStatus(

    status?: string

) {

    if (
        !status ||
        !(status in PROJECT_STATUS)
    ) {

        return PROJECT_STATUS.active

    }



    return PROJECT_STATUS[
        status as ProjectStatus
    ]

}



export function isProjectActive(
    status?: string
) {

    return status === "active"

}



export function isProjectCompleted(
    status?: string
) {

    return status === "completed"

}



export function isProjectPaused(
    status?: string
) {

    return status === "paused"

}



export function isProjectAbandoned(
    status?: string
) {

    return status === "abandoned"

}



export function getStatusProgressColor(

    progress: number

) {

    if (progress >= 100) {

        return {

            color:
                "text-emerald-300",

            bg:
                "bg-emerald-500/10",

            border:
                "border-emerald-500/20",

            gradient:
                "from-emerald-700 via-emerald-500 to-emerald-400",

        }

    }



    if (progress >= 75) {

        return {

            color:
                "text-orange-300",

            bg:
                "bg-orange-500/10",

            border:
                "border-orange-500/20",

            gradient:
                "from-orange-700 via-orange-500 to-orange-400",

        }

    }



    if (progress >= 40) {

        return {

            color:
                "text-yellow-300",

            bg:
                "bg-yellow-500/10",

            border:
                "border-yellow-500/20",

            gradient:
                "from-yellow-700 via-yellow-500 to-yellow-400",

        }

    }



    return {

        color:
            "text-zinc-300",

        bg:
            "bg-zinc-500/10",

        border:
            "border-zinc-500/20",

        gradient:
            "from-zinc-700 via-zinc-500 to-zinc-400",

    }

}