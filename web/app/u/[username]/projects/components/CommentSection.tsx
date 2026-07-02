"use client"

import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddComment({
    slug,
}: {
    slug: string
}) {

    const router = useRouter()

    return (

        <button

            onClick={() =>
                router.push(`/project/${slug}`)
            }

            className="
                p-2
                rounded-full
                text-zinc-200
                hover:bg-zinc-900
                hover:text-zinc-400
                transition
            "
        >

            <MessageCircle
                size={26}
                strokeWidth={2}
            />

        </button>
    )
}