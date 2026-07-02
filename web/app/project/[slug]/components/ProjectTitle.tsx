"use client"

export default function ProjectTitle({
    title,
}: {
    title: string
}) {

    return (

        <div
            className="
                fade-up

                relative
            "
        >

            {/* subtle glow */}

            <div
                className="
                    absolute
                    -left-8
                    top-1/2

                    h-32
                    w-32

                    -translate-y-1/2

                    rounded-full

                    bg-orange-500/10

                    blur-3xl
                "
            />



            <h1
                className="
                    relative

                    max-w-5xl

                    text-4xl
                    font-black

                    leading-[0.95]

                    tracking-[-0.04em]

                    text-white

                    sm:text-5xl

                    lg:text-6xl

                    xl:text-7xl
                "
            >

                <span
                    className="
                        gradient-text
                    "
                >
                    {title}
                </span>

            </h1>



            {/* subtle bottom line */}

            <div
                className="
                    mt-6

                    h-px
                    w-24

                    bg-linear-to-r
                    from-orange-500/70
                    to-transparent
                "
            />

        </div>
    )
}