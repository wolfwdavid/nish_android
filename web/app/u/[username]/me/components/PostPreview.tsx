"use client"

export default function PostsPreview() {
    return (
        <div className="space-y-4">

            {
                Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5"
                    >

                        <div className="flex items-center gap-3">

                            <div className="h-12 w-12 rounded-full bg-zinc-800 animate-pulse" />

                            <div>

                                <div className="h-4 w-32 rounded bg-zinc-800 animate-pulse" />

                                <div className="mt-2 h-3 w-20 rounded bg-zinc-800 animate-pulse" />

                            </div>

                        </div>

                        <div className="mt-5 h-4 w-full rounded bg-zinc-800 animate-pulse" />

                        <div className="mt-2 h-4 w-5/6 rounded bg-zinc-800 animate-pulse" />

                        <div className="mt-2 h-4 w-2/3 rounded bg-zinc-800 animate-pulse" />

                    </div>
                ))
            }

        </div>
    )
}