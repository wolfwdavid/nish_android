"use client"

import {
    Share2,
    Copy,
    Check,
} from "lucide-react"

import Image from "next/image"

import { useState } from "react"



export default function ShareProject({
    slug,
}: {
    slug: string
}) {

    const [open, setOpen] =
        useState(false)

    const [copied, setCopied] =
        useState(false)



    const projectUrl =
        `${window.location.origin}/project/${slug}`



    const copyLink = async () => {

        await navigator.clipboard.writeText(
            projectUrl
        )

        setCopied(true)

        setTimeout(() => {

            setCopied(false)

        }, 2000)
    }



    const shareLinks = [

        {
            name: "WhatsApp",
            icon: "/whatsapp.svg",
            href:
                `https://wa.me/?text=${encodeURIComponent(projectUrl)}`,
        },

        {
            name: "Discord",
            icon: "/discord.svg",
            href:
                `https://discord.com/channels/@me`,
        },

        {
            name: "Instagram",
            icon: "/instagram-svg.svg",
            href:
                `https://www.instagram.com/`,
        },

        {
            name: "Reddit",
            icon: "/reddit.svg",
            href:
                `https://www.reddit.com/submit?url=${encodeURIComponent(projectUrl)}`,
        },

        {
            name: "Facebook",
            icon: "/facebook.svg",
            href:
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`,
        },

        {
            name: "Twitter",
            icon: "/twitter.svg",
            href:
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(projectUrl)}`,
        },

        {
            name: "LinkedIn",
            icon: "/linkedin-svg.svg",
            href:
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`,
        },

        {
            name: "Telegram",
            icon: "/telegram.svg",
            href:
                `https://t.me/share/url?url=${encodeURIComponent(projectUrl)}`,
        },
    ]



    return (

        <>

            {/* SHARE BUTTON */}

            <button

                onClick={() => setOpen(true)}

                className="
                    p-2
                    rounded-full
                    text-zinc-200
                    hover:bg-zinc-900
                    hover:text-zinc-400
                    transition
                "
            >

                <Share2
                    size={26}
                    strokeWidth={2}
                />

            </button>



            {/* MODAL */}

            {
                open && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50

                            flex
                            items-center
                            justify-center

                            bg-black/70
                            backdrop-blur-sm

                            p-4
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-lg

                                rounded-3xl

                                border
                                border-zinc-800

                                bg-zinc-950

                                p-6
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between

                                    mb-6
                                "
                            >

                                <h2
                                    className="
                                        text-xl
                                        font-semibold
                                        text-white
                                    "
                                >
                                    Share Project
                                </h2>

                                <button

                                    onClick={() =>
                                        setOpen(false)
                                    }

                                    className="
                                        text-zinc-400
                                        hover:text-white
                                        transition
                                    "
                                >
                                    ✕
                                </button>

                            </div>



                            {/* COPY LINK */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2

                                    bg-zinc-900

                                    border
                                    border-zinc-800

                                    rounded-2xl

                                    p-3
                                "
                            >

                                <input
                                    value={projectUrl}
                                    readOnly

                                    className="
                                        flex-1
                                        bg-transparent
                                        text-zinc-300
                                        text-sm
                                        outline-none
                                    "
                                />

                                <button

                                    onClick={copyLink}

                                    className="
                                        flex
                                        items-center
                                        gap-2

                                        px-3
                                        py-2

                                        rounded-xl

                                        bg-zinc-800
                                        hover:bg-zinc-700

                                        transition
                                    "
                                >

                                    {
                                        copied
                                            ? (
                                                <Check
                                                    size={18}
                                                />
                                            )
                                            : (
                                                <Copy
                                                    size={18}
                                                />
                                            )
                                    }

                                </button>

                            </div>



                            {/* SHARE OPTIONS */}

                            <div
                                className="
                                    grid
                                    grid-cols-4

                                    gap-4

                                    mt-6
                                "
                            >

                                {
                                    shareLinks.map((item) => (

                                        <a
                                            key={item.name}

                                            href={item.href}

                                            target="_blank"

                                            className="
                                                flex
                                                flex-col
                                                items-center
                                                gap-2

                                                rounded-2xl

                                                bg-zinc-900
                                                hover:bg-zinc-800

                                                p-4

                                                transition
                                            "
                                        >

                                            <Image
                                                src={item.icon}
                                                alt={item.name}
                                                width={28}
                                                height={28}
                                            />

                                            <span
                                                className="
                                                    text-xs
                                                    text-zinc-300
                                                    text-center
                                                "
                                            >
                                                {item.name}
                                            </span>

                                        </a>
                                    ))
                                }

                            </div>

                        </div>

                    </div>
                )
            }

        </>
    )
}