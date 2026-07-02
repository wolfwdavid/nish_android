export function formatRelativeTime(

    date: string | Date

) {

    const now =
        new Date().getTime()

    const target =
        new Date(date).getTime()

    const diff =
        now - target



    const seconds =
        Math.floor(diff / 1000)

    const minutes =
        Math.floor(seconds / 60)

    const hours =
        Math.floor(minutes / 60)

    const days =
        Math.floor(hours / 24)

    const weeks =
        Math.floor(days / 7)

    const months =
        Math.floor(days / 30)

    const years =
        Math.floor(days / 365)



    if (seconds < 60) {

        return "just now"

    }



    if (minutes < 60) {

        return `${minutes}m ago`

    }



    if (hours < 24) {

        return `${hours}h ago`

    }



    if (days < 7) {

        return `${days}d ago`

    }



    if (weeks < 5) {

        return `${weeks}w ago`

    }



    if (months < 12) {

        return `${months}mo ago`

    }



    return `${years}y ago`

}



export function formatFullDate(

    date: string | Date

) {

    return new Date(date)
        .toLocaleDateString(
            "en-US",
            {

                year: "numeric",

                month: "long",

                day: "numeric",

            }
        )

}



export function formatFullDateTime(

    date: string | Date

) {

    return new Date(date)
        .toLocaleString(
            "en-US",
            {

                year: "numeric",

                month: "long",

                day: "numeric",

                hour: "numeric",

                minute: "2-digit",

            }
        )

}



export function getDayNumber(

    created_at: string

) {

    const created =
        new Date(created_at)
            .getTime()



    const now =
        Date.now()



    const diff =
        now - created



    return Math.max(
        1,
        Math.floor(
            diff /
            (
                1000 *
                60 *
                60 *
                24
            )
        ) + 1
    )

}



export function daysBetween(

    start: string | Date,

    end: string | Date

) {

    const startDate =
        new Date(start).getTime()

    const endDate =
        new Date(end).getTime()



    const diff =
        endDate - startDate



    return Math.floor(
        diff /
        (
            1000 *
            60 *
            60 *
            24
        )
    )

}



export function isToday(

    date: string | Date

) {

    const target =
        new Date(date)

    const today =
        new Date()



    return (

        target.getDate() ===
        today.getDate() &&

        target.getMonth() ===
        today.getMonth() &&

        target.getFullYear() ===
        today.getFullYear()

    )

}



export function getGreeting() {

    const hour =
        new Date().getHours()



    if (hour < 12) {

        return "Good morning"

    }



    if (hour < 18) {

        return "Good afternoon"

    }



    return "Good evening"

}



export function estimateCompletionDate(

    progress: number,

    created_at: string

) {

    if (progress <= 0) {

        return null

    }



    const started =
        new Date(created_at)
            .getTime()



    const now =
        Date.now()



    const elapsedDays =
        (
            now - started
        ) /
        (
            1000 *
            60 *
            60 *
            24
        )



    const estimatedTotalDays =
        (
            elapsedDays /
            progress
        ) * 100



    const remainingDays =
        estimatedTotalDays -
        elapsedDays



    const completionDate =
        new Date(
            now +
            remainingDays *
            24 *
            60 *
            60 *
            1000
        )



    return completionDate

}



export function formatDuration(

    seconds: number

) {

    const hrs =
        Math.floor(seconds / 3600)

    const mins =
        Math.floor(
            (seconds % 3600) / 60
        )

    const secs =
        seconds % 60



    if (hrs > 0) {

        return `${hrs}h ${mins}m`

    }



    if (mins > 0) {

        return `${mins}m ${secs}s`

    }



    return `${secs}s`

}