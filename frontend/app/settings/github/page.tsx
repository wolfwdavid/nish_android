'use client'

import { useEffect, useMemo, useState } from 'react'
import type React from 'react'
import Link from 'next/link'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    ArrowLeft,
    ArrowUpRight,
    BadgeCheck,
    BookOpen,
    CheckCircle2,
    Code2,
    ExternalLink,
    Eye,
    FileCode2,
    Github,
    GitBranch,
    Globe2,
    Info,
    KeyRound,
    Layers3,
    Loader2,
    Lock,
    RefreshCcw,
    Save,
    ShieldCheck,
    Sparkles,
    TriangleAlert,
    XCircle,
    Zap,
} from 'lucide-react'


type CurrentUser = {
    id?: string
    clerk_user_id?: string
    username?: string
    display_name?: string
    github_url?: string | null
    github_username?: string | null
}


const SYNC_FEATURES = [
    {
        title: 'Stack detection',
        description:
            'Detect technologies from public repo files like package.json, requirements.txt, pyproject.toml, and more.',
        icon: Layers3,
        active: true,
    },
    {
        title: 'README context',
        description:
            'Use public README content to understand what the project is about.',
        icon: BookOpen,
        active: true,
    },
    {
        title: 'Project credibility',
        description:
            'Show GitHub links beside your projects so people can verify the source.',
        icon: BadgeCheck,
        active: true,
    },
    {
        title: 'Commit activity',
        description:
            'Later, DevManiac will use commits to show build consistency and progress.',
        icon: GitBranch,
        active: false,
    },
]

const COMING_SOON = [
    {
        title: 'GitHub OAuth',
        description:
            'Connect your GitHub account directly instead of only using public URLs.',
        icon: KeyRound,
    },
    {
        title: 'Private repo import',
        description:
            'Choose private repositories to turn into projects without exposing private code.',
        icon: Lock,
    },
    {
        title: 'Auto project creation',
        description:
            'Import a repo and let DevManiac create a project draft automatically.',
        icon: RefreshCcw,
    },
    {
        title: 'Commit timeline',
        description:
            'Turn real commit history into a visible consistency graph.',
        icon: GitBranch,
    },
]


