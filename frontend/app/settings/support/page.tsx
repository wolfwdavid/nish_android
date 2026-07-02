'use client'

import { useEffect, useMemo, useState } from 'react'
import type React from 'react'
import Link from 'next/link'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Mail,
    ChevronDown,
    ExternalLink,
    Sparkles,
    Send,
    Loader2,
    Bot,
    MessageCircle,
} from 'lucide-react'

type TicketStatus =
    | 'open'
    | 'in_progress'
    | 'waiting_on_user'
    | 'resolved'
    | 'closed'

type TicketCategory =
    | 'bug'
    | 'account'
    | 'integration'
    | 'feature_not_working'
    | 'other'

type TicketPriority =
    | 'low'
    | 'normal'
    | 'high'
    | 'urgent'

interface SupportTicket {
    id: string
    ticket_number: string
    user_id: string | null
    project_id: string | null
    subject: string
    description: string
    status: TicketStatus
    category: TicketCategory
    priority: TicketPriority
    created_at: string
    updated_at: string
    resolved_at: string | null
}

const STATUS_META: Record<
    TicketStatus,
    {
        label: string
        color: string
        icon: typeof Clock
    }
> = {
    open: {
        label: 'Open',
        color: 'text-[#3B82F6]',
        icon: AlertCircle,
    },
    in_progress: {
        label: 'In progress',
        color: 'text-[#E8560A]',
        icon: Clock,
    },
    waiting_on_user: {
        label: 'Waiting on you',
        color: 'text-[#E8560A]',
        icon: MessageCircle,
    },
    resolved: {
        label: 'Resolved',
        color: 'text-[#16A34A]',
        icon: CheckCircle2,
    },
    closed: {
        label: 'Closed',
        color: 'text-[#9CA3AF]',
        icon: CheckCircle2,
    },
}

const FAQS = [
    {
        q: 'How does GitHub sync work?',
        a: 'Once you connect GitHub from Settings → GitHub, DevManiac can sync selected repositories and attach them to your projects.',
    },
    {
        q: 'What counts as a shipped project?',
        a: 'A project counts as shipped when it has a real outcome: live link, GitHub repo, demo, or a completed project page.',
    },
    {
        q: 'Can I make a project private?',
        a: 'Yes. Private projects do not appear publicly on your profile, feed, or search.',
    },
    {
        q: 'How are my profile stats calculated?',
        a: 'Stats are calculated from projects, live project logs, stars, activity, and developer contributions.',
    },
    {
        q: 'How do I change my username?',
        a: 'Go to Settings → Profile. Username changes may be rate-limited later to prevent abuse.',
    },
    {
        q: 'How do I delete my account?',
        a: 'Go to Settings → Account → Danger Zone. Account deletion should require confirmation before becoming permanent.',
    },
]

export default function SupportPage() {
    const { user, isLoaded } = useUser()

    const [openTickets, setOpenTickets] = useState<SupportTicket[]>([])
    const [loadingTickets, setLoadingTickets] = useState(true)
    const [ticketError, setTicketError] = useState('')

    const [botOpen, setBotOpen] = useState(false)

    const clerkUserId = user?.id

    useEffect(() => {
        if (!isLoaded) return

        if (!clerkUserId) {
            setOpenTickets([])
            setLoadingTickets(false)
            return
        }

        async function fetchOpenTickets() {
            try {
                setLoadingTickets(true)
                setTicketError('')

                const res = await api.get('/support/tickets/open', {
                    params: {
                        clerk_user_id: clerkUserId,
                    },
                })

                setOpenTickets(res.data ?? [])
            } catch (error) {
                console.error(error)
                setOpenTickets([])
                setTicketError('Could not load your support tickets.')
            } finally {
                setLoadingTickets(false)
            }
        }

        fetchOpenTickets()
    }, [isLoaded, clerkUserId])

    return (
        <div className='mx-auto max-w-3xl space-y-16 px-6 py-12'>
            <header className='space-y-2'>
                <h1 className='text-5xl font-bold tracking-tight text-[#F9FAFB]'>
                    Support
                </h1>

                <p className='text-base text-[#9CA3AF]'>
                    Find an answer, reach the team, or report what&apos;s broken.
                </p>
            </header>

            <CurrentCasesSection
                tickets={openTickets}
                loading={loadingTickets}
                error={ticketError}
            />

            <ReportSection />

            <FaqSection />

            <EscalationSection
                botOpen={botOpen}
                setBotOpen={setBotOpen}
            />

            {botOpen && <BasicSupportBot />}

            <OtherSupportSection />
        </div>
    )
}

