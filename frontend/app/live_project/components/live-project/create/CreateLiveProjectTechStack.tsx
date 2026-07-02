type Props = {

    githubUrl: string
    setGithubUrl: (value: string) => void

}

export default function CreateLiveProjectRepository({

    githubUrl,
    setGithubUrl,

}: Props) {

    return (

        <div>

            <div className="mb-5 flex items-center justify-between">

                <h2 className="text-xl font-bold">
                    Repository
                </h2>

                <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">

                    Required

                </span>

            </div>


            <div className="rounded-4xl border border-zinc-800 bg-zinc-950 p-6">

                <input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-lg outline-none transition focus:border-orange-500"
                />


                <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-zinc-400">

                        <div className="h-2 w-2 rounded-full bg-orange-400" />

                        Auto-detect tech stack

                    </div>

                    <div className="flex items-center gap-3 text-sm text-zinc-400">

                        <div className="h-2 w-2 rounded-full bg-orange-400" />

                        Sync repository metadata

                    </div>

                    <div className="flex items-center gap-3 text-sm text-zinc-400">

                        <div className="h-2 w-2 rounded-full bg-orange-400" />

                        Future commit analytics & activity tracking

                    </div>

                </div>

            </div>

        </div>

    )

}