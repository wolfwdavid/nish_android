export interface LiveProjectCodeSnippet {

    language: string

    code: string

}



export interface LiveProjectProblemSolution {

    problem: string

    solution: string

}



export type LiveProjectJournalEntryType =
    | "progress"
    | "milestone"
    | "bugfix"
    | "deployment"
    | "architecture"
    | "announcement"
    | "failure";

export type PublicUser = {
    id?: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
};

export type GetLiveProjectJournal = {

    id: string

    live_project_id: string

    user_id: string

    day_number: number

    entry_type: LiveProjectJournalEntryType

    title?: string | null

    content: string

    progress_percentage: number | null

    code_snippets: LiveProjectCodeSnippet[]

    problem_solutions: LiveProjectProblemSolution[]

    media_urls: string[]

    likes_count: number

    comments_count: number

    parent_id?: string | null

    created_at: string

    updated_at: string

    user?: PublicUser

    author?: PublicUser

}


export interface GetLiveProject {

    id: string

    user_id: string

    user: PublicUser

    days_count: number

    title: string

    slug: string

    goal: string

    description: string | null

    current_status: string | null

    current_goal: string | null

    progress_percentage: number

    status:
        | "active"
        | "paused"
        | "completed"
        | "abandoned"

    category: string | null

    github_url: string | null

    live_url: string | null

    demo_video_url: string | null

    thumbnail_url: string | null

    gallery_urls: string[]

    tech_stack: string[]

    is_public: boolean

    is_featured: boolean

    views_count: number

    journal_count: number

    created_at: string

    updated_at: string

    completed_at: string | null

}



export interface CreateLiveProject {

    title: string

    slug: string

    goal: string

    description?: string | null

    current_status?: string | null

    current_goal?: string | null

    progress_percentage?: number

    category?: string | null

    github_url?: string | null

    live_url?: string | null

    demo_video_url?: string | null

    thumbnail_url?: string | null

    gallery_urls?: string[]

    tech_stack?: string[]

    is_public?: boolean

    is_draft?: boolean

}



export interface UpdateLiveProject {

    title?: string

    slug?: string

    goal?: string

    description?: string | null

    current_status?: string | null

    current_goal?: string | null

    progress_percentage?: number

    status?:
        | "active"
        | "paused"
        | "completed"
        | "abandoned"

    category?: string | null

    github_url?: string | null

    live_url?: string | null

    demo_video_url?: string | null

    thumbnail_url?: string | null

    gallery_urls?: string[]

    tech_stack?: string[]

    is_public?: boolean

    is_featured?: boolean

}



export interface CreateJournalEntry {

    day_number: number

    content: string

    entry_type: LiveProjectJournalEntryType

    media_urls?: string[]

    code_snippets?: LiveProjectCodeSnippet[]

    problem_solutions?: LiveProjectProblemSolution[]

    progress_percentage?: number | null

}



export interface UpdateJournalEntry {

    content?: string

    entry_type?: LiveProjectJournalEntryType

    media_urls?: string[]

    code_snippets?: LiveProjectCodeSnippet[]

    problem_solutions?: LiveProjectProblemSolution[]

    progress_percentage?: number | null

}




export interface CreateLiveProjectJournalComment {

    content: string

    parent_id?: string | null

}



export interface UpdateLiveProjectJournalComment {

    content: string

}



export interface GetLiveProjectJournalComment {

    id: string

    user_id: string

    journal_id: string

    parent_id: string | null

    content: string

    likes_count: number

    is_edited: boolean

    deleted_at: string | null

    created_at: string

    updated_at: string

}



export interface GetLiveProjectJournalLike {

    id: string

    user_id: string

    journal_id: string

    created_at: string

}



export interface LiveProjectAnalytics {

    total_views: number

    total_journal_entries: number

    total_likes: number

    total_comments: number

    average_progress_per_day: number

    most_used_tech_stack: string[]

    active_days: number

}



export interface LiveProjectReaction {

    liked: boolean

    bookmarked: boolean

}



export interface LiveProjectComment {

    id: string

    username: string

    avatar_url?: string | null

    content: string

    created_at: string

}



export type LiveProjectStatus =
    GetLiveProject["status"]



export type JournalEntryType =
    GetLiveProjectJournal["entry_type"]