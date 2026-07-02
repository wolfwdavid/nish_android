import {
    TrendingUp,
    Flag,
    Bug,
    Rocket,
    Layers,
    Megaphone,
    AlertTriangle,
} from "lucide-react"



export const LIVE_PROJECT_STATUS = [

    {
        value: "active",
        label: "Active",
        color:
            "text-emerald-300",
        bg:
            "bg-emerald-500/10",
        border:
            "border-emerald-500/20",
    },

    {
        value: "paused",
        label: "Paused",
        color:
            "text-yellow-300",
        bg:
            "bg-yellow-500/10",
        border:
            "border-yellow-500/20",
    },

    {
        value: "completed",
        label: "Completed",
        color:
            "text-blue-300",
        bg:
            "bg-blue-500/10",
        border:
            "border-blue-500/20",
    },

    {
        value: "abandoned",
        label: "Abandoned",
        color:
            "text-red-300",
        bg:
            "bg-red-500/10",
        border:
            "border-red-500/20",
    },

]



export const JOURNAL_ENTRY_TYPES = {

    progress: {
        label: "Progress",
        icon: TrendingUp,
        color:
            "text-orange-300",
        bg:
            "bg-orange-500/10",
        border:
            "border-orange-500/20",
    },

    milestone: {
        label: "Milestone",
        icon: Flag,
        color:
            "text-yellow-300",
        bg:
            "bg-yellow-500/10",
        border:
            "border-yellow-500/20",
    },

    bugfix: {
        label: "Bug Fix",
        icon: Bug,
        color:
            "text-blue-300",
        bg:
            "bg-blue-500/10",
        border:
            "border-blue-500/20",
    },

    deployment: {
        label: "Deployment",
        icon: Rocket,
        color:
            "text-emerald-300",
        bg:
            "bg-emerald-500/10",
        border:
            "border-emerald-500/20",
    },

    architecture: {
        label: "Architecture",
        icon: Layers,
        color:
            "text-purple-300",
        bg:
            "bg-purple-500/10",
        border:
            "border-purple-500/20",
    },

    announcement: {
        label: "Announcement",
        icon: Megaphone,
        color:
            "text-pink-300",
        bg:
            "bg-pink-500/10",
        border:
            "border-pink-500/20",
    },

    failure: {
        label: "Failure",
        icon: AlertTriangle,
        color:
            "text-red-300",
        bg:
            "bg-red-500/10",
        border:
            "border-red-500/20",
    },

}



export const DEFAULT_PROGRESS = 0

export const MAX_PROGRESS = 100



export const MAX_JOURNAL_CONTENT =
    5000

export const MAX_CODE_SNIPPETS =
    10

export const MAX_MEDIA_UPLOADS =
    12



export const SUPPORTED_CODE_LANGUAGES = [

    "typescript",

    "javascript",

    "python",

    "go",

    "rust",

    "cpp",

    "java",

    "sql",

    "tsx",

    "jsx",

    "bash",

    "html",

    "css",

]



export const LIVE_PROJECT_TABS = [

    {
        value: "journal",
        label: "Journal",
    },

    {
        value: "setup",
        label: "Setup",
    },

    {
        value: "analytics",
        label: "Analytics",
    },

]



export const MOCK_ACTIVITY = [

    "Refactored backend architecture",

    "Fixed deployment issue",

    "Improved timeline rendering",

    "Integrated GSAP animations",

    "Connected live journal system",

]