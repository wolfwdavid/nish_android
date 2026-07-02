type Props = {

    handleSubmit: () => void

    submitting: boolean

    saveDraft?: () => void

}

export default function CreateLiveProjectActions({

    handleSubmit,

    submitting,

    saveDraft,

}: Props) {

    return (

        <div className="border-t border-zinc-800 bg-[#0b0b0d] p-5">

            <div className="flex flex-col gap-3 sm:flex-row">

                {/* SAVE DRAFT */}

                <button
                    onClick={saveDraft}
                    disabled={submitting}
                    className="group flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-base font-semibold text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <div className="flex items-center justify-center gap-2">

                        <span className="transition group-hover:-translate-y-0.5">
                            Save as draft
                        </span>

                    </div>

                </button>


                {/* CREATE */}

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="group flex-1 overflow-hidden rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <div className="flex items-center justify-center gap-2">

                        <span className="transition group-hover:-translate-y-0.5">

                            {submitting
                                ? "Launching..."
                                : "Launch build journey"}

                        </span>

                        <span className="transition group-hover:translate-x-1">

                            →

                        </span>

                    </div>

                </button>

            </div>

        </div>

    )

}