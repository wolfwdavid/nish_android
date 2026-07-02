"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
    BarChart3,
    Clock3,
    Eye,
    Flame,
    FolderGit2,
    GitBranch,
    MessageCircle,
    Plus,
    Rocket,
    Star,
} from "lucide-react";

import api from "@/app/lib/api";
import useCurrentUser from "@/app/lib/currentUser";


type DashboardStats = {
    total_projects: number;
    total_live_projects: number;
    total_views: number;
    total_stars: number;
    total_comments: number;
    total_journals: number;
};

type DashboardProject = {
    id: string;
    title: string;
    slug: string;
    views_count: number;
    stars_count: number;
    comments_count: number;
    tech_stack: string[];
    created_at: string;
};

type DashboardLiveProject = {
    id: string;
    title: string;
    slug: string;
    goal: string;
    current_goal: string | null;
    progress_percentage: number;
    status: string;
    views_count: number;
    journal_count: number;
    tech_stack: string[];
    created_at: string;
    updated_at: string | null;
};

type DashboardStackStat = {
    stack_name: string;
    projects_count: number;
    live_projects_count: number;
    score: number;
};

type DashboardFeedEvent = {
    id: string;
    event_type: string;
    content: string | null;
    created_at: string;
};

type DashboardData = {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    stats: DashboardStats;
    recent_projects: DashboardProject[];
    active_live_projects: DashboardLiveProject[];
    top_stacks: DashboardStackStat[];
    recent_activity: DashboardFeedEvent[];
};

function formatNumber(value: number) {
    return new Intl.NumberFormat("en-US", {
        notation: value >= 1000 ? "compact" : "standard",
        maximumFractionDigits: 1,
    }).format(value);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}

function getEventLabel(eventType: string) {
    const labels: Record<string, string> = {
        live_project_created: "Started a live project",
        journal_published: "Published a journal",
        project_created: "Published a project",
    };

    return labels[eventType] || eventType.replaceAll("_", " ");
}

