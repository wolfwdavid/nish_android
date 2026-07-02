'use client'

import { useEffect, useMemo, useState } from 'react'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Copy,
    Filter,
    Inbox,
    LifeBuoy,
    Loader2,
    MessageSquareText,
    RefreshCcw,
    Save,
    Search,
    ShieldAlert,
    Ticket,
    XCircle,
} from 'lucide-react'


type TicketStatus =
    | 'open'
    | 'in_progress'
    | 'waiting_on_user'
    | 'resolved'
    | 'closed'

type TicketPriority =
    | 'low'
    | 'normal'
    | 'high'
    | 'urgent'

type TicketCategory =
    | 'bug'
    | 'account'
    | 'integration'
    | 'feature_not_working'
    | 'other'


type AdminSupportTicket = {
    id: string
    ticket_number: string

    user_id?: string | null
    project_id?: string | null

    category: TicketCategory
    status: TicketStatus
    priority: TicketPriority

    subject: string
    description: string

    internal_notes?: string | null
    resolved_at?: string | null

    created_at: string
    updated_at: string
}


type StatusFilter =
    | 'all'
    | TicketStatus


const STATUS_FILTERS: {
    label: string
    value: StatusFilter
}[] = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'Open',
        value: 'open',
    },
    {
        label: 'In progress',
        value: 'in_progress',
    },
    {
        label: 'Waiting',
        value: 'waiting_on_user',
    },
    {
        label: 'Resolved',
        value: 'resolved',
    },
    {
        label: 'Closed',
        value: 'closed',
    },
]


const STATUS_OPTIONS: {
    label: string
    value: TicketStatus
}[] = [
    {
        label: 'Open',
        value: 'open',
    },
    {
        label: 'In progress',
        value: 'in_progress',
    },
    {
        label: 'Waiting on user',
        value: 'waiting_on_user',
    },
    {
        label: 'Resolved',
        value: 'resolved',
    },
    {
        label: 'Closed',
        value: 'closed',
    },
]


const PRIORITY_OPTIONS: {
    label: string
    value: TicketPriority
}[] = [
    {
        label: 'Low',
        value: 'low',
    },
    {
        label: 'Normal',
        value: 'normal',
    },
    {
        label: 'High',
        value: 'high',
    },
    {
        label: 'Urgent',
        value: 'urgent',
    },
]


