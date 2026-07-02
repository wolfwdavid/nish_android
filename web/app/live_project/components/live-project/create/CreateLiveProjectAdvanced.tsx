type Props = {

    showAdvanced: boolean
    setShowAdvanced: (value: boolean) => void

    githubUrl: string
    setGithubUrl: (value: string) => void

    liveUrl: string
    setLiveUrl: (value: string) => void

    demoVideoUrl: string
    setDemoVideoUrl: (value: string) => void

    thumbnailUrl: string
    setThumbnailUrl: (value: string) => void

}

export default function CreateLiveProjectAdvanced({

    showAdvanced,
    setShowAdvanced,

    githubUrl,
    setGithubUrl,

    liveUrl,
    setLiveUrl,

    demoVideoUrl,
    setDemoVideoUrl,

    thumbnailUrl,
    setThumbnailUrl,

}: Props) {

    return (

        <div>

            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-700 px-5 py-4 text-left text-xl"
            >

                <span>
                    Add details
                    <span className="ml-2 text-zinc-500">
                        — optional
                    </span>
                </span>

                <span>
                    {showAdvanced ? "−" : "+"}
                </span>

            </button>


            {showAdvanced && (

                <div className="mt-6 space-y-5">

                    <input
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="GitHub URL"
                        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-lg outline-none"
                    />

                    <input
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="Live URL"
                        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-lg outline-none"
                    />

                    <input
                        value={demoVideoUrl}
                        onChange={(e) => setDemoVideoUrl(e.target.value)}
                        placeholder="Demo Video URL"
                        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-lg outline-none"
                    />

                    <input
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder="Thumbnail URL"
                        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-lg outline-none"
                    />

                </div>

            )}

        </div>

    )

}