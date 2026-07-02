type Props = {
    isPublic: boolean
    setIsPublic: (value: boolean) => void
}

export default function CreateLiveProjectVisibility({
    isPublic,
    setIsPublic,
}: Props) {

    return (

        <div>

            <h2 className="mb-5 text-xl font-bold">
                Visibility
            </h2>

            <div className="flex items-center justify-between rounded-4xl border border-zinc-800 bg-zinc-950 p-6">

                <div className="max-w-xl">

                    <h3 className="mb-2 text-2xl font-bold">
                        Build in public
                    </h3>

                    <p className="text-lg leading-relaxed text-zinc-400">
                        Your journal and progress appear on your profile.
                        This is how DevManiac turns your work into a portfolio.
                    </p>

                </div>

                <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative h-12 w-24 rounded-full transition ${
                        isPublic
                            ? "bg-orange-500"
                            : "bg-zinc-700"
                    }`}
                >

                    <div
                        className={`absolute top-1 h-10 w-10 rounded-full bg-white transition ${
                            isPublic
                                ? "left-12"
                                : "left-1"
                        }`}
                    />

                </button>

            </div>

        </div>

    )

}