export default function AdminSupportPage() {
    const { user, isLoaded } = useUser()

    const [tickets, setTickets] =
        useState<AdminSupportTicket[]>([])

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [updatingTicketId, setUpdatingTicketId] =
        useState<string | null>(null)

    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>('all')

    const [selectedTicket, setSelectedTicket] =
        useState<AdminSupportTicket | null>(null)

    const [draftStatus, setDraftStatus] =
        useState<TicketStatus>('open')

    const [draftPriority, setDraftPriority] =
        useState<TicketPriority>('normal')

    const [draftNotes, setDraftNotes] = useState('')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [copied, setCopied] = useState('')

    const clerkUserId = user?.id

    const filteredTickets = useMemo(() => {
        const search = query.trim().toLowerCase()

        return tickets.filter((ticket) => {
            const matchesSearch =
                !search ||
                ticket.ticket_number
                    .toLowerCase()
                    .includes(search) ||
                ticket.subject.toLowerCase().includes(search) ||
                ticket.description.toLowerCase().includes(search) ||
                ticket.category.toLowerCase().includes(search) ||
                ticket.priority.toLowerCase().includes(search) ||
                ticket.status.toLowerCase().includes(search)

            const matchesStatus =
                statusFilter === 'all' ||
                ticket.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [tickets, query, statusFilter])

    const stats = useMemo(() => {
        return {
            total: tickets.length,
            open: tickets.filter((item) => item.status === 'open')
                .length,
            inProgress: tickets.filter(
                (item) => item.status === 'in_progress'
            ).length,
            waiting: tickets.filter(
                (item) => item.status === 'waiting_on_user'
            ).length,
            urgent: tickets.filter(
                (item) => item.priority === 'urgent'
            ).length,
            resolved: tickets.filter(
                (item) => item.status === 'resolved'
            ).length,
        }
    }, [tickets])

    useEffect(() => {
        if (!isLoaded) return

        if (!clerkUserId) {
            setLoading(false)
            return
        }

        fetchTickets()
    }, [isLoaded, clerkUserId])

    useEffect(() => {
        if (!selectedTicket) return

        setDraftStatus(selectedTicket.status)
        setDraftPriority(selectedTicket.priority)
        setDraftNotes(selectedTicket.internal_notes || '')
    }, [selectedTicket])

    async function fetchTickets() {
        try {
            setError('')
            setRefreshing(true)

            const res = await api.get('/admin/support-tickets', {
                params: {
                    clerk_user_id: clerkUserId,
                    limit: 100,
                },
            })

            setTickets(res.data)

            if (selectedTicket) {
                const fresh = res.data.find(
                    (item: AdminSupportTicket) =>
                        item.id === selectedTicket.id
                )

                setSelectedTicket(fresh || null)
            }
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not load support tickets.'

            setError(String(detail))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function updateTicket(ticketId: string) {
        try {
            setUpdatingTicketId(ticketId)
            setError('')
            setSuccess('')

            const res = await api.patch(
                `/admin/support-tickets/${ticketId}`,
                {
                    status: draftStatus,
                    priority: draftPriority,
                    internal_notes: draftNotes.trim() || null,
                },
                {
                    params: {
                        clerk_user_id: clerkUserId,
                    },
                }
            )

            setTickets((prev) =>
                prev.map((item) =>
                    item.id === ticketId ? res.data : item
                )
            )

            setSelectedTicket(res.data)
            setSuccess('Support ticket updated successfully.')
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not update support ticket.'

            setError(String(detail))
        } finally {
            setUpdatingTicketId(null)
        }
    }

    async function quickUpdateTicket(
        ticket: AdminSupportTicket,
        payload: Partial<
            Pick<
                AdminSupportTicket,
                'status' | 'priority' | 'internal_notes'
            >
        >
    ) {
        try {
            setUpdatingTicketId(ticket.id)
            setError('')
            setSuccess('')

            const res = await api.patch(
                `/admin/support-tickets/${ticket.id}`,
                payload,
                {
                    params: {
                        clerk_user_id: clerkUserId,
                    },
                }
            )

            setTickets((prev) =>
                prev.map((item) =>
                    item.id === ticket.id ? res.data : item
                )
            )

            if (selectedTicket?.id === ticket.id) {
                setSelectedTicket(res.data)
            }

            setSuccess('Ticket updated.')
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not update ticket.'

            setError(String(detail))
        } finally {
            setUpdatingTicketId(null)
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
                        Loading support tickets
                    </h1>

                    <p className='mt-2 text-sm text-[#8B8B92]'>
                        Fetching user reports and account issues...
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
                            <LifeBuoy className='h-3.5 w-3.5' />
                            Support operations
                        </div>

                        <h1 className='max-w-3xl text-4xl font-black tracking-tighter text-white sm:text-5xl'>
                            Support tickets
                        </h1>

                        <p className='mt-4 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8'>
                            Review user issues, change status, set priority,
                            and keep internal admin notes without exposing them
                            publicly.
                        </p>
                    </div>

                    <button
                        type='button'
                        onClick={fetchTickets}
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
                                Refresh tickets
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

            <section className='mt-6 grid grid-cols-2 gap-4 lg:grid-cols-6'>
                <MiniStatCard
                    label='Total'
                    value={stats.total}
                    icon={Ticket}
                />

                <MiniStatCard
                    label='Open'
                    value={stats.open}
                    icon={Inbox}
                    urgent={stats.open > 0}
                />

                <MiniStatCard
                    label='Progress'
                    value={stats.inProgress}
                    icon={Clock3}
                />

                <MiniStatCard
                    label='Waiting'
                    value={stats.waiting}
                    icon={MessageSquareText}
                />

                <MiniStatCard
                    label='Urgent'
                    value={stats.urgent}
                    icon={ShieldAlert}
                    danger={stats.urgent > 0}
                />

                <MiniStatCard
                    label='Resolved'
                    value={stats.resolved}
                    icon={CheckCircle2}
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
                            placeholder='Search ticket, subject, category...'
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
                                    {filteredTickets.length} tickets found
                                </h2>
                            </div>

                            <p className='text-xs text-[#71717A]'>
                                Showing max 100 tickets from backend
                            </p>
                        </div>
                    </div>

                    {filteredTickets.length === 0 ? (
                        <EmptyTickets />
                    ) : (
                        <div className='divide-y divide-[#2D2D2D]'>
                            {filteredTickets.map((ticket) => (
                                <TicketRow
                                    key={ticket.id}
                                    ticket={ticket}
                                    active={
                                        selectedTicket?.id ===
                                        ticket.id
                                    }
                                    copied={copied}
                                    updating={
                                        updatingTicketId ===
                                        ticket.id
                                    }
                                    onSelect={() =>
                                        setSelectedTicket(ticket)
                                    }
                                    onCopy={copyText}
                                    onQuickUpdate={
                                        quickUpdateTicket
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

                <aside className='xl:sticky xl:top-6 xl:h-fit'>
                    {selectedTicket ? (
                        <TicketDetailPanel
                            ticket={selectedTicket}
                            draftStatus={draftStatus}
                            setDraftStatus={setDraftStatus}
                            draftPriority={draftPriority}
                            setDraftPriority={setDraftPriority}
                            draftNotes={draftNotes}
                            setDraftNotes={setDraftNotes}
                            updating={
                                updatingTicketId === selectedTicket.id
                            }
                            onSave={() =>
                                updateTicket(selectedTicket.id)
                            }
                        />
                    ) : (
                        <NoTicketSelected />
                    )}
                </aside>
            </section>
        </div>
    )
}


function TicketRow({
    ticket,
    active,
    copied,
    updating,
    onSelect,
    onCopy,
    onQuickUpdate,
}: {
    ticket: AdminSupportTicket
    active: boolean
    copied: string
    updating: boolean
    onSelect: () => void
    onCopy: (label: string, value: string) => void
    onQuickUpdate: (
        ticket: AdminSupportTicket,
        payload: Partial<
            Pick<
                AdminSupportTicket,
                'status' | 'priority' | 'internal_notes'
            >
        >
    ) => void
}) {
    const copyKey = `ticket-${ticket.id}`

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
                            text={formatTicketStatus(ticket.status)}
                            tone={getStatusTone(ticket.status)}
                        />

                        <StatusPill
                            text={ticket.priority}
                            tone={getPriorityTone(ticket.priority)}
                        />

                        <StatusPill
                            text={formatCategory(ticket.category)}
                            tone='muted'
                        />
                    </div>

                    <h3 className='line-clamp-2 text-base font-black text-white'>
                        {ticket.subject}
                    </h3>

                    <p className='mt-2 line-clamp-2 text-sm leading-6 text-[#A1A1AA]'>
                        {ticket.description}
                    </p>

                    <div className='mt-4 flex flex-wrap items-center gap-3 text-xs text-[#71717A]'>
                        <span>
                            #{ticket.ticket_number}
                        </span>

                        <span>
                            Created {formatDate(ticket.created_at)}
                        </span>

                        <span>
                            Updated {formatDate(ticket.updated_at)}
                        </span>
                    </div>
                </button>

                <div className='flex flex-wrap gap-2 lg:justify-end'>
                    <button
                        type='button'
                        onClick={() =>
                            onCopy(copyKey, ticket.ticket_number)
                        }
                        className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                    >
                        {copied === copyKey ? (
                            <CheckCircle2 className='h-3.5 w-3.5 text-green-400' />
                        ) : (
                            <Copy className='h-3.5 w-3.5' />
                        )}
                        Copy
                    </button>

                    {ticket.status !== 'in_progress' && (
                        <button
                            type='button'
                            disabled={updating}
                            onClick={() =>
                                onQuickUpdate(ticket, {
                                    status: 'in_progress',
                                })
                            }
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {updating ? (
                                <Loader2 className='h-3.5 w-3.5 animate-spin' />
                            ) : (
                                <Clock3 className='h-3.5 w-3.5' />
                            )}
                            Start
                        </button>
                    )}

                    {ticket.status !== 'resolved' && (
                        <button
                            type='button'
                            disabled={updating}
                            onClick={() =>
                                onQuickUpdate(ticket, {
                                    status: 'resolved',
                                })
                            }
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-green-500/10 px-3 py-2 text-xs font-black text-green-400 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            <CheckCircle2 className='h-3.5 w-3.5' />
                            Resolve
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}


function TicketDetailPanel({
    ticket,
    draftStatus,
    setDraftStatus,
    draftPriority,
    setDraftPriority,
    draftNotes,
    setDraftNotes,
    updating,
    onSave,
}: {
    ticket: AdminSupportTicket
    draftStatus: TicketStatus
    setDraftStatus: (value: TicketStatus) => void
    draftPriority: TicketPriority
    setDraftPriority: (value: TicketPriority) => void
    draftNotes: string
    setDraftNotes: (value: string) => void
    updating: boolean
    onSave: () => void
}) {
    return (
        <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 shadow-2xl sm:p-6'>
            <div className='mb-5 flex items-start gap-3'>
                <div className='rounded-full bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                    <Ticket className='h-5 w-5' />
                </div>

                <div className='min-w-0'>
                    <p className='text-xs font-black uppercase tracking-[0.22em] text-[#E8560A]'>
                        Ticket details
                    </p>

                    <h2 className='mt-1 wrap-break-word text-xl font-black text-white'>
                        #{ticket.ticket_number}
                    </h2>
                </div>
            </div>

            <div className='rounded-3xl border border-[#2D2D2D] bg-[#080808] p-4'>
                <h3 className='text-base font-black text-white'>
                    {ticket.subject}
                </h3>

                <p className='mt-3 whitespace-pre-wrap text-sm leading-7 text-[#A1A1AA]'>
                    {ticket.description}
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
                                event.target.value as TicketStatus
                            )
                        }
                        className='mt-2 w-full rounded-2xl border border-[#2D2D2D] bg-[#080808] px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-[#E8560A]/70'
                    >
                        {STATUS_OPTIONS.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className='block'>
                    <span className='text-xs font-black uppercase tracking-[0.16em] text-[#71717A]'>
                        Priority
                    </span>

                    <select
                        value={draftPriority}
                        onChange={(event) =>
                            setDraftPriority(
                                event.target.value as TicketPriority
                            )
                        }
                        className='mt-2 w-full rounded-2xl border border-[#2D2D2D] bg-[#080808] px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-[#E8560A]/70'
                    >
                        {PRIORITY_OPTIONS.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className='mt-5 block'>
                <span className='text-xs font-black uppercase tracking-[0.16em] text-[#71717A]'>
                    Internal notes
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
                    label='Category'
                    value={formatCategory(ticket.category)}
                />

                <SmallInfo
                    label='Created'
                    value={formatDate(ticket.created_at)}
                />

                <SmallInfo
                    label='User ID'
                    value={ticket.user_id || 'None'}
                />

                <SmallInfo
                    label='Project ID'
                    value={ticket.project_id || 'None'}
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
                        Save ticket changes
                    </>
                )}
            </button>
        </div>
    )
}


function NoTicketSelected() {
    return (
        <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 text-center shadow-2xl'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-[#71717A]'>
                <MessageSquareText className='h-6 w-6' />
            </div>

            <h2 className='mt-4 text-xl font-black text-white'>
                Select a ticket
            </h2>

            <p className='mt-2 text-sm leading-7 text-[#8B8B92]'>
                Choose a support ticket from the list to update status,
                priority, and internal notes.
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
}: {
    label: string
    value: number
    icon: typeof Ticket
    urgent?: boolean
    danger?: boolean
}) {
    return (
        <div
            className={`rounded-3xl border p-4 ${
                danger
                    ? 'border-red-500/30 bg-red-500/10'
                    : urgent
                      ? 'border-[#E8560A]/40 bg-[#E8560A]/10'
                      : 'border-[#2D2D2D] bg-[#111113]'
            }`}
        >
            <div className='mb-4 flex items-center justify-between'>
                <div
                    className={`rounded-full p-2.5 ${
                        danger
                            ? 'bg-red-500/15 text-red-400'
                            : urgent
                              ? 'bg-[#E8560A] text-white'
                              : 'bg-[#E8560A]/10 text-[#E8560A]'
                    }`}
                >
                    <Icon className='h-4 w-4' />
                </div>

                {(danger || urgent) && value > 0 && (
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
}: {
    label: string
    value: string
}) {
    return (
        <div className='min-w-0 rounded-2xl border border-[#2D2D2D] bg-[#080808] p-3'>
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


function EmptyTickets() {
    return (
        <div className='flex min-h-80 items-center justify-center bg-[#080808] p-6 text-center'>
            <div>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-[#71717A]'>
                    <Ticket className='h-6 w-6' />
                </div>

                <h3 className='mt-4 text-xl font-black text-white'>
                    No tickets found
                </h3>

                <p className='mt-2 text-sm text-[#8B8B92]'>
                    Try changing your search or status filter.
                </p>
            </div>
        </div>
    )
}


function getStatusTone(
    status: TicketStatus
): 'good' | 'danger' | 'muted' | 'orange' | 'warning' {
    if (status === 'open') return 'orange'
    if (status === 'in_progress') return 'warning'
    if (status === 'waiting_on_user') return 'muted'
    if (status === 'resolved') return 'good'
    return 'muted'
}


function getPriorityTone(
    priority: TicketPriority
): 'good' | 'danger' | 'muted' | 'orange' | 'warning' {
    if (priority === 'urgent') return 'danger'
    if (priority === 'high') return 'orange'
    if (priority === 'normal') return 'warning'
    return 'muted'
}


function formatTicketStatus(status: TicketStatus) {
    return status.replaceAll('_', ' ')
}


function formatCategory(category: TicketCategory) {
    return category.replaceAll('_', ' ')
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