function CurrentCasesSection({
    tickets,
    loading,
    error,
}: {
    tickets: SupportTicket[]
    loading: boolean
    error: string
}) {
    return (
        <section className='space-y-4'>
            <div className='flex items-baseline justify-between'>
                <div>
                    <h2 className='text-2xl font-semibold text-[#F9FAFB]'>
                        Your open cases
                    </h2>

                    <p className='mt-1 text-sm text-[#9CA3AF]'>
                        Active reports stay here until they are resolved or closed.
                    </p>
                </div>

                {tickets.length > 0 && (
                    <Link
                        href='/settings/support/tickets'
                        className='text-sm text-[#9CA3AF] transition-colors hover:text-[#F9FAFB]'
                    >
                        View all →
                    </Link>
                )}
            </div>

            {loading ? (
                <div className='rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-6'>
                    <div className='flex items-center gap-3 text-[#9CA3AF]'>
                        <Loader2 className='h-4 w-4 animate-spin' />

                        <span className='text-sm'>
                            Checking your tickets…
                        </span>
                    </div>
                </div>
            ) : error ? (
                <div className='rounded-xl border border-[#7F1D1D]/60 bg-[#1C1C1E] p-6'>
                    <div className='flex items-center gap-3 text-sm text-red-400'>
                        <AlertCircle className='h-4 w-4' />
                        {error}
                    </div>
                </div>
            ) : tickets.length > 0 ? (
                <div className='space-y-3'>
                    {tickets.map((ticket) => (
                        <OpenTicketCard
                            key={ticket.id}
                            ticket={ticket}
                        />
                    ))}
                </div>
            ) : (
                <EmptyTicketState />
            )}
        </section>
    )
}

function OpenTicketCard({
    ticket,
}: {
    ticket: SupportTicket
}) {
    const meta = STATUS_META[ticket.status]
    const Icon = meta.icon

    return (
        <Link
            href={`/settings/support/tickets/${ticket.id}`}
            className='group block rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 transition-colors hover:border-[#E8560A]/40'
        >
            <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 space-y-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='rounded-full bg-[#0F0F0F] px-2 py-1 text-xs text-[#9CA3AF]'>
                            {ticket.ticket_number}
                        </span>

                        <span
                            className={`flex items-center gap-1.5 text-xs ${meta.color}`}
                        >
                            <Icon className='h-3.5 w-3.5' />
                            {meta.label}
                        </span>

                        <span className='text-xs capitalize text-[#9CA3AF]'>
                            {ticket.priority} priority
                        </span>
                    </div>

                    <h3 className='truncate font-medium text-[#F9FAFB] transition-colors group-hover:text-[#E8560A]'>
                        {ticket.subject}
                    </h3>

                    <p className='line-clamp-2 text-sm leading-relaxed text-[#9CA3AF]'>
                        {ticket.description}
                    </p>

                    <p className='text-xs text-[#6B7280]'>
                        Opened {formatRelativeTime(ticket.created_at)}
                    </p>
                </div>

                <ChevronDown className='mt-1 h-4 w-4 shrink-0 -rotate-90 text-[#9CA3AF] transition-colors group-hover:text-[#E8560A]' />
            </div>
        </Link>
    )
}

function EmptyTicketState() {
    return (
        <div className='rounded-xl border border-dashed border-[#2D2D2D] bg-transparent p-6 text-center'>
            <CheckCircle2 className='mx-auto mb-2 h-5 w-5 text-[#16A34A]' />

            <p className='text-sm text-[#9CA3AF]'>
                You have no open cases. All clear.
            </p>
        </div>
    )
}

function ReportSection() {
    return (
        <section className='space-y-4'>
            <SectionTitle
                title='Have a report?'
                description='Found a bug or hit a wall? Let us know.'
            />

            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <Link
                    href='/settings/support/new'
                    className='group flex items-start gap-4 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 transition-colors hover:border-[#E8560A]/40'
                >
                    <IconBox variant='orange'>
                        <FileText className='h-5 w-5' />
                    </IconBox>

                    <CardText
                        title='Submit a report'
                        description='Structured form. Best for bugs and broken things.'
                    />
                </Link>

                <a
                    href='mailto:devmaniacsupport@gmail.com'
                    className='group flex items-start gap-4 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 transition-colors hover:border-[#E8560A]/40'
                >
                    <IconBox variant='blue'>
                        <Mail className='h-5 w-5' />
                    </IconBox>

                    <CardText
                        title='Email us'
                        description='Prefer freeform? Write to devmaniacsupport@gmail.com.'
                    />
                </a>
            </div>
        </section>
    )
}

