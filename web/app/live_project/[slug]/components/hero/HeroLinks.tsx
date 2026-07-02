"use client"

import {
    Github,
    ExternalLink,
    Play,
} from "lucide-react"

interface HeroLinksProps {
    github_url: string | null

    live_url?: string | null

    demo_video_url?: string | null
}

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

export default function HeroLinks({
    github_url,
    live_url,
    demo_video_url,
}: HeroLinksProps) {
    const githubHref =
        normalizeExternalUrl(github_url)

    const liveHref =
        normalizeExternalUrl(live_url)

    const demoVideoHref =
        normalizeExternalUrl(demo_video_url)

    return (
        <div
            className="
                flex
                flex-wrap
                items-center
                gap-3
            "
        >
            {/* GITHUB */}

            {githubHref ? (
                <a
                    href={githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        group
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/3
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-zinc-300
                        transition-all
                        hover:border-orange-500/30
                        hover:bg-orange-500/10
                        hover:text-orange-300
                    "
                >
                    <Github
                        size={17}
                        className="
                            transition-transform
                            group-hover:rotate-6
                        "
                    />

                    Repository
                </a>
            ) : (
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/2
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-zinc-600
                    "
                >
                    <Github size={17} />

                    No Repository
                </div>
            )}

            {/* LIVE */}

            {liveHref ? (
                <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        group
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-emerald-300
                        transition-all
                        hover:scale-[1.02]
                        hover:border-emerald-400/40
                        hover:bg-emerald-500/15
                    "
                >
                    <ExternalLink
                        size={17}
                        className="
                            transition-transform
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                        "
                    />

                    Live Demo
                </a>
            ) : (
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/2
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-zinc-600
                    "
                >
                    <ExternalLink size={17} />

                    No Live URL
                </div>
            )}

            {/* VIDEO */}

            {demoVideoHref ? (
                <a
                    href={demoVideoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        group
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-red-300
                        transition-all
                        hover:scale-[1.02]
                        hover:border-red-400/40
                        hover:bg-red-500/15
                    "
                >
                    <Play
                        size={17}
                        className="
                            transition-transform
                            group-hover:scale-110
                        "
                    />

                    Watch Demo
                </a>
            ) : (
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/2
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-zinc-600
                    "
                >
                    <Play size={17} />

                    No Demo Video
                </div>
            )}
        </div>
    )
}