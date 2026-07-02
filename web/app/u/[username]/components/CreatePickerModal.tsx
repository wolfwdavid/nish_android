"use client"

import {
    X,
    MessageSquareText,
    Rocket,
    Activity,
    ChevronRight,
} from "lucide-react"

type CreateType = "post" | "project" | "live"

type CreatePickerModalProps = {
    onClose: () => void
    onSelect: (type: CreateType) => void
}

const createOptions: {
    type: CreateType
    title: string
    description: string
    icon: React.ElementType
    accent: string
    badge?: string
}[] = [
    {
        type: "post",
        title: "Post",
        description:
            "A thought, question, or update. Text, image, or code snippet.",
        icon: MessageSquareText,
        accent:
            "text-sky-300 bg-sky-500/10 border-sky-500/20",
    },
    {
        type: "project",
        title: "Project",
        description:
            "Something you shipped. Repo, stack, screenshots — your portfolio entry.",
        icon: Rocket,
        accent:
            "text-orange-300 bg-orange-500/10 border-orange-500/20",
    },
    {
        type: "live",
        title: "Live Project",
        description:
            "A work-in-progress. Show what you're building right now, live.",
        icon: Activity,
        accent:
            "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
        badge: "BUILDING",
    },
]

export default function CreatePickerModal({
    onClose,
    onSelect,
}: CreatePickerModalProps) {

    return (

        <div
            onClick={onClose}
            className="
                fixed
                inset-0
                z-999
                flex
                items-center
                justify-center
                bg-black/80
                px-4
                backdrop-blur-md
            "
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full
                    max-w-2xl
                    rounded-[30px]
                    border
                    border-white/10
                    bg-[#090604]
                    p-6
                    shadow-[0_40px_120px_rgba(0,0,0,0.9)]
                    md:p-7
                "
            >

                {/* HEADER */}

                <div className="mb-7 flex items-start justify-between gap-6">

                    <div>

                        <h2
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-zinc-100
                            "
                        >
                            Share something
                        </h2>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-zinc-500
                            "
                        >
                            What are you putting out into the world?
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/3
                            text-zinc-400
                            transition-all
                            hover:border-white/20
                            hover:bg-white/6
                            hover:text-white
                        "
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* OPTIONS */}

                <div className="space-y-4">

                    {createOptions.map((option) => {

                        const Icon = option.icon

                        return (

                            <button
                                key={option.type}
                                type="button"
                                onClick={() => onSelect(option.type)}
                                className="
                                    group
                                    relative
                                    flex
                                    w-full
                                    items-center
                                    gap-5
                                    overflow-hidden
                                    rounded-[26px]
                                    border
                                    border-white/10
                                    bg-[#0f0a07]
                                    p-5
                                    text-left
                                    transition-all
                                    duration-200
                                    hover:border-orange-500/40
                                    hover:bg-orange-500/4
                                    hover:shadow-[0_0_40px_rgba(249,115,22,0.08)]
                                    hover:scale-[1.01]
                                "
                            >

                                {/* ICON */}

                                <div
                                    className={`
                                        relative
                                        flex
                                        h-16
                                        w-16
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        ${option.accent}
                                    `}
                                >

                                    {option.type === "live" && (

                                        <span
                                            className="
                                                absolute
                                                right-3
                                                top-3
                                                h-2.5
                                                w-2.5
                                                rounded-full
                                                bg-emerald-400
                                                shadow-[0_0_14px_rgba(52,211,153,0.9)]
                                            "
                                        />

                                    )}

                                    <Icon size={24} />

                                </div>

                                {/* CONTENT */}

                                <div className="min-w-0 flex-1">

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h3
                                            className="
                                                text-xl
                                                font-semibold
                                                text-zinc-100
                                            "
                                        >
                                            {option.title}
                                        </h3>

                                        {option.badge && (

                                            <span
                                                className="
                                                    rounded-full
                                                    bg-emerald-500/15
                                                    px-3
                                                    py-1
                                                    text-[11px]
                                                    font-bold
                                                    tracking-[0.18em]
                                                    text-emerald-300
                                                "
                                            >
                                                {option.badge}
                                            </span>

                                        )}

                                    </div>

                                    <p
                                        className="
                                            mt-1.5
                                            max-w-xl
                                            text-sm
                                            leading-6
                                            text-zinc-500
                                        "
                                    >
                                        {option.description}
                                    </p>

                                </div>

                                {/* ARROW */}

                                <ChevronRight
                                    size={20}
                                    className="
                                        shrink-0
                                        text-zinc-700
                                        transition-all
                                        duration-200
                                        group-hover:translate-x-1
                                        group-hover:text-orange-300
                                    "
                                />

                            </button>

                        )

                    })}

                </div>

                {/* FOOTER */}

                <div
                    className="
                        mt-7
                        border-t
                        border-white/5
                        pt-5
                    "
                >

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-center
                            gap-3
                            text-xs
                            text-zinc-600
                        "
                    >

                        <span>Press</span>

                        <kbd
                            className="
                                rounded-md
                                border
                                border-white/10
                                bg-white/4
                                px-2
                                py-1
                                text-zinc-400
                            "
                        >
                            Esc
                        </kbd>

                        <span>to close</span>

                        <span>·</span>

                        <kbd
                            className="
                                rounded-md
                                border
                                border-white/10
                                bg-white/4
                                px-2
                                py-1
                                text-zinc-400
                            "
                        >
                            ↑↓
                        </kbd>

                        <span>to navigate</span>

                        <span>·</span>

                        <kbd
                            className="
                                rounded-md
                                border
                                border-white/10
                                bg-white/4
                                px-2
                                py-1
                                text-zinc-400
                            "
                        >
                            Enter
                        </kbd>

                        <span>to select</span>

                    </div>

                </div>

            </div>

        </div>

    )

}