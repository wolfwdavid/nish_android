"use client"

import { useEffect, useState } from "react"

import api from "@/app/lib/api"

import ProfileHeader from "../components/ProfileHeader"

import { useUser } from "@clerk/nextjs"
import { useParams } from "next/navigation"

import { UserFullProfile } from "@/app/lib/type/profileAnalytics"

import StacksAnalytics from "./components/StacksAnalytics"
import ProjectsPreview from "./components/ProjectPreview"
import LiveProjectsPreview from "./components/LiveProjectPreview"


export default function Profile() {

    const params = useParams()

    const username = params.username as string

    const [activeTab, setActiveTab] = useState("stacks")

    const [profileData, setProfileData] =
        useState<UserFullProfile | null>(null);

    const [loading, setLoading] = useState(true)

    const { user, isLoaded } = useUser()

    useEffect(() => {

        if (!username) return

        const getProfile = async () => {

            try {

                const response = await api.get(
                    `/projects/${username}/full-profile`
                );

                setProfileData(response.data)

            } catch (err) {

                console.error(err)

            } finally {

                setLoading(false)

            }

        }

        getProfile()

    }, [username])

    if (!username) return null

    if (loading || !isLoaded) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">

                Loading...

            </div>

        )

    }

    if (!profileData) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">

                User not found

            </div>

        )

    }

    return (

        <div className="min-h-screen bg-black text-white">

            <div className="mx-auto w-full max-w-6xl px-4 py-6">

                <ProfileHeader
                    profileData={profileData}
                    isOwner={
                        user?.id === profileData.clerk_user_id
                    }
                />

            </div>

            <div className="mx-auto mt-8 w-full max-w-6xl px-4">

                <div className="border-b border-zinc-800">

                    <div className="flex overflow-x-auto scrollbar-hide">

                        <button
                            onClick={() => setActiveTab("stacks")}
                            className={`
                                relative px-5 py-3 text-sm font-medium transition-all
                                ${
                                    activeTab === "stacks"
                                        ? "text-orange-400"
                                        : "text-zinc-500 hover:text-zinc-200"
                                }
                            `}
                        >

                            Stacks

                            {
                                activeTab === "stacks" && (
                                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.9)]" />
                                )
                            }

                        </button>

                        <button
                            onClick={() => setActiveTab("projects")}
                            className={`
                                relative px-5 py-3 text-sm font-medium transition-all
                                ${
                                    activeTab === "projects"
                                        ? "text-orange-400"
                                        : "text-zinc-500 hover:text-zinc-200"
                                }
                            `}
                        >

                            Projects

                            {
                                activeTab === "projects" && (
                                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.9)]" />
                                )
                            }

                        </button>

                        <button
                            onClick={() => setActiveTab("live")}
                            className={`
                                relative px-5 py-3 text-sm font-medium transition-all
                                ${
                                    activeTab === "live"
                                        ? "text-orange-400"
                                        : "text-zinc-500 hover:text-zinc-200"
                                }
                            `}
                        >

                            Live Projects

                            {
                                activeTab === "live" && (
                                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.9)]" />
                                )
                            }

                        </button>

                    </div>

                </div>

                <div className="mt-6">

                    {
                        activeTab === "stacks" && (
                            <StacksAnalytics profile={profileData} />
                        )
                    }

                    {
                        activeTab === "projects" && (
                            <ProjectsPreview 
                            profile={profileData}
                            />
                        )
                    }

                    {
                        activeTab === "live" && (
                            <LiveProjectsPreview
                                profile={profileData}
                            />
                        )
                    }

                </div>

            </div>

        </div>

    )

}