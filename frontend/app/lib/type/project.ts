export interface ProjectData {

    title: string

    slug: string

    description: string

    github_url: string

    live_url?: string

    thumbnail_url?: string

    demo_video_url?: string

    gallery_urls: string[]

    tech_stack: string[]
}


export type GetProject = {

    id: string

    user_id: string

    title: string

    slug: string

    description: string

    github_url: string

    live_url: string | null

    thumbnail_url: string | null

    demo_video_url: string | null

    gallery_urls: string[]

    tech_stack: string[]

    stars_count: number

    views_count: number

    comments_count: number

    is_featured: boolean

    is_starred: boolean

    is_bookmarked: boolean

    user: ProjectAuthor

    created_at: string

    updated_at: string
}


export type ProjectAuthor = {

    id: string

    username: string

    display_name: string

    avatar_url: string | null

    location: string | null

}