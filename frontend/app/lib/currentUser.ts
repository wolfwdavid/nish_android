"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import api from "./api"



import type { CurrentUser } from "./type/currentUser"



export default function useCurrentUser() {

    const { user } = useUser()

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")

    const [currentUser, setCurrentUser] =
        useState<CurrentUser | null>(null)



    useEffect(() => {

        if (!user?.id) {
            setLoading(false)
            return
        }

        const fetchCurrentUser = async () => {

            try {

                setLoading(true)

                setError("")

                const result = await api.get(
                    `/profile/me?clerk_user_id=${user.id}`
                )

                setCurrentUser(result.data)

            } catch (err) {

                console.error(err)

                setError(
                    "There was a problem loading current user"
                )

            } finally {

                setLoading(false)

            }

        }

        fetchCurrentUser()

    }, [user?.id])



    return {
        currentUser,
        loading,
        error,
    }
}