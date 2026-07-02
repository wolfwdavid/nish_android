'use client'

import { useMemo, useState } from 'react'
import type React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    ArrowLeft,
    AlertCircle,
    Bug,
    UserCircle,
    Plug,
    Wrench,
    HelpCircle,
    Loader2,
    Send,
    CheckCircle2,
} from 'lucide-react'

type TicketCategory =
    | 'bug'
    | 'account'
    | 'integration'
    | 'feature_not_working'
    | 'other'

type TicketPriority = 'low' | 'normal' | 'high' | 'urgent'

type CreateTicketPayload = {
    category: TicketCategory
    subject: string
    description: string
    project_id: string | null
    diagnostics: Record<string, unknown>
}

const CATEGORY_OPTIONS: {
    value: TicketCategory
    label: string
    description: string
    icon: typeof Bug
}[] = [
    {
        value: 'bug',
        label: 'Bug',
        description: 'Something crashes, looks broken, or behaves wrong.',
        icon: Bug,
    },
    {
        value: 'account',
        label: 'Account',
        description: 'Login, profile, username, or account access problem.',
        icon: UserCircle,
    },
    {
        value: 'integration',
        label: 'Integration',
        description: 'GitHub, Clerk, Cloudinary, or external service issue.',
        icon: Plug,
    },
    {
        value: 'feature_not_working',
        label: 'Feature not working',
        description: 'A specific DevManiac feature is not doing its job.',
        icon: Wrench,
    },
    {
        value: 'other',
        label: 'Other',
        description: 'Something else that does not fit the categories.',
        icon: HelpCircle,
    },
]

export default function NewSupportTicketPage() {
    const router = useRouter()
    const { user, isLoaded } = useUser()

    const [category, setCategory] = useState<TicketCategory>('bug')
    const [subject, setSubject] = useState('')
    const [description, setDescription] = useState('')
    const [pageUrl, setPageUrl] = useState('')
    const [projectId, setProjectId] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const clerkUserId = user?.id

    const selectedCategory = useMemo(() => {
        return CATEGORY_OPTIONS.find((item) => item.value === category)
    }, [category])

    const canSubmit =
        isLoaded &&
        Boolean(clerkUserId) &&
        subject.trim().length >= 3 &&
        description.trim().length >= 5 &&
        !loading

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!clerkUserId) {
            setError('You need to be signed in to submit a report.')
            return
        }

        if (subject.trim().length < 3) {
            setError('Subject must be at least 3 characters.')
            return
        }

        if (description.trim().length < 5) {
            setError('Description must be at least 5 characters.')
            return
        }

        try {
            setLoading(true)
            setError('')
            setSuccess('')

            const payload: CreateTicketPayload = {
                category,
                subject: subject.trim(),
                description: description.trim(),
                project_id: projectId.trim() || null,
                diagnostics: {
                    page_url: pageUrl.trim() || null,
                    frontend_path:
                        typeof window !== 'undefined'
                            ? window.location.pathname
                            : null,
                    browser:
                        typeof navigator !== 'undefined'
                            ? navigator.userAgent
                            : null,
                },
            }

            const res = await api.post('/support/tickets', payload, {
                params: {
                    clerk_user_id: clerkUserId,
                },
            })

            setSuccess(
                `Report submitted successfully. Ticket ${res.data.ticket_number} created.`
            )

            setSubject('')
            setDescription('')
            setPageUrl('')
            setProjectId('')
            setCategory('bug')

            setTimeout(() => {
                router.push('/settings/support')
            }, 900)
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not submit report. Please try again.'

            setError(String(detail))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='mx-auto max-w-3xl px-6 py-12'>
            <div className='mb-10'>
                <Link
                    href='/settings/support'
                    className='inline-flex items-center gap-2 text-sm text-[#9CA3AF] transition-colors hover:text-[#F9FAFB]'
                >
                    <ArrowLeft className='h-4 w-4' />
                    Back to support
                </Link>

                <div className='mt-6 space-y-2'>
                    <h1 className='text-4xl font-bold tracking-tight text-[#F9FAFB]'>
                        Submit a report
                    </h1>

                    <p className='max-w-2xl text-sm leading-relaxed text-[#9CA3AF]'>
                        Tell us what broke, where it happened, and what you
                        expected. The clearer the report, the faster the fix.
                    </p>
                </div>
            </div>

            {!isLoaded ? (
                <div className='rounded-2xl border border-[#2D2D2D] bg-[#1C1C1E] p-6'>
                    <div className='flex items-center gap-3 text-sm text-[#9CA3AF]'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Loading account...
                    </div>
                </div>
            ) : !clerkUserId ? (
                <div className='rounded-2xl border border-[#7F1D1D]/70 bg-[#1C1C1E] p-6'>
                    <div className='flex items-start gap-3 text-sm text-red-400'>
                        <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
                        <p>You need to sign in before submitting a report.</p>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className='space-y-8 rounded-2xl border border-[#2D2D2D] bg-[#1C1C1E] p-6'
                >
                    {error && (
                        <div className='rounded-xl border border-red-500/30 bg-red-500/10 p-4'>
                            <div className='flex items-start gap-3 text-sm text-red-400'>
                                <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className='rounded-xl border border-green-500/30 bg-green-500/10 p-4'>
                            <div className='flex items-start gap-3 text-sm text-green-400'>
                                <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0' />
                                <p>{success}</p>
                            </div>
                        </div>
                    )}

                    <section className='space-y-4'>
                        <div>
                            <h2 className='text-lg font-semibold text-[#F9FAFB]'>
                                What type of issue is this?
                            </h2>

                            <p className='mt-1 text-sm text-[#9CA3AF]'>
                                Pick the closest category. Admins can adjust it
                                later.
                            </p>
                        </div>

                        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                            {CATEGORY_OPTIONS.map((item) => {
                                const Icon = item.icon
                                const active = category === item.value

                                return (
                                    <button
                                        key={item.value}
                                        type='button'
                                        onClick={() => setCategory(item.value)}
                                        className={`rounded-xl border p-4 text-left transition-colors ${
                                            active
                                                ? 'border-[#E8560A]/70 bg-[#E8560A]/10'
                                                : 'border-[#2D2D2D] bg-[#0F0F0F] hover:border-[#E8560A]/40'
                                        }`}
                                    >
                                        <div className='flex gap-3'>
                                            <div
                                                className={`rounded-lg p-2 ${
                                                    active
                                                        ? 'bg-[#E8560A]/20 text-[#E8560A]'
                                                        : 'bg-[#1C1C1E] text-[#9CA3AF]'
                                                }`}
                                            >
                                                <Icon className='h-4 w-4' />
                                            </div>

                                            <div className='space-y-1'>
                                                <h3 className='text-sm font-medium text-[#F9FAFB]'>
                                                    {item.label}
                                                </h3>

                                                <p className='text-xs leading-relaxed text-[#9CA3AF]'>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </section>

                    <section className='space-y-5'>
                        <div>
                            <h2 className='text-lg font-semibold text-[#F9FAFB]'>
                                Report details
                            </h2>

                            <p className='mt-1 text-sm text-[#9CA3AF]'>
                                Selected:{' '}
                                <span className='text-[#E8560A]'>
                                    {selectedCategory?.label}
                                </span>
                            </p>
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='subject'
                                className='text-sm font-medium text-[#F9FAFB]'
                            >
                                Subject
                            </label>

                            <input
                                id='subject'
                                value={subject}
                                onChange={(event) =>
                                    setSubject(event.target.value)
                                }
                                placeholder='Example: Mobile plus button does not open modal'
                                maxLength={120}
                                className='w-full rounded-xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                            />

                            <div className='flex justify-between text-xs text-[#6B7280]'>
                                <span>Keep it short and searchable.</span>
                                <span>{subject.length}/120</span>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='description'
                                className='text-sm font-medium text-[#F9FAFB]'
                            >
                                Description
                            </label>

                            <textarea
                                id='description'
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder={`What happened?\nWhat did you expect?\nWhat page were you on?\nCan you reproduce it?`}
                                rows={8}
                                maxLength={2000}
                                className='w-full resize-none rounded-xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm leading-relaxed text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                            />

                            <div className='flex justify-between text-xs text-[#6B7280]'>
                                <span>Minimum 5 characters.</span>
                                <span>{description.length}/2000</span>
                            </div>
                        </div>
                    </section>

                    <section className='space-y-5'>
                        <div>
                            <h2 className='text-lg font-semibold text-[#F9FAFB]'>
                                Extra context
                            </h2>

                            <p className='mt-1 text-sm text-[#9CA3AF]'>
                                Optional, but useful for debugging.
                            </p>
                        </div>

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <label
                                    htmlFor='pageUrl'
                                    className='text-sm font-medium text-[#F9FAFB]'
                                >
                                    Page URL
                                </label>

                                <input
                                    id='pageUrl'
                                    value={pageUrl}
                                    onChange={(event) =>
                                        setPageUrl(event.target.value)
                                    }
                                    placeholder='/settings/support or full URL'
                                    className='w-full rounded-xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label
                                    htmlFor='projectId'
                                    className='text-sm font-medium text-[#F9FAFB]'
                                >
                                    Project ID
                                </label>

                                <input
                                    id='projectId'
                                    value={projectId}
                                    onChange={(event) =>
                                        setProjectId(event.target.value)
                                    }
                                    placeholder='Optional UUID'
                                    className='w-full rounded-xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm text-[#F9FAFB] outline-none placeholder:text-[#6B7280] transition-colors focus:border-[#E8560A]/70'
                                />
                            </div>
                        </div>
                    </section>

                    <div className='flex flex-col-reverse gap-3 border-t border-[#2D2D2D] pt-6 sm:flex-row sm:items-center sm:justify-between'>
                        <Link
                            href='/settings/support'
                            className='rounded-xl border border-[#2D2D2D] px-5 py-3 text-center text-sm font-medium text-[#F9FAFB] transition-colors hover:bg-[#0F0F0F]'
                        >
                            Cancel
                        </Link>

                        <button
                            type='submit'
                            disabled={!canSubmit}
                            className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8560A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff6a1a] disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className='h-4 w-4' />
                                    Submit report
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}