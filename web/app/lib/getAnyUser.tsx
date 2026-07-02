"use client"

import { useState, useEffect } from "react"

import api from "./api"

import type { GetProfileData }
from "./type/profile"



export default function useAnyProfile({
    username
}: {
    username: string
}) {

    const [profileLoading, setProfileLoading] =
        useState(false)

    const [profileError, setProfileError] =
        useState("")

    const [profileData, setProfileData] =
        useState<GetProfileData | null>(null)



    useEffect(() => {

        if (!username) return

        const fetchAnyUserProfile =
            async () => {

            try {

                setProfileError("")

                setProfileLoading(true)

                const res = await api.get(
                    `/profile/${username}`
                )

                setProfileData(res.data)

            } catch (err) {

                setProfileError(
                    "There was a problem fetching profile"
                )

                console.error(err)

            } finally {

                setProfileLoading(false)
            }
        }

        fetchAnyUserProfile()

    }, [username])



    return {
        profileData,
        profileLoading,
        profileError
    }
}