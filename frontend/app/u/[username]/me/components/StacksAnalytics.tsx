"use client";

import { UserFullProfile } from "@/app/lib/type/profileAnalytics";
import { useEffect, useState } from "react";
import {
    Activity,
    BarChart3,
    Code2,
    Eye,
    Flame,
    GitBranch,
    Layers3,
    Rocket,
    Star,
    Trophy,
} from "lucide-react";

type Props = {
    profile: UserFullProfile;
};

type StackCount = {
    name: string;
    count: number;
};

/* ----------------------------- data helpers ----------------------------- */

function normalizeStackName(stack: string) {
    return stack.trim();
}

function getStackCounts(profile: UserFullProfile): StackCount[] {
    const map = new Map<string, number>();

    const addStack = (stack: string) => {
        const cleanStack = normalizeStackName(stack);
        if (!cleanStack) return;
        map.set(cleanStack, (map.get(cleanStack) || 0) + 1);
    };

    profile.projects?.forEach((project) => project.tech_stack?.forEach(addStack));
    profile.live_projects?.forEach((project) => project.tech_stack?.forEach(addStack));

    return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

function getTotalViews(profile: UserFullProfile) {
    const projectViews =
        profile.projects?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
    const liveProjectViews =
        profile.live_projects?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
    return projectViews + liveProjectViews;
}

function getTotalStars(profile: UserFullProfile) {
    return profile.projects?.reduce((sum, p) => sum + (p.stars_count || 0), 0) || 0;
}

function getTotalComments(profile: UserFullProfile) {
    return profile.projects?.reduce((sum, p) => sum + (p.comments_count || 0), 0) || 0;
}

function getTotalJournals(profile: UserFullProfile) {
    return profile.live_projects?.reduce((sum, p) => sum + (p.journal_count || 0), 0) || 0;
}

/* ------------------------------ tier system ------------------------------ */

const STACK_TIERS = [
    { min: 0, label: "New Builder", description: "Early profile. Time to ship more proof." },
    { min: 75, label: "Active Builder", description: "The foundation is forming." },
    { min: 200, label: "Rising Builder", description: "Good momentum. More projects will compound fast." },
    { min: 500, label: "Elite Builder", description: "Strong proof of shipping and consistency." },
    { min: 1000, label: "Legend", description: "Moving like a serious operator." },
];

function getStackProgress(score: number) {
    let index = 0;
    for (let i = 0; i < STACK_TIERS.length; i++) {
        if (score >= STACK_TIERS[i].min) index = i;
    }

    const current = STACK_TIERS[index];
    const next = STACK_TIERS[index + 1] ?? null;

    if (!next) {
        return { current, next: null, progress: 100, pointsToNext: 0 };
    }

    const span = next.min - current.min;
    const into = score - current.min;
    const progress = Math.min(Math.round((into / span) * 100), 100);
    const pointsToNext = Math.max(next.min - score, 0);

    return { current, next, progress, pointsToNext };
}

/* --------------------------- animated primitives -------------------------- */

function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);
    return mounted;
}

