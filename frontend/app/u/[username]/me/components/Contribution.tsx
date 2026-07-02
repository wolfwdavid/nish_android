"use client"

export default function ContributionPreview() {
    return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-lg font-semibold text-zinc-100">
                        Contribution Graph
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        GitHub-style activity heatmap
                    </p>
                </div>

                <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
                    247 contributions
                </div>

            </div>

            <div className="mt-8 grid grid-cols-14 gap-2">

                {
                    Array.from({ length: 98 }).map((_, index) => (
                        <div
                            key={index}
                            className={`
                                aspect-square rounded-md
                                ${
                                    index % 5 === 0
                                        ? "bg-orange-500"
                                        : index % 3 === 0
                                        ? "bg-orange-500/60"
                                        : "bg-zinc-800"
                                }
                            `}
                        />
                    ))
                }

            </div>

        </div>
    )
}