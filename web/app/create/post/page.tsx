"use client"

import { useRouter } from "next/navigation"

import {
    ArrowLeft,
    Construction,
    Hammer,
    Lightbulb,
    MessageSquareText,
    Sparkles,
    Clock,
    Rocket,
    Wrench,
} from "lucide-react"

export default function CreatePostMaintenancePage() {
    const router = useRouter()

    return (
        <main
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-black
                px-4
                py-10
                text-white
            "
        >
            {/* BACKGROUND GRID */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[0.045]
                    bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                    bg-size-[56px_56px]
                "
            />

            {/* GLOW BLOBS */}
            <div
                className="
                    absolute
                    -top-32
                    left-1/2
                    h-105
                    w-105
                    -translate-x-1/2
                    rounded-full
                    bg-orange-500/20
                    blur-[110px]
                    animate-pulse
                "
            />

            <div
                className="
                    absolute
                    -bottom-40
                    -left-24
                    h-90
                    w-90
                    rounded-full
                    bg-red-500/10
                    blur-[100px]
                    animate-pulse
                "
            />

            <div
                className="
                    absolute
                    -right-32
                    top-1/3
                    h-80
                    w-[320px]
                    rounded-full
                    bg-yellow-500/10
                    blur-[100px]
                    animate-pulse
                "
            />

            {/* FLOATING ICONS */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-[12%]
                    top-[18%]
                    hidden
                    animate-bounce
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    text-orange-300
                    shadow-2xl
                    shadow-orange-500/10
                    md:block
                "
            >
                <Hammer size={26} />
            </div>

            <div
                className="
                    pointer-events-none
                    absolute
                    right-[14%]
                    top-[22%]
                    hidden
                    animate-pulse
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    text-yellow-300
                    shadow-2xl
                    shadow-yellow-500/10
                    md:block
                "
            >
                <Lightbulb size={26} />
            </div>

            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-[18%]
                    right-[18%]
                    hidden
                    animate-bounce
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    text-red-300
                    shadow-2xl
                    shadow-red-500/10
                    md:block
                "
            >
                <Wrench size={26} />
            </div>

            {/* MAIN CARD */}
            <section
                className="
                    relative
                    z-10
                    w-full
                    max-w-3xl
                    overflow-hidden
                    rounded-[36px]
                    border
                    border-white/10
                    bg-[#090909]/90
                    p-6
                    shadow-2xl
                    shadow-orange-500/10
                    backdrop-blur-2xl
                    sm:p-8
                    md:p-10
                "
            >
                {/* CARD INNER GLOW */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-64
                        w-64
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-24
                        h-64
                        w-64
                        rounded-full
                        bg-red-500/10
                        blur-3xl
                    "
                />

                <div className="relative z-10">
                    {/* TOP BAR */}
                    <div
                        className="
                            mb-8
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="
                                group
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
                                text-zinc-400
                                transition-all
                                hover:border-orange-500/30
                                hover:bg-orange-500/10
                                hover:text-orange-300
                            "
                        >
                            <ArrowLeft
                                size={16}
                                className="
                                    transition-transform
                                    group-hover:-translate-x-1
                                "
                            />

                            Back
                        </button>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-4
                                py-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.22em]
                                text-orange-300
                            "
                        >
                            <Sparkles size={14} />
                            Coming Soon
                        </div>
                    </div>

                    {/* ICON ANIMATION */}
                    <div
                        className="
                            mx-auto
                            mb-8
                            flex
                            h-28
                            w-28
                            items-center
                            justify-center
                            rounded-4xl
                            border
                            border-orange-500/20
                            bg-orange-500/10
                            shadow-2xl
                            shadow-orange-500/20
                        "
                    >
                        <div
                            className="
                                flex
                                h-20
                                w-20
                                animate-pulse
                                items-center
                                justify-center
                                rounded-[26px]
                                bg-orange-500
                                text-black
                            "
                        >
                            <Construction size={42} />
                        </div>
                    </div>

                    {/* TEXT */}
                    <div className="text-center">
                        <h1
                            className="
                                bg-linear-to-r
                                from-white
                                via-orange-100
                                to-orange-400
                                bg-clip-text
                                text-4xl
                                font-black
                                tracking-[-0.08em]
                                text-transparent
                                sm:text-5xl
                                md:text-6xl
                            "
                        >
                            Post Builder is Under Maintenance
                        </h1>

                        <p
                            className="
                                mx-auto
                                mt-5
                                max-w-2xl
                                text-base
                                leading-8
                                text-zinc-400
                                sm:text-lg
                            "
                        >
                            The post creation system is getting upgraded.
                            We are cooking a better editor, cleaner publishing
                            flow, and a smoother builder experience.
                        </p>
                    </div>

                    {/* STATUS STRIP */}
                    <div
                        className="
                            mt-8
                            rounded-3xl
                            border
                            border-white/10
                            bg-white/3
                            p-5
                        "
                    >
                        <div
                            className="
                                mb-4
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-orange-500/10
                                        text-orange-300
                                    "
                                >
                                    <Clock size={20} />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Upgrade in progress
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        Better tools are being prepared.
                                    </p>
                                </div>
                            </div>

                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-emerald-500/20
                                    bg-emerald-500/10
                                    px-3
                                    py-2
                                    text-xs
                                    font-bold
                                    text-emerald-300
                                    sm:flex
                                "
                            >
                                <Rocket size={14} />
                                Building
                            </div>
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
                                    w-[68%]
                                    animate-pulse
                                    rounded-full
                                    bg-linear-to-r
                                    from-orange-600
                                    via-orange-400
                                    to-yellow-300
                                "
                            />
                        </div>

                        <div
                            className="
                                mt-3
                                flex
                                justify-between
                                text-xs
                                text-zinc-500
                            "
                        >
                            <span>Editor rebuild</span>
                            <span>68%</span>
                        </div>
                    </div>

                    {/* FEEDBACK CTA */}
                    <div
                        className="
                            mt-8
                            rounded-3xl
                            border
                            border-orange-500/20
                            bg-orange-500/6
                            p-5
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <div>
                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-bold
                                        text-orange-300
                                    "
                                >
                                    <MessageSquareText size={17} />
                                    Have an idea?
                                </div>

                                <p
                                    className="
                                        max-w-xl
                                        text-sm
                                        leading-6
                                        text-zinc-400
                                    "
                                >
                                    Want a feature, better post flow, or found
                                    something annoying? Drop feedback and help
                                    shape this thing properly.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/settings/feedback"
                                    )
                                }
                                className="
                                    group
                                    flex
                                    shrink-0
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    bg-orange-500
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-black
                                    transition-all
                                    hover:scale-[1.03]
                                    hover:bg-orange-400
                                    active:scale-[0.98]
                                "
                            >
                                Give Feedback

                                <MessageSquareText
                                    size={16}
                                    className="
                                        transition-transform
                                        group-hover:rotate-6
                                    "
                                />
                            </button>
                        </div>
                    </div>

                    {/* SMALL FOOTER */}
                    <p
                        className="
                            mt-6
                            text-center
                            text-xs
                            text-zinc-600
                        "
                    >
                        DevManiac is upgrading the forge. Real builders wait
                        for sharp tools — not broken buttons. ⚒️
                    </p>
                </div>
            </section>
        </main>
    )
}