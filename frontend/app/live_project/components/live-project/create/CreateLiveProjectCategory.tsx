const CATEGORIES = [
    "Web app",
    "AI / ML",
    "Dev tool",
    "API",
    "Mobile",
    "Other",
]

type Props = {
    category: string
    setCategory: (value: string) => void
}

export default function CreateLiveProjectCategory({
    category,
    setCategory,
}: Props) {

    return (

        <div>

            <h2 className="mb-5 text-xl font-bold">
                Category
            </h2>

            <div className="flex flex-wrap gap-3">

                {CATEGORIES.map((item) => (

                    <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={`rounded-2xl border px-5 py-3 text-lg transition ${
                            category === item
                                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                                : "border-zinc-700 bg-zinc-900 text-zinc-300"
                        }`}
                    >

                        {item}

                    </button>

                ))}

            </div>

        </div>

    )

}