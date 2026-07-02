"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Loader2, Save, Trash2, X } from "lucide-react"

import api from "@/app/lib/api"
import { uploadToCloudinary } from "@/app/lib/cloudinary"

type ProjectForm = {
    title: string
    description: string
    github_url: string
    live_url: string
    thumbnail_url: string
    demo_video_url: string
    gallery_urls: string[]
}

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug as string

    const { user, isLoaded } = useUser()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")
    const [galleryInput, setGalleryInput] = useState("")

    const [form, setForm] = useState<ProjectForm>({
        title: "",
        description: "",
        github_url: "",
        live_url: "",
        thumbnail_url: "",
        demo_video_url: "",
        gallery_urls: [],
    })

    const generatedSlug = useMemo(() => {
        return form.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
    }, [form.title])

    useEffect(() => {
        if (!slug) return

        const fetchProject = async () => {
            try {
                setLoading(true)
                setError("")

                const res = await api.get(`/projects/${slug}`, {
                    params: {
                        clerk_user_id: user?.id,
                    },
                })

                setForm({
                    title: res.data.title || "",
                    description: res.data.description || "",
                    github_url: res.data.github_url || "",
                    live_url: res.data.live_url || "",
                    thumbnail_url: res.data.thumbnail_url || "",
                    demo_video_url: res.data.demo_video_url || "",
                    gallery_urls: res.data.gallery_urls || [],
                })
            } catch (err) {
                console.error(err)
                setError("Failed to load project.")
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, [slug, user?.id])

    const updateField = (
        field: keyof ProjectForm,
        value: string
    ) => {
        setForm((prev) => ({
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
            setUploading(true)
            setError("")

            const uploaded = await uploadToCloudinary(file)

            setForm((prev) => ({
                ...prev,
                thumbnail_url: uploaded.secure_url,
            }))
        } catch (err) {
            console.error(err)
            setError("Thumbnail upload failed.")
        } finally {
            setUploading(false)
        }
    }

    const handleGalleryUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        try {
            setUploading(true)
            setError("")

            const uploadedUrls = await Promise.all(
                files.map(async (file) => {
                    const uploaded = await uploadToCloudinary(file)
                    return uploaded.secure_url as string
                })
            )

            setForm((prev) => ({
                ...prev,
                gallery_urls: [
                    ...prev.gallery_urls,
                    ...uploadedUrls,
                ],
            }))
        } catch (err) {
            console.error(err)
            setError("Gallery upload failed.")
        } finally {
            setUploading(false)
        }
    }

    const addGalleryLink = () => {
        const value = galleryInput.trim()
        if (!value) return

        setForm((prev) => ({
            ...prev,
            gallery_urls: [...prev.gallery_urls, value],
        }))

        setGalleryInput("")
    }

    const removeGalleryItem = (index: number) => {
        setForm((prev) => ({
            ...prev,
            gallery_urls: prev.gallery_urls.filter(
                (_, itemIndex) => itemIndex !== index
            ),
        }))
    }

    const handleSave = async () => {
        if (!user?.id) {
            setError("You must be signed in.")
            return
        }

        try {
            setSaving(true)
            setError("")

            const res = await api.patch(
                `/projects/${slug}`,
                {
                    title: form.title,
                    slug: generatedSlug,
                    description: form.description,
                    github_url: form.github_url,
                    live_url: form.live_url || null,
                    thumbnail_url: form.thumbnail_url || null,
                    demo_video_url: form.demo_video_url || null,
                    gallery_urls: form.gallery_urls,
                },
                {
                    params: {
                        clerk_user_id: user.id,
                    },
                }
            )

            router.push(`/project/${res.data.slug || generatedSlug || slug}`)
        } catch (err: any) {
            console.error(err)
            setError(
                err.response?.data?.detail ||
                    "Failed to update project."
            )
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!user?.id) {
            setError("You must be signed in.")
            return
        }

        const confirmed = window.confirm(
            `Delete "${form.title}"? This cannot be undone.`
        )

        if (!confirmed) return

        try {
            setDeleting(true)
            setError("")

            await api.delete(`/projects/${slug}`, {
                params: {
                    clerk_user_id: user.id,
                },
            })

            router.push("/")
        } catch (err: any) {
            console.error(err)
            setError(
                err.response?.data?.detail ||
                    "Failed to delete project."
            )
        } finally {
            setDeleting(false)
        }
    }

    if (!isLoaded || loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black px-4 py-8 text-white">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex flex-col gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-400">
                            Edit Project
                        </p>

                        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
                            Update shipped work.
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
                            Edit the project details, media, demo video, and gallery assets shown on your public project page.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push(`/project/${slug}`)}
                        className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-orange-500/50 hover:text-orange-300"
                    >
                        Cancel
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
                    <section className="rounded-4xl border border-zinc-800 bg-zinc-950 p-5 md:p-7">
                        <div className="space-y-6">
                            <div>
                                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                                    Title
                                </label>

                                <input
                                    value={form.title}
                                    onChange={(e) =>
                                        updateField("title", e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                                    Slug Preview
                                </label>

                                <div className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-sm text-zinc-500">
                                    /project/{generatedSlug || "project-slug"}
                                </div>
                            </div>

                            <div>
                                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                                    Description
                                </label>

                                <textarea
                                    rows={10}
                                    value={form.description}
                                    onChange={(e) =>
                                        updateField(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="w-full resize-none rounded-2xl border border-zinc-800 bg-black px-5 py-4 leading-8 text-white outline-none transition focus:border-orange-500"
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                                        GitHub URL
                                    </label>

                                    <input
                                        value={form.github_url}
                                        onChange={(e) =>
                                            updateField(
                                                "github_url",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                                        Live URL
                                    </label>

                                    <input
                                        value={form.live_url}
                                        onChange={(e) =>
                                            updateField(
                                                "live_url",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                                    Demo Video URL
                                </label>

                                <input
                                    value={form.demo_video_url}
                                    onChange={(e) =>
                                        updateField(
                                            "demo_video_url",
                                            e.target.value
                                        )
                                    }
                                    placeholder="YouTube / Vimeo / Loom / Drive"
                                    className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                                    Thumbnail
                                </label>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-black p-8 text-center transition hover:border-orange-500">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleThumbnailUpload}
                                        />

                                        <span className="text-sm font-semibold text-orange-400">
                                            {uploading
                                                ? "Uploading..."
                                                : "Upload thumbnail"}
                                        </span>

                                        <span className="mt-2 text-xs text-zinc-500">
                                            PNG, JPG, WEBP
                                        </span>
                                    </label>

                                    <input
                                        value={form.thumbnail_url}
                                        onChange={(e) =>
                                            updateField(
                                                "thumbnail_url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://image-url.com"
                                        className="rounded-3xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                                    Gallery
                                </label>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-black p-8 text-center transition hover:border-orange-500">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleGalleryUpload}
                                        />

                                        <span className="text-sm font-semibold text-orange-400">
                                            Upload images
                                        </span>

                                        <span className="mt-2 text-xs text-zinc-500">
                                            Multiple screenshots supported
                                        </span>
                                    </label>

                                    <div className="flex gap-3">
                                        <input
                                            value={galleryInput}
                                            onChange={(e) =>
                                                setGalleryInput(e.target.value)
                                            }
                                            placeholder="Paste gallery image URL"
                                            className="min-w-0 flex-1 rounded-3xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition focus:border-orange-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={addGalleryLink}
                                            className="rounded-3xl bg-orange-500 px-5 text-sm font-bold text-black transition hover:bg-orange-400"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {form.gallery_urls.length > 0 && (
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        {form.gallery_urls.map((url, index) => (
                                            <div
                                                key={`${url}-${index}`}
                                                className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-black"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Gallery ${index + 1}`}
                                                    className="aspect-video w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeGalleryItem(index)
                                                    }
                                                    className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-red-300 backdrop-blur transition hover:bg-red-500/30"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-5">
                        <div className="overflow-hidden rounded-4xl border border-zinc-800 bg-zinc-950">
                            {form.thumbnail_url ? (
                                <img
                                    src={form.thumbnail_url}
                                    alt={form.title}
                                    className="aspect-video w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-video items-center justify-center bg-zinc-900 text-sm text-zinc-600">
                                    Preview thumbnail
                                </div>
                            )}

                            <div className="p-5">
                                <h2 className="text-2xl font-bold">
                                    {form.title || "Project title"}
                                </h2>

                                <p className="mt-3 line-clamp-5 text-sm leading-7 text-zinc-400">
                                    {form.description ||
                                        "Project description preview appears here."}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                                        /project/{generatedSlug || "slug"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-zinc-800 bg-zinc-950 p-5">
                            <button
                                type="button"
                                disabled={saving || uploading}
                                onClick={handleSave}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        Delete Project
                                    </>
                                )}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}