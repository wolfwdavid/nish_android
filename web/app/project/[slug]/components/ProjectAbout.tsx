"use client"

import { Dispatch, SetStateAction } from "react"



export default function ProjectAbout({
    expanded,
    setExpanded,
    description,
    shortDescription,
}: {
    expanded: boolean

    setExpanded: Dispatch<
        SetStateAction<boolean>
    >

    description: string

    shortDescription: string
}) {

    const shouldShowButton =
        description
            ?.split("\n")
            ?.length > 10



    return (

        <section className="fade-up mt-14">

            <div
                className="
                    mb-6
                    flex
                    items-center
                    justify-between
                "
            >

                <h2
                    className="
                        text-sm
                        uppercase
                        tracking-[0.3em]
                        text-zinc-500
                    "
                >

                    About Project

                </h2>

            </div>



            <div
                className="
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-zinc-900/40
                    p-7
                    backdrop-blur-xl
                "
            >

                <div
                    className="
                        whitespace-pre-line
                        text-[15px]
                        leading-8
                        text-zinc-300
                    "
                >

                    {
                        expanded
                            ? description
                            : shortDescription
                    }

                    {
                        !expanded &&
                        shouldShowButton &&
                        " ..."
                    }

                </div>



                {
                    shouldShowButton && (

                        <button
                            onClick={() =>
                                setExpanded(
                                    !expanded
                                )
                            }
                            className="
                                mt-6
                                text-sm
                                font-medium
                                text-orange-400
                                transition
                                hover:text-orange-300
                            "
                        >

                            {
                                expanded
                                    ? "Show less"
                                    : "Read more"
                            }

                        </button>
                    )
                }

            </div>

        </section>
    )
}