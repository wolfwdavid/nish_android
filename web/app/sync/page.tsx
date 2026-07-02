"use client"

import { useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import gsap from "gsap"

import api from "@/app/lib/api"

export default function SyncUserPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    const [error, setError] = useState("")

    const containerRef = useRef<HTMLDivElement>(null)
    const orbRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    const loadingTexts = [
        "Syncing identity...",
        "Preparing your workspace...",
        "Loading your universe...",
        "Connecting neural systems...",
        "Almost there..."
    ]

    const [currentText, setCurrentText] = useState(0)

    useEffect(() => {

        const tl = gsap.timeline()

        tl.fromTo(
            containerRef.current,
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: 1
            }
        )

        tl.fromTo(
            orbRef.current,
            {
                scale: 0.6,
                opacity: 0
            },
            {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out"
            },
            "-=0.5"
        )

        gsap.to(orbRef.current, {
            rotate: 360,
            duration: 10,
            repeat: -1,
            ease: "linear"
        })

        gsap.to(orbRef.current, {
            y: -12,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

    }, [])

    useEffect(() => {

        const interval = setInterval(() => {
            setCurrentText((prev) => (prev + 1) % loadingTexts.length)
        }, 2200)

        return () => clearInterval(interval)

    }, [])

    useEffect(() => {

        const syncUser = async () => {

            if (!isLoaded || !user) return

            try {

                setError("")

                const response = await api.post(
                    "/sync_user",
                    {
                        clerk_user_id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        display_name: user.fullName,
                        avatar_url: user.imageUrl
                    }
                )

                const backendUser = response.data

                await new Promise((resolve) =>
                    setTimeout(resolve, 2500)
                )

                if (!backendUser.onboarding_completed) {
                    router.push("/onboarding")
                } else if (backendUser.username){
                    router.push(`/u/${backendUser.username}`)
                } else {
                    router.push("/onboarding")
                }

            } catch (err) {

                console.error(err)
                setError("User syncing failed")

            }

        }

        syncUser()

    }, [isLoaded, user, router])

    return (
        <div
            ref={containerRef}
            className="
                min-h-screen
                bg-black
                text-white
                flex
                items-center
                justify-center
                overflow-hidden
                relative
            "
        >

            {/* Background Glow */}

            <div
                className="
                    absolute
                    w-175
                    h-175
                    rounded-full
                    bg-orange-500/10
                    blur-3xl
                "
            />

            {/* Grid */}

            <div
                className="
                    absolute
                    inset-0
                    bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
                    bg-size-[40px_40px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    items-center
                    gap-10
                "
            >

                {/* Orb */}

                <div
                    ref={orbRef}
                    className="
                        relative
                        w-40
                        h-40
                        rounded-full
                        border
                        border-orange-400/30
                        flex
                        items-center
                        justify-center
                        shadow-[0_0_80px_rgba(249,115,22,0.35)]
                    "
                >

                    <div
                        className="
                            absolute
                            inset-4
                            rounded-full
                            border
                            border-orange-300/20
                        "
                    />

                    <div
                        className="
                            absolute
                            inset-0
                            rounded-full
                            animate-ping
                            bg-orange-400/10
                        "
                    />

                    <div
                        className="
                            w-16
                            h-16
                            rounded-full
                            bg-linear-to-br
                            from-orange-300
                            to-orange-600
                        "
                    />

                </div>

                {/* Text */}

                <div
                    ref={textRef}
                    className="text-center"
                >

                    <h1
                        className="
                            text-4xl
                            md:text-5xl
                            font-bold
                            tracking-tight
                            bg-linear-to-r
                            from-white
                            via-orange-200
                            to-orange-500
                            bg-clip-text
                            text-transparent
                        "
                    >
                        DevManiac
                    </h1>

                    <p
                        className="
                            mt-5
                            text-zinc-400
                            text-lg
                            tracking-wide
                            min-h-7
                        "
                    >
                        {loadingTexts[currentText]}
                    </p>

                    {error && (
                        <p
                            className="
                                mt-4
                                text-red-400
                            "
                        >
                            {error}
                        </p>
                    )}

                </div>

            </div>

        </div>
    )
}