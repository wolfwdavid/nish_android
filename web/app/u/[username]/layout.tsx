"use client";

import api from "@/app/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";

import AppNoticeManager from "@/app/components/AppNoticeManager";
import AppFooter from "@/app/components/AppFooter";
import BuyMeCoffee from "@/app/components/BuyMeCoffee";

import {
    Home,
    Compass,
    Bell,
    Bookmark,
    User,
    Settings,
    Search,
    Rocket,
} from "lucide-react";

import LeftSidebar from "./components/LeftSideBar";
import RightSidebar from "./components/RightSideBar";
import MobileBottomNav from "./components/MobileBottomNav";
import FloatingCreateButton from "./components/FloatingCreateButton";
import CreatePickerModal from "./components/CreatePickerModal";

type CurrentUser = {
    avatar_url: string | null;
    display_name: string;
    username: string;
    banner_url: string | null;

    project_count?: number;
    followers_count?: number;
    live_projects_count?: number;
    build_streak_days?: number;

    stack_stats?: {
        name: string;
        count: number;
    }[];
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const { user, isLoaded } = useUser();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false)

    const [currentUser, setCurrentUser] = useState<CurrentUser>({
        avatar_url: null,
        display_name: "",
        username: "",
        banner_url: null,
    });

    useEffect(() => {
        if (!isLoaded) return;

        if (!user?.id) {
            setLoading(false);
            return;
        }

        const fetchCurrentUser = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await api.get(
                    `/profile/me?clerk_user_id=${user.id}`
                );

                setCurrentUser(result.data);
            } catch (err) {
                console.error(err);

                setError(
                    "There was a problem loading dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [isLoaded, user?.id]);

    const safeUsername = currentUser.username || "loading";

    const navItems = [
        {
            name: "Dashboard",
            href: `/u/${safeUsername}`,
            icon: Home,
        },

        {
            name: "Explore",
            href: `/u/${safeUsername}/projects`,
            icon: Compass,
        },

        {
            name: "Live Projects",
            href: `/u/${safeUsername}/live_projects`,
            icon: Rocket,
        },

        {
            name: "Bookmarks",
            href: `/u/${safeUsername}/bookmarks`,
            icon: Bookmark,
        },

        {
            name: "Profile",
            href: `/u/${safeUsername}/me`,
            icon: User,
        },

        {
            name: "Settings",
            href: `/settings`,
            icon: Settings,
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#050505] text-white">
            {/* LEFT SIDEBAR */}

            <LeftSidebar
                navItems={navItems}
                avatarUrl={
                    loading
                        ? null
                        : currentUser.avatar_url
                }
                displayName={
                    loading
                        ? "Loading..."
                        : currentUser.display_name
                }
                username={
                    loading
                        ? "loading"
                        : currentUser.username
                }
            />

            {/* MAIN */}

            <main className="min-w-0 flex-1 border-r border-white/10 pb-28 md:pb-0">
                {/* MOBILE TOPBAR */}

                <div className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl md:hidden">
                    <div className="flex items-center justify-between px-4 py-4">
                        <h1 className="bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-2xl font-black tracking-[-0.08em] text-transparent">
                            DevManiac
                        </h1>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.push(`/search`)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 transition hover:bg-white/10"
                            >
                                <Search size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push(`/settings`)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 transition hover:bg-white/10"
                            >
                                <Settings size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push(`/settings`)}
                                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 transition hover:bg-white/10"
                            >
                                <Bell size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {showCreateModal && (
                    <CreatePickerModal
                        onClose={() => setShowCreateModal(false)}
                        onSelect={(type) => {
                            setShowCreateModal(false);

                            const username = currentUser.username;

                            if (!username || username === "loading") {
                                console.warn("Username not ready yet");
                                return;
                            }

                            if (type === "post") {
                                router.push(`/create/post`);
                                return;
                            }

                            if (type === "project") {
                                router.push(`/u/${username}/create/project`);
                                return;
                            }

                            if (type === "live") {
                                router.push(`/u/${username}/create/live_project`);
                                return;
                            }
                        }}
                    />
                )}
                {/* ERROR */}

                {error && (
                    <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* PAGE CONTENT */}

                <div className="min-h-screen">
                    {children}
                </div>

                {/* MOBILE BUY ME A COFFEE ONLY */}

                    <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 xl:hidden">
                        <BuyMeCoffee
                            variant="card"
                            username="nish489"
                            qrImageSrc="/coffeeqr.jpg"
                            title="Fuel the next build"
                            description="I build full-stack projects, AI tools, and useful developer resources. If my work helped you, support the journey with a coffee."
                            showOfficialButton={false}
                        />
                    </div>

                <AppFooter />
            </main>

            {/* RIGHT SIDEBAR */}

            <RightSidebar
                avatarUrl={
                    loading
                        ? null
                        : currentUser.avatar_url
                }
                displayName={
                    loading
                        ? "Loading..."
                        : currentUser.display_name
                }
                username={
                    loading
                        ? "loading"
                        : currentUser.username
                }
                bannerUrl={
                    loading
                        ? null
                        : currentUser.banner_url
                }
                projectCount={currentUser.project_count ?? 0}
                followersCount={currentUser.followers_count ?? 0}
                liveProjectsCount={currentUser.live_projects_count ?? 0}
                buildStreakDays={currentUser.build_streak_days ?? 0}
                stackStats={currentUser.stack_stats ?? []}
            />

            {/* MOBILE BOTTOM NAV */}

            <MobileBottomNav
                navItems={navItems}
                avatarUrl={
                    loading
                        ? null
                        : currentUser.avatar_url
                }
            />

            {/* FLOATING CREATE BUTTON */}

            <FloatingCreateButton
                onClick={() => setShowCreateModal(true)}
            />

            {/* APP NOTICE POPUP */}

            <AppNoticeManager />
        </div>
    );
}