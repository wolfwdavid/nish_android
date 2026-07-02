'use client'

import Link from 'next/link'

import {
    ArrowLeft,
    ArrowRight,
    Bug,
    HelpCircle,
    MessageSquareMore,
    Rocket,
    Sparkles,
    User,
} from 'lucide-react'

interface FinalGuideStepProps {
    onBack: () => void
    onSubmit: () => void
    loading: boolean
}

export default function FinalGuideStep({
    onBack,
    onSubmit,
    loading,
}: FinalGuideStepProps) {

    return (
        <div className="space-y-8">
            <div>
                <div
                    className="
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
                        font-medium
                        uppercase
                        tracking-[0.2em]
                        text-orange-300
                    "
                >
                    <Sparkles size={14} />
                    Final Guide
                </div>

                <h2
                    className="
                        mt-6
                        text-3xl
                        sm:text-4xl
                        font-black
                        tracking-[-0.06em]
                        leading-tight
                    "
                >
                    You are almost
                    <span
                        className="
                            block
                            bg-linear-to-r
                            from-red-500
                            via-orange-400
                            to-red-600
                            bg-clip-text
                            text-transparent
                        "
                    >
                        ready to ship.
                    </span>
                </h2>

                <p
                    className="
                        mt-5
                        max-w-xl
                        text-base
                        leading-8
                        text-zinc-400
                    "
                >
                    DevManiac is built around proof: publish finished projects,
                    track live builds, write journal logs, and grow your builder
                    profile over time.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                    "
                >
                    <User className="text-orange-400" size={22} />

                    <h3 className="mt-4 font-bold text-white">
                        Complete your profile
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Your profile is your proof hub. Keep your bio, links,
                        and current build updated.
                    </p>
                </div>

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                    "
                >
                    <Rocket className="text-orange-400" size={22} />

                    <h3 className="mt-4 font-bold text-white">
                        Ship projects
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Add finished projects and live projects. Real work
                        beats empty claims.
                    </p>
                </div>

                <Link
                    href="/settings/feedback"
                    target="_blank"
                    className="
                        group
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        transition-all
                        hover:border-orange-500/40
                        hover:bg-orange-500/10
                    "
                >
                    <MessageSquareMore
                        className="text-zinc-400 transition group-hover:text-orange-300"
                        size={22}
                    />

                    <h3 className="mt-4 font-bold text-white">
                        Send feedback
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Found something confusing? Tell us what should improve.
                    </p>
                </Link>

                <Link
                    href="/settings/support"
                    target="_blank"
                    className="
                        group
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        transition-all
                        hover:border-orange-500/40
                        hover:bg-orange-500/10
                    "
                >
                    <HelpCircle
                        className="text-zinc-400 transition group-hover:text-orange-300"
                        size={22}
                    />

                    <h3 className="mt-4 font-bold text-white">
                        Get support
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        If something breaks, support is there. Bugs are enemies,
                        not mysteries.
                    </p>
                </Link>
            </div>

            <div
                className="
                    rounded-3xl
                    border
                    border-orange-500/20
                    bg-orange-500/10
                    p-5
                    text-sm
                    leading-7
                    text-orange-100/80
                "
            >
                <div className="mb-2 flex items-center gap-2 font-bold text-orange-300">
                    <Bug size={17} />
                    Early production note
                </div>

                DevManiac is improving fast. Use feedback/support whenever you
                see rough edges. That helps shape the platform.
            </div>

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-4
                    pt-4
                    sm:flex-row
                "
            >
                <button
                    type="button"
                    onClick={onBack}
                    className="
                        flex
                        h-16
                        flex-1
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/4
                        text-lg
                        font-semibold
                        text-zinc-300
                        transition-all
                        hover:bg-white/8
                    "
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="
                        group
                        relative
                        flex
                        h-16
                        flex-1
                        items-center
                        justify-center
                        gap-3
                        overflow-hidden
                        rounded-2xl
                        bg-linear-to-r
                        from-red-500
                        via-orange-500
                        to-red-600
                        text-lg
                        font-bold
                        text-white
                        transition-all
                        hover:scale-[1.01]
                        hover:shadow-[0_0_60px_rgba(249,115,22,0.35)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <div
                        className="
                            absolute
                            inset-0
                            opacity-0
                            transition-opacity
                            duration-500
                            group-hover:opacity-100
                            bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)]
                            translate-x-[-200%]
                            group-hover:translate-x-[200%]
                        "
                    />

                    {loading
                        ? 'Initializing profile...'
                        : 'Enter DevManiac'}

                    {!loading && <ArrowRight size={20} />}
                </button>
            </div>
        </div>
    )
}