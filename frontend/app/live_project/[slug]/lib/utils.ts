export function cn(

    ...classes: (
        string |
        false |
        null |
        undefined
    )[]

) {

    return classes
        .filter(Boolean)
        .join(" ")

}



export function truncateText(

    text: string,

    maxLength: number = 120

) {

    if (
        text.length <= maxLength
    ) {

        return text

    }



    return (
        text.slice(
            0,
            maxLength
        ) + "..."
    )

}



export function generateSlug(

    text: string

) {

    return text
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9\s-]/g,
            ""
        )
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")

}



export function getProgressLabel(

    progress: number

) {

    if (progress >= 100)
        return "Completed"

    if (progress >= 80)
        return "Final Stretch"

    if (progress >= 60)
        return "Major Progress"

    if (progress >= 40)
        return "Building Momentum"

    if (progress >= 20)
        return "Early Build Phase"

    return "Project Started"

}



export function getProgressColor(

    progress: number

) {

    if (progress >= 100) {

        return {

            text:
                "text-emerald-300",

            bg:
                "bg-emerald-500/10",

            border:
                "border-emerald-500/20",

            gradient:
                "from-emerald-700 via-emerald-500 to-emerald-400",

        }

    }



    if (progress >= 75) {

        return {

            text:
                "text-orange-300",

            bg:
                "bg-orange-500/10",

            border:
                "border-orange-500/20",

            gradient:
                "from-orange-700 via-orange-500 to-orange-400",

        }

    }



    if (progress >= 40) {

        return {

            text:
                "text-yellow-300",

            bg:
                "bg-yellow-500/10",

            border:
                "border-yellow-500/20",

            gradient:
                "from-yellow-700 via-yellow-500 to-yellow-400",

        }

    }



    return {

        text:
            "text-zinc-300",

        bg:
            "bg-zinc-500/10",

        border:
            "border-zinc-500/20",

        gradient:
            "from-zinc-700 via-zinc-500 to-zinc-400",

    }

}



export function calculateProjectAge(

    created_at: string

) {

    const created =
        new Date(created_at)
            .getTime()



    const now =
        Date.now()



    return Math.max(
        1,
        Math.floor(
            (
                now - created
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        )
    )

}



export function sortJournalsByNewest(

    journals: {
        created_at: string
    }[]

) {

    return [...journals].sort(
        (a, b) =>
            new Date(
                b.created_at
            ).getTime() -
            new Date(
                a.created_at
            ).getTime()
    )

}



export function sortJournalsByOldest(

    journals: {
        created_at: string
    }[]

) {

    return [...journals].sort(
        (a, b) =>
            new Date(
                a.created_at
            ).getTime() -
            new Date(
                b.created_at
            ).getTime()
    )

}



export function countWords(

    text: string

) {

    return text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length

}



export function readingTime(

    text: string

) {

    const words =
        countWords(text)



    const minutes =
        Math.ceil(words / 200)



    return `${minutes} min read`

}



export function isValidUrl(

    value: string

) {

    try {

        new URL(value)

        return true

    }

    catch {

        return false

    }

}



export function getYouTubeEmbedUrl(

    url: string

) {

    if (!url) return ""



    if (
        url.includes("youtube.com")
    ) {

        const parsed =
            new URL(url)

        const id =
            parsed.searchParams.get(
                "v"
            )



        return id
            ? `https://www.youtube.com/embed/${id}`
            : url

    }



    if (url.includes("youtu.be")) {

        const id =
            url.split("/")
                .pop()



        return `https://www.youtube.com/embed/${id}`

    }



    return url

}



export function formatNumber(

    value: number

) {

    return new Intl.NumberFormat(
        "en-US"
    ).format(value)

}



export function clamp(

    value: number,

    min: number,

    max: number

) {

    return Math.min(
        Math.max(value, min),
        max
    )

}



export function randomId() {

    return crypto.randomUUID()

}