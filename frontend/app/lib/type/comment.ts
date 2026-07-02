
export type CommentData = {
    content : string 
    parent_id : string | null
}

export type GetComment = {

    id: string

    user_id: string

    project_id: string

    parent_id: string | null

    content: string

    upvotes_count: number

    downvotes_count: number

    score: number

    is_edited: boolean

    created_at: string

    updated_at: string

    user: CommentUser

    replies: GetComment[]
}

export type CommentUser = {

    id: string

    username: string

    display_name: string

    avatar_url: string | null
}