function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className='space-y-4'>
            <SectionTitle
                title='Frequently asked'
                description='Most answers live here.'
            />

            <div className='overflow-hidden rounded-xl border border-[#2D2D2D] bg-[#1C1C1E]'>
                {FAQS.map((faq, index) => {
                    const isOpen = openIndex === index
                    const isLast = index === FAQS.length - 1

                    return (
                        <div
                            key={faq.q}
                            className={
                                !isLast
                                    ? 'border-b border-[#2D2D2D]'
                                    : ''
                            }
                        >
                            <button
                                onClick={() =>
                                    setOpenIndex(isOpen ? null : index)
                                }
                                className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#0F0F0F]/40'
                            >
                                <span className='text-sm font-medium text-[#F9FAFB]'>
                                    {faq.q}
                                </span>

                                <ChevronDown
                                    className={`h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform ${
                                        isOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {isOpen && (
                                <div className='px-5 pb-4 text-sm leading-relaxed text-[#9CA3AF]'>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

function EscalationSection({
    botOpen,
    setBotOpen,
}: {
    botOpen: boolean
    setBotOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <section className='space-y-4'>
            <SectionTitle
                title='Not enough?'
                description='Two ways to dig deeper.'
            />

            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <button
                    onClick={() => setBotOpen((prev) => !prev)}
                    className='group flex items-start gap-4 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 text-left transition-colors hover:border-[#E8560A]/40'
                >
                    <IconBox variant='orange'>
                        <Sparkles className='h-5 w-5' />
                    </IconBox>

                    <CardText
                        title={botOpen ? 'Close bot' : 'Ask our bot'}
                        description='Basic MVP helper for common support questions.'
                    />
                </button>

                <a
                    href='mailto:devmaniacsupport@gmail.com'
                    className='group flex items-start gap-4 rounded-xl border border-[#2D2D2D] bg-[#1C1C1E] p-5 transition-colors hover:border-[#E8560A]/40'
                >
                    <IconBox variant='blue'>
                        <Send className='h-5 w-5' />
                    </IconBox>

                    <CardText
                        title='Email us'
                        description='We respond within 24 hours on weekdays.'
                    />
                </a>
            </div>
        </section>
    )
}

function BasicSupportBot() {
    const [message, setMessage] = useState('')
    const [answer, setAnswer] = useState(
        'Ask me about GitHub sync, project privacy, shipped projects, username changes, or account deletion.'
    )

    const faqAnswerMap = useMemo(
        () => [
            {
                keywords: ['github', 'sync', 'repo', 'repository'],
                answer:
                    'Go to Settings → GitHub. Connect your GitHub account, then choose which repositories DevManiac should sync.',
            },
            {
                keywords: ['private', 'privacy', 'hide'],
                answer:
                    'You can make a project private. Private projects will not show publicly on your profile, feed, or search.',
            },
            {
                keywords: ['ship', 'shipped', 'complete', 'project'],
                answer:
                    'A shipped project should have a real outcome: live link, GitHub repo, demo, or a completed project page.',
            },
            {
                keywords: ['username', 'name'],
                answer:
                    'Go to Settings → Profile to change your username. Later, username changes may be limited to prevent abuse.',
            },
            {
                keywords: ['delete', 'account', 'remove'],
                answer:
                    'Go to Settings → Account → Danger Zone. Deletion should require confirmation before it becomes permanent.',
            },
            {
                keywords: ['bug', 'broken', 'error', 'issue'],
                answer:
                    'For bugs, submit a report with the page URL, what happened, and what you expected. Screenshots help a lot.',
            },
        ],
        []
    )

    function handleAsk() {
        const normalized = message.trim().toLowerCase()

        if (!normalized) {
            setAnswer('Type a question first. The bot is small, not psychic yet 😭')
            return
        }

        const match = faqAnswerMap.find((item) =>
            item.keywords.some((keyword) => normalized.includes(keyword))
        )

        if (!match) {
            setAnswer(
                'I do not know that yet. For this MVP, submit a report or email devmaniacsupport@gmail.com.'
            )
            return
        }

        setAnswer(match.answer)
    }

    return (
        <section className='rounded-2xl border border-[#2D2D2D] bg-[#1C1C1E] p-5'>
            <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-[#E8560A]/10 p-2 text-[#E8560A]'>
                    <Bot className='h-5 w-5' />
                </div>

                <div>
                    <h2 className='font-semibold text-[#F9FAFB]'>
                        DevManiac Bot
                    </h2>

                    <p className='text-xs text-[#9CA3AF]'>
                        Basic MVP bot. FAQ search only for now.
                    </p>
                </div>
            </div>

            <div className='rounded-xl border border-[#2D2D2D] bg-[#0F0F0F] p-4 text-sm leading-relaxed text-[#D1D5DB]'>
                {answer}
            </div>

            <div className='mt-4 flex gap-2'>
                <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleAsk()
                        }
                    }}
                    placeholder='Ask about GitHub sync, bugs, privacy...'
                    className='min-w-0 flex-1 rounded-xl border border-[#2D2D2D] bg-[#0F0F0F] px-4 py-3 text-sm text-[#F9FAFB] outline-none placeholder:text-[#6B7280] focus:border-[#E8560A]/60'
                />

                <button
                    onClick={handleAsk}
                    className='rounded-xl bg-[#E8560A] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff6a1a]'
                >
                    Ask
                </button>
            </div>
        </section>
    )
}

function OtherSupportSection() {
const links = [
    {
        label: 'Documentation',
        href: 'https://docs.devmaniac.com',
        external: true,
    },
    {
        label: 'Status page',
        href: 'https://status.devmaniac.com',
        external: true,
    },
    {
        label: 'Changelog',
        href: '/changelog',
        external: false,
    },
    {
        label: 'Community Discord',
        href: 'https://discord.gg/devmaniac',
        external: true,
    },
]

    return (
        <section className='space-y-4'>
            <SectionTitle
                title='Other resources'
                description="Self-serve options the docs don't cover."
            />

            <div className='overflow-hidden rounded-xl border border-[#2D2D2D] bg-[#1C1C1E]'>
                {links.map((link, index) => {
                    const className = `flex items-center justify-between px-5 py-4 text-sm text-[#F9FAFB] transition-colors hover:bg-[#0F0F0F]/40 hover:text-[#E8560A] ${
                        index !== links.length - 1
                            ? 'border-b border-[#2D2D2D]'
                            : ''
                    }`

                    if (link.external) {
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                target='_blank'
                                rel='noopener noreferrer'
                                className={className}
                            >
                                <span>{link.label}</span>

                                <ExternalLink className='h-4 w-4 text-[#9CA3AF]' />
                            </a>
                        )
                    }

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={className}
                        >
                            <span>{link.label}</span>

                            <ChevronDown className='h-4 w-4 -rotate-90 text-[#9CA3AF]' />
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

function SectionTitle({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className='space-y-1'>
            <h2 className='text-2xl font-semibold text-[#F9FAFB]'>
                {title}
            </h2>

            <p className='text-sm text-[#9CA3AF]'>
                {description}
            </p>
        </div>
    )
}

function IconBox({
    children,
    variant,
}: {
    children: React.ReactNode
    variant: 'orange' | 'blue'
}) {
    const classes =
        variant === 'orange'
            ? 'bg-[#E8560A]/10 text-[#E8560A]'
            : 'bg-[#3B82F6]/10 text-[#3B82F6]'

    return (
        <div className={`shrink-0 rounded-lg p-2 ${classes}`}>
            {children}
        </div>
    )
}

function CardText({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className='space-y-1'>
            <h3 className='font-medium text-[#F9FAFB] transition-colors group-hover:text-[#E8560A]'>
                {title}
            </h3>

            <p className='text-xs text-[#9CA3AF]'>
                {description}
            </p>
        </div>
    )
}

function formatRelativeTime(iso: string): string {
    const now = new Date()
    const then = new Date(iso)

    const diffMs = now.getTime() - then.getTime()
    const diffMin = Math.floor(diffMs / 60_000)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)

    if (diffMin < 1) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDay < 7) return `${diffDay}d ago`

    return then.toLocaleDateString()
}