export default function GitHubSettingsPage() {
    const { user, isLoaded } = useUser()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [githubUrl, setGithubUrl] = useState('')
    const [originalGithubUrl, setOriginalGithubUrl] = useState('')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [autoDetectStack, setAutoDetectStack] = useState(true)
    const [showGithubStats, setShowGithubStats] = useState(true)
    const [useReadmeContext, setUseReadmeContext] = useState(true)

    const clerkUserId = user?.id

    const githubUsername = useMemo(() => {
        return extractGithubUsername(githubUrl)
    }, [githubUrl])

    const isValidGithubUrl = useMemo(() => {
        if (!githubUrl.trim()) return true

        return Boolean(githubUsername)
    }, [githubUrl, githubUsername])

    const hasChanges =
        githubUrl.trim() !== originalGithubUrl.trim()

    useEffect(() => {
        if (!isLoaded) return

        if (!clerkUserId) {
            setLoading(false)
            return
        }

        fetchCurrentUser()
    }, [isLoaded, clerkUserId])

    async function fetchCurrentUser() {
        try {
            setLoading(true)
            setError('')
            setSuccess('')

            const res = await api.get('/profile/me', {
                params: {
                    clerk_user_id: clerkUserId,
                },
            })

            const data: CurrentUser = res.data

            const savedGithubUrl =
                data.github_url ||
                buildGithubUrlFromUsername(data.github_username) ||
                ''

            setGithubUrl(savedGithubUrl)
            setOriginalGithubUrl(savedGithubUrl)
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not load your GitHub settings.'

            setError(String(detail))
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        if (!clerkUserId) {
            setError('You must be logged in to save GitHub settings.')
            return
        }

        if (!isValidGithubUrl) {
            setError('Please enter a valid GitHub profile URL.')
            return
        }

        try {
            setSaving(true)
            setError('')
            setSuccess('')

            const normalizedGithubUrl = normalizeGithubUrl(githubUrl)

            await api.patch(
                '/profile/me',
                {
                    github_url: normalizedGithubUrl || null,
                    github_username:
                        extractGithubUsername(normalizedGithubUrl) ||
                        null,
                },
                {
                    params: {
                        clerk_user_id: clerkUserId,
                    },
                }
            )

            setGithubUrl(normalizedGithubUrl)
            setOriginalGithubUrl(normalizedGithubUrl)

            setSuccess('GitHub settings saved successfully.')
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not save GitHub settings.'

            setError(String(detail))
        } finally {
            setSaving(false)
        }
    }

    function handleUseMyGithub() {
        const username =
            user?.username ||
            user?.externalAccounts?.find(
                (account) =>
                    String(account.provider) === 'oauth_github'
            )?.username ||
            ''

        if (!username) {
            setError(
                'No GitHub username found from your account. Paste your GitHub profile URL manually.'
            )
            return
        }

        setGithubUrl(`https://github.com/${username}`)
        setError('')
    }

    return (
        <main className='min-h-screen bg-[#0A0A0A] px-4 py-8 text-[#F9FAFB] sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='mb-6'>
                    <Link
                        href='/settings'
                        className='inline-flex items-center gap-2 text-sm text-[#9CA3AF] transition-colors hover:text-[#F9FAFB]'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back to settings
                    </Link>
                </div>

                <section className='relative overflow-hidden rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 shadow-2xl sm:p-8'>
                    <div className='pointer-events-none absolute -left-30 -top-30 h-80 w-80 rounded-full bg-[#E8560A]/20 blur-[110px]' />
                    <div className='pointer-events-none absolute -right-30 -bottom-35 h-80 w-80 rounded-full bg-white/5 blur-[110px]' />

                    <div className='relative grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end'>
                        <div>
                            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#E8560A]'>
                                <Github className='h-3.5 w-3.5' />
                                GitHub Sync
                            </div>

                            <h1 className='max-w-3xl text-4xl font-black tracking-tighter text-[#F9FAFB] sm:text-5xl lg:text-6xl'>
                                Connect your public build history.
                            </h1>

                            <p className='mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8'>
                                DevManiac uses public GitHub links to strengthen
                                your developer identity. Your projects should not
                                only say what stack you know — they should prove
                                where and how you used it.
                            </p>

                            <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
                                {githubUsername ? (
                                    <a
                                        href={`https://github.com/${githubUsername}`}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6a1a]'
                                    >
                                        View GitHub profile
                                        <ArrowUpRight className='h-4 w-4' />
                                    </a>
                                ) : (
                                    <button
                                        type='button'
                                        onClick={handleUseMyGithub}
                                        className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6a1a]'
                                    >
                                        Try from my account
                                        <Sparkles className='h-4 w-4' />
                                    </button>
                                )}

                                <Link
                                    href='/settings/feedback'
                                    className='inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A]/70 px-5 py-3 text-sm font-semibold text-[#F9FAFB] transition hover:border-[#E8560A]/50'
                                >
                                    Suggest GitHub feature
                                    <ExternalLink className='h-4 w-4' />
                                </Link>
                            </div>
                        </div>

                        <ConnectionCard
                            loading={loading}
                            githubUsername={githubUsername}
                            githubUrl={githubUrl}
                        />
                    </div>
                </section>

                <section className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
                    <form
                        onSubmit={handleSubmit}
                        className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'
                    >
                        <div className='mb-6 flex items-start justify-between gap-4'>
                            <div>
                                <p className='mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                                    Profile link
                                </p>

                                <h2 className='text-2xl font-black tracking-[-0.03em] text-[#F9FAFB]'>
                                    Public GitHub profile
                                </h2>

                                <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                                    Paste your GitHub profile URL. Full OAuth
                                    connection comes later.
                                </p>
                            </div>

                            <div className='hidden rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A] sm:block'>
                                <Github className='h-5 w-5' />
                            </div>
                        </div>

                        {error && (
                            <div className='mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4'>
                                <div className='flex items-start gap-3 text-sm text-red-400'>
                                    <XCircle className='mt-0.5 h-4 w-4 shrink-0' />
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className='mb-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4'>
                                <div className='flex items-start gap-3 text-sm text-green-400'>
                                    <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0' />
                                    <p>{success}</p>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className='flex min-h-65 items-center justify-center rounded-3xl border border-[#2D2D2D] bg-[#0A0A0A]'>
                                <div className='flex items-center gap-3 text-sm text-[#9CA3AF]'>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Loading GitHub settings...
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className='space-y-2'>
                                    <label
                                        htmlFor='githubUrl'
                                        className='text-sm font-semibold text-[#F9FAFB]'
                                    >
                                        GitHub profile URL
                                    </label>

                                    <div
                                        className={`flex items-center gap-3 rounded-2xl border bg-[#0A0A0A] px-4 py-3 transition-colors ${
                                            isValidGithubUrl
                                                ? 'border-[#2D2D2D] focus-within:border-[#E8560A]/70'
                                                : 'border-red-500/50'
                                        }`}
                                    >
                                        <Github className='h-5 w-5 shrink-0 text-[#71717A]' />

                                        <input
                                            id='githubUrl'
                                            value={githubUrl}
                                            onChange={(event) => {
                                                setGithubUrl(
                                                    event.target.value
                                                )
                                                setError('')
                                                setSuccess('')
                                            }}
                                            placeholder='https://github.com/username'
                                            className='w-full bg-transparent text-sm text-[#F9FAFB] outline-none placeholder:text-[#52525B]'
                                        />
                                    </div>

                                    {!isValidGithubUrl && (
                                        <p className='text-xs text-red-400'>
                                            Use a valid GitHub profile URL like
                                            https://github.com/username
                                        </p>
                                    )}

                                    {githubUsername && (
                                        <div className='flex flex-wrap items-center gap-2 pt-2'>
                                            <span className='rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-3 py-1 text-xs font-semibold text-[#E8560A]'>
                                                @{githubUsername}
                                            </span>

                                            <a
                                                href={`https://github.com/${githubUsername}`}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='inline-flex items-center gap-1 text-xs font-medium text-[#9CA3AF] transition hover:text-[#F9FAFB]'
                                            >
                                                Open profile
                                                <ExternalLink className='h-3.5 w-3.5' />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className='mt-6 space-y-3'>
                                    <SettingToggle
                                        title='Auto-detect stack from repo links'
                                        description='When you add a public repo to a project, DevManiac can detect technologies automatically.'
                                        checked={autoDetectStack}
                                        onChange={setAutoDetectStack}
                                    />

                                    <SettingToggle
                                        title='Show GitHub signals on projects'
                                        description='Display useful public GitHub context beside project details later.'
                                        checked={showGithubStats}
                                        onChange={setShowGithubStats}
                                    />

                                    <SettingToggle
                                        title='Use README as project context'
                                        description='Public README content can help explain what your project does.'
                                        checked={useReadmeContext}
                                        onChange={setUseReadmeContext}
                                    />
                                </div>

                                <div className='mt-6 rounded-3xl border border-[#E8560A]/20 bg-[#E8560A]/10 p-4'>
                                    <div className='flex items-start gap-3'>
                                        <Info className='mt-0.5 h-4 w-4 shrink-0 text-[#E8560A]' />

                                        <p className='text-xs leading-6 text-[#D4D4D8]'>
                                            These toggles are MVP preferences
                                            for the UI. Full backend preference
                                            storage can be added later. The main
                                            important thing right now is saving
                                            your GitHub profile URL.
                                        </p>
                                    </div>
                                </div>

                                <div className='mt-6 flex flex-col-reverse gap-3 border-t border-[#2D2D2D] pt-5 sm:flex-row sm:items-center sm:justify-between'>
                                    <p className='text-xs text-[#71717A]'>
                                        {hasChanges
                                            ? 'You have unsaved changes.'
                                            : 'Everything is up to date.'}
                                    </p>

                                    <button
                                        type='submit'
                                        disabled={
                                            saving ||
                                            !hasChanges ||
                                            !isValidGithubUrl ||
                                            !clerkUserId
                                        }
                                        className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6a1a] disabled:cursor-not-allowed disabled:opacity-50'
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className='h-4 w-4 animate-spin' />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className='h-4 w-4' />
                                                Save GitHub settings
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <div className='space-y-6'>
                        <PublicRepoCard />

                        <PrivacyCard />
                    </div>
                </section>

                <section className='mt-6'>
                    <SectionHeader
                        eyebrow='Public repo intelligence'
                        title='What DevManiac can understand'
                        description='For MVP, DevManiac only reads public GitHub URLs that you add to your projects.'
                    />

                    <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                        {SYNC_FEATURES.map((feature) => (
                            <FeatureCard
                                key={feature.title}
                                {...feature}
                            />
                        ))}
                    </div>
                </section>

                <section className='mt-8'>
                    <SectionHeader
                        eyebrow='Coming later'
                        title='GitHub will become deeper'
                        description='Do not build these yet. They are future upgrades after the MVP proves value.'
                    />

                    <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {COMING_SOON.map((item) => (
                            <ComingSoonCard
                                key={item.title}
                                {...item}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}


function ConnectionCard({
    loading,
    githubUsername,
    githubUrl,
}: {
    loading: boolean
    githubUsername: string | null
    githubUrl: string
}) {
    const connected = Boolean(githubUsername)

    return (
        <div className='rounded-3xl border border-[#2D2D2D] bg-[#0A0A0A]/80 p-5 shadow-2xl backdrop-blur'>
            <div className='mb-5 flex items-center justify-between border-b border-[#2D2D2D] pb-4'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#71717A]'>
                        Connection
                    </p>

                    <h2 className='mt-1 text-2xl font-black text-[#F9FAFB]'>
                        {loading
                            ? 'Checking...'
                            : connected
                              ? 'Public profile added'
                              : 'Not connected yet'}
                    </h2>
                </div>

                <div
                    className={`rounded-2xl p-3 ${
                        connected
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-[#E8560A]/10 text-[#E8560A]'
                    }`}
                >
                    {connected ? (
                        <CheckCircle2 className='h-6 w-6' />
                    ) : (
                        <Github className='h-6 w-6' />
                    )}
                </div>
            </div>

            <div className='space-y-3'>
                <StatusRow
                    icon={Globe2}
                    label='Access type'
                    value='Public URLs only'
                    good
                />

                <StatusRow
                    icon={Eye}
                    label='Private repos'
                    value='Not accessed'
                    good
                />

                <StatusRow
                    icon={Code2}
                    label='Stack detection'
                    value='Available for public repos'
                    good
                />
            </div>

            <div className='mt-5 rounded-2xl border border-[#2D2D2D] bg-[#111113] p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-[#71717A]'>
                    Current profile
                </p>

                <p className='mt-2 break-all text-sm font-medium text-[#F9FAFB]'>
                    {githubUrl.trim() || 'No GitHub profile URL saved'}
                </p>

                {githubUsername && (
                    <p className='mt-2 text-xs text-[#E8560A]'>
                        @{githubUsername}
                    </p>
                )}
            </div>
        </div>
    )
}


function PublicRepoCard() {
    return (
        <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
            <div className='mb-5 flex items-start gap-3'>
                <div className='rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                    <FileCode2 className='h-5 w-5' />
                </div>

                <div>
                    <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                        How sync works
                    </p>

                    <h2 className='mt-1 text-xl font-black text-[#F9FAFB]'>
                        Repo URLs power project intelligence
                    </h2>
                </div>
            </div>

            <p className='text-sm leading-7 text-[#A1A1AA]'>
                When you create a project and paste a GitHub repo URL,
                DevManiac can read public repo metadata and detect the tech
                stack. This helps your profile become proof-based instead of
                manually written claims.
            </p>

            <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <MiniProof label='package.json' value='Next.js / React' />
                <MiniProof label='requirements.txt' value='Python / FastAPI' />
                <MiniProof label='tailwind.config' value='Tailwind CSS' />
                <MiniProof label='README.md' value='Project context' />
            </div>
        </div>
    )
}


function PrivacyCard() {
    return (
        <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
            <div className='mb-5 flex items-start gap-3'>
                <div className='rounded-2xl bg-green-500/10 p-3 text-green-400'>
                    <ShieldCheck className='h-5 w-5' />
                </div>

                <div>
                    <p className='text-xs font-bold uppercase tracking-[0.22em] text-green-400'>
                        Privacy
                    </p>

                    <h2 className='mt-1 text-xl font-black text-[#F9FAFB]'>
                        No private repo access
                    </h2>
                </div>
            </div>

            <p className='text-sm leading-7 text-[#A1A1AA]'>
                For the MVP, DevManiac does not access private repositories,
                tokens, secrets, or GitHub account permissions. It only uses
                public links you provide.
            </p>

            <div className='mt-5 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] p-4'>
                <div className='flex items-start gap-3'>
                    <TriangleAlert className='mt-0.5 h-4 w-4 shrink-0 text-[#E8560A]' />

                    <p className='text-xs leading-6 text-[#D4D4D8]'>
                        Never paste private tokens, API keys, or secrets into
                        project descriptions, README files, or feedback forms.
                    </p>
                </div>
            </div>
        </div>
    )
}


function SectionHeader({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string
    title: string
    description: string
}) {
    return (
        <div>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                {eyebrow}
            </p>

            <h2 className='mt-2 text-2xl font-black tracking-[-0.03em] text-[#F9FAFB] sm:text-3xl'>
                {title}
            </h2>

            <p className='mt-3 max-w-2xl text-sm leading-7 text-[#A1A1AA]'>
                {description}
            </p>
        </div>
    )
}


function FeatureCard({
    title,
    description,
    icon: Icon,
    active,
}: {
    title: string
    description: string
    icon: typeof Layers3
    active: boolean
}) {
    return (
        <div className='rounded-3xl border border-[#2D2D2D] bg-[#111113] p-5 transition hover:-translate-y-1 hover:border-[#E8560A]/40'>
            <div className='mb-5 flex items-center justify-between'>
                <div className='rounded-2xl bg-[#0A0A0A] p-3 text-[#E8560A]'>
                    <Icon className='h-5 w-5' />
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
                        active
                            ? 'border border-green-500/30 bg-green-500/10 text-green-400'
                            : 'border border-[#2D2D2D] bg-[#0A0A0A] text-[#71717A]'
                    }`}
                >
                    {active ? 'MVP' : 'Later'}
                </span>
            </div>

            <h3 className='text-base font-black text-[#F9FAFB]'>
                {title}
            </h3>

            <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                {description}
            </p>
        </div>
    )
}


function ComingSoonCard({
    title,
    description,
    icon: Icon,
}: {
    title: string
    description: string
    icon: typeof KeyRound
}) {
    return (
        <div className='rounded-3xl border border-[#2D2D2D] bg-[#111113] p-5'>
            <div className='flex gap-4'>
                <div className='h-fit rounded-2xl bg-[#0A0A0A] p-3 text-[#9CA3AF]'>
                    <Icon className='h-5 w-5' />
                </div>

                <div>
                    <div className='mb-2 flex flex-wrap items-center gap-2'>
                        <h3 className='font-black text-[#F9FAFB]'>
                            {title}
                        </h3>

                        <span className='rounded-full border border-[#2D2D2D] bg-[#0A0A0A] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#71717A]'>
                            Coming soon
                        </span>
                    </div>

                    <p className='text-sm leading-7 text-[#A1A1AA]'>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}


function SettingToggle({
    title,
    description,
    checked,
    onChange,
}: {
    title: string
    description: string
    checked: boolean
    onChange: (value: boolean) => void
}) {
    return (
        <button
            type='button'
            onClick={() => onChange(!checked)}
            className='flex w-full items-center justify-between gap-4 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] p-4 text-left transition hover:border-[#E8560A]/40'
        >
            <div>
                <h3 className='text-sm font-bold text-[#F9FAFB]'>
                    {title}
                </h3>

                <p className='mt-1 text-xs leading-5 text-[#9CA3AF]'>
                    {description}
                </p>
            </div>

            <span
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    checked ? 'bg-[#E8560A]' : 'bg-[#27272A]'
                }`}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        checked ? 'left-6' : 'left-1'
                    }`}
                />
            </span>
        </button>
    )
}


function StatusRow({
    icon: Icon,
    label,
    value,
    good,
}: {
    icon: typeof Globe2
    label: string
    value: string
    good?: boolean
}) {
    return (
        <div className='flex items-center justify-between gap-4 rounded-2xl border border-[#2D2D2D] bg-[#111113] px-4 py-3'>
            <div className='flex items-center gap-3'>
                <Icon
                    className={`h-4 w-4 ${
                        good ? 'text-green-400' : 'text-[#71717A]'
                    }`}
                />

                <span className='text-xs text-[#9CA3AF]'>
                    {label}
                </span>
            </div>

            <span className='text-right text-xs font-bold text-[#F9FAFB]'>
                {value}
            </span>
        </div>
    )
}


function MiniProof({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className='rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] p-4'>
            <p className='text-xs font-mono text-[#71717A]'>
                {label}
            </p>

            <p className='mt-1 text-sm font-bold text-[#F9FAFB]'>
                {value}
            </p>
        </div>
    )
}


function extractGithubUsername(value: string): string | null {
    const cleanValue = value.trim()

    if (!cleanValue) return null

    const githubPattern =
        /^(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9-]+)\/?$/

    const match = cleanValue.match(githubPattern)

    if (!match) return null

    return match[1]
}


function normalizeGithubUrl(value: string): string {
    const username = extractGithubUsername(value)

    if (!username) return ''

    return `https://github.com/${username}`
}


function buildGithubUrlFromUsername(
    username?: string | null
): string {
    if (!username) return ''

    return `https://github.com/${username}`
}