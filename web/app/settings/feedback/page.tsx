'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import Link from 'next/link'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    ArrowLeft,
    ArrowUpRight,
    Bug,
    CheckCircle2,
    Github,
    Heart,
    Lightbulb,
    Loader2,
    MessageSquareText,
    MousePointerClick,
    Rocket,
    Send,
    ShieldCheck,
    Sparkles,
    Star,
    TriangleAlert,
    X,
    XCircle,
} from 'lucide-react'


/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const MIN_TITLE = 2
const MIN_MESSAGE = 5
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const REPO_URL = 'https://github.com/nishchup489-afk/codegram'


/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type FeedbackType =
    | 'general'
    | 'bug'
    | 'idea'
    | 'ux'
    | 'praise'
    | 'complaint'

type FeedbackPayload = {
    feedback_type: FeedbackType
    rating: number | null
    title: string
    message: string
    page_url: string | null
    source: string
    allow_contact: boolean
    contact_email: string | null
    diagnostics: Record<string, unknown>
}


const FEEDBACK_TYPES: {
    value: FeedbackType
    label: string
    description: string
    icon: typeof MessageSquareText
}[] = [
    {
        value: 'general',
        label: 'General',
        description: 'Overall thoughts, confusion, or random feedback.',
        icon: MessageSquareText,
    },
    {
        value: 'ux',
        label: 'UX',
        description: 'Something feels hard, unclear, slow, or annoying.',
        icon: MousePointerClick,
    },
    {
        value: 'idea',
        label: 'Idea',
        description: 'A feature or improvement you want to see.',
        icon: Lightbulb,
    },
    {
        value: 'bug',
        label: 'Bug',
        description: 'Something is broken or not working correctly.',
        icon: Bug,
    },
    {
        value: 'praise',
        label: 'Praise',
        description: 'Something you liked and want us to keep.',
        icon: Heart,
    },
    {
        value: 'complaint',
        label: 'Complaint',
        description: 'Something frustrated you or made the product worse.',
        icon: TriangleAlert,
    },
]


const IDEA_CATEGORIES = [
    { value: 'feature', label: 'New feature' },
    { value: 'integration', label: 'Integration' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'other', label: 'Other' },
] as const

type IdeaCategory = (typeof IDEA_CATEGORIES)[number]['value']


/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function extractError(err: unknown, fallback: string): string {
    if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (
            err as { response?: { data?: { detail?: unknown } } }
        ).response

        const detail = response?.data?.detail

        if (typeof detail === 'string') {
            return detail
        }
    }

    return fallback
}


