"use client"

import {
    useEffect,
    useState,
} from "react"

import { useUser } from "@clerk/nextjs"

import api from "@/app/lib/api"

import type { GetProject }
from "@/app/lib/type/project"

import ProjectCard from "./components/ProjectCard"

import {
    Bookmark,
} from "lucide-react"



export default function GetBookmarks() {

    const { user } = useUser()



    const [
        bookmarks,
        setBookmarks,
    ] = useState<GetProject[]>([])



    const [
        loading,
        setLoading,
    ] = useState(true)



    const [
        error,
        setError,
    ] = useState("")



    // =====================================================
    // FETCH BOOKMARKS
    // =====================================================

    useEffect(() => {

        const fetchBookmarks =
            async () => {

                if (!user?.id)
                    return

                try {

                    setLoading(true)

                    const response =
                        await api.get(
                            "/bookmarks/me",
                            {
                                params: {
                                    clerk_user_id:
                                        user.id,
                                },
                            }
                        )

                    setBookmarks(
                        response.data
                    )

                } catch (err) {

                    console.error(err)

                    setError(
                        "Failed to load bookmarks"
                    )

                } finally {

                    setLoading(false)
                }
            }

        fetchBookmarks()

    }, [user?.id])



    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-4
                    "
                >

                    <div
                        className="
                            h-10
                            w-10

                            animate-spin

                            rounded-full

                            border-2
                            border-zinc-800
                            border-t-orange-500
                        "
                    />

                    <p
                        className="
                            text-sm
                            text-zinc-500
                        "
                    >
                        Loading bookmarks...
                    </p>

                </div>

            </div>
        )
    }



    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-6
                "
            >

                <div
                    className="
                        rounded-3xl

                        border
                        border-red-500/20

                        bg-red-500/10

                        px-8
                        py-6

                        text-center

                        backdrop-blur-xl
                    "
                >

                    <p
                        className="
                            text-red-400
                        "
                    >
                        {error}
                    </p>

                </div>

            </div>
        )
    }



    // =====================================================
    // EMPTY
    // =====================================================

    if (bookmarks.length === 0) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center

                    px-6
                "
            >

                <div
                    className="
                        relative

                        w-full
                        max-w-xl

                        overflow-hidden

                        rounded-4xl

                        border
                        border-zinc-900

                        bg-zinc-950/50

                        px-10
                        py-20

                        text-center

                        backdrop-blur-2xl
                    "
                >

                    {/* glow */}

                    <div
                        className="
                            absolute
                            left-1/2
                            top-0

                            h-40
                            w-40

                            -translate-x-1/2

                            rounded-full

                            bg-orange-500/10

                            blur-3xl
                        "
                    />



                    <div
                        className="
                            relative
                            z-10
                        "
                    >

                        <div
                            className="
                                mx-auto

                                flex
                                h-20
                                w-20

                                items-center
                                justify-center

                                rounded-3xl

                                border
                                border-orange-500/20

                                bg-orange-500/10
                            "
                        >

                            <Bookmark
                                size={34}
                                className="
                                    text-orange-400
                                "
                            />

                        </div>



                        <h1
                            className="
                                mt-8

                                text-3xl
                                font-black

                                tracking-tight

                                text-white

                                sm:text-4xl
                            "
                        >
                            No bookmarks yet
                        </h1>



                        <p
                            className="
                                mx-auto
                                mt-4

                                max-w-md

                                text-sm
                                leading-relaxed

                                text-zinc-500

                                sm:text-base
                            "
                        >

                            Save projects you want
                            to revisit, study,
                            clone, or admire later.

                        </p>

                    </div>

                </div>

            </div>
        )
    }

    const removeBookmark =
                    async (
                        slug: string,
                        projectId: string,
                    ) => {

                        if (!user?.id)
                            return

                        try {

                            await api.delete(
                                `/projects/${slug}/bookmark`,
                                {
                                    params: {
                                        clerk_user_id:
                                            user.id,
                                    },
                                }
                            )

                            // ====================================
                            // REMOVE FROM UI INSTANTLY
                            // ====================================

                            setBookmarks((prev) =>
                                prev.filter(
                                    (project) =>
                                        project.id !== projectId
                                )
                            )

                        } catch (err) {

                            console.error(err)
                        }
                }



    // =====================================================
    // SUCCESS
    // =====================================================

    return (

        <div
            className="
                min-h-screen

                px-4
                py-8

                sm:px-6

                lg:px-8
            "
        >

            {/* HEADER */}

            <div
                className="
                    mx-auto

                    mb-10

                    flex
                    max-w-2xl
                    items-center
                    justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-black

                            tracking-tight

                            text-white

                            sm:text-4xl
                        "
                    >

                        Bookmarks

                    </h1>

                    

                </div>



                <div
                    className="
                        rounded-2xl

                        border
                        border-zinc-800

                        bg-zinc-900/60

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-zinc-300
                    "
                >

                    {bookmarks.length}

                </div>

            </div>



            {/* FEED */}

            <div
                className="
                    mx-auto

                    flex
                    max-w-2xl
                    flex-col

                    gap-8
                "
            >

                {
                    bookmarks.map(
                        (project) => (

                           <ProjectCard

                                key={project.id}

                                project={project}

                                onUnbookmark={() =>
                                    removeBookmark(
                                        project.slug,
                                        project.id,
                                    )
                                }
                            />
                        )
                    )
                }

            </div>

        </div>
    )
}