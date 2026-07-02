'use client'

import {
    ArrowRight,
    AtSign,
    User2,
    Sparkles,
} from 'lucide-react'


interface IdentityStepProps {
    username: string
    setUsername: React.Dispatch<React.SetStateAction<string>>

    displayName: string
    setDisplayName: React.Dispatch<React.SetStateAction<string>>

    bio: string
    setBio: React.Dispatch<React.SetStateAction<string>>

    currentBuild: string
    setCurrentBuild: React.Dispatch<React.SetStateAction<string>>

    onContinue: () => void
}

export default function IdentityStep({
    username,
    setUsername,

    displayName,
    setDisplayName,

    bio,
    setBio,

    currentBuild,
    setCurrentBuild,

    onContinue,
}: IdentityStepProps) {

    return (

        <div className="space-y-8">

            {/* HERO */}

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
                    Identity Layer
                </div>


                <h2
                    className="
                        mt-6
                        text-4xl
                        font-black
                        tracking-[-0.06em]
                        leading-tight
                    "
                >
                    Create your
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
                        developer presence.
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
                    This is how developers will
                    recognize you across DevManiac.
                    Keep it clean, memorable,
                    and authentic.
                </p>

            </div>


            {/* LIVE PREVIEW */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-4xl
                    border
                    border-white/10
                    bg-white/3
                    p-6
                    backdrop-blur-2xl
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-linear-to-br
                        from-red-500/10
                        via-orange-500/5
                        to-transparent
                    "
                />


                <div className="relative">

                    <div className="flex items-start gap-5">

                        {/* AVATAR */}

                        <div
                            className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                bg-linear-to-br
                                from-red-500
                                to-orange-500
                                shadow-[0_0_40px_rgba(249,115,22,0.25)]
                            "
                        >
                            <User2 size={28} />
                        </div>


                        {/* INFO */}

                        <div className="flex-1">

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                "
                            >

                                <h3
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-[-0.04em]
                                    "
                                >
                                    {
                                        displayName ||
                                        'Display Name'
                                    }
                                </h3>


                                <div
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
                                    "
                                >
                                    Builder
                                </div>

                            </div>


                            <p
                                className="
                                    mt-2
                                    font-mono
                                    text-sm
                                    text-orange-400
                                "
                            >
                                @
                                {
                                    username ||
                                    'username'
                                }
                            </p>


                            <p
                                className="
                                    mt-4
                                    max-w-lg
                                    text-sm
                                    leading-7
                                    text-zinc-400
                                "
                            >
                                {
                                    bio ||
                                    'Your bio preview will appear here.'
                                }
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* FORM */}

            <div className="space-y-6">

                {/* USERNAME */}

                <div>

                    <label
                        className="
                            mb-3
                            block
                            text-sm
                            font-medium
                            text-zinc-300
                        "
                    >
                        Username
                    </label>


                    <div className="relative">

                        <AtSign
                            className="
                                absolute
                                left-5
                                top-1/2
                                -translate-y-1/2
                                text-zinc-500
                            "
                            size={18}
                        />


                        <input
                            type="text"
                            placeholder="nishcodes"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                        .toLowerCase()
                                        .replace(/\s+/g, '')
                                )
                            }
                            className="
                                h-16
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                pl-14
                                pr-5
                                text-lg
                                text-white
                                outline-none
                                transition-all
                                placeholder:text-zinc-500
                                focus:border-orange-500/40
                                focus:bg-white/8
                                focus:ring-4
                                focus:ring-orange-500/10
                            "
                        />

                    </div>


                    <p
                        className="
                            mt-3
                            text-sm
                            text-zinc-500
                        "
                    >
                        Your public developer handle.
                    </p>

                </div>


                {/* DISPLAY NAME */}

                <div>

                    <label
                        className="
                            mb-3
                            block
                            text-sm
                            font-medium
                            text-zinc-300
                        "
                    >
                        Display Name
                    </label>


                    <div className="relative">

                        <User2
                            className="
                                absolute
                                left-5
                                top-1/2
                                -translate-y-1/2
                                text-zinc-500
                            "
                            size={18}
                        />


                        <input
                            type="text"
                            placeholder="Nishchup"
                            value={displayName}
                            onChange={(e) =>
                                setDisplayName(e.target.value)
                            }
                            className="
                                h-16
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                pl-14
                                pr-5
                                text-lg
                                text-white
                                outline-none
                                transition-all
                                placeholder:text-zinc-500
                                focus:border-orange-500/40
                                focus:bg-white/8
                                focus:ring-4
                                focus:ring-orange-500/10
                            "
                        />

                    </div>

                </div>


                {/* BIO */}

                <div>

                    <label
                        className="
                            mb-3
                            block
                            text-sm
                            font-medium
                            text-zinc-300
                        "
                    >
                        Bio
                    </label>


                    <textarea
                        placeholder="Building the future with AI, software, and caffeine."
                        value={bio}
                        onChange={(e) =>
                            setBio(e.target.value)
                        }
                        className="
                            min-h-35
                            w-full
                            resize-none
                            rounded-3xl
                            border
                            border-white/10
                            bg-white/5
                            p-6
                            text-base
                            leading-8
                            text-white
                            outline-none
                            transition-all
                            placeholder:text-zinc-500
                            focus:border-orange-500/40
                            focus:bg-white/8
                            focus:ring-4
                            focus:ring-orange-500/10
                        "
                    />


                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            justify-between
                            text-sm
                        "
                    >

                        <p className="text-zinc-500">
                            Optional for now.
                        </p>

                        <p className="text-zinc-600">
                            {bio.length}/280
                        </p>

                    </div>

                </div>

            </div>


            {/* CURRENT BUILD */}
            
            <div>
                <label
                    className="
                        mb-3
                        block
                        text-sm
                        font-medium
                        text-zinc-300
                    "
                >
                    Current Build
                </label>

                <input
                    type="text"
                    placeholder="What are you building right now?"
                    value={currentBuild}
                    onChange={(e) =>
                        setCurrentBuild(e.target.value)
                    }
                    className="
                        h-16
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        px-5
                        text-white
                        outline-none
                        transition-all
                        placeholder:text-zinc-500
                        focus:border-orange-500/40
                        focus:bg-white/8
                        focus:ring-4
                        focus:ring-orange-500/10
                    "
                />
            </div>


            {/* BUTTON */}

            <div className="pt-4">

                <button
                    type="button"
                    onClick={onContinue}
                    className="
                        group
                        relative
                        flex
                        h-16
                        w-full
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
                    "
                >

                    {/* SHINE */}

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


                    Continue

                    <ArrowRight size={20} />

                </button>

            </div>

        </div>

    )
}