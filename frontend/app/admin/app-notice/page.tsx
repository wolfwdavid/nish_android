"use client";

import api from "@/app/lib/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Edit3,
    Info,
    Loader2,
    Megaphone,
    Plus,
    Save,
    ShieldAlert,
    Trash2,
    Wrench,
    X,
} from "lucide-react";

type NoticeType =
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "maintenance"
    | "update";

type AppNoticeItem = {
    id: string;
    title: string;
    message: string;
    notice_type: NoticeType | string;
    cta_label: string | null;
    cta_href: string | null;
    is_active: boolean;
    show_once: boolean;
    priority: number;
    starts_at: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
};

type NoticeForm = {
    title: string;
    message: string;
    notice_type: NoticeType;
    cta_label: string;
    cta_href: string;
    is_active: boolean;
    show_once: boolean;
    priority: string;
    starts_at: string;
    expires_at: string;
};

const emptyForm: NoticeForm = {
    title: "",
    message: "",
    notice_type: "info",
    cta_label: "",
    cta_href: "",
    is_active: true,
    show_once: true,
    priority: "0",
    starts_at: "",
    expires_at: "",
};

const noticeTypes: {
    value: NoticeType;
    label: string;
}[] = [
    { value: "info", label: "Info" },
    { value: "success", label: "Success" },
    { value: "warning", label: "Warning" },
    { value: "danger", label: "Danger" },
    { value: "maintenance", label: "Maintenance" },
    { value: "update", label: "Update" },
];

function getNoticeMeta(type: string) {
    if (type === "warning") {
        return {
            label: "Warning",
            icon: AlertTriangle,
            className:
                "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
        };
    }

    if (type === "danger") {
        return {
            label: "Danger",
            icon: ShieldAlert,
            className:
                "border-red-500/30 bg-red-500/10 text-red-300",
        };
    }

    if (type === "maintenance") {
        return {
            label: "Maintenance",
            icon: Wrench,
            className:
                "border-orange-500/30 bg-orange-500/10 text-orange-300",
        };
    }

    if (type === "success") {
        return {
            label: "Success",
            icon: CheckCircle2,
            className:
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        };
    }

    if (type === "update") {
        return {
            label: "Update",
            icon: Megaphone,
            className:
                "border-orange-500/30 bg-orange-500/10 text-orange-300",
        };
    }

    return {
        label: "Info",
        icon: Info,
        className:
            "border-sky-500/30 bg-sky-500/10 text-sky-300",
    };
}

function toDatetimeLocal(value: string | null) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 16);
}

function toApiDatetime(value: string) {
    if (!value) return null;

    return new Date(value).toISOString();
}

function itemToForm(item: AppNoticeItem): NoticeForm {
    return {
        title: item.title,
        message: item.message,
        notice_type: item.notice_type as NoticeType,
        cta_label: item.cta_label || "",
        cta_href: item.cta_href || "",
        is_active: item.is_active,
        show_once: item.show_once,
        priority: String(item.priority ?? 0),
        starts_at: toDatetimeLocal(item.starts_at),
        expires_at: toDatetimeLocal(item.expires_at),
    };
}

function formToPayload(form: NoticeForm) {
    return {
        title: form.title.trim(),
        message: form.message.trim(),
        notice_type: form.notice_type,
        cta_label: form.cta_label.trim() || null,
        cta_href: form.cta_href.trim() || null,
        is_active: form.is_active,
        show_once: form.show_once,
        priority: Number(form.priority || 0),
        starts_at: toApiDatetime(form.starts_at),
        expires_at: toApiDatetime(form.expires_at),
    };
}

function getApiErrorMessage(err: unknown) {
    if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
    ) {
        const axiosErr = err as {
            response?: {
                data?: unknown;
            };
        };

        const data = axiosErr.response?.data;

        console.error("API ERROR:", data);

        if (
            typeof data === "object" &&
            data !== null &&
            "detail" in data
        ) {
            const detail = (data as { detail: unknown }).detail;

            if (typeof detail === "string") return detail;

            return JSON.stringify(detail);
        }
    }

    console.error(err);

    return "Something went wrong.";
}

