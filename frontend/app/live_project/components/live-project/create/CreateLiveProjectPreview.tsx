type Props = {

    title: string

    goal: string

    techStack: string[]

    isPublic: boolean

}

export default function CreateLiveProjectPreview({
    title,
    goal,
    isPublic,
}: Props) {

    return (

        <div>

            <div className="mb-5 flex items-center justify-between">

                <p className="text-[11px] font-semibold tracking-[0.35em] text-zinc-600">
                    PREVIEW
                </p>

                <div className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-800 to-transparent ml-4" />

            </div>


            <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f0f13] p-7 transition duration-500 hover:border-orange-500/20">

                {/* glow */}

                <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-orange-500/10 via-transparent to-transparent opacity-60" />

                {/* gradient blur */}

                <div className="absolute -top-24 right-[-30%] h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />


                <div className="relative z-10">

                    {/* tags */}

                    <div className="mb-7 flex items-center gap-3">

                        <div className="rounded-full border border-orange-500/10 bg-orange-500/10 px-4 py-2 text-xs font-bold tracking-wide text-orange-300 backdrop-blur-xl">

                            DAY 0

                        </div>

                        <div className={`rounded-full border px-4 py-2 text-xs font-bold tracking-wide backdrop-blur-xl ${
                            isPublic
                                ? "border-emerald-500/10 bg-emerald-500/10 text-emerald-300"
                                : "border-zinc-700 bg-zinc-800/70 text-zinc-400"
                        }`}>

                            {isPublic ? "Public" : "Private"}

                        </div>

                    </div>


                    {/* title */}

                    <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white md:text-5xl">

                        {title || "Your project title"}

                    </h1>


                    {/* divider */}

                    <div className="my-6 h-px w-full bg-linear-to-r from-zinc-700/40 via-zinc-500/10 to-transparent" />


                    {/* goal */}

                    <p className="max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">

                        {goal ||
                            "Your one-line goal will show up here as you write it."}

                    </p>

                </div>

            </div>

        </div>

    )

}