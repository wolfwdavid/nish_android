"use client"

import { useEffect, useMemo, useState } from "react"



interface UseProjectProgressProps {

    initialProgress?: number

    targetProgress?: number

    animationDuration?: number

}



export default function useProjectProgress({

    initialProgress = 0,

    targetProgress = 0,

    animationDuration = 900,

}: UseProjectProgressProps) {



    const [progress, setProgress] =
        useState(initialProgress)



    const [animating, setAnimating] =
        useState(false)



    useEffect(() => {

        if (
            targetProgress === progress
        ) {
            return
        }



        let frame: number

        let startTime: number | null =
            null



        const start =
            progress

        const distance =
            targetProgress - start



        setAnimating(true)



        function animate(
            timestamp: number
        ) {

            if (!startTime)
                startTime = timestamp



            const elapsed =
                timestamp - startTime



            const rawProgress =
                Math.min(
                    elapsed /
                    animationDuration,
                    1
                )



            /*
                easeOutQuart
            */

            const eased =
                1 -
                Math.pow(
                    1 - rawProgress,
                    4
                )



            const nextValue =
                Math.round(
                    start +
                    distance * eased
                )



            setProgress(nextValue)



            if (rawProgress < 1) {

                frame =
                    requestAnimationFrame(
                        animate
                    )

            }

            else {

                setAnimating(false)

            }

        }



        frame =
            requestAnimationFrame(
                animate
            )



        return () =>
            cancelAnimationFrame(frame)

    }, [
        targetProgress,
        animationDuration,
    ])



    const progressLabel =
        useMemo(() => {

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

        }, [progress])



    const progressColor =
        useMemo(() => {

            if (progress >= 100)
                return "emerald"

            if (progress >= 75)
                return "orange"

            if (progress >= 40)
                return "yellow"

            return "zinc"

        }, [progress])



    function increaseProgress(
        amount: number = 1
    ) {

        setProgress((prev) =>
            Math.min(
                100,
                prev + amount
            )
        )

    }



    function decreaseProgress(
        amount: number = 1
    ) {

        setProgress((prev) =>
            Math.max(
                0,
                prev - amount
            )
        )

    }



    function resetProgress() {

        setProgress(0)

    }



    return {

        progress,

        setProgress,



        animating,



        progressLabel,

        progressColor,



        increaseProgress,

        decreaseProgress,

        resetProgress,

    }

}