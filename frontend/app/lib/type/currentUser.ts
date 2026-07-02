export type CurrentUser = {
    id : string

    username: string

    display_name: string

    clerk_user_id : string 

    avatar_url: string | null

    bio?: string | null

    github_url?: string | null

    linkedin_url?: string | null

    portfolio_url?: string | null
}