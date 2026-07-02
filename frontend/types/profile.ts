
export type ProfileData = {

    clerk_user_id: string

    username: string

    display_name: string

    bio: string

    avatar_url: string

    banner_url: string

    github_url: string

    linkedin_url: string

    portfolio_url: string

    instagram_url: string

    email: string

    reputation_score: number

    followers_count: number

    following_count: number

    posts_count: number

    project_count: number

    location: string

    current_build: string

    joined_date: string
}



export type ProfileHeaderProps = {

    profileData: ProfileData

    loading?: boolean

    error?: string

    isOwner?: boolean
}