/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function FeedbackPage() {
    const { user, isLoaded } = useUser()

    const [feedbackType, setFeedbackType] =
        useState<FeedbackType>('ux')

    const [rating, setRating] = useState<number | null>(null)

    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [pageUrl, setPageUrl] = useState('')

    const [allowContact, setAllowContact] = useState(false)
    const [contactEmail, setContactEmail] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [ideaOpen, setIdeaOpen] = useState(false)

    const formRef = useRef<HTMLFormElement>(null)

    const clerkUserId = user?.id

    const selectedType = FEEDBACK_TYPES.find(
        (item) => item.value === feedbackType
    )

    const userPrimaryEmail =
        user?.primaryEmailAddress?.emailAddress || ''

    const canSubmit =
        title.trim().length >= MIN_TITLE &&
        message.trim().length >= MIN_MESSAGE &&
        !loading

    const showHint =
        !loading &&
        (title.trim().length < MIN_TITLE ||
            message.trim().length < MIN_MESSAGE)

    function scrollToTop() {
        formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    function flashError(msg: string) {
        setError(msg)
        setSuccess('')
        scrollToTop()
    }

    function flashSuccess(msg: string) {
        setSuccess(msg)
        setError('')
        scrollToTop()
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        if (title.trim().length < MIN_TITLE) {
            flashError(`Title must be at least ${MIN_TITLE} characters.`)
            return
        }

        if (message.trim().length < MIN_MESSAGE) {
            flashError(
                `Message must be at least ${MIN_MESSAGE} characters.`
            )
            return
        }

        if (
            allowContact &&
            contactEmail.trim() &&
            !EMAIL_RE.test(contactEmail.trim())
        ) {
            flashError('That contact email looks invalid.')
            return
        }

        try {
            setLoading(true)
            setError('')
            setSuccess('')

            const finalContactEmail =
                contactEmail.trim() ||
                userPrimaryEmail ||
                null

            const payload: FeedbackPayload = {
                feedback_type: feedbackType,
                rating,
                title: title.trim(),
                message: message.trim(),
                page_url: pageUrl.trim() || null,
                source: 'feedback_page',
                allow_contact: allowContact,
                contact_email: allowContact
                    ? finalContactEmail
                    : null,
                diagnostics: {
                    frontend_path:
                        typeof window !== 'undefined'
                            ? window.location.pathname
                            : null,
                    browser:
                        typeof navigator !== 'undefined'
                            ? navigator.userAgent
                            : null,
                    screen:
                        typeof window !== 'undefined'
                            ? {
                                  width: window.innerWidth,
                                  height: window.innerHeight,
                              }
                            : null,
                },
            }

            const params = clerkUserId
                ? { clerk_user_id: clerkUserId }
                : undefined

            await api.post('/feedback', payload, { params })

            flashSuccess(
                'Feedback sent. This is exactly what helps shape the MVP.'
            )

            setFeedbackType('ux')
            setRating(null)
            setTitle('')
            setMessage('')
            setPageUrl('')
            setAllowContact(false)
            setContactEmail('')
        } catch (err) {
            console.error(err)
            flashError(
                extractError(
                    err,
                    'Could not send feedback. Please try again.'
                )
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className='min-h-screen bg-[#0A0A0A] px-4 py-10 text-[#F9FAFB] sm:px-6'>
            <div className='mx-auto max-w-5xl'>
                <div className='mb-8'>
                    <Link
                        href='/settings'
                        className='inline-flex items-center gap-2 text-sm text-[#9CA3AF] transition-colors hover:text-[#F9FAFB]'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back to settings
                    </Link>
                </div>

                <section className='grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]'>
                    <FeedbackHero
                        onOpenIdea={() => setIdeaOpen(true)}
                    />

                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className='rounded-3xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 shadow-2xl sm:p-6'
                    >
                        <div className='mb-6'>
                            <p className='mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#E8560A]'>
                                MVP feedback
                            </p>

                            <h1 className='text-3xl font-bold tracking-tight text-[#F9FAFB] sm:text-4xl'>
                                Tell us what to fix, keep, or build.
                            </h1>

                            <p className='mt-3 text-sm leading-relaxed text-[#9CA3AF]'>
                                Be honest. Good feedback is not just praise —
                                it tells us where the product feels confusing,
                                slow, useful, or missing something.
                            </p>
                        </div>

                        {error && (
                            <div
                                role='alert'
                                aria-live='assertive'
                                className='mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4'
                            >
                                <div className='flex items-start gap-3 text-sm text-red-400'>
                                    <XCircle className='mt-0.5 h-4 w-4 shrink-0' />
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div
                                role='status'
                                aria-live='polite'
                                className='mb-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4'
                            >
                                <div className='flex items-start gap-3 text-sm text-green-400'>
                                    <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0' />
                                    <p>{success}</p>
                                </div>
                            </div>
                        )}

                        {/* Disabling the whole body during submit prevents
                            mid-flight edits on a slow network. */}
                        <fieldset
                            disabled={loading}
                            className='contents'
                        >
                            <section className='space-y-4'>
                                <SectionHeader
                                    title='What kind of feedback is this?'
                                    description='Pick the closest one. You do not need to be perfect.'
                                />

                                <div
                                    role='radiogroup'
                                    aria-label='Feedback type'
                                    className='grid grid-cols-1 gap-3 sm:grid-cols-2'
                                >
                                    {FEEDBACK_TYPES.map((item) => {
                                        const Icon = item.icon
                                        const active =
                                            feedbackType === item.value

                                        return (
                                            <button
                                                key={item.value}
                                                type='button'
                                                role='radio'
                                                aria-checked={active}
                                                onClick={() =>
                                                    setFeedbackType(
                                                        item.value
                                                    )
                                                }
                                                className={`rounded-2xl border p-4 text-left transition-colors ${
                                                    active
                                                        ? 'border-[#E8560A]/70 bg-[#E8560A]/10'
                                                        : 'border-[#2D2D2D] bg-[#0F0F0F] hover:border-[#E8560A]/40'
                                                }`}
                                            >
                                                <div className='flex gap-3'>
                                                    <div
                                                        className={`rounded-xl p-2 ${
                                                            active
                                                                ? 'bg-[#E8560A]/20 text-[#E8560A]'
                                                                : 'bg-[#1C1C1E] text-[#9CA3AF]'
                                                        }`}
                                                    >
                                                        <Icon className='h-4 w-4' />
                                                    </div>

                                                    <div>
                                                        <h3 className='text-sm font-semibold text-[#F9FAFB]'>
                                                            {item.label}
                                                        </h3>

                                                        <p className='mt-1 text-xs leading-relaxed text-[#9CA3AF]'>
                                                            {
                                                                item.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </section>

                            <section className='mt-8 space-y-4'>
                                <SectionHeader
                                    title='How does it feel?'
                                    description='Optional, but very helpful for product direction.'
                                />

                                <div className='rounded-2xl border border-[#2D2D2D] bg-[#0F0F0F] p-4'>
                                    <div
                                        role='radiogroup'
                                        aria-label='Overall rating'
                                        className='flex flex-wrap items-center gap-2'
                                    >
                                        {[1, 2, 3, 4, 5].map((value) => {
                                            const active =
                                                rating !== null &&
                                                value <= rating

                                            return (
                                                <button
                                                    key={value}
                                                    type='button'
                                                    role='radio'
                                                    aria-checked={
                                                        rating === value
                                                    }
                                                    onClick={() =>
                                                        setRating(
                                                            rating ===
                                                                value
                                                                ? null
                                                                : value
                                                        )
                                                    }
                                                    className={`rounded-xl border px-3 py-2 transition-colors ${
                                                        active
                                                            ? 'border-[#E8560A]/60 bg-[#E8560A]/10 text-[#E8560A]'
                                                            : 'border-[#2D2D2D] text-[#6B7280] hover:border-[#E8560A]/40 hover:text-[#F9FAFB]'
                                                    }`}
                                                    aria-label={`Rate ${value} out of 5`}
                                                >
                                                    <Star
                                                        className={`h-5 w-5 ${
                                                            active
                                                                ? 'fill-current'
                                                                : ''
                                                        }`}
                                                    />
                                                </button>
                                            )
                                        })}

                                        <span className='ml-0 text-sm text-[#9CA3AF] sm:ml-2'>
                                            {rating
                                                ? `${rating}/5`
                                                : 'No rating'}
                                        </span>
                                    </div>

                                    <p className='mt-3 text-xs text-[#6B7280]'>
                                        Selected type:{' '}
                                        <span className='text-[#E8560A]'>
                                            {selectedType?.label}
                                        </span>
                                    </p>
                                </div>
                            </section>

                            <section className='mt-8 space-y-5'>
                                <SectionHeader
                                    title='Tell us the real thing'
                                    description='The more specific you are, the more useful this becomes.'
                                />

                                <div className='space-y-2'>
                                    <label
                                        htmlFor='title'
                                        className='text-sm font-medium text-[#F9FAFB]'
                                    >
                                        Short title
                                    </label>

                                    <input
                                        id='title'
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                        maxLength={140}
                                        placeholder='Example: Feedback button should be easier to find'
                                        className='w-full rounded-2xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                                    />

                                    <div className='flex justify-between text-xs text-[#6B7280]'>
                                        <span>Make it searchable.</span>
                                        <span>{title.length}/140</span>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <label
                                        htmlFor='message'
                                        className='text-sm font-medium text-[#F9FAFB]'
                                    >
                                        Feedback
                                    </label>

                                    <textarea
                                        id='message'
                                        value={message}
                                        onChange={(event) =>
                                            setMessage(
                                                event.target.value
                                            )
                                        }
                                        maxLength={5000}
                                        rows={8}
                                        placeholder={`What felt good?\nWhat felt confusing?\nWhat would make you use this more?\nWhat almost made you leave?`}
                                        className='w-full resize-none rounded-2xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm leading-relaxed text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                                    />

                                    <div className='flex justify-between text-xs text-[#6B7280]'>
                                        <span>
                                            Brutal honesty is allowed.
                                        </span>
                                        <span>
                                            {message.length}/5000
                                        </span>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <label
                                        htmlFor='pageUrl'
                                        className='text-sm font-medium text-[#F9FAFB]'
                                    >
                                        Page URL
                                        <span className='ml-2 text-xs font-normal text-[#6B7280]'>
                                            optional
                                        </span>
                                    </label>

                                    <input
                                        id='pageUrl'
                                        value={pageUrl}
                                        onChange={(event) =>
                                            setPageUrl(
                                                event.target.value
                                            )
                                        }
                                        placeholder='/settings/support, /u/username, or full URL'
                                        className='w-full rounded-2xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                                    />
                                </div>
                            </section>

                            <section className='mt-8 rounded-2xl border border-[#2D2D2D] bg-[#0F0F0F] p-4'>
                                <label className='flex cursor-pointer items-start gap-3'>
                                    <input
                                        type='checkbox'
                                        checked={allowContact}
                                        onChange={(event) =>
                                            setAllowContact(
                                                event.target.checked
                                            )
                                        }
                                        className='mt-1 h-4 w-4 rounded border-[#2D2D2D] bg-[#1C1C1E] accent-[#E8560A]'
                                    />

                                    <div>
                                        <p className='text-sm font-medium text-[#F9FAFB]'>
                                            You can contact me about this
                                        </p>

                                        <p className='mt-1 text-xs leading-relaxed text-[#9CA3AF]'>
                                            Useful if we need more detail.
                                            This is optional.
                                        </p>
                                    </div>
                                </label>

                                {allowContact && (
                                    <div className='mt-4 space-y-2'>
                                        <label
                                            htmlFor='contactEmail'
                                            className='text-sm font-medium text-[#F9FAFB]'
                                        >
                                            Contact email
                                        </label>

                                        <input
                                            id='contactEmail'
                                            type='email'
                                            value={contactEmail}
                                            onChange={(event) =>
                                                setContactEmail(
                                                    event.target.value
                                                )
                                            }
                                            placeholder={
                                                userPrimaryEmail ||
                                                'you@example.com'
                                            }
                                            className='w-full rounded-2xl border border-[#2D2D2D] bg-[#1C1C1E] px-4 py-3 text-sm text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                                        />
                                    </div>
                                )}
                            </section>
                        </fieldset>

                        <div className='mt-8 flex flex-col-reverse gap-3 border-t border-[#2D2D2D] pt-6 sm:flex-row sm:items-center sm:justify-between'>
                            <div className='space-y-1'>
                                <p className='text-xs leading-relaxed text-[#6B7280]'>
                                    {isLoaded && clerkUserId
                                        ? 'Submitting as your logged-in account.'
                                        : 'You can submit anonymously. Logged-in users are easier to follow up with.'}
                                </p>

                                {showHint && (
                                    <p className='text-xs leading-relaxed text-[#E8560A]/80'>
                                        Add a title ({MIN_TITLE}+) and a
                                        message ({MIN_MESSAGE}+) to send.
                                    </p>
                                )}
                            </div>

                            <button
                                type='submit'
                                disabled={!canSubmit}
                                className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff6a1a] disabled:cursor-not-allowed disabled:opacity-50'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className='h-4 w-4' />
                                        Send feedback
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            <IdeaModal
                open={ideaOpen}
                onClose={() => setIdeaOpen(false)}
                clerkUserId={clerkUserId}
            />
        </main>
    )
}


/* -------------------------------------------------------------------------- */
/*  Idea modal                                                                */
/* -------------------------------------------------------------------------- */

function IdeaModal({
    open,
    onClose,
    clerkUserId,
}: {
    open: boolean
    onClose: () => void
    clerkUserId: string | undefined
}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<IdeaCategory | ''>('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)

    const titleRef = useRef<HTMLInputElement>(null)

    const canSubmit =
        title.trim().length >= 2 &&
        description.trim().length >= 10 &&
        !loading

    // Escape to close, lock background scroll, autofocus the first field.
    useEffect(() => {
        if (!open) return

        function onKey(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', onKey)
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const focusTimer = window.setTimeout(
            () => titleRef.current?.focus(),
            0
        )

        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
            window.clearTimeout(focusTimer)
        }
    }, [open, onClose])

    // Reset state whenever the modal is closed.
    useEffect(() => {
        if (open) return
        setTitle('')
        setDescription('')
        setCategory('')
        setError('')
        setDone(false)
        setLoading(false)
    }, [open])

    if (!open) return null

    async function submit() {
        if (title.trim().length < 2) {
            setError('Give your idea a short title (2+ characters).')
            return
        }

        if (description.trim().length < 10) {
            setError('Describe the idea a little more (10+ characters).')
            return
        }

        try {
            setLoading(true)
            setError('')

            const payload = {
                title: title.trim(),
                description: description.trim(),
                category: category || null,
                page_url:
                    typeof window !== 'undefined'
                        ? window.location.pathname
                        : null,
                diagnostics: {
                    source: 'idea_modal',
                    browser:
                        typeof navigator !== 'undefined'
                            ? navigator.userAgent
                            : null,
                },
            }

            const params = clerkUserId
                ? { clerk_user_id: clerkUserId }
                : undefined

            await api.post('/ideas', payload, { params })

            setDone(true)
        } catch (err) {
            console.error(err)
            setError(
                extractError(
                    err,
                    'Could not submit your idea. Please try again.'
                )
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4'
            onClick={onClose}
        >
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby='idea-modal-title'
                onClick={(event) => event.stopPropagation()}
                className='w-full max-w-lg rounded-t-3xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 shadow-2xl sm:rounded-3xl sm:p-6'
            >
                <div className='mb-5 flex items-start justify-between gap-4'>
                    <div className='flex items-start gap-3'>
                        <div className='rounded-2xl bg-[#E8560A]/10 p-2.5 text-[#E8560A]'>
                            <Lightbulb className='h-5 w-5' />
                        </div>

                        <div>
                            <h2
                                id='idea-modal-title'
                                className='text-xl font-bold tracking-tight text-[#F9FAFB]'
                            >
                                Have an idea?
                            </h2>

                            <p className='mt-1 text-sm leading-relaxed text-[#9CA3AF]'>
                                Drop it here. Good ideas become real
                                roadmap items.
                            </p>
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={onClose}
                        aria-label='Close'
                        className='rounded-xl border border-[#2D2D2D] p-2 text-[#9CA3AF] transition-colors hover:border-[#E8560A]/40 hover:text-[#F9FAFB]'
                    >
                        <X className='h-4 w-4' />
                    </button>
                </div>

                {done ? (
                    <div className='rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-center'>
                        <CheckCircle2 className='mx-auto h-8 w-8 text-green-400' />

                        <h3 className='mt-3 text-base font-semibold text-[#F9FAFB]'>
                            Idea submitted
                        </h3>

                        <p className='mt-1 text-sm leading-relaxed text-[#9CA3AF]'>
                            Thanks — it lands in the idea board for review.
                        </p>

                        <button
                            type='button'
                            onClick={onClose}
                            className='mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#ff6a1a]'
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {error && (
                            <div
                                role='alert'
                                aria-live='assertive'
                                className='rounded-2xl border border-red-500/30 bg-red-500/10 p-3'
                            >
                                <div className='flex items-start gap-3 text-sm text-red-400'>
                                    <XCircle className='mt-0.5 h-4 w-4 shrink-0' />
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        <div className='space-y-2'>
                            <label
                                htmlFor='idea-title'
                                className='text-sm font-medium text-[#F9FAFB]'
                            >
                                Idea title
                            </label>

                            <input
                                id='idea-title'
                                ref={titleRef}
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                maxLength={140}
                                placeholder='Example: Public idea board with upvotes'
                                className='w-full rounded-2xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                            />
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='idea-description'
                                className='text-sm font-medium text-[#F9FAFB]'
                            >
                                What is it?
                            </label>

                            <textarea
                                id='idea-description'
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                maxLength={5000}
                                rows={5}
                                placeholder='What should it do, and why would it help?'
                                className='w-full resize-none rounded-2xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm leading-relaxed text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                            />

                            <div className='flex justify-end text-xs text-[#6B7280]'>
                                <span>{description.length}/5000</span>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <p className='text-sm font-medium text-[#F9FAFB]'>
                                Category
                                <span className='ml-2 text-xs font-normal text-[#6B7280]'>
                                    optional
                                </span>
                            </p>

                            <div className='flex flex-wrap gap-2'>
                                {IDEA_CATEGORIES.map((item) => {
                                    const active =
                                        category === item.value

                                    return (
                                        <button
                                            key={item.value}
                                            type='button'
                                            onClick={() =>
                                                setCategory(
                                                    active
                                                        ? ''
                                                        : item.value
                                                )
                                            }
                                            className={`rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                                                active
                                                    ? 'border-[#E8560A]/60 bg-[#E8560A]/10 text-[#E8560A]'
                                                    : 'border-[#2D2D2D] text-[#9CA3AF] hover:border-[#E8560A]/40 hover:text-[#F9FAFB]'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className='flex items-center justify-end gap-3 pt-2'>
                            <button
                                type='button'
                                onClick={onClose}
                                className='rounded-2xl border border-[#2D2D2D] px-4 py-2.5 text-sm font-medium text-[#9CA3AF] transition-colors hover:text-[#F9FAFB]'
                            >
                                Cancel
                            </button>

                            <button
                                type='button'
                                onClick={submit}
                                disabled={!canSubmit}
                                className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#ff6a1a] disabled:cursor-not-allowed disabled:opacity-50'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className='h-4 w-4' />
                                        Submit idea
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function FeedbackHero({ onOpenIdea }: { onOpenIdea: () => void }) {
    return (
        <aside className='space-y-5 lg:sticky lg:top-8 lg:self-start'>
            <div className='overflow-hidden rounded-3xl border border-[#2D2D2D] bg-[#1C1C1E] p-6'>
                <div className='mb-6 inline-flex rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                    <Sparkles className='h-6 w-6' />
                </div>

                <h2 className='text-3xl font-bold tracking-tight text-[#F9FAFB]'>
                    Help shape DevManiac before it gets big.
                </h2>

                <p className='mt-4 text-sm leading-relaxed text-[#9CA3AF]'>
                    MVP feedback is not decoration. It decides what gets
                    removed, redesigned, fixed, and shipped next.
                </p>

                <div className='mt-6 grid grid-cols-1 gap-3'>
                    <HeroPoint
                        icon={MousePointerClick}
                        title='UX pain matters'
                        description='If something feels awkward, tell us. Small friction kills products.'
                    />

                    <HeroPoint
                        icon={Lightbulb}
                        title='Ideas are welcome'
                        description='A good feature request can become a real roadmap item.'
                    />

                    <HeroPoint
                        icon={ShieldCheck}
                        title='Admin-ready'
                        description='Every response can later be reviewed, planned, shipped, or archived.'
                    />
                </div>
            </div>

            {/* Have an idea? */}
            <div className='rounded-3xl border border-[#E8560A]/30 bg-linear-to-b from-[#E8560A]/10 to-transparent p-5'>
                <div className='flex items-start gap-3'>
                    <div className='rounded-2xl bg-[#E8560A]/15 p-2.5 text-[#E8560A]'>
                        <Lightbulb className='h-5 w-5' />
                    </div>

                    <div>
                        <h3 className='font-semibold text-[#F9FAFB]'>
                            Have an idea?
                        </h3>

                        <p className='mt-1 text-sm leading-relaxed text-[#9CA3AF]'>
                            Got something you wish DevManiac did? Send it
                            straight to the idea board.
                        </p>
                    </div>
                </div>

                <button
                    type='button'
                    onClick={onOpenIdea}
                    className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff6a1a]'
                >
                    <Lightbulb className='h-4 w-4' />
                    Submit an idea
                </button>
            </div>

            {/* Wanna contribute? */}
            <a
                href={REPO_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='group block rounded-3xl border border-[#2D2D2D] bg-[#0F0F0F] p-5 transition-colors hover:border-[#E8560A]/40'
            >
                <div className='flex items-start gap-3'>
                    <div className='rounded-2xl bg-[#1C1C1E] p-2.5 text-[#F9FAFB]'>
                        <Github className='h-5 w-5' />
                    </div>

                    <div className='min-w-0'>
                        <div className='flex items-center gap-2'>
                            <h3 className='font-semibold text-[#F9FAFB]'>
                                Wanna contribute?
                            </h3>

                            <ArrowUpRight className='h-4 w-4 text-[#6B7280] transition-colors group-hover:text-[#E8560A]' />
                        </div>

                        <p className='mt-1 text-sm leading-relaxed text-[#9CA3AF]'>
                            DevManiac is built in the open. Star the repo,
                            open an issue, or send a pull request.
                        </p>

                        <div className='mt-3 inline-flex items-center gap-2 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] px-3 py-1.5 font-mono text-xs text-[#9CA3AF]'>
                            <Rocket className='h-3.5 w-3.5 text-[#E8560A]' />
                            nishchup489-afk/codegram
                        </div>
                    </div>
                </div>
            </a>

            <div className='rounded-3xl border border-[#2D2D2D] bg-[#0F0F0F] p-5'>
                <h3 className='font-semibold text-[#F9FAFB]'>
                    What good feedback looks like
                </h3>

                <ul className='mt-4 space-y-3 text-sm leading-relaxed text-[#9CA3AF]'>
                    <li>
                        <span className='text-[#E8560A]'>01.</span>{' '}
                        “I expected X, but Y happened.”
                    </li>

                    <li>
                        <span className='text-[#E8560A]'>02.</span>{' '}
                        “This page made me confused because...”
                    </li>

                    <li>
                        <span className='text-[#E8560A]'>03.</span>{' '}
                        “I would use this more if...”
                    </li>

                    <li>
                        <span className='text-[#E8560A]'>04.</span>{' '}
                        “This feature feels unnecessary because...”
                    </li>
                </ul>
            </div>
        </aside>
    )
}


function HeroPoint({
    icon: Icon,
    title,
    description,
}: {
    icon: typeof Sparkles
    title: string
    description: string
}) {
    return (
        <div className='rounded-2xl border border-[#2D2D2D] bg-[#0F0F0F] p-4'>
            <div className='flex gap-3'>
                <div className='rounded-xl bg-[#E8560A]/10 p-2 text-[#E8560A]'>
                    <Icon className='h-4 w-4' />
                </div>

                <div>
                    <h3 className='text-sm font-semibold text-[#F9FAFB]'>
                        {title}
                    </h3>

                    <p className='mt-1 text-xs leading-relaxed text-[#9CA3AF]'>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}


function SectionHeader({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div>
            <h2 className='text-lg font-semibold text-[#F9FAFB]'>
                {title}
            </h2>

            <p className='mt-1 text-sm leading-relaxed text-[#9CA3AF]'>
                {description}
            </p>
        </div>
    )
}