"use client";

import api from "@/app/lib/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    Bug,
    CalendarDays,
    CheckCircle2,
    Edit3,
    Loader2,
    Megaphone,
    Plus,
    Rocket,
    Save,
    ShieldCheck,
    Sparkles,
    Trash2,
    Wrench,
    X,
} from "lucide-react";

type ChangelogType =
    | "release"
    | "feature"
    | "fix"
    | "improvement"
    | "security"
    | "breaking"
    | "announcement";

type AdminChangelogItem = {
    id: string;
    title: string;
    slug: string;
    version: string | null;
    summary: string | null;
    content: string;
    changelog_type: ChangelogType | string;
    tags: string[];
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
};

type ChangelogFormData = {
    title: string;
    slug: string;
    version: string;
    summary: string;
    content: string;
    changelog_type: ChangelogType;
    tags: string;
    is_published: boolean;
};

const emptyForm: ChangelogFormData = {
    title: "",
    slug: "",
    version: "",
    summary: "",
    content: "",
    changelog_type: "release",
    tags: "",
    is_published: false,
};

const changelogTypes: {
    value: ChangelogType;
    label: string;
}[] = [
    { value: "release", label: "Release" },
    { value: "feature", label: "Feature" },
    { value: "fix", label: "Fix" },
    { value: "improvement", label: "Improvement" },
    { value: "security", label: "Security" },
    { value: "breaking", label: "Breaking" },
    { value: "announcement", label: "Announcement" },
];

const typeStyles: Record<
    string,
    {
        label: string;
        icon: React.ElementType;
        className: string;
    }
> = {
    release: {
        label: "Release",
        icon: Rocket,
        className:
            "border-orange-500/30 bg-orange-500/10 text-orange-300",
    },
    feature: {
        label: "Feature",
        icon: Sparkles,
        className:
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    },
    fix: {
        label: "Fix",
        icon: Bug,
        className:
            "border-sky-500/30 bg-sky-500/10 text-sky-300",
    },
    improvement: {
        label: "Improvement",
        icon: Wrench,
        className:
            "border-violet-500/30 bg-violet-500/10 text-violet-300",
    },
    security: {
        label: "Security",
        icon: ShieldCheck,
        className:
            "border-green-500/30 bg-green-500/10 text-green-300",
    },
    breaking: {
        label: "Breaking",
        icon: AlertTriangle,
        className:
            "border-red-500/30 bg-red-500/10 text-red-300",
    },
    announcement: {
        label: "Announcement",
        icon: Megaphone,
        className:
            "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    },
};

function getTypeMeta(type: string) {
    return (
        typeStyles[type] || {
            label: type,
            icon: CheckCircle2,
            className:
                "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
        }
    );
}

function formatDate(value: string | null) {
    if (!value) return "Not published";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function makeSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-_]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function formToPayload(form: ChangelogFormData) {
    return {
        title: form.title.trim(),
        slug: form.slug.trim() || null,
        version: form.version.trim() || null,
        summary: form.summary.trim() || null,
        content: form.content.trim(),
        changelog_type: form.changelog_type,
        tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        is_published: form.is_published,
    };
}

function itemToForm(item: AdminChangelogItem): ChangelogFormData {
    return {
        title: item.title,
        slug: item.slug,
        version: item.version || "",
        summary: item.summary || "",
        content: item.content,
        changelog_type: item.changelog_type as ChangelogType,
        tags: item.tags.join(", "),
        is_published: item.is_published,
    };
}

function getApiErrorMessage(err: unknown) {
    if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
    ) {
        const axiosError = err as {
            response?: {
                data?: unknown;
            };
        };

        const data = axiosError.response?.data;

        console.error("API ERROR:", data);

        if (
            typeof data === "object" &&
            data !== null &&
            "detail" in data
        ) {
            const detail = (data as { detail: unknown }).detail;

            if (typeof detail === "string") {
                return detail;
            }

            return JSON.stringify(detail);
        }
    }

    console.error(err);

    return "Something went wrong.";
}

