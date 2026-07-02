"use client"

import {
    GitCommit,
    Clock,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface LatestCommitCardProps {

    githubUrl: string | null

}



export default function LatestCommitCard({

    githubUrl,

}: LatestCommitCardProps) {



    // =====================================================
    // NO REPOSITORY
    // =====================================================

    if (!githubUrl) {

        return (

            <RevealWrapper delay={0.15}>

                <section
                    className="
                        overflow-hidden
                        rounded-[28px]
                        border
                        border-white/10
                        bg-[#0d0d0d]
                        backdrop-blur-xl
                    "
                >

                    <div className="p-6">

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-zinc-800
                                    bg-zinc-900
                                    text-zinc-500
                                "
                            >

                                <GitCommit size={24} />

                            </div>

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-white
                                    "
                                >
                                    Latest Commit
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-zinc-500
                                    "
                                >
                                    No GitHub repository connected.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </RevealWrapper>

        )

    }



    // =====================================================
    // MOCK DATA
    // =====================================================

    const commit = {

        message:
            "feat: live project journal timeline + entry composer",

        sha:
            "a3f9c1e",

        branch:
            "main",

        additions:
            412,

        deletions:
            38,

        time:
            "2h ago",

    }



    // =====================================================
    // PAGE
    // =====================================================

    return (

        <RevealWrapper delay={0.15}>

            <section
                className="
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/10
                    bg-[#0d0d0d]
                    backdrop-blur-xl
                "
            >

                {/* TOP GLOW */}

                <div
                    className="
                        h-0.5
                        w-full
                        bg-linear-to-r
                        from-transparent
                        via-orange-500
                        to-transparent
                    "
                />



                <div className="p-6">

                    {/* HEADER */}

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                text-orange-400
                            "
                        >

                            <GitCommit size={24} />

                        </div>



                        <div className="min-w-0 flex-1">

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Latest Commit
                                </h2>



                                <a
                                    href={githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        rounded-full
                                        border
                                        border-orange-500/20
                                        bg-orange-500/10
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        text-orange-300
                                        transition-all
                                        hover:bg-orange-500/20
                                    "
                                >
                                    Open Repo
                                </a>

                            </div>



                            <p
                                className="
                                    mt-4
                                    text-sm
                                    leading-relaxed
                                    text-zinc-300
                                "
                            >
                                {commit.message}
                            </p>



                            <div
                                className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                    text-xs
                                "
                            >

                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-white/3
                                        px-3
                                        py-1.5
                                        font-mono
                                        text-zinc-400
                                    "
                                >
                                    {commit.sha}
                                </span>



                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-emerald-500/20
                                        bg-emerald-500/10
                                        px-3
                                        py-1.5
                                        text-emerald-300
                                    "
                                >
                                    +{commit.additions}
                                </span>



                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-red-500/20
                                        bg-red-500/10
                                        px-3
                                        py-1.5
                                        text-red-300
                                    "
                                >
                                    -{commit.deletions}
                                </span>



                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-white/3
                                        px-3
                                        py-1.5
                                        text-zinc-400
                                    "
                                >
                                    {commit.branch}
                                </span>



                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                        text-zinc-500
                                    "
                                >

                                    <Clock size={13} />

                                    {commit.time}

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </RevealWrapper>

    )

}