export default function Dashboard() {
    const {
        currentUser,
        loading: userLoading,
    } = useCurrentUser();

    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (userLoading) return;

        if (!currentUser?.clerk_user_id) {
            setLoading(false);
            return;
        }

        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/dashboard?clerk_user_id=${currentUser.clerk_user_id}`
                );

                setDashboard(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [userLoading, currentUser?.clerk_user_id]);

    if (loading || userLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
                Loading dashboard...
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black px-4 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        You need to sign in
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Dashboard is only available for logged-in builders.
                    </p>

                    <Link
                        href="/sign-in"
                        className="mt-5 inline-flex rounded-2xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black px-4 text-center">
                <div>
                    <h1 className="text-xl font-semibold text-white">
                        Dashboard failed
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
                No dashboard data found.
            </div>
        );
    }

    const displayName =
        currentUser.display_name ||
        dashboard.display_name ||
        currentUser.username ||
        dashboard.username;

    const avatarUrl =
        currentUser.avatar_url ||
        dashboard.avatar_url;

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
                {/* Header */}

                <section className="relative overflow-hidden rounded-4xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.08),transparent_30%)]" />

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-orange-500/30 bg-zinc-900 shadow-[0_0_45px_rgba(249,115,22,0.18)]">
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt={displayName}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-orange-500/10 text-2xl font-bold text-orange-400">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-orange-400">
                                    Welcome back 👋
                                </p>

                                <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-5xl">
                                    {displayName}
                                </h1>

                                <p className="mt-2 text-sm text-zinc-500">
                                    @{currentUser.username}
                                </p>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                                    Your builder command center. Track projects,
                                    live builds, journals, stacks, and momentum.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/u/${currentUser.username}/create/project`}
                                className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
                            >
                                <Plus className="h-4 w-4" />
                                New Project
                            </Link>

                            <Link
                                href="/live_project/create"
                                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-500/50"
                            >
                                <Rocket className="h-4 w-4 text-orange-400" />
                                Start Live Build
                            </Link>

                            <Link
                                href={`/u/${currentUser.username}/me`}
                                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-500/50"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats */}

                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                    <StatCard
                        label="Projects"
                        value={dashboard.stats.total_projects}
                        icon={<FolderGit2 className="h-5 w-5" />}
                    />

                    <StatCard
                        label="Live Builds"
                        value={dashboard.stats.total_live_projects}
                        icon={<Rocket className="h-5 w-5" />}
                    />

                    <StatCard
                        label="Views"
                        value={dashboard.stats.total_views}
                        icon={<Eye className="h-5 w-5" />}
                    />

                    <StatCard
                        label="Stars"
                        value={dashboard.stats.total_stars}
                        icon={<Star className="h-5 w-5" />}
                        orange
                    />

                    <StatCard
                        label="Comments"
                        value={dashboard.stats.total_comments}
                        icon={<MessageCircle className="h-5 w-5" />}
                    />

                    <StatCard
                        label="Journals"
                        value={dashboard.stats.total_journals}
                        icon={<GitBranch className="h-5 w-5" />}
                    />
                </section>

                {/* Main Grid */}

                <section className="mt-6 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-4xl border border-zinc-800 bg-zinc-950/80 p-5 xl:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Rocket className="h-5 w-5 text-orange-400" />

                                <h2 className="text-lg font-semibold">
                                    Active Live Builds
                                </h2>
                            </div>

                            <Link
                                href="/live_project/create"
                                className="text-sm text-orange-400 hover:text-orange-300"
                            >
                                New build
                            </Link>
                        </div>
                        {dashboard.active_live_projects.length === 0 ? (
                            <EmptyState
                                title="No live builds yet"
                                description="Start a live project and document the journey."
                                href="/live_project/create"
                                action="Start building"
                            />
                        ) : (
                            <div className="space-y-4">
                                {dashboard.active_live_projects.map((project) => {
                                    const href = project.slug
                                        ? `/live_project/${project.slug}`
                                        : "#"

                                    return (
                                        <Link
                                            key={project.id}
                                            href={href}
                                            onClick={(e) => {
                                                if (!project.slug) {
                                                    e.preventDefault()
                                                    console.error("Missing live project slug:", project)
                                                }
                                            }}
                                            className="group block rounded-3xl border border-zinc-800 bg-black/40 p-4 transition hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-zinc-900/60"
                                        >
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-semibold text-white group-hover:text-orange-400">
                                                            {project.title}
                                                        </h3>

                                                        <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs text-orange-400">
                                                            {project.status}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 max-w-xl text-sm text-zinc-500">
                                                        {project.current_goal || project.goal}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {project.tech_stack.slice(0, 5).map((stack) => (
                                                            <span
                                                                key={stack}
                                                                className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400"
                                                            >
                                                                {stack}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="min-w-32 text-left md:text-right">
                                                    <p className="text-xs text-zinc-500">
                                                        Progress
                                                    </p>

                                                    <p className="text-2xl font-bold text-orange-400">
                                                        {project.progress_percentage}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                                                <div
                                                    className="h-full rounded-full bg-orange-500"
                                                    style={{
                                                        width: `${Math.min(
                                                            Math.max(project.progress_percentage, 0),
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                                                <span>
                                                    👁 {formatNumber(project.views_count)} views
                                                </span>

                                                <span>
                                                    📓 {formatNumber(project.journal_count)} journals
                                                </span>

                                                <span>
                                                    Updated{" "}
                                                    {formatDate(
                                                        project.updated_at || project.created_at
                                                    )}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                        </div>

                    <div className="space-y-6">
                        <div className="rounded-4xl border border-zinc-800 bg-zinc-950/80 p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <Flame className="h-5 w-5 text-orange-400" />

                                <h2 className="font-semibold">
                                    Builder Momentum
                                </h2>
                            </div>

                            <h3 className="text-4xl font-bold">
                                {dashboard.recent_activity.length}
                            </h3>

                            <p className="mt-2 text-sm text-zinc-500">
                                recent actions recorded
                            </p>
                        </div>

                        <div className="rounded-4xl border border-zinc-800 bg-zinc-950/80 p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-orange-400" />

                                <h2 className="font-semibold">
                                    Top Stacks
                                </h2>
                            </div>

                            {dashboard.top_stacks.length === 0 ? (
                                <p className="text-sm text-zinc-500">
                                    Your stack stats will appear after you
                                    publish projects.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {dashboard.top_stacks.map((stack) => {
                                        const count =
                                            stack.projects_count +
                                            stack.live_projects_count;

                                        const maxCount = Math.max(
                                            ...dashboard.top_stacks.map(
                                                (item) =>
                                                    item.projects_count +
                                                    item.live_projects_count
                                            ),
                                            1
                                        );

                                        const width =
                                            (count / maxCount) * 100;

                                        return (
                                            <div key={stack.stack_name}>
                                                <div className="mb-1 flex items-center justify-between text-sm">
                                                    <span className="text-zinc-300">
                                                        {
                                                            stack.stack_name
                                                        }
                                                    </span>

                                                    <span className="text-zinc-500">
                                                        {count}
                                                    </span>
                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                                                    <div
                                                        className="h-full rounded-full bg-orange-500"
                                                        style={{
                                                            width: `${width}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div className="rounded-4xl border border-zinc-800 bg-zinc-950/80 p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FolderGit2 className="h-5 w-5 text-orange-400" />

                                <h2 className="text-lg font-semibold">
                                    Recent Projects
                                </h2>
                            </div>

                            <Link
                                href={`/u/${currentUser.username}`}
                                className="text-sm text-orange-400 hover:text-orange-300"
                            >
                                View profile
                            </Link>
                        </div>

                        {dashboard.recent_projects.length === 0 ? (
                            <EmptyState
                                title="No projects yet"
                                description="Publish your first completed project."
                                href="/create/project"
                                action="Create project"
                            />
                        ) : (
                            <div className="space-y-3">
                                {dashboard.recent_projects.map(
                                    (project) => (
                                        <Link
                                            key={project.id}
                                            href={`/project/${project.slug}`}
                                            className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/40 p-4 transition hover:border-orange-500/40 hover:bg-zinc-900"
                                        >
                                            <div>
                                                <h3 className="font-medium group-hover:text-orange-400">
                                                    {project.title}
                                                </h3>

                                                <p className="mt-1 text-sm text-zinc-500">
                                                    {project.tech_stack
                                                        ?.slice(0, 4)
                                                        .join(" • ") ||
                                                        "No stack"}
                                                </p>
                                            </div>

                                            <div className="flex gap-4 text-xs text-zinc-500">
                                                <span>
                                                    👁{" "}
                                                    {formatNumber(
                                                        project.views_count
                                                    )}
                                                </span>

                                                <span className="text-orange-400">
                                                    ★{" "}
                                                    {formatNumber(
                                                        project.stars_count
                                                    )}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="rounded-4xl border border-zinc-800 bg-zinc-950/80 p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <Clock3 className="h-5 w-5 text-orange-400" />

                            <h2 className="text-lg font-semibold">
                                Recent Activity
                            </h2>
                        </div>

                        {dashboard.recent_activity.length === 0 ? (
                            <p className="text-sm text-zinc-500">
                                No activity yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {dashboard.recent_activity.map(
                                    (event) => (
                                        <div
                                            key={event.id}
                                            className="rounded-2xl border border-zinc-800 bg-black/40 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {getEventLabel(
                                                            event.event_type
                                                        )}
                                                    </p>

                                                    {event.content && (
                                                        <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                                                            {event.content}
                                                        </p>
                                                    )}
                                                </div>

                                                <span className="shrink-0 text-xs text-zinc-600">
                                                    {formatDate(
                                                        event.created_at
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

function StatCard({
    label,
    value,
    icon,
    orange = false,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    orange?: boolean;
}) {
    return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div
                className={`mb-4 inline-flex rounded-2xl border p-3 ${
                    orange
                        ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400"
                }`}
            >
                {icon}
            </div>

            <p className="text-xs uppercase tracking-wider text-zinc-500">
                {label}
            </p>

            <h2
                className={`mt-2 text-3xl font-bold ${
                    orange ? "text-orange-400" : "text-white"
                }`}
            >
                {formatNumber(value)}
            </h2>
        </div>
    );
}

function EmptyState({
    title,
    description,
    href,
    action,
}: {
    title: string;
    description: string;
    href: string;
    action: string;
}) {
    return (
        <div className="rounded-3xl border border-dashed border-zinc-800 py-12 text-center">
            <h3 className="font-semibold text-white">
                {title}
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
                {description}
            </p>

            <Link
                href={href}
                className="mt-5 inline-flex rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
                {action}
            </Link>
        </div>
    );
}