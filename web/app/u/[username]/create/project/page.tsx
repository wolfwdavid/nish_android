"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import gsap from "gsap"

import {
    Flame,
    ShieldCheck,
    Github,
    Globe,
    Upload,
    Video,
    ImagePlus,
    Loader2,
    X,
} from "lucide-react"

import api from "@/app/lib/api"

import useCurrentUser from "@/app/lib/currentUser"

import { uploadToCloudinary } from "@/app/lib/cloudinary"
import { useRouter } from "next/navigation"



type ProjectData = {

    title: string

    slug: string

    description: string

    github_url: string

    live_url?: string

    thumbnail_url?: string

    demo_video_url?: string

    gallery_urls: string[]
}



export default function CreateProject() {



    const containerRef = useRef<HTMLDivElement>(null)

    const router = useRouter();



    const [error, setError] = useState("")

    const [submitting, setSubmitting] =
        useState(false)

    const [projectType, setProjectType] =
        useState<"live" | "done" | null>(null)



    const [galleryInput, setGalleryInput] =
        useState("")



    const [projectData, setProjectData] =
        useState<ProjectData>({
            title: "",
            slug: "",
            description: "",
            github_url: "",
            gallery_urls: [],
        })



    const {
        currentUser,
        loading,
    } = useCurrentUser()



    useEffect(() => {

        const ctx = gsap.context(() => {

            gsap.from(".hero-fade", {

                opacity: 0,

                y: 40,

                stagger: 0.08,

                duration: 0.7,

                ease: "power3.out",

            })



            gsap.from(".card-fade", {

                opacity: 0,

                y: 60,

                stagger: 0.12,

                duration: 0.8,

                delay: 0.2,

                ease: "power3.out",

            })

        }, containerRef)



        return () => ctx.revert()

    }, [])



    const generatedSlug = useMemo(() => {

        return projectData.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\\s-]/g, "")
            .replace(/\\s+/g, "-")

    }, [projectData.title])



    const handleChange = (
        field: keyof ProjectData,
        value: string
    ) => {

        setProjectData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }



    const handleThumbnailUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0]

        if (!file) return



        try {

            const uploaded =
                await uploadToCloudinary(file)



            setProjectData((prev) => ({
                ...prev,
                thumbnail_url:
                    uploaded.secure_url,
            }))

        } catch (err) {

            console.error(err)
        }
    }



    const handleGalleryZipUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0]

        if (!file) return



        try {

            const uploaded =
                await uploadToCloudinary(file)



            setProjectData((prev) => ({

                ...prev,

                gallery_urls: [
                    ...prev.gallery_urls,
                    uploaded.secure_url,
                ],

            }))

        } catch (err) {

            console.error(err)
        }
    }



    const addGalleryLink = () => {

        if (!galleryInput.trim()) return



        setProjectData((prev) => ({

            ...prev,

            gallery_urls: [
                ...prev.gallery_urls,
                galleryInput.trim(),
            ],

        }))



        setGalleryInput("")
    }



    const removeGalleryItem = (
        index: number
    ) => {

        setProjectData((prev) => ({

            ...prev,

            gallery_urls:
                prev.gallery_urls.filter(
                    (_, i) => i !== index
                ),

        }))
    }



    const handleFinalSubmit = async () => {

        try {

            setSubmitting(true)

            setError("")



            await api.post(

                `/projects/?clerk_user_id=${currentUser?.clerk_user_id}`,

                {

                    title:
                        projectData.title,

                    slug:
                        generatedSlug,

                    description:
                        projectData.description,

                    github_url:
                        projectData.github_url,

                    live_url:
                        projectData.live_url,

                    thumbnail_url:
                        projectData.thumbnail_url,

                    demo_video_url:
                        projectData.demo_video_url,

                    gallery_urls:
                        projectData.gallery_urls,

                }
            )



            /*
                BACKEND ALREADY DOES:

                - github verification
                - github metadata fetch
                - tech stack extraction
                - live url verification
                - slug generation fallback

                inside:

                fetch_github_url()
                verify_live_url()

            */

        } catch (err) {

            console.error(err)

            setError(
                "There was a problem creating project"
            )

        } finally {

            setSubmitting(false)
        }
    }



    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-black text-white">

                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />

            </div>
        )
    }



    return (

        <div
            ref={containerRef}
            className="min-h-screen bg-black text-white"
        >

            <div className="mx-auto flex max-w-450 flex-col gap-8 px-4 py-6 lg:px-8 xl:flex-row">

                {/* LEFT */}

                <div className="w-full xl:w-[65%]">

                    {/* HERO */}

                    <div className="hero-fade mb-10">

                        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-orange-500">

                            create / project

                        </p>

                        <h1 className="max-w-212.5 text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">

                            Build reputation
                            through shipped work.

                        </h1>

                        <p className="mt-6 max-w-175 text-sm leading-8 text-zinc-400 sm:text-base">

                            DevManiac validates repositories,
                            verifies deployments,
                            extracts stack intelligence,
                            and turns projects into proof.

                        </p>

                    </div>



                    {/* TYPE */}

                    <div className="card-fade mb-8 flex flex-col gap-4 md:flex-row">

                        <button
                            onClick={() =>
                                router.push(`/live_project/create`)
                            }
                            className={`flex-1 rounded-3xl border p-6 text-left transition-all duration-300 ${

                                projectType === "live"

                                    ? "border-orange-500 bg-orange-500/10"

                                    : "border-white/10 bg-[#111111] hover:border-white/20"

                                }`}
                        >

                            <div className="mb-5 flex items-center justify-between">

                                <Flame className="h-5 w-5 text-orange-500" />

                                {
                                    projectType === "live" && (
                                        <span className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black">

                                            selected

                                        </span>
                                    )
                                }

                            </div>

                            <h3 className="text-2xl font-semibold">

                                Live Project

                            </h3>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">

                                Build publicly with logs,
                                deployment milestones,
                                and visible progress.

                            </p>

                        </button>



                        <button
                            onClick={() =>
                                setProjectType("done")
                            }
                            className={`flex-1 rounded-3xl border p-6 text-left transition-all duration-300 ${

                                projectType === "done"

                                    ? "border-orange-500 bg-orange-500/10"

                                    : "border-white/10 bg-[#111111] hover:border-white/20"

                                }`}
                        >

                            <div className="mb-5 flex items-center justify-between">

                                <ShieldCheck className="h-5 w-5 text-orange-500" />

                                {
                                    projectType === "done" && (
                                        <span className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black">

                                            selected

                                        </span>
                                    )
                                }

                            </div>

                            <h3 className="text-2xl font-semibold">

                                Done Project

                            </h3>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">

                                Upload already-shipped work
                                with verified repositories.

                            </p>

                        </button>

                    </div>



                    {/* FORM */}

                    <div className="card-fade rounded-4xl border border-white/10 bg-[#0f0f0f] p-5 sm:p-8">

                        <div className="space-y-7">

                            {/* TITLE */}

                            <div>

                                <label className="mb-3 block text-xs uppercase tracking-[0.3em] text-zinc-500">

                                    Project Title

                                </label>

                                <input
                                    type="text"
                                    value={projectData.title}
                                    onChange={(e) =>
                                        handleChange(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="DevManiac"
                                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition-all focus:border-orange-500"
                                />

                            </div>



                            {/* SLUG */}

                            <div>

                                <label className="mb-3 block text-xs uppercase tracking-[0.3em] text-zinc-500">

                                    Generated Slug

                                </label>

                                <div className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-sm text-zinc-500">

                                    /projects/{generatedSlug || "your-project"}

                                </div>

                            </div>



                            {/* DESCRIPTION */}

                            <div>

                                <label className="mb-3 block text-xs uppercase tracking-[0.3em] text-zinc-500">

                                    Description

                                </label>

                                <textarea
                                    rows={7}
                                    value={projectData.description}
                                    onChange={(e) =>
                                        handleChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Explain the project, architecture, purpose, scaling ideas, and engineering decisions."
                                    className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 leading-8 outline-none transition-all focus:border-orange-500"
                                />

                            </div>



                            {/* URL GRID */}

                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                                <div>

                                    <label className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">

                                        <Github className="h-4 w-4" />

                                        GitHub URL

                                    </label>

                                    <input
                                        type="text"
                                        value={projectData.github_url}
                                        onChange={(e) =>
                                            handleChange(
                                                "github_url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://github.com/..."
                                        className="w-full rounded-2xl border border-green-500/30 bg-black px-5 py-4 outline-none transition-all focus:border-orange-500"
                                    />

                                </div>



                                <div>

                                    <label className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">

                                        <Globe className="h-4 w-4" />

                                        Live URL

                                    </label>

                                    <input
                                        type="text"
                                        value={projectData.live_url || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "live_url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://yourapp.com"
                                        className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition-all focus:border-orange-500"
                                    />

                                </div>

                            </div>



                            {/* VIDEO */}

                            <div>

                                <label className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">

                                    <Video className="h-4 w-4" />

                                    Demo Video

                                </label>

                                <input
                                    type="text"
                                    value={projectData.demo_video_url || ""}
                                    onChange={(e) =>
                                        handleChange(
                                            "demo_video_url",
                                            e.target.value
                                        )
                                    }
                                    placeholder="YouTube / Vimeo / Google Drive"
                                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition-all focus:border-orange-500"
                                />

                                <p className="mt-2 text-xs leading-6 text-zinc-500">

                                    Upload your demo to YouTube,
                                    Vimeo, or Google Drive —
                                    then paste the public link.

                                </p>

                            </div>



                            {/* THUMBNAIL */}

                            <div>

                                <label className="mb-4 block text-xs uppercase tracking-[0.3em] text-zinc-500">

                                    Thumbnail

                                </label>

                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                                    {/* CLOUDINARY */}

                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111111] p-10 transition-all hover:border-orange-500">

                                        <Upload className="mb-5 h-10 w-10 text-orange-500" />

                                        <h3 className="text-lg font-semibold">

                                            Upload Image

                                        </h3>

                                        <p className="mt-2 text-center text-sm leading-7 text-zinc-500">

                                            PNG, JPG, WEBP supported.

                                        </p>

                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={
                                                handleThumbnailUpload
                                            }
                                        />

                                    </label>



                                    {/* URL */}

                                    <div className="rounded-3xl border border-white/10 bg-[#111111] p-5">

                                        <div className="mb-5 flex items-center gap-3">

                                            <ImagePlus className="h-5 w-5 text-orange-500" />

                                            <h3 className="font-semibold">

                                                Image URL

                                            </h3>

                                        </div>

                                        <input
                                            type="text"
                                            value={projectData.thumbnail_url || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "thumbnail_url",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="https://image.com/..."
                                            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition-all focus:border-orange-500"
                                        />

                                    </div>

                                </div>

                            </div>



                            {/* GALLERY */}

                            <div>

                                <label className="mb-4 block text-xs uppercase tracking-[0.3em] text-zinc-500">

                                    Gallery Assets

                                </label>

                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                                    {/* ZIP */}

                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111111] p-10 transition-all hover:border-orange-500">

                                        <Upload className="mb-5 h-10 w-10 text-orange-500" />

                                        <h3 className="text-lg font-semibold">

                                            Upload ZIP

                                        </h3>

                                        <p className="mt-2 text-center text-sm leading-7 text-zinc-500">

                                            ZIP only.
                                            Multiple screenshots supported.

                                        </p>

                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".zip"
                                            onChange={
                                                handleGalleryZipUpload
                                            }
                                        />

                                    </label>



                                    {/* URL */}

                                    <div className="rounded-3xl border border-white/10 bg-[#111111] p-5">

                                        <div className="mb-5 flex items-center gap-3">

                                            <ImagePlus className="h-5 w-5 text-orange-500" />

                                            <h3 className="font-semibold">

                                                Add Gallery Link

                                            </h3>

                                        </div>

                                        <div className="flex gap-3">

                                            <input
                                                type="text"
                                                value={galleryInput}
                                                onChange={(e) =>
                                                    setGalleryInput(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Google Drive / ZIP / CDN"
                                                className="flex-1 rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition-all focus:border-orange-500"
                                            />

                                            <button
                                                onClick={
                                                    addGalleryLink
                                                }
                                                className="rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-black transition-all hover:bg-orange-400"
                                            >

                                                Add

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>



                            {/* GALLERY LIST */}

                            {
                                projectData.gallery_urls
                                    .length > 0 && (

                                    <div className="rounded-3xl border border-white/10 bg-[#111111] p-5">

                                        <div className="mb-5 flex items-center justify-between">

                                            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">

                                                Gallery Assets

                                            </h3>

                                            <span className="text-xs text-zinc-500">

                                                {
                                                    projectData.gallery_urls.length
                                                } assets

                                            </span>

                                        </div>

                                        <div className="space-y-3">

                                            {
                                                projectData.gallery_urls.map(
                                                    (
                                                        url,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black px-4 py-3"
                                                        >

                                                            <p className="truncate text-sm text-zinc-300">

                                                                {url}

                                                            </p>

                                                            <button
                                                                onClick={() =>
                                                                    removeGalleryItem(
                                                                        index
                                                                    )
                                                                }
                                                                className="ml-4 rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition-all hover:bg-red-500/20"
                                                            >

                                                                <X className="h-4 w-4" />

                                                            </button>

                                                        </div>
                                                    )
                                                )
                                            }

                                        </div>

                                    </div>
                                )
                            }



                            {/* ERROR */}

                            {
                                error && (

                                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">

                                        {error}

                                    </div>
                                )
                            }



                            {/* ACTION */}

                            <div className="sticky bottom-0 z-50 mt-10 flex flex-col gap-4 border-t border-white/10 bg-[#0f0f0f]/95 pt-6 backdrop-blur-xl sm:flex-row sm:justify-end">

                                <button
                                    onClick={
                                        handleFinalSubmit
                                    }
                                    disabled={
                                        submitting ||
                                        !projectData.title ||
                                        !projectData.github_url
                                    }
                                    className="rounded-2xl bg-orange-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    {
                                        submitting
                                            ? "Creating..."
                                            : projectType === "live"
                                                ? "Start Building"
                                                : "Publish Project"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                </div>



                {/* RIGHT PREVIEW */}

                <div className="hidden xl:block xl:w-[35%]">

                    <div className="sticky top-6">

                        <div className="overflow-hidden rounded-4xl border border-white/10 bg-[#101010]">

                            <div className="relative h-65 overflow-hidden bg-linear-to-br from-orange-700 via-orange-500/20 to-black">

                                {
                                    projectData.thumbnail_url && (

                                        <img
                                            src={projectData.thumbnail_url}
                                            alt="thumbnail"
                                            className="h-full w-full object-cover"
                                        />
                                    )
                                }

                                <div className="absolute right-4 top-4 rounded-full bg-black/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400 backdrop-blur-xl">

                                    LIVE

                                </div>

                            </div>

                            <div className="space-y-5 p-6">

                                <div>

                                    <h2 className="text-3xl font-semibold">

                                        {
                                            projectData.title ||
                                            "Your Project"
                                        }

                                    </h2>

                                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-zinc-400">

                                        {
                                            projectData.description ||

                                            "Your project preview appears here instantly."
                                        }

                                    </p>

                                </div>



                                <div className="flex items-center gap-3 border-t border-white/10 pt-5">

                                    <img
                                        src={
                                            currentUser?.avatar_url ??
                                            "/default-avatar.webp"
                                        }
                                        alt="avatar"
                                        className="h-12 w-12 rounded-full object-cover"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-zinc-300">

                                            @
                                            {
                                                currentUser?.username
                                            }

                                        </p>

                                        <p className="text-xs text-zinc-500">

                                            Verified Builder

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}