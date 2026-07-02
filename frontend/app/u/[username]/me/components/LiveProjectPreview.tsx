"use client";

import { useRouter } from "next/navigation";
import { UserFullProfile } from "@/app/lib/type/profileAnalytics";

type Props = {
    profile: UserFullProfile;
};

export default function LiveProjectsPreview({
    profile,
}: Props) {
    const router = useRouter();

    const totalViews = profile.live_projects.reduce(
        (sum, project) => sum + project.views_count,
        0
    );

    const totalJournals = profile.live_projects.reduce(
        (sum, project) => sum + project.journal_count,
        0
    );

    return (
        <section className="space-y-6">
            {/* Analytics */}

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Live Projects
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-white">
                        {profile.live_projects.length}
                    </h3>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Total Views
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-white">
                        {totalViews}
                    </h3>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Journal Entries
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-orange-400">
                        {totalJournals}
                    </h3>
                </div>
            </div>

            {/* Live Projects */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Live Projects
                    </h2>

                    <span className="text-sm text-zinc-500">
                        {profile.live_projects.length} active
                    </span>
                </div>

                {profile.live_projects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-800 py-12 text-center">
                        <p className="text-zinc-500">
                            No live projects yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {profile.live_projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() =>
                                    router.push(
                                        `/live_project/${project.slug}`
                                    )
                                }
                                className="
                                    group
                                    cursor-pointer
                                    rounded-2xl
                                    border
                                    border-zinc-800
                                    bg-zinc-950/60
                                    p-4
                                    transition-all
                                    duration-200
                                    hover:-translate-y-1
                                    hover:border-orange-500/40
                                    hover:bg-zinc-900
                                "
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-white group-hover:text-orange-400">
                                            {project.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-zinc-500">
                                            {project.current_goal ||
                                                project.goal}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500">
                                            Progress
                                        </p>

                                        <p className="font-semibold text-orange-400">
                                            {project.progress_percentage}%
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                                        <div
                                            className="h-full rounded-full bg-orange-500 transition-all"
                                            style={{
                                                width: `${project.progress_percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <div className="flex gap-4">
                                        <span className="text-zinc-500">
                                            👁 {project.views_count}
                                        </span>

                                        <span className="text-zinc-500">
                                            📓 {project.journal_count}
                                        </span>
                                    </div>

                                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}