"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { useUser } from "@clerk/nextjs"

import api from "@/app/lib/api"
import CreateLiveProjectHeader from "../components/live-project/create/CreateLiveProjectHeader"
import CreateLiveProjectBasicInfo from "../components/live-project/create/CreateLiveProjectBasicInfo"
import CreateLiveProjectCategory from "../components/live-project/create/CreateLiveProjectCategory"
import CreateLiveProjectTechStack from "../components/live-project/create/CreateLiveProjectTechStack"
import CreateLiveProjectRepository from "../components/live-project/create/CreateLiveProjectTechStack"
import CreateLiveProjectAdvanced from "../components/live-project/create/CreateLiveProjectAdvanced"
import CreateLiveProjectVisibility from "../components/live-project/create/CreateLiveProjectVisibility"
import CreateLiveProjectActions from "../components/live-project/CreateLiveProjectAction"
import CreateLiveProjectPreview from "../components/live-project/create/CreateLiveProjectPreview"




export default function CreateLiveProjectPage() {

    const router = useRouter()

    const { user } = useUser()



    const [step, setStep] = useState(1)



    const [title, setTitle] = useState("")

    const [goal, setGoal] = useState("")



    const [category, setCategory] =
        useState("")



    const [githubUrl, setGithubUrl] =
        useState("")



    const [techStack, setTechStack] =
        useState<string[]>([])



    const [showAdvanced, setShowAdvanced] =
        useState(false)

    const [liveUrl, setLiveUrl] =
        useState("")

    const [demoVideoUrl, setDemoVideoUrl] =
        useState("")

    const [thumbnailUrl, setThumbnailUrl] =
        useState("")



    const [isPublic, setIsPublic] =
        useState(true)



    const [submitting, setSubmitting] =
        useState(false)

    const [error, setError] =
        useState("")



    const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")



    const handleSubmit = async () => {

        if (!user?.id) {

            setError("You must be signed in to create a live project.")

            return

        }

        if (!title.trim()) {

            setError("Project title is required.")

            return

        }

        if (!goal.trim()) {

            setError("Project goal is required.")

            return

        }

        try {

            setSubmitting(true)

            setError("")

            const response = await api.post(
                "/live-projects",
                {
                    title: title.trim(),

                    slug: generatedSlug,

                    goal: goal.trim(),

                    category: category || null,

                    github_url: githubUrl || null,

                    tech_stack: techStack,

                    live_url: liveUrl || null,

                    demo_video_url: demoVideoUrl || null,

                    thumbnail_url: thumbnailUrl || null,

                    is_public: isPublic,
                },
                {
                    params: {
                        clerk_user_id: user.id,
                    },
                }
            )

            router.push(
                `/live_project/${response.data.slug}`
            )

        } catch (err: any) {

            console.error(err)

            setError(
                err?.response?.data?.detail ||
                "Failed to create project"
            )

        } finally {

            setSubmitting(false)

        }

    }



    return (

        <main className="min-h-screen bg-black text-white">

            <div className="mx-auto max-w-7xl px-4 py-8">

                <CreateLiveProjectHeader />



                <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]">

                    {/* LEFT */}

                    <div>

                        {/* STEP INDICATOR */}

                        <div className="mb-8 flex items-center gap-3">

                            {
                                [1, 2, 3, 4].map((item) => (

                                    <div
                                        key={item}
                                        className={`
                                            h-2 flex-1 rounded-full transition-all
                                            ${
                                                step >= item
                                                    ? "bg-orange-500"
                                                    : "bg-zinc-800"
                                            }
                                        `}
                                    />

                                ))
                            }

                        </div>



                        {/* STEP 1 */}

                        {
                            step === 1 && (

                                <div className="rounded-4xl border border-zinc-800 bg-[#0d0d11] p-7">

                                    <div className="mb-8">

                                        <p className="text-sm font-medium text-orange-400">

                                            Step 1

                                        </p>

                                        <h1 className="mt-2 text-3xl font-bold">

                                            What are you building?

                                        </h1>

                                    </div>



                                    <CreateLiveProjectBasicInfo
                                        title={title}
                                        setTitle={setTitle}
                                        goal={goal}
                                        setGoal={setGoal}
                                        generatedSlug={generatedSlug}
                                    />



                                    <div className="mt-10 flex justify-end">

                                        <button
                                            onClick={() => setStep(2)}
                                            className="rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
                                        >

                                            Continue →

                                        </button>

                                    </div>

                                </div>

                            )
                        }



                        {/* STEP 2 */}

                        {
                            step === 2 && (

                                <div className="rounded-4xl border border-zinc-800 bg-[#0d0d11] p-7">

                                    <div className="mb-8">

                                        <p className="text-sm font-medium text-orange-400">

                                            Step 2

                                        </p>

                                        <h1 className="mt-2 text-3xl font-bold">

                                            Choose your stack

                                        </h1>

                                    </div>



                                    <CreateLiveProjectCategory
                                        category={category}
                                        setCategory={setCategory}
                                    />



                                    <div className="mt-10">

                                        {/* <CreateLiveProjectTechStack
                                            techStack={techStack}
                                            setTechStack={setTechStack}
                                        /> */}

                                    </div>



                                    <div className="mt-10 flex items-center justify-between">

                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-zinc-500 transition hover:text-white"
                                        >

                                            ← Back

                                        </button>

                                        <button
                                            onClick={() => setStep(3)}
                                            className="rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
                                        >

                                            Continue →

                                        </button>

                                    </div>

                                </div>

                            )
                        }



                        {/* STEP 3 */}

                        {
                            step === 3 && (

                                <div className="rounded-4xl border border-zinc-800 bg-[#0d0d11] p-7">

                                    <div className="mb-8">

                                        <p className="text-sm font-medium text-orange-400">

                                            Step 3

                                        </p>

                                        <h1 className="mt-2 text-3xl font-bold">

                                            Connect repository

                                        </h1>

                                    </div>



                                    <CreateLiveProjectRepository
                                        githubUrl={githubUrl}
                                        setGithubUrl={setGithubUrl}
                                    />



                                    <div className="mt-10">

                                        <CreateLiveProjectAdvanced

                                            showAdvanced={showAdvanced}
                                            setShowAdvanced={setShowAdvanced}

                                            githubUrl={githubUrl}
                                            setGithubUrl={setGithubUrl}

                                            liveUrl={liveUrl}
                                            setLiveUrl={setLiveUrl}

                                            demoVideoUrl={demoVideoUrl}
                                            setDemoVideoUrl={setDemoVideoUrl}

                                            thumbnailUrl={thumbnailUrl}
                                            setThumbnailUrl={setThumbnailUrl}

                                        />

                                    </div>



                                    <div className="mt-10 flex items-center justify-between">

                                        <button
                                            onClick={() => setStep(2)}
                                            className="text-zinc-500 transition hover:text-white"
                                        >

                                            ← Back

                                        </button>

                                        <button
                                            onClick={() => setStep(4)}
                                            className="rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
                                        >

                                            Continue →

                                        </button>

                                    </div>

                                </div>

                            )
                        }



                        {/* STEP 4 */}

                        {
                            step === 4 && (

                                <div className="rounded-4xl border border-zinc-800 bg-[#0d0d11] p-7">

                                    <div className="mb-8">

                                        <p className="text-sm font-medium text-orange-400">

                                            Final Step

                                        </p>

                                        <h1 className="mt-2 text-3xl font-bold">

                                            Launch your journey

                                        </h1>

                                    </div>



                                    <CreateLiveProjectVisibility
                                        isPublic={isPublic}
                                        setIsPublic={setIsPublic}
                                    />



                                    {
                                        error && (

                                            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">

                                                {error}

                                            </div>

                                        )
                                    }



                                    <div className="mt-10">

                                        <CreateLiveProjectActions
                                            handleSubmit={handleSubmit}
                                            submitting={submitting}
                                        />

                                    </div>



                                    <div className="mt-6">

                                        <button
                                            onClick={() => setStep(3)}
                                            className="text-zinc-500 transition hover:text-white"
                                        >

                                            ← Back

                                        </button>

                                    </div>

                                </div>

                            )
                        }

                    </div>



                    {/* RIGHT */}

                    <div className="sticky top-6 h-fit">

                        <CreateLiveProjectPreview
                            title={title}
                            goal={goal}
                            techStack={techStack}
                            isPublic={isPublic}
                        />

                    </div>

                </div>

            </div>

        </main>

    )

}