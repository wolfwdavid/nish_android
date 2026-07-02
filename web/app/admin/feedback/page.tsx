'use client'

import { useEffect, useMemo, useState } from 'react'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    AlertTriangle,
    Archive,
    BadgeCheck,
    CheckCircle2,
    Copy,
    Filter,
    Inbox,
    Lightbulb,
    Loader2,
    MessageSquareMore,
    RefreshCcw,
    Save,
    Search,
    Send,
    Smile,
    Sparkles,
    Star,
    ThumbsUp,
    XCircle,
} from 'lucide-react'


type FeedbackType =
    | 'general'
    | 'bug'
    | 'idea'
    | 'ux'
    | 'praise'
    | 'complaint'

type FeedbackStatus =
    | 'new'
    | 'reviewed'
    | 'planned'
    | 'shipped'
    | 'archived'

type FeedbackSentiment =
    | 'positive'
    | 'neutral'
    | 'negative'


type AdminFeedbackItem = {
    id: string

    user_id?: string | null

    feedback_type: FeedbackType
    status: FeedbackStatus
    sentiment?: FeedbackSentiment | null

    rating?: number | null
    title?: string | null
    message: string
    page_url?: string | null
    contact_email?: string | null

    admin_notes?: string | null

    created_at: string
    updated_at: string
}


type StatusFilter =
    | 'all'
    | FeedbackStatus

type TypeFilter =
    | 'all'
    | FeedbackType


const STATUS_FILTERS: {
    label: string
    value: StatusFilter
}[] = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'New',
        value: 'new',
    },
    {
        label: 'Reviewed',
        value: 'reviewed',
    },
    {
        label: 'Planned',
        value: 'planned',
    },
    {
        label: 'Shipped',
        value: 'shipped',
    },
    {
        label: 'Archived',
        value: 'archived',
    },
]


const TYPE_FILTERS: {
    label: string
    value: TypeFilter
}[] = [
    {
        label: 'All types',
        value: 'all',
    },
    {
        label: 'General',
        value: 'general',
    },
    {
        label: 'Bug',
        value: 'bug',
    },
    {
        label: 'Idea',
        value: 'idea',
    },
    {
        label: 'UX',
        value: 'ux',
    },
    {
        label: 'Praise',
        value: 'praise',
    },
    {
        label: 'Complaint',
        value: 'complaint',
    },
]


const STATUS_OPTIONS: {
    label: string
    value: FeedbackStatus
}[] = [
    {
        label: 'New',
        value: 'new',
    },
    {
        label: 'Reviewed',
        value: 'reviewed',
    },
    {
        label: 'Planned',
        value: 'planned',
    },
    {
        label: 'Shipped',
        value: 'shipped',
    },
    {
        label: 'Archived',
        value: 'archived',
    },
]


const SENTIMENT_OPTIONS: {
    label: string
    value: FeedbackSentiment
}[] = [
    {
        label: 'Positive',
        value: 'positive',
    },
    {
        label: 'Neutral',
        value: 'neutral',
    },
    {
        label: 'Negative',
        value: 'negative',
    },
]


