import { Suspense } from "react"

import SearchClient from "./SearchClient"



function SearchFallback() {

    return (
        <main
            className="
                min-h-screen
                bg-black
                px-4
                py-6
                text-white
                sm:px-6
                lg:px-8
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-3xl
                    flex-col
                    gap-6
                "
            >
                <div
                    className="
                        h-12
                        w-32
                        animate-pulse
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                    "
                />

                <section
                    className="
                        rounded-4xl
                        border
                        border-white/10
                        bg-[#090909]
                        p-6
                    "
                >
                    <div
                        className="
                            h-10
                            w-52
                            animate-pulse
                            rounded-xl
                            bg-white/10
                        "
                    />

                    <div
                        className="
                            mt-6
                            h-12
                            animate-pulse
                            rounded-2xl
                            bg-white/5
                        "
                    />
                </section>

                <div
                    className="
                        h-28
                        animate-pulse
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                    "
                />
            </div>
        </main>
    )

}



export default function SearchPage() {

    return (
        <Suspense fallback={<SearchFallback />}>
            <SearchClient />
        </Suspense>
    )

}