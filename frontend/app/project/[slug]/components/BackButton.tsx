"use client"

import { ArrowLeft } from "lucide-react"

import { useRouter } from "next/navigation"
import useCurrentUser from "@/app/lib/currentUser"



export default function BackButton() {

    const router = useRouter()
    const { currentUser  , loading , error } = useCurrentUser()

    return (

        <button
            onClick={() => router.push(`/u/${currentUser?.username}/projects`)}
            className="
                fade-up
                mb-8
                flex
                items-center
                gap-2
                text-sm
                text-zinc-400
                transition
                hover:text-white
            "
        >

            <ArrowLeft size={18} />

            Back to Explore

        </button>
    )
}