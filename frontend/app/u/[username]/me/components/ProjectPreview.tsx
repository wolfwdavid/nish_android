"use client";

import { useRouter } from "next/navigation";
import { UserFullProfile } from "@/app/lib/type/profileAnalytics";

type Props = {
    profile: UserFullProfile;
};

export default function ProjectsPreview({
    profile,
}: Props) {
    const router = useRouter();

    const totalViews = profile.projects.reduce(
        (sum, project) => sum + project.views_count,
        0
    );

    const totalStars = profile.projects.reduce(
        (sum, project) => sum + project.stars_count,
        0
    );

    const totalComments = profile.projects.reduce(
        (sum, project) => sum + project.comments_count,
        0
    );

    return (
        <section className="space-y-6">
            {/* Analytics */}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Total Projects
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-white">
                        {profile.projects.length}
                    </h3>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Total Stars
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-orange-400">
                        {totalStars}
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
                        Discussions
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-white">
                        {totalComments}
                    </h3>
                </div>
            </div>

            {/* Recent Projects */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Recent Projects
                    </h2>

                    <span className="text-sm text-zinc-500">
                        {profile.projects.length} projects
                    </span>
                </div>

                {profile.projects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-800 py-12 text-center">
                        <p className="text-zinc-500">
                            No projects published yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {profile.projects
                            .slice(0, 5)
                            .map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() =>
                                        router.push(
                                            `/project/${project.slug}`
                                        )
                                    }
                                    className="
                                        group
                                        flex
                                        cursor-pointer
                                        items-center
                                        justify-between
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
                                    <div>
                                        <h3 className="font-medium text-white transition-colors group-hover:text-orange-400">
                                            {project.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-zinc-500">
                                            {project.tech_stack?.length
                                                ? project.tech_stack
                                                      .slice(0, 4)
                                                      .join(" • ")
                                                : "No tech stack"}
                                        </p>
                                    </div>

                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <p className="text-zinc-500">
                                                Views
                                            </p>

                                            <p className="text-white">
                                                {project.views_count}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-zinc-500">
                                                Stars
                                            </p>

                                            <p className="text-orange-400">
                                                {project.stars_count}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-zinc-500">
                                                Comments
                                            </p>

                                            <p className="text-white">
                                                {project.comments_count}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </section>
    );
}