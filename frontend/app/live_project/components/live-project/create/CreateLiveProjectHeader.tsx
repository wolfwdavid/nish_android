"use client"

import { ArrowLeft, X } from "lucide-react"

import { useRouter } from "next/navigation"
import useCurrentUser from "@/app/lib/currentUser"



export default function CreateLiveProjectHeader() {

    const router = useRouter()
    const { error , loading , currentUser } = useCurrentUser();

    return (

        <div className="border-b border-zinc-800 bg-[#0a0a0a] px-5 py-4">

            <div className="flex items-center justify-between">

                {/* LEFT */}

                <button
                    onClick={() => router.push(`/u/${currentUser?.username}/live_projects`)}
                    className="text-zinc-400 transition hover:text-white"
                >

                    <ArrowLeft className="h-6 w-6" />

                </button>


                {/* CENTER */}

                <h1 className="text-xl font-semibold tracking-tight text-white">

                    New live project

                </h1>


                {/* RIGHT */}

                <button
                    onClick={() => router.back()}
                    className="text-zinc-400 transition hover:text-white"
                >

                    <X className="h-6 w-6" />

                </button>

            </div>

        </div>

    )

}