export default function AdminFeedbackPage() {
    const { user, isLoaded } = useUser()

    const [feedbackItems, setFeedbackItems] =
        useState<AdminFeedbackItem[]>([])

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [updatingFeedbackId, setUpdatingFeedbackId] =
        useState<string | null>(null)

    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>('all')
    const [typeFilter, setTypeFilter] =
        useState<TypeFilter>('all')

    const [selectedFeedback, setSelectedFeedback] =
        useState<AdminFeedbackItem | null>(null)

    const [draftStatus, setDraftStatus] =
        useState<FeedbackStatus>('new')
    const [draftSentiment, setDraftSentiment] =
        useState<FeedbackSentiment>('neutral')
    const [draftNotes, setDraftNotes] = useState('')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [copied, setCopied] = useState('')

    const clerkUserId = user?.id

    const filteredFeedback = useMemo(() => {
        const search = query.trim().toLowerCase()

        return feedbackItems.filter((item) => {
            const matchesSearch =
                !search ||
                item.title?.toLowerCase().includes(search) ||
                item.message?.toLowerCase().includes(search) ||
                item.feedback_type?.toLowerCase().includes(search) ||
                item.status?.toLowerCase().includes(search) ||
                item.sentiment?.toLowerCase().includes(search) ||
                item.page_url?.toLowerCase().includes(search) ||
                item.contact_email?.toLowerCase().includes(search)

            const matchesStatus =
                statusFilter === 'all' ||
                item.status === statusFilter

            const matchesType =
                typeFilter === 'all' ||
                item.feedback_type === typeFilter

            return matchesSearch && matchesStatus && matchesType
        })
    }, [feedbackItems, query, statusFilter, typeFilter])

    const stats = useMemo(() => {
        return {
            total: feedbackItems.length,
            new: feedbackItems.filter((item) => item.status === 'new')
                .length,
            planned: feedbackItems.filter(
                (item) => item.status === 'planned'
            ).length,
            shipped: feedbackItems.filter(
                (item) => item.status === 'shipped'
            ).length,
            bugs: feedbackItems.filter(
                (item) => item.feedback_type === 'bug'
            ).length,
            ideas: feedbackItems.filter(
                (item) => item.feedback_type === 'idea'
            ).length,
            avgRating: getAverageRating(feedbackItems),
        }
    }, [feedbackItems])

    useEffect(() => {
        if (!isLoaded) return

        if (!clerkUserId) {
            setLoading(false)
            return
        }

        fetchFeedback()
    }, [isLoaded, clerkUserId])

    useEffect(() => {
        if (!selectedFeedback) return

        setDraftStatus(selectedFeedback.status)
        setDraftSentiment(
            selectedFeedback.sentiment || 'neutral'
        )
        setDraftNotes(selectedFeedback.admin_notes || '')
    }, [selectedFeedback])

    async function fetchFeedback() {
        try {
            setError('')
            setRefreshing(true)

            const res = await api.get('/admin/feedback', {
                params: {
                    clerk_user_id: clerkUserId,
                    limit: 100,
                },
            })

            setFeedbackItems(res.data)

            if (selectedFeedback) {
                const fresh = res.data.find(
                    (item: AdminFeedbackItem) =>
                        item.id === selectedFeedback.id
                )

                setSelectedFeedback(fresh || null)
            }
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not load feedback.'

            setError(String(detail))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function updateFeedback(feedbackId: string) {
        try {
            setUpdatingFeedbackId(feedbackId)
            setError('')
            setSuccess('')

            const res = await api.patch(
                `/admin/feedback/${feedbackId}`,
                {
                    status: draftStatus,
                    sentiment: draftSentiment,
                    admin_notes: draftNotes.trim() || null,
                },
                {
                    params: {
                        clerk_user_id: clerkUserId,
                    },
                }
            )

            setFeedbackItems((prev) =>
                prev.map((item) =>
                    item.id === feedbackId ? res.data : item
                )
            )

            setSelectedFeedback(res.data)
            setSuccess('Feedback updated successfully.')
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not update feedback.'

            setError(String(detail))
        } finally {
            setUpdatingFeedbackId(null)
        }
    }

    async function quickUpdateFeedback(
        item: AdminFeedbackItem,
        payload: Partial<
            Pick<
                AdminFeedbackItem,
                'status' | 'sentiment' | 'admin_notes'
            >
        >
    ) {
        try {
            setUpdatingFeedbackId(item.id)
            setError('')
            setSuccess('')

            const res = await api.patch(
                `/admin/feedback/${item.id}`,
                payload,
                {
                    params: {
                        clerk_user_id: clerkUserId,
                    },
                }
            )

            setFeedbackItems((prev) =>
                prev.map((feedback) =>
                    feedback.id === item.id ? res.data : feedback
                )
            )

            if (selectedFeedback?.id === item.id) {
                setSelectedFeedback(res.data)
            }

            setSuccess('Feedback updated.')
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not update feedback.'

            setError(String(detail))
        } finally {
            setUpdatingFeedbackId(null)
        }
    }

    async function copyText(label: string, value: string) {
        await navigator.clipboard.writeText(value)
        setCopied(label)

        window.setTimeout(() => {
            setCopied('')
        }, 1500)
    }

    if (loading) {
        return (
            <section className='flex min-h-[65vh] items-center justify-center'>
                <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 text-center shadow-2xl'>
                    <Loader2 className='mx-auto h-7 w-7 animate-spin text-[#E8560A]' />

                    <h1 className='mt-4 text-xl font-black text-white'>
                        Loading feedback
                    </h1>

                    <p className='mt-2 text-sm text-[#8B8B92]'>
                        Fetching product signals and user reports...
                    </p>
                </div>
            </section>
        )
    }

    return (
        <div>
            <section className='relative overflow-hidden rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 shadow-2xl sm:p-8'>
                <div className='pointer-events-none absolute -left-32.5 -top-32.5 h-80 w-80 rounded-full bg-[#E8560A]/20 blur-[110px]' />
                <div className='pointer-events-none absolute -right-30 -bottom-30 h-80 w-80 rounded-full bg-white/5 blur-[110px]' />

                <div className='relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end'>
                    <div>
                        <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#E8560A]'>
                            <MessageSquareMore className='h-3.5 w-3.5' />
                            Feedback control
                        </div>

                        <h1 className='max-w-3xl text-4xl font-black tracking-tighter text-white sm:text-5xl'>
                            User feedback
                        </h1>

                        <p className='mt-4 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8'>
                            Review ideas, bugs, complaints, praise, UX notes,
                            and turn them into product decisions without losing
                            signal.
                        </p>
                    </div>

                    <button
                        type='button'
                        onClick={fetchFeedback}
                        disabled={refreshing}
                        className='inline-flex items-center justify-center gap-2 rounded-full bg-[#E8560A] px-5 py-3 text-sm font-black text-white transition hover:bg-[#ff6a1a] disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {refreshing ? (
                            <>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Refreshing
                            </>
                        ) : (
                            <>
                                <RefreshCcw className='h-4 w-4' />
                                Refresh feedback
                            </>
                        )}
                    </button>
                </div>
            </section>

            {error && (
                <div className='mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4'>
                    <div className='flex items-start gap-3 text-sm text-red-400'>
                        <XCircle className='mt-0.5 h-4 w-4 shrink-0' />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className='mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4'>
                    <div className='flex items-start gap-3 text-sm text-green-400'>
                        <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0' />
                        <p>{success}</p>
                    </div>
                </div>
            )}

            <section className='mt-6 grid grid-cols-2 gap-4 lg:grid-cols-7'>
                <MiniStatCard
                    label='Total'
                    value={stats.total}
                    icon={MessageSquareMore}
                />

                <MiniStatCard
                    label='New'
                    value={stats.new}
                    icon={Inbox}
                    urgent={stats.new > 0}
                />

                <MiniStatCard
                    label='Ideas'
                    value={stats.ideas}
                    icon={Lightbulb}
                />

                <MiniStatCard
                    label='Bugs'
                    value={stats.bugs}
                    icon={AlertTriangle}
                    danger={stats.bugs > 0}
                />

                <MiniStatCard
                    label='Planned'
                    value={stats.planned}
                    icon={Sparkles}
                    orange
                />

                <MiniStatCard
                    label='Shipped'
                    value={stats.shipped}
                    icon={Send}
                />

                <MiniStatCard
                    label='Avg rating'
                    value={stats.avgRating}
                    icon={Star}
                />
            </section>

            <section className='mt-6 rounded-4xl border border-[#2D2D2D] bg-[#111113] p-4 sm:p-5'>
                <div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
                    <div className='flex w-full items-center gap-3 rounded-full border border-[#2D2D2D] bg-[#080808] px-4 py-3 xl:max-w-md'>
                        <Search className='h-4 w-4 shrink-0 text-[#71717A]' />

                        <input
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            placeholder='Search title, message, page, email...'
                            className='w-full bg-transparent text-sm text-white outline-none placeholder:text-[#52525B]'
                        />
                    </div>

                    <div className='flex gap-2 overflow-x-auto pb-1 xl:pb-0'>
                        {STATUS_FILTERS.map((item) => {
                            const active = statusFilter === item.value

                            return (
                                <button
                                    key={item.value}
                                    type='button'
                                    onClick={() =>
                                        setStatusFilter(item.value)
                                    }
                                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                                        active
                                            ? 'bg-[#E8560A] text-white shadow-[0_0_24px_rgba(232,86,10,0.3)]'
                                            : 'bg-[#151515] text-[#A1A1AA] hover:bg-[#E8560A]/20 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className='mt-4 flex gap-2 overflow-x-auto pb-1'>
                    {TYPE_FILTERS.map((item) => {
                        const active = typeFilter === item.value

                        return (
                            <button
                                key={item.value}
                                type='button'
                                onClick={() => setTypeFilter(item.value)}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                                    active
                                        ? 'bg-white text-black'
                                        : 'bg-[#151515] text-[#A1A1AA] hover:bg-[#E8560A]/20 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </button>
                        )
                    })}
                </div>
            </section>

            <section className='mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]'>
                <div className='overflow-hidden rounded-4xl border border-[#2D2D2D] bg-[#111113]'>
                    <div className='border-b border-[#2D2D2D] p-5'>
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
                            <div>
                                <p className='flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#E8560A]'>
                                    <Filter className='h-3.5 w-3.5' />
                                    Results
                                </p>

                                <h2 className='mt-1 text-2xl font-black tracking-[-0.03em] text-white'>
                                    {filteredFeedback.length} feedback items
                                </h2>
                            </div>

                            <p className='text-xs text-[#71717A]'>
                                Showing max 100 items from backend
                            </p>
                        </div>
                    </div>

                    {filteredFeedback.length === 0 ? (
                        <EmptyFeedback />
                    ) : (
                        <div className='divide-y divide-[#2D2D2D]'>
                            {filteredFeedback.map((item) => (
                                <FeedbackRow
                                    key={item.id}
                                    item={item}
                                    active={
                                        selectedFeedback?.id === item.id
                                    }
                                    copied={copied}
                                    updating={
                                        updatingFeedbackId === item.id
                                    }
                                    onSelect={() =>
                                        setSelectedFeedback(item)
                                    }
                                    onCopy={copyText}
                                    onQuickUpdate={
                                        quickUpdateFeedback
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

                <aside className='xl:sticky xl:top-6 xl:h-fit'>
                    {selectedFeedback ? (
                        <FeedbackDetailPanel
                            item={selectedFeedback}
                            draftStatus={draftStatus}
                            setDraftStatus={setDraftStatus}
                            draftSentiment={draftSentiment}
                            setDraftSentiment={setDraftSentiment}
                            draftNotes={draftNotes}
                            setDraftNotes={setDraftNotes}
                            updating={
                                updatingFeedbackId === selectedFeedback.id
                            }
                            onSave={() =>
                                updateFeedback(selectedFeedback.id)
                            }
                        />
                    ) : (
                        <NoFeedbackSelected />
                    )}
                </aside>
            </section>
        </div>
    )
}


function FeedbackRow({
    item,
    active,
    copied,
    updating,
    onSelect,
    onCopy,
    onQuickUpdate,
}: {
    item: AdminFeedbackItem
    active: boolean
    copied: string
    updating: boolean
    onSelect: () => void
    onCopy: (label: string, value: string) => void
    onQuickUpdate: (
        item: AdminFeedbackItem,
        payload: Partial<
            Pick<
                AdminFeedbackItem,
                'status' | 'sentiment' | 'admin_notes'
            >
        >
    ) => void
}) {
    const copyKey = `feedback-${item.id}`

    return (
        <div
            className={`p-4 transition sm:p-5 ${
                active
                    ? 'bg-[#E8560A]/10'
                    : 'bg-[#080808] hover:bg-[#101010]'
            }`}
        >
            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                <button
                    type='button'
                    onClick={onSelect}
                    className='min-w-0 flex-1 text-left'
                >
                    <div className='mb-3 flex flex-wrap items-center gap-2'>
                        <StatusPill
                            text={formatText(item.status)}
                            tone={getStatusTone(item.status)}
                        />

                        <StatusPill
                            text={formatText(item.feedback_type)}
                            tone={getTypeTone(item.feedback_type)}
                        />

                        {item.sentiment && (
                            <StatusPill
                                text={item.sentiment}
                                tone={getSentimentTone(item.sentiment)}
                            />
                        )}

                        {typeof item.rating === 'number' && (
                            <StatusPill
                                text={`${item.rating}/5`}
                                tone='orange'
                            />
                        )}
                    </div>

                    <h3 className='line-clamp-2 text-base font-black text-white'>
                        {item.title || 'Untitled feedback'}
                    </h3>

                    <p className='mt-2 line-clamp-2 text-sm leading-6 text-[#A1A1AA]'>
                        {item.message}
                    </p>

                    <div className='mt-4 flex flex-wrap items-center gap-3 text-xs text-[#71717A]'>
                        <span>
                            Created {formatDate(item.created_at)}
                        </span>

                        {item.page_url && (
                            <span className='truncate'>
                                Page: {item.page_url}
                            </span>
                        )}

                        {item.contact_email && (
                            <span className='truncate'>
                                Email: {item.contact_email}
                            </span>
                        )}
                    </div>
                </button>

                <div className='flex flex-wrap gap-2 lg:justify-end'>
                    <button
                        type='button'
                        onClick={() => onCopy(copyKey, item.id)}
                        className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                    >
                        {copied === copyKey ? (
                            <CheckCircle2 className='h-3.5 w-3.5 text-green-400' />
                        ) : (
                            <Copy className='h-3.5 w-3.5' />
                        )}
                        Copy
                    </button>

                    {item.status === 'new' && (
                        <button
                            type='button'
                            disabled={updating}
                            onClick={() =>
                                onQuickUpdate(item, {
                                    status: 'reviewed',
                                })
                            }
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {updating ? (
                                <Loader2 className='h-3.5 w-3.5 animate-spin' />
                            ) : (
                                <BadgeCheck className='h-3.5 w-3.5' />
                            )}
                            Review
                        </button>
                    )}

                    {item.status !== 'planned' &&
                        item.feedback_type === 'idea' && (
                            <button
                                type='button'
                                disabled={updating}
                                onClick={() =>
                                    onQuickUpdate(item, {
                                        status: 'planned',
                                    })
                                }
                                className='inline-flex items-center justify-center gap-2 rounded-full bg-[#E8560A] px-3 py-2 text-xs font-black text-white transition hover:bg-[#ff6a1a] disabled:cursor-not-allowed disabled:opacity-50'
                            >
                                <Lightbulb className='h-3.5 w-3.5' />
                                Plan
                            </button>
                        )}

                    {item.status !== 'archived' && (
                        <button
                            type='button'
                            disabled={updating}
                            onClick={() =>
                                onQuickUpdate(item, {
                                    status: 'archived',
                                })
                            }
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-red-500/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            <Archive className='h-3.5 w-3.5' />
                            Archive
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}


function FeedbackDetailPanel({
    item,
    draftStatus,
    setDraftStatus,
    draftSentiment,
    setDraftSentiment,
    draftNotes,
    setDraftNotes,
    updating,
    onSave,
}: {
    item: AdminFeedbackItem
    draftStatus: FeedbackStatus
    setDraftStatus: (value: FeedbackStatus) => void
    draftSentiment: FeedbackSentiment
    setDraftSentiment: (value: FeedbackSentiment) => void
    draftNotes: string
    setDraftNotes: (value: string) => void
    updating: boolean
    onSave: () => void
}) {
    return (
        <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 shadow-2xl sm:p-6'>
            <div className='mb-5 flex items-start gap-3'>
                <div className='rounded-full bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                    <MessageSquareMore className='h-5 w-5' />
                </div>

                <div className='min-w-0'>
                    <p className='text-xs font-black uppercase tracking-[0.22em] text-[#E8560A]'>
                        Feedback details
                    </p>

                    <h2 className='mt-1 wrap-break-word text-xl font-black text-white'>
                        {item.title || 'Untitled feedback'}
                    </h2>
                </div>
            </div>

            <div className='rounded-3xl border border-[#2D2D2D] bg-[#080808] p-4'>
                <div className='mb-3 flex flex-wrap gap-2'>
                    <StatusPill
                        text={formatText(item.feedback_type)}
                        tone={getTypeTone(item.feedback_type)}
                    />

                    <StatusPill
                        text={formatText(item.status)}
                        tone={getStatusTone(item.status)}
                    />

                    {typeof item.rating === 'number' && (
                        <StatusPill
                            text={`${item.rating}/5 rating`}
                            tone='orange'
                        />
                    )}
                </div>

                <p className='whitespace-pre-wrap text-sm leading-7 text-[#A1A1AA]'>
                    {item.message}
                </p>
            </div>

            <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1'>
                <label className='block'>
                    <span className='text-xs font-black uppercase tracking-[0.16em] text-[#71717A]'>
                        Status
                    </span>

                    <select
                        value={draftStatus}
                        onChange={(event) =>
                            setDraftStatus(
                                event.target.value as FeedbackStatus
                            )
                        }
                        className='mt-2 w-full rounded-2xl border border-[#2D2D2D] bg-[#080808] px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-[#E8560A]/70'
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className='block'>
                    <span className='text-xs font-black uppercase tracking-[0.16em] text-[#71717A]'>
                        Sentiment
                    </span>

                    <select
                        value={draftSentiment}
                        onChange={(event) =>
                            setDraftSentiment(
                                event.target.value as FeedbackSentiment
                            )
                        }
                        className='mt-2 w-full rounded-2xl border border-[#2D2D2D] bg-[#080808] px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-[#E8560A]/70'
                    >
                        {SENTIMENT_OPTIONS.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className='mt-5 block'>
                <span className='text-xs font-black uppercase tracking-[0.16em] text-[#71717A]'>
                    Admin notes
                </span>

                <textarea
                    value={draftNotes}
                    onChange={(event) =>
                        setDraftNotes(event.target.value)
                    }
                    rows={7}
                    placeholder='Write admin-only notes here...'
                    className='mt-2 w-full resize-none rounded-2xl border border-[#2D2D2D] bg-[#080808] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-[#52525B] focus:border-[#E8560A]/70'
                />
            </label>

            <div className='mt-5 grid grid-cols-2 gap-3'>
                <SmallInfo
                    label='Type'
                    value={formatText(item.feedback_type)}
                />

                <SmallInfo
                    label='Created'
                    value={formatDate(item.created_at)}
                />

                <SmallInfo
                    label='User ID'
                    value={item.user_id || 'None'}
                />

                <SmallInfo
                    label='Email'
                    value={item.contact_email || 'None'}
                />

                <SmallInfo
                    label='Page'
                    value={item.page_url || 'None'}
                    wide
                />
            </div>

            <button
                type='button'
                onClick={onSave}
                disabled={updating}
                className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E8560A] px-5 py-3 text-sm font-black text-white transition hover:bg-[#ff6a1a] disabled:cursor-not-allowed disabled:opacity-60'
            >
                {updating ? (
                    <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Saving changes
                    </>
                ) : (
                    <>
                        <Save className='h-4 w-4' />
                        Save feedback changes
                    </>
                )}
            </button>
        </div>
    )
}


function NoFeedbackSelected() {
    return (
        <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 text-center shadow-2xl'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-[#71717A]'>
                <MessageSquareMore className='h-6 w-6' />
            </div>

            <h2 className='mt-4 text-xl font-black text-white'>
                Select feedback
            </h2>

            <p className='mt-2 text-sm leading-7 text-[#8B8B92]'>
                Choose a feedback item from the list to update status,
                sentiment, and admin notes.
            </p>
        </div>
    )
}


function MiniStatCard({
    label,
    value,
    icon: Icon,
    urgent,
    danger,
    orange,
}: {
    label: string
    value: number
    icon: typeof MessageSquareMore
    urgent?: boolean
    danger?: boolean
    orange?: boolean
}) {
    return (
        <div
            className={`rounded-3xl border p-4 ${
                danger
                    ? 'border-red-500/30 bg-red-500/10'
                    : urgent || orange
                      ? 'border-[#E8560A]/40 bg-[#E8560A]/10'
                      : 'border-[#2D2D2D] bg-[#111113]'
            }`}
        >
            <div className='mb-4 flex items-center justify-between'>
                <div
                    className={`rounded-full p-2.5 ${
                        danger
                            ? 'bg-red-500/15 text-red-400'
                            : urgent || orange
                              ? 'bg-[#E8560A] text-white'
                              : 'bg-[#E8560A]/10 text-[#E8560A]'
                    }`}
                >
                    <Icon className='h-4 w-4' />
                </div>

                {(danger || urgent || orange) && value > 0 && (
                    <AlertTriangle
                        className={`h-4 w-4 ${
                            danger
                                ? 'text-red-400'
                                : 'text-[#E8560A]'
                        }`}
                    />
                )}
            </div>

            <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#71717A]'>
                {label}
            </p>

            <h3 className='mt-1 text-3xl font-black tracking-tighter text-white'>
                {value}
            </h3>
        </div>
    )
}


function SmallInfo({
    label,
    value,
    wide,
}: {
    label: string
    value: string
    wide?: boolean
}) {
    return (
        <div
            className={`min-w-0 rounded-2xl border border-[#2D2D2D] bg-[#080808] p-3 ${
                wide ? 'col-span-2' : ''
            }`}
        >
            <p className='text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#71717A]'>
                {label}
            </p>

            <p className='mt-1 truncate text-xs font-black text-white'>
                {value}
            </p>
        </div>
    )
}


function StatusPill({
    text,
    tone,
}: {
    text: string
    tone: 'good' | 'danger' | 'muted' | 'orange' | 'warning'
}) {
    const classes = {
        good: 'border-green-500/30 bg-green-500/10 text-green-400',
        danger: 'border-red-500/30 bg-red-500/10 text-red-400',
        muted: 'border-[#2D2D2D] bg-[#151515] text-[#8B8B92]',
        orange: 'border-[#E8560A]/30 bg-[#E8560A]/10 text-[#E8560A]',
        warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    }

    return (
        <span
            className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] ${classes[tone]}`}
        >
            {text}
        </span>
    )
}


function EmptyFeedback() {
    return (
        <div className='flex min-h-80 items-center justify-center bg-[#080808] p-6 text-center'>
            <div>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-[#71717A]'>
                    <MessageSquareMore className='h-6 w-6' />
                </div>

                <h3 className='mt-4 text-xl font-black text-white'>
                    No feedback found
                </h3>

                <p className='mt-2 text-sm text-[#8B8B92]'>
                    Try changing search, status, or type filters.
                </p>
            </div>
        </div>
    )
}


function getAverageRating(items: AdminFeedbackItem[]) {
    const ratings = items
        .map((item) => item.rating)
        .filter(
            (rating): rating is number =>
                typeof rating === 'number'
        )

    if (!ratings.length) return 0

    const average =
        ratings.reduce((sum, rating) => sum + rating, 0) /
        ratings.length

    return Number(average.toFixed(1))
}


function getStatusTone(
    status: FeedbackStatus
): 'good' | 'danger' | 'muted' | 'orange' | 'warning' {
    if (status === 'new') return 'orange'
    if (status === 'reviewed') return 'warning'
    if (status === 'planned') return 'orange'
    if (status === 'shipped') return 'good'
    return 'muted'
}


function getTypeTone(
    type: FeedbackType
): 'good' | 'danger' | 'muted' | 'orange' | 'warning' {
    if (type === 'bug') return 'danger'
    if (type === 'idea') return 'orange'
    if (type === 'praise') return 'good'
    if (type === 'complaint') return 'warning'
    return 'muted'
}


function getSentimentTone(
    sentiment: FeedbackSentiment
): 'good' | 'danger' | 'muted' | 'orange' | 'warning' {
    if (sentiment === 'positive') return 'good'
    if (sentiment === 'negative') return 'danger'
    return 'muted'
}


function formatText(value: string) {
    return value.replaceAll('_', ' ')
}


function formatDate(value?: string | null) {
    if (!value) return 'Unknown'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return 'Unknown'
    }

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}