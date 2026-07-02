'use client'

import {
    useState,
    useEffect,
    useRef,
} from 'react'

import { useRouter } from 'next/navigation'

import { useUser } from '@clerk/nextjs'

import { gsap } from 'gsap'

import api from '../lib/api'

import LeftPanel from './components/LeftPanel'

import ProgressBar from './components/ProgressBar'

import IdentityStep from './components/IdentityStep'

import VisualStep from './components/VisualStep'

import SocialStep from './components/SocialStep'

import LocationStep from './components/LocationStep'
import FinalGuideStep from './components/FinalGuideStep'

export default function OnBoardingPage() {

    const router = useRouter()

    const { user, isLoaded } = useUser()

    const cardRef = useRef<HTMLDivElement>(null)

    const [step, setStep] = useState(1)

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')


    // =========================================================
    // FORM STATE
    // =========================================================

    const [username, setUsername] = useState('')

    const [displayName, setDisplayName] = useState('')

    const [bio, setBio] = useState('')

    const [avatarUrl, setAvatarUrl] = useState('')

    const [bannerUrl, setBannerUrl] = useState('')

    const [githubUrl, setGithubUrl] = useState('')

    const [linkedinUrl, setLinkedinUrl] = useState('')

    const [portfolioUrl, setPortfolioUrl] = useState('')

    const [instagramUrl, setInstagramUrl] = useState('')

    const [location, setLocation] = useState('')

    const [currentBuild, setCurrentBuild] = useState('')


    // =========================================================
    // PREFILL
    // =========================================================

    useEffect(() => {

        if (!user) return

        if (!displayName) {
            setDisplayName(user.fullName || '')
        }

        if (!avatarUrl) {
            setAvatarUrl(user.imageUrl || '')
        }

        if (!username) {

            const generatedUsername =
                user.username ||
                user.primaryEmailAddress?.emailAddress
                    ?.split('@')[0]
                    ?.replace(/[^a-zA-Z0-9_]/g, '')
                    ?.toLowerCase()

            if (generatedUsername) {
                setUsername(generatedUsername)
            }
        }

    }, [user])


    // =========================================================
    // AUTH GUARD
    // =========================================================

    useEffect(() => {

        if (isLoaded && !user) {
            router.push('/sign-in')
        }

    }, [isLoaded, user, router])


    // =========================================================
    // GSAP STEP TRANSITION
    // =========================================================

    useEffect(() => {

        if (!cardRef.current) return

        gsap.fromTo(
            cardRef.current,
            {
                opacity: 0,
                y: 40,
                scale: 0.98,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: 'power3.out',
            }
        )

    }, [step])


    // =========================================================
    // FINAL SUBMIT
    // =========================================================

    const handleFinalSubmit = async () => {

        if (!user?.id) {
            setError('User session missing. Please sign in again.')
            return
        }

        try {

            setLoading(true)

            setError('')

            await api.post(
                '/sync_user/onboarding',
                {
                    clerk_user_id: user.id,

                    username: username.trim(),

                    display_name: displayName.trim(),

                    bio: bio.trim() || null,

                    avatar_url: avatarUrl || null,

                    banner_url: bannerUrl || null,

                    github_url: githubUrl.trim() || null,

                    linkedin_url: linkedinUrl.trim() || null,

                    portfolio_url: portfolioUrl.trim() || null,

                    instagram_url: instagramUrl.trim() || null,

                    location: location.trim() || null,

                    current_build: currentBuild.trim() || null,
                }
            )

            router.push('/sync')

        } catch (err: any) {

            console.error(err)

            setError(
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                'Something went wrong.'
            )

        } finally {

            setLoading(false)
        }
    }


    return (
        <div
            className="
                min-h-screen
                overflow-hidden
                bg-black
                text-white
                relative
            "
        >

            {/* BACKGROUND */}

            <div
                className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_30%)]
                "
            />

            <div
                className="
                    absolute
                    inset-0
                    opacity-[0.03]
                    bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
                    bg-size-[80px_80px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    max-w-7xl
                    mx-auto
                    min-h-screen
                    px-4
                    py-6
                    sm:px-6
                    lg:px-12
                    grid
                    lg:grid-cols-2
                    gap-10
                    lg:gap-16
                    items-center
                "
            >

                <LeftPanel />

                <div
                    className="
                        relative
                        mx-auto
                        w-full
                        max-w-2xl
                    "
                >

                    <div
                        className="
                            absolute
                            inset-0
                            rounded-[40px]
                            bg-linear-to-br
                            from-red-500/20
                            via-orange-500/10
                            to-transparent
                            blur-3xl
                        "
                    />

                    <div
                        ref={cardRef}
                        className="
                            relative
                            rounded-[28px]
                            border
                            border-white/10
                            bg-white/4
                            backdrop-blur-2xl
                            p-5
                            sm:p-8
                            lg:rounded-[40px]
                            lg:p-10
                            shadow-[0_0_100px_rgba(239,68,68,0.08)]
                        "
                    >

                        {/* HEADER */}

                        <div className="mb-8">

                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            sm:text-sm
                                            uppercase
                                            tracking-[0.2em]
                                            text-orange-400
                                        "
                                    >
                                        Builder Profile Setup
                                    </p>

                                    <h1
                                        className="
                                            mt-3
                                            text-3xl
                                            sm:text-4xl
                                            font-black
                                            tracking-[-0.06em]
                                        "
                                    >
                                        Complete onboarding
                                    </h1>

                                </div>

                                <div
                                    className="
                                        shrink-0
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/4
                                        px-3
                                        py-2
                                        sm:px-4
                                        sm:py-3
                                        text-xs
                                        sm:text-sm
                                        text-zinc-400
                                    "
                                >
                                    Step {step} / 5
                                </div>

                            </div>

                            <div className="mt-8">
                                <ProgressBar step={step} />
                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div
                                className="
                                    mb-6
                                    rounded-2xl
                                    border
                                    border-red-500/20
                                    bg-red-500/10
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-300
                                "
                            >
                                {error}
                            </div>
                        )}


                        {/* STEP 1 */}

                        {step === 1 && (
                            <IdentityStep
                                username={username}
                                setUsername={setUsername}

                                displayName={displayName}
                                setDisplayName={setDisplayName}

                                bio={bio}
                                setBio={setBio}

                                currentBuild={currentBuild}
                                setCurrentBuild={setCurrentBuild}

                                onContinue={() => setStep(2)}
                            />
                        )}


                        {/* STEP 2 */}

                        {step === 2 && (
                            <VisualStep
                                avatarUrl={avatarUrl}
                                setAvatarUrl={setAvatarUrl}

                                bannerUrl={bannerUrl}
                                setBannerUrl={setBannerUrl}

                                onBack={() => setStep(1)}

                                onContinue={() => setStep(3)}
                            />
                        )}


                        {/* STEP 3 */}

                        {step === 3 && (
                            <SocialStep
                                githubUrl={githubUrl}
                                setGithubUrl={setGithubUrl}

                                linkedinUrl={linkedinUrl}
                                setLinkedinUrl={setLinkedinUrl}

                                portfolioUrl={portfolioUrl}
                                setPortfolioUrl={setPortfolioUrl}

                                instagramUrl={instagramUrl}
                                setInstagramUrl={setInstagramUrl}

                                onBack={() => setStep(2)}
                                onContinue={() => setStep(4)}
                            />
                        )}


                        {/* STEP 4 */}

                        {step === 4 && (
                            <LocationStep
                                location={location}
                                setLocation={setLocation}
                                onBack={() => setStep(3)}
                                onContinue={() => setStep(5)}
                                onSkip={() => setStep(5)}
                            />
                        )}


                        {/* STEP 5 */}

                        {step === 5 && (
                            <FinalGuideStep
                                onBack={() => setStep(4)}
                                onSubmit={handleFinalSubmit}
                                loading={loading}
                            />
                        )}

                    </div>

                </div>

            </div>

        </div>
    )
}