export default function AdminAppNoticesPage() {
    const router = useRouter();

    const { user, isLoaded } = useUser();

    const [items, setItems] = useState<AppNoticeItem[]>([]);
    const [form, setForm] = useState<NoticeForm>(emptyForm);

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

    const activeCount = useMemo(() => {
        return items.filter((item) => item.is_active).length;
    }, [items]);

    const fetchNotices = async () => {
        if (!user?.id || !adminQuery) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await api.get<AppNoticeItem[]>(
                `/admin/app-notices?limit=100&${adminQuery}`
            );

            setItems(res.data || []);
        } catch (err) {
            const message = getApiErrorMessage(err);

            setError(`Failed to load app notices. ${message}`);
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

        fetchNotices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, user?.id]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError("");
    };

    const handleChange = (
        field: keyof NoticeForm,
        value: string | boolean
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEdit = (item: AppNoticeItem) => {
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

        if (!form.message.trim() || form.message.trim().length < 5) {
            setError("Message must be at least 5 characters.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = formToPayload(form);

            if (editingId) {
                await api.patch(
                    `/admin/app-notices/${editingId}?${adminQuery}`,
                    payload
                );

                setSuccess("App notice updated successfully.");
            } else {
                await api.post(
                    `/admin/app-notices?${adminQuery}`,
                    payload
                );

                setSuccess("App notice created successfully.");
            }

            resetForm();

            await fetchNotices();
        } catch (err) {
            const message = getApiErrorMessage(err);

            setError(
                `${
                    isEditing
                        ? "Failed to update app notice."
                        : "Failed to create app notice."
                } ${message}`
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item: AppNoticeItem) => {
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
                `/admin/app-notices/${item.id}?${adminQuery}`
            );

            setSuccess("App notice deleted successfully.");

            if (editingId === item.id) {
                resetForm();
            }

            await fetchNotices();
        } catch (err) {
            const message = getApiErrorMessage(err);

            setError(`Failed to delete app notice. ${message}`);
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleActive = async (item: AppNoticeItem) => {
        if (!user?.id || !adminQuery) {
            setError("Admin Clerk user id missing.");
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.patch(
                `/admin/app-notices/${item.id}?${adminQuery}`,
                {
                    is_active: !item.is_active,
                }
            );

            setSuccess(
                item.is_active
                    ? "Notice deactivated."
                    : "Notice activated."
            );

            await fetchNotices();
        } catch (err) {
            const message = getApiErrorMessage(err);

            setError(`Failed to update notice status. ${message}`);
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
                        <Megaphone size={14} />
                        Admin Notices
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                                App Notice Manager
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                                Create important popups for bugs, maintenance,
                                updates, or urgent messages users should see.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:w-fit">
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
                                    Active
                                </p>
                                <p className="mt-1 text-2xl font-black text-emerald-300">
                                    {activeCount}
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
                                        ? "Edit notice"
                                        : "New notice"}
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    This can appear as a popup for users.
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
                                    placeholder="Known loading issue"
                                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                    Message
                                </label>

                                <textarea
                                    value={form.message}
                                    onChange={(e) =>
                                        handleChange(
                                            "message",
                                            e.target.value
                                        )
                                    }
                                    rows={5}
                                    placeholder="If a page loads for more than 10 seconds, refresh once. We are working on a fix."
                                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                        Type
                                    </label>

                                    <select
                                        value={form.notice_type}
                                        onChange={(e) =>
                                            handleChange(
                                                "notice_type",
                                                e.target.value as NoticeType
                                            )
                                        }
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/50"
                                    >
                                        {noticeTypes.map((type) => (
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

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                        Priority
                                    </label>

                                    <input
                                        type="number"
                                        value={form.priority}
                                        onChange={(e) =>
                                            handleChange(
                                                "priority",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                        CTA Label
                                    </label>

                                    <input
                                        value={form.cta_label}
                                        onChange={(e) =>
                                            handleChange(
                                                "cta_label",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Report issue"
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                        CTA Link
                                    </label>

                                    <input
                                        value={form.cta_href}
                                        onChange={(e) =>
                                            handleChange(
                                                "cta_href",
                                                e.target.value
                                            )
                                        }
                                        placeholder="/feedback"
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                        Starts At
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={form.starts_at}
                                        onChange={(e) =>
                                            handleChange(
                                                "starts_at",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                        Expires At
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={form.expires_at}
                                        onChange={(e) =>
                                            handleChange(
                                                "expires_at",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/50"
                                    />
                                </div>
                            </div>

                            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Active
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        Active notices can appear to users.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) =>
                                        handleChange(
                                            "is_active",
                                            e.target.checked
                                        )
                                    }
                                    className="h-5 w-5 accent-orange-500"
                                />
                            </label>

                            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Show once
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        Users see it once per browser.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={form.show_once}
                                    onChange={(e) =>
                                        handleChange(
                                            "show_once",
                                            e.target.checked
                                        )
                                    }
                                    className="h-5 w-5 accent-orange-500"
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={
                                    saving || !isLoaded || !user?.id
                                }
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
                                            ? "Save notice"
                                            : "Create notice"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <section className="min-w-0">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-black text-white">
                                    All app notices
                                </h2>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Highest priority active notice is shown
                                    first to users.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fetchNotices}
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
                                        <div className="mb-4 h-6 w-32 animate-pulse rounded-full bg-white/10" />
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
                                    <Megaphone size={24} />
                                </div>

                                <h3 className="text-xl font-black text-white">
                                    No notices yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
                                    Create one when users need to know about
                                    an important update, bug, or maintenance.
                                </p>
                            </div>
                        )}

                        {!loading && items.length > 0 && (
                            <div className="space-y-4">
                                {items.map((item) => {
                                    const meta = getNoticeMeta(
                                        item.notice_type
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
                                                            item.is_active
                                                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                                                : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
                                                        }`}
                                                    >
                                                        {item.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>

                                                    <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-bold text-zinc-300">
                                                        Priority {item.priority}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleActive(item)
                                                    }
                                                    className="w-fit rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-bold text-zinc-300 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-200"
                                                >
                                                    {item.is_active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>
                                            </div>

                                            <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">
                                                {item.title}
                                            </h3>

                                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-400">
                                                {item.message}
                                            </p>

                                            {(item.cta_label ||
                                                item.cta_href) && (
                                                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
                                                    CTA:{" "}
                                                    <span className="text-orange-300">
                                                        {item.cta_label ||
                                                            "No label"}
                                                    </span>{" "}
                                                    →{" "}
                                                    <span className="text-zinc-300">
                                                        {item.cta_href ||
                                                            "No link"}
                                                    </span>
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