function AnimatedNumber({ value, duration = 900 }: { value: number; duration?: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let frame: number;
        const start = performance.now();

        const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
            setDisplay(Math.round(value * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [value, duration]);

    return <span className="tabular-nums">{display.toLocaleString()}</span>;
}

/* -------------------------------- component ------------------------------- */

export default function StacksAnalytics({ profile }: Props) {
    const mounted = useMounted();

    const stackCounts = getStackCounts(profile);

    const totalProjects = profile.projects?.length || 0;
    const totalLiveProjects = profile.live_projects?.length || 0;
    const totalBuilds = totalProjects + totalLiveProjects;

    const totalViews = getTotalViews(profile);
    const totalStars = getTotalStars(profile);
    const totalComments = getTotalComments(profile);
    const totalJournals = getTotalJournals(profile);

    const stackScore =
        totalBuilds * 30 +
        totalStars * 8 +
        totalComments * 5 +
        totalJournals * 10 +
        totalViews;

    const { current, next, progress, pointsToNext } = getStackProgress(stackScore);
    const topStack = stackCounts[0];
    const maxCount = stackCounts[0]?.count || 1;

    return (
        <section className="space-y-6 font-mono">
            {/* HERO: score + rank + progression in one focal block */}
            <div className="relative overflow-hidden rounded-3xl border border-orange-500/25 bg-linear-to-br from-orange-500/15 via-orange-500/4 to-transparent p-6 sm:p-8">
                <div
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl"
                    aria-hidden
                />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-orange-300/70">
                            <Trophy size={14} />
                            <p className="text-xs uppercase tracking-[0.2em]">Stack Score</p>
                        </div>

                        <h3 className="mt-3 text-6xl font-black leading-none text-orange-300 sm:text-7xl">
                            <AnimatedNumber value={stackScore} />
                        </h3>

                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1">
                            <Flame size={13} className="text-orange-400" />
                            <span className="text-sm font-semibold text-orange-200">
                                {current.label}
                            </span>
                        </div>

                        <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-400">
                            {current.description}
                        </p>
                    </div>

                    {/* progress to next rank — the gamified core */}
                    <div className="w-full lg:max-w-sm">
                        <div className="mb-2 flex items-baseline justify-between gap-4">
                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                {next ? "Progress to next rank" : "Max rank reached"}
                            </p>
                            <p className="text-xs font-semibold text-orange-300 tabular-nums">
                                {progress}%
                            </p>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-orange-600 to-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.7)] transition-[width] duration-1000 ease-out"
                                style={{ width: mounted ? `${progress}%` : "0%" }}
                            />
                        </div>

                        {next ? (
                            <p className="mt-3 text-sm text-zinc-400">
                                <span className="font-bold text-white tabular-nums">
                                    {pointsToNext.toLocaleString()}
                                </span>{" "}
                                points to{" "}
                                <span className="font-semibold text-orange-300">
                                    {next.label}
                                </span>
                            </p>
                        ) : (
                            <p className="mt-3 text-sm text-zinc-400">
                                Top of the ladder. Keep shipping to stay there.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* secondary stat strip */}
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard icon={<Rocket size={20} />} label="Total Builds" value={totalBuilds} />
                <StatCard icon={<Code2 size={20} />} label="Tech Used" value={stackCounts.length} />
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                Top Stack
                            </p>
                            <h3 className="mt-2 truncate text-2xl font-black text-white">
                                {topStack?.name || "None"}
                            </h3>
                        </div>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300">
                            <Layers3 size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* stack breakdown */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Stack Breakdown</h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Real tech usage from finished and live projects.
                            </p>
                        </div>
                        <BarChart3 className="text-orange-400" size={22} />
                    </div>

                    {stackCounts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-800 py-12 text-center">
                            <p className="text-zinc-500">No tech stack data yet.</p>
                            <p className="mt-2 text-sm text-zinc-600">
                                Add projects with tech stacks to build this profile.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stackCounts.map((stack, index) => {
                                const percentage = Math.round((stack.count / maxCount) * 100);
                                const intensity = Math.max(1 - index * 0.08, 0.45);

                                return (
                                    <div key={stack.name}>
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                                                <p className="text-sm font-medium text-white">
                                                    {stack.name}
                                                </p>
                                            </div>
                                            <p className="text-sm text-zinc-400 tabular-nums">
                                                {stack.count}{" "}
                                                {stack.count === 1 ? "build" : "builds"}
                                            </p>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                                            <div
                                                className="h-full rounded-full bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.6)] transition-[width] duration-700 ease-out"
                                                style={{
                                                    width: mounted ? `${percentage}%` : "0%",
                                                    opacity: intensity,
                                                    transitionDelay: `${index * 80}ms`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* activity summary */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">Activity Summary</h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Signals from projects and live builds.
                            </p>
                        </div>
                        <Activity className="text-orange-400" size={22} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <ActivityCell icon={<Eye size={18} className="text-zinc-400" />} value={totalViews} label="Views" />
                        <ActivityCell icon={<Star size={18} className="text-orange-400" />} value={totalStars} label="Stars" />
                        <ActivityCell icon={<GitBranch size={18} className="text-zinc-400" />} value={totalJournals} label="Journals" />
                        <ActivityCell icon={<Activity size={18} className="text-zinc-400" />} value={totalComments} label="Comments" />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------ small pieces ------------------------------ */

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
                    <h3 className="mt-2 text-3xl font-black text-white">
                        <AnimatedNumber value={value} />
                    </h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function ActivityCell({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: number;
    label: string;
}) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4 transition-colors hover:border-orange-500/30">
            {icon}
            <p className="mt-3 text-2xl font-black text-white">
                <AnimatedNumber value={value} />
            </p>
            <p className="mt-1 text-xs text-zinc-500">{label}</p>
        </div>
    );
}