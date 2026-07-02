"use client";

import api from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    Bug,
    CalendarDays,
    CheckCircle2,
    Code2,
    Rocket,
    ShieldCheck,
    Sparkles,
    Wrench,
} from "lucide-react";

type ChangelogType =
    | "release"
    | "feature"
    | "fix"
    | "improvement"
    | "security"
    | "breaking"
    | "announcement";

type Changelog = {
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

type ChangelogResponse = {
    items: Changelog[];
    total: number;
    limit: number;
    offset: number;
};

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
        icon: Activity,
        className:
            "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    },
};

function formatDate(value: string | null) {
    if (!value) return "Recently";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

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

function ChangelogSkeleton() {
    return (
        <div className="space-y-5">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 sm:p-6"
                >
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />
                        <div className="h-5 w-24 animate-pulse rounded-full bg-white/10" />
                    </div>

                    <div className="h-7 w-3/4 animate-pulse rounded-lg bg-white/10" />
                    <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />
                    <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />

                    <div className="mt-5 flex gap-2">
                        <div className="h-6 w-16 animate-pulse rounded-full bg-white/10" />
                        <div className="h-6 w-20 animate-pulse rounded-full bg-white/10" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ChangelogPage() {
    const router = useRouter();

    const [changelogs, setChangelogs] = useState<Changelog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchChangelogs = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await api.get<ChangelogResponse>(
                    "/changelog?limit=50&offset=0"
                );

                setChangelogs(res.data.items || []);
                setTotal(res.data.total || 0);
            } catch (err) {
                console.error(err);
                setError("Failed to load changelog.");
            } finally {
                setLoading(false);
            }
        };

        fetchChangelogs();
    }, []);

    return (
        <main className="min-h-screen bg-[#080808] text-white">
            <section className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-200"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="mb-8 overflow-hidden rounded-[1.7rem] border border-white/10 bg-linear-to-br from-orange-500/15 via-zinc-950 to-black p-5 shadow-2xl shadow-black/40 sm:mb-10 sm:rounded-3xl sm:p-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
                        <Rocket size={14} />
                        Devmaniac Updates
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                                Changelog
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                                Follow every product improvement, bug fix,
                                feature release, and platform update shipped on
                                Devmaniac.
                            </p>
                        </div>

                        <div className="w-fit rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Total updates
                            </p>
                            <p className="mt-1 text-2xl font-black text-orange-300">
                                {total}
                            </p>
                        </div>
                    </div>
                </div>

                {loading && <ChangelogSkeleton />}

                {!loading && error && (
                    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
                        <div className="mb-3 flex items-center gap-2 font-bold">
                            <AlertTriangle size={18} />
                            Something broke
                        </div>

                        <p className="text-sm text-red-200/80">
                            {error} Try refreshing the page.
                        </p>
                    </div>
                )}

                {!loading && !error && changelogs.length === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-300">
                            <Code2 size={24} />
                        </div>

                        <h2 className="text-xl font-black text-white">
                            No changelog yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
                            Updates will appear here once Devmaniac starts
                            shipping public releases.
                        </p>
                    </div>
                )}

                {!loading && !error && changelogs.length > 0 && (
                    <div className="relative">
                        <div className="absolute left-4 top-0 hidden h-full w-px bg-linear-to-b from-orange-500/60 via-white/10 to-transparent sm:block" />

                        <div className="space-y-5 sm:space-y-6">
                            {changelogs.map((item) => {
                                const meta = getTypeMeta(
                                    item.changelog_type
                                );

                                const Icon = meta.icon;

                                return (
                                    <article
                                        key={item.id}
                                        className="relative rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-xl shadow-black/20 transition hover:border-orange-500/30 hover:bg-zinc-950 sm:ml-10 sm:rounded-3xl sm:p-6"
                                    >
                                        <div className="absolute left-[-2.95rem] top-7 hidden h-8 w-8 items-center justify-center rounded-full border border-orange-500/30 bg-black text-orange-300 shadow-lg shadow-orange-950/50 sm:flex">
                                            <Icon size={15} />
                                        </div>

                                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div
                                                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}
                                            >
                                                <Icon size={13} />
                                                {meta.label}
                                            </div>

                                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-zinc-400">
                                                <CalendarDays size={13} />
                                                {formatDate(
                                                    item.published_at ||
                                                        item.created_at
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <h2 className="text-xl font-black leading-tight text-white sm:text-2xl">
                                                {item.title}
                                            </h2>

                                            {item.version && (
                                                <span className="w-fit rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
                                                    v{item.version}
                                                </span>
                                            )}
                                        </div>

                                        {item.summary && (
                                            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
                                                {item.summary}
                                            </p>
                                        )}

                                        <div className="mt-5 whitespace-pre-line rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-300">
                                            {item.content}
                                        </div>

                                        {item.tags.length > 0 && (
                                            <div className="mt-5 flex flex-wrap gap-2">
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
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}