export default function AdminChangelogPage() {
    const router = useRouter();

    const { user, isLoaded } = useUser();

    const [items, setItems] = useState<AdminChangelogItem[]>([]);
    const [form, setForm] = useState<ChangelogFormData>(emptyForm);

    const [editingId, setEditingId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isEditing = Boolean(editingId);

    const adminQuery = useMemo(() => {
        if (!user?.id) return "";

        return `clerk_user_id=${encodeURIComponent(user.id)}`;
    }, [user?.id]);

    const publishedCount = useMemo(() => {
        return items.filter((item) => item.is_published).length;
    }, [items]);

    const draftCount = useMemo(() => {
        return items.filter((item) => !item.is_published).length;
    }, [items]);

    const fetchChangelogs = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await api.get<AdminChangelogItem[]>(
                `/admin/changelogs?limit=100&${adminQuery}`
            );

            setItems(res.data || []);
        } catch (err) {
            const message = getApiErrorMessage(err);

            setError(`Failed to load admin changelogs. ${message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoaded) return;

        if (!user?.id) {
            setLoading(false);
            setError("You must be signed in as admin.");
            return;
        }

        fetchChangelogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, user?.id]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError("");
    };

    const handleChange = (
        field: keyof ChangelogFormData,
        value: string | boolean
    ) => {
        setForm((prev) => {
            const next = {
                ...prev,
                [field]: value,
            };

            if (
                field === "title" &&
                typeof value === "string" &&
                !editingId
            ) {
                next.slug = makeSlug(value);
            }

            return next;
        });
    };

    const handleEdit = (item: AdminChangelogItem) => {
        setEditingId(item.id);
        setForm(itemToForm(item));
        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!user?.id || !adminQuery) {
            setError("Admin Clerk user id missing.");
            return;
        }

        if (!form.title.trim()) {
            setError("Title is required.");
            return;
        }

        if (!form.content.trim() || form.content.trim().length < 10) {
            setError("Content must be at least 10 characters.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = formToPayload(form);

            if (editingId) {
                await api.patch(
                    `/admin/changelogs/${editingId}?${adminQuery}`,
                    payload
                );

                setSuccess("Changelog updated successfully.");
            } else {
                await api.post(
                    `/admin/changelogs?${adminQuery}`,
                    payload
                );

                setSuccess("Changelog created successfully.");
            }

            resetForm();

            await fetchChangelogs();
        } catch (err) {
            const message = getApiErrorMessage(err);

            setError(
                `${
                    isEditing
                        ? "Failed to update changelog."
                        : "Failed to create changelog."
                } ${message}`
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item: AdminChangelogItem) => {
        if (!user?.id || !adminQuery) {
            setError("Admin Clerk user id missing.");
            return;
        }

        const confirmed = window.confirm(
            `Delete "${item.title}"? This cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setDeletingId(item.id);
            setError("");
            setSuccess("");

            await api.delete(
                `/admin/changelogs/${item.id}?${adminQuery}`
            );

            setSuccess("Changelog deleted successfully.");

            if (editingId === item.id) {
                resetForm();
            }

            await fetchChangelogs();
        } catch (err) {
            const message = getApiErrorMessage(err);

            setError(`Failed to delete changelog. ${message}`);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#080808] text-white">
            <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-200"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="mb-6 rounded-[1.7rem] border border-white/10 bg-linear-to-br from-orange-500/15 via-zinc-950 to-black p-5 shadow-2xl shadow-black/40 sm:rounded-3xl sm:p-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
                        <Activity size={14} />
                        Admin Control
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                                Changelog Manager
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                                Create, edit, publish, and remove Devmaniac
                                changelog entries from one admin panel.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:w-fit">
                            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                    Total
                                </p>
                                <p className="mt-1 text-2xl font-black text-white">
                                    {items.length}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">
                                    Live
                                </p>
                                <p className="mt-1 text-2xl font-black text-emerald-300">
                                    {publishedCount}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-yellow-300/70">
                                    Draft
                                </p>
                                <p className="mt-1 text-2xl font-black text-yellow-300">
                                    {draftCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                        <div className="flex items-start gap-2 font-bold">
                            <AlertTriangle
                                size={17}
                                className="mt-0.5 shrink-0"
                            />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                        <div className="flex items-center gap-2 font-bold">
                            <CheckCircle2 size={17} />
                            {success}
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                    <form
                        onSubmit={handleSubmit}
                        className="h-fit rounded-[1.7rem] border border-white/10 bg-zinc-950/80 p-5 shadow-xl shadow-black/30 sm:rounded-3xl sm:p-6 lg:sticky lg:top-6"
                    >
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-black text-white">
                                    {isEditing
                                        ? "Edit changelog"
                                        : "New changelog"}
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    {isEditing
                                        ? "Update an existing release note."
                                        : "Ship a new public update."}
                                </p>
                            </div>

                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
                                >
                                    <X size={14} />
                                    Cancel
                                </button>
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-300">
                                    <Plus size={18} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                    Title
                                </label>

                                <input
                                    value={form.title}
                                    onChange={(e) =>
                                        handleChange(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Added live project journals"
                                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                    Slug
                                </label>

                                <input
                                    value={form.slug}
                                    onChange={(e) =>
                                        handleChange(
                                            "slug",
                                            e.target.value
                                        )
                                    }
                                    placeholder="added-live-project-journals"
                                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                />

                                <p className="mt-2 text-xs text-zinc-600">
                                    Leave empty to auto-generate from title.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                        Version
                                    </label>

                                    <input
                                        value={form.version}
                                        onChange={(e) =>
                                            handleChange(
                                                "version",
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.1.0"
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                        Type
                                    </label>

                                    <select
                                        value={form.changelog_type}
                                        onChange={(e) =>
                                            handleChange(
                                                "changelog_type",
                                                e.target
                                                    .value as ChangelogType
                                            )
                                        }
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/50"
                                    >
                                        {changelogTypes.map((type) => (
                                            <option
                                                key={type.value}
                                                value={type.value}
                                                className="bg-zinc-950 text-white"
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                    Summary
                                </label>

                                <textarea
                                    value={form.summary}
                                    onChange={(e) =>
                                        handleChange(
                                            "summary",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Short description users will see first."
                                    rows={3}
                                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                    Content
                                </label>

                                <textarea
                                    value={form.content}
                                    onChange={(e) =>
                                        handleChange(
                                            "content",
                                            e.target.value
                                        )
                                    }
                                    placeholder={`Example:\n- Added live project journals\n- Improved mobile navigation\n- Fixed profile route bug`}
                                    rows={7}
                                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                    Tags
                                </label>

                                <input
                                    value={form.tags}
                                    onChange={(e) =>
                                        handleChange(
                                            "tags",
                                            e.target.value
                                        )
                                    }
                                    placeholder="live-projects, mobile, bugfix"
                                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                />

                                <p className="mt-2 text-xs text-zinc-600">
                                    Separate tags with commas.
                                </p>
                            </div>

                            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Publish now
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        Published entries appear on the public
                                        changelog page.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={form.is_published}
                                    onChange={(e) =>
                                        handleChange(
                                            "is_published",
                                            e.target.checked
                                        )
                                    }
                                    className="h-5 w-5 accent-orange-500"
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={saving || !isLoaded || !user?.id}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={17} />
                                        {isEditing
                                            ? "Save changes"
                                            : "Create changelog"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <section className="min-w-0">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-black text-white">
                                    All changelogs
                                </h2>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Manage every release note from newest to
                                    oldest.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fetchChangelogs}
                                disabled={!user?.id}
                                className="hidden rounded-full border border-white/10 bg-white/3 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-200 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
                            >
                                Refresh
                            </button>
                        </div>

                        {loading && (
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5"
                                    >
                                        <div className="mb-4 flex justify-between gap-3">
                                            <div className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
                                            <div className="h-6 w-24 animate-pulse rounded-full bg-white/10" />
                                        </div>

                                        <div className="h-7 w-3/4 animate-pulse rounded-lg bg-white/10" />
                                        <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
                                        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && items.length === 0 && (
                            <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-300">
                                    <Rocket size={24} />
                                </div>

                                <h3 className="text-xl font-black text-white">
                                    No changelogs yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
                                    Create your first Devmaniac update from the
                                    form.
                                </p>
                            </div>
                        )}

                        {!loading && items.length > 0 && (
                            <div className="space-y-4">
                                {items.map((item) => {
                                    const meta = getTypeMeta(
                                        item.changelog_type
                                    );

                                    const Icon = meta.icon;

                                    return (
                                        <article
                                            key={item.id}
                                            className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-xl shadow-black/20 transition hover:border-orange-500/30 sm:rounded-3xl sm:p-6"
                                        >
                                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}
                                                    >
                                                        <Icon size={13} />
                                                        {meta.label}
                                                    </span>

                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                                                            item.is_published
                                                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                                                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                                                        }`}
                                                    >
                                                        {item.is_published
                                                            ? "Published"
                                                            : "Draft"}
                                                    </span>

                                                    {item.version && (
                                                        <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-bold text-zinc-300">
                                                            v{item.version}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-zinc-400">
                                                    <CalendarDays size={13} />
                                                    {formatDate(
                                                        item.published_at ||
                                                            item.created_at
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 break-all text-xs text-zinc-600">
                                                /changelog/{item.slug}
                                            </p>

                                            {item.summary && (
                                                <p className="mt-3 text-sm leading-6 text-zinc-400">
                                                    {item.summary}
                                                </p>
                                            )}

                                            <div className="mt-4 max-h-40 overflow-hidden whitespace-pre-line rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-300">
                                                {item.content}
                                            </div>

                                            {item.tags.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {item.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-zinc-400"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/3 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-200"
                                                >
                                                    <Edit3 size={15} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                    disabled={
                                                        deletingId === item.id
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 transition hover:border-red-500/40 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {deletingId === item.id ? (
                                                        <Loader2
                                                            size={15}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
}