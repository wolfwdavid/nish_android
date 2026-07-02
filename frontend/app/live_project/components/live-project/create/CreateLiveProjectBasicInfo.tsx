type Props = {

    title: string
    setTitle: (value: string) => void

    goal: string
    setGoal: (value: string) => void

    generatedSlug : string

}

export default function CreateLiveProjectBasicInfo({

    title,
    setTitle,

    goal,
    setGoal,

    generatedSlug,

}: Props) {


    return (

        <div className="space-y-8">

            <div>

                <label className="mb-3 block text-lg font-semibold">
                    Title
                </label>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. DevManiac"
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-xl outline-none transition focus:border-orange-500"
                />

                <p className="mt-3 text-lg text-zinc-500">

                    DevManiac.dev/@nish/

                    <span className="ml-2 font-bold text-orange-400">

                        {generatedSlug}

                    </span>

                </p>

            </div>


            <div>

                <div className="mb-3 flex items-center justify-between">

                    <label className="text-lg font-semibold">
                        What are you building, and why?
                    </label>

                    <span className="text-sm text-zinc-500">
                        {goal.length}/160
                    </span>

                </div>

                <textarea
                    value={goal}
                    maxLength={160}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="A dev social platform where your build history becomes your portfolio."
                    rows={4}
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-2xl leading-relaxed outline-none transition focus:border-orange-500"
                />

                <p className="mt-3 text-lg text-zinc-500">
                    This becomes the public headline of your build.
                </p>

            </div>

        </div>

    )

}