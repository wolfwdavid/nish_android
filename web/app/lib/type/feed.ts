export type FeedEvent = {

    id: string

    event_type: string

    content: string | null

    created_at: string

    event_metadata: Record<string, any>

    user: {

        username: string

        display_name: string

        avatar_url: string | null

    }

    live_project: {

        title: string

        slug: string

    } | null

}