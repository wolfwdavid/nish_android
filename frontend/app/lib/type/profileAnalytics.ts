// =========================================================
// STACK STATS
// =========================================================

export type UserStackStat = {
    id: string;

    stack_name: string;

    projects_count: number;

    live_projects_count: number;

    journal_entries_count: number;

    score: number;

    level: number;

    last_used_at: string | null;
};


// =========================================================
// PROJECT
// =========================================================

export type ProfileProject = {
    id: string;

    title: string;

    slug: string;

    description: string | null;

    github_url: string | null;

    live_url: string | null;

    thumbnail_url: string | null;

    tech_stack: string[];

    stars_count: number;

    views_count: number;

    comments_count: number;

    created_at: string;
};


// =========================================================
// LIVE PROJECT
// =========================================================

export type ProfileLiveProject = {
    current_goal: string;
    id: string;

    title: string;

    slug: string;

    goal: string;

    progress_percentage: number;

    status: string;

    tech_stack: string[];

    journal_count: number;

    views_count: number;

    created_at: string;
};


// =========================================================
// FULL PROFILE
// =========================================================

export type UserFullProfile = {
    id: string;

    clerk_user_id: string;

    username: string;

    display_name: string | null;

    email: string;

    bio: string | null;

    avatar_url: string | null;

    banner_url: string | null;

    github_url: string | null;

    linkedin_url: string | null;

    portfolio_url: string | null;

    instagram_url: string | null;

    location: string | null;

    current_build: string | null;

    joined_date: string;

    reputation_score: number;

    followers_count: number;

    following_count: number;

    posts_count: number;

    project_count: number;

    projects: ProfileProject[];

    live_projects: ProfileLiveProject[];

    stack_stats: UserStackStat[];
};