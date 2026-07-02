'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    BadgeCheck,
    BarChart3,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronRight,
    CircleDot,
    Code2,
    FolderKanban,
    Github,
    LayoutDashboard,
    LifeBuoy,
    Loader2,
    Lock,
    MessageSquareMore,
    RefreshCcw,
    ShieldCheck,
    Sparkles,
    Ticket,
    UserRound,
    Users,
    XCircle,
} from 'lucide-react'


type AdminStats = {
    total_users: number
    total_projects: number
    total_live_projects: number
    new_feedback: number
    open_support_tickets: number
    active_users: number
}


type AdminRecentUser = {
    id: string
    clerk_user_id: string
    username: string
    display_name: string
    email?: string | null
    is_active: boolean
    is_banned: boolean
    created_at: string
}


type AdminRecentProject = {
    id: string
    title: string
    slug: string
    stars_count: number
    views_count: number
    is_featured: boolean
    created_at: string
}


type AdminDashboardResponse = {
    stats: AdminStats
    recent_users: AdminRecentUser[]
    recent_projects: AdminRecentProject[]
}


const ADMIN_LINKS = [
    {
        title: 'Feedback',
        description: 'Review ideas, bugs, UX notes, and product signals.',
        href: '/admin/feedback',
        icon: MessageSquareMore,
        badge: 'Product signal',
    },
    {
        title: 'Support',
        description: 'Handle open tickets, account issues, and bug reports.',
        href: '/admin/support',
        icon: LifeBuoy,
        badge: 'Needs attention',
    },
    {
        title: 'Users',
        description: 'View users, account status, bans, and verification.',
        href: '/admin/users',
        icon: Users,
        badge: 'Identity',
    },
    {
        title: 'Projects',
        description: 'Feature, review, and inspect user projects.',
        href: '/admin/projects',
        icon: FolderKanban,
        badge: 'Content',
    },
]


export default function AdminDashboardPage() {
    const { user, isLoaded } = useUser()

    const [dashboard, setDashboard] =
        useState<AdminDashboardResponse | null>(null)

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState('')

    const adminIds = useMemo(() => {
        const raw =
            process.env.NEXT_PUBLIC_ADMIN_CLERK_USER_IDS ||
            process.env.NEXT_PUBLIC_ADMIN_CLERK_USER_ID ||
            ''

        return raw
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    }, [])

    const isAdmin = Boolean(
        user?.id && adminIds.includes(user.id)
    )

    useEffect(() => {
        if (!isLoaded) return

        if (!user?.id) {
            setLoading(false)
            return
        }

        if (!isAdmin) {
            setLoading(false)
            return
        }

        fetchDashboard()
    }, [isLoaded, user?.id, isAdmin])

    async function fetchDashboard() {
        try {
            setError('')
            setRefreshing(true)

            const res = await api.get('/admin/dashboard', {
                params: {
                    clerk_user_id: user?.id,
                },
            })

            setDashboard(res.data)
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not load admin dashboard.'

            setError(String(detail))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    if (!isLoaded || loading) {
        return (
            <AdminShell>
                <div className='flex min-h-[70vh] items-center justify-center'>
                    <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 text-center'>
                        <Loader2 className='mx-auto h-7 w-7 animate-spin text-[#E8560A]' />

                        <h2 className='mt-4 text-lg font-black text-white'>
                            Loading admin panel
                        </h2>

                        <p className='mt-2 text-sm text-[#8B8B92]'>
                            Checking your admin access...
                        </p>
                    </div>
                </div>
            </AdminShell>
        )
    }

    if (!user?.id) {
        return (
            <AdminShell>
                <AccessCard
                    title='Sign in required'
                    description='You need to sign in before accessing the admin panel.'
                    icon={Lock}
                />
            </AdminShell>
        )
    }

    if (!isAdmin) {
        return (
            <AdminShell>
                <AccessCard
                    title='Admin access required'
                    description='This area is private. Your account is not listed as an admin account.'
                    icon={ShieldCheck}
                />
            </AdminShell>
        )
    }

    return (
        <AdminShell>
            <section className='relative overflow-hidden rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 shadow-2xl sm:p-8'>
                <div className='pointer-events-none absolute -left-32.5 -top-32.5 h-80 w-80 rounded-full bg-[#E8560A]/20 blur-[110px]' />
                <div className='pointer-events-none absolute -right-30 -bottom-30 h-80 w-80 rounded-full bg-white/5 blur-[110px]' />

                <div className='relative grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end'>
                    <div>
                        <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#E8560A]'>
                            <LayoutDashboard className='h-3.5 w-3.5' />
                            Admin command center
                        </div>

                        <h1 className='max-w-3xl text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl'>
                            Control the whole product from one place.
                        </h1>

                        <p className='mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8'>
                            Track users, projects, feedback, and support
                            tickets. This panel is private and only visible to
                            approved admin Clerk IDs.
                        </p>

                        <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
                            <button
                                type='button'
                                onClick={fetchDashboard}
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
                                        Refresh dashboard
                                    </>
                                )}
                            </button>

                            <Link
                                href='/settings'
                                className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-5 py-3 text-sm font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                            >
                                Settings
                                <ArrowUpRight className='h-4 w-4' />
                            </Link>
                        </div>
                    </div>

                    <AdminStatusCard
                        userId={user.id}
                        email={
                            user.primaryEmailAddress?.emailAddress ||
                            'No email found'
                        }
                    />
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

            <section className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                <StatCard
                    title='Total users'
                    value={dashboard?.stats.total_users ?? 0}
                    icon={Users}
                    description='Registered accounts'
                />

                <StatCard
                    title='Active users'
                    value={dashboard?.stats.active_users ?? 0}
                    icon={CheckCircle2}
                    description='Currently active accounts'
                />

                <StatCard
                    title='Projects'
                    value={dashboard?.stats.total_projects ?? 0}
                    icon={Code2}
                    description='Finished project entries'
                />

                <StatCard
                    title='Live projects'
                    value={dashboard?.stats.total_live_projects ?? 0}
                    icon={Activity}
                    description='Ongoing build logs'
                />

                <StatCard
                    title='New feedback'
                    value={dashboard?.stats.new_feedback ?? 0}
                    icon={MessageSquareMore}
                    description='Waiting for review'
                    urgent={(dashboard?.stats.new_feedback ?? 0) > 0}
                />

                <StatCard
                    title='Open tickets'
                    value={dashboard?.stats.open_support_tickets ?? 0}
                    icon={Ticket}
                    description='Support needs attention'
                    urgent={
                        (dashboard?.stats.open_support_tickets ?? 0) > 0
                    }
                />
            </section>

            <section className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
                {ADMIN_LINKS.map((item) => (
                    <AdminLinkCard
                        key={item.title}
                        {...item}
                    />
                ))}
            </section>

            <section className='mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <RecentUsersTable
                    users={dashboard?.recent_users ?? []}
                />

                <RecentProjectsTable
                    projects={dashboard?.recent_projects ?? []}
                />
            </section>
        </AdminShell>
    )
}


function AdminShell({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className='min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl'>
                {children}
            </div>
        </main>
    )
}


function AccessCard({
    title,
    description,
    icon: Icon,
}: {
    title: string
    description: string
    icon: typeof Lock
}) {
    return (
        <div className='flex min-h-[70vh] items-center justify-center'>
            <div className='w-full max-w-lg rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 text-center shadow-2xl sm:p-8'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8560A]/10 text-[#E8560A]'>
                    <Icon className='h-7 w-7' />
                </div>

                <h1 className='mt-6 text-3xl font-black tracking-[-0.04em] text-white'>
                    {title}
                </h1>

                <p className='mt-3 text-sm leading-7 text-[#A1A1AA]'>
                    {description}
                </p>

                <Link
                    href='/'
                    className='mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#E8560A] px-5 py-3 text-sm font-black text-white transition hover:bg-[#ff6a1a]'
                >
                    Go home
                    <ArrowUpRight className='h-4 w-4' />
                </Link>
            </div>
        </div>
    )
}


function AdminStatusCard({
    userId,
    email,
}: {
    userId: string
    email: string
}) {
    return (
        <div className='rounded-3xl border border-[#2D2D2D] bg-[#080808]/80 p-5 shadow-2xl backdrop-blur'>
            <div className='mb-5 flex items-center justify-between border-b border-[#2D2D2D] pb-4'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#71717A]'>
                        Access status
                    </p>

                    <h2 className='mt-1 text-2xl font-black text-white'>
                        Admin verified
                    </h2>
                </div>

                <div className='rounded-full bg-[#E8560A] p-3 text-white shadow-[0_0_28px_rgba(232,86,10,0.35)]'>
                    <ShieldCheck className='h-6 w-6' />
                </div>
            </div>

            <div className='space-y-3'>
                <StatusRow
                    label='Auth provider'
                    value='Clerk'
                />

                <StatusRow
                    label='Admin lock'
                    value='Enabled'
                />

                <StatusRow
                    label='Email'
                    value={email}
                />

                <div className='rounded-2xl border border-[#2D2D2D] bg-[#111113] p-4'>
                    <p className='text-xs text-[#71717A]'>
                        Clerk user ID
                    </p>

                    <p className='mt-1 break-all text-xs font-bold text-[#D1D5DB]'>
                        {userId}
                    </p>
                </div>
            </div>
        </div>
    )
}


function StatCard({
    title,
    value,
    description,
    icon: Icon,
    urgent,
}: {
    title: string
    value: number
    description: string
    icon: typeof Users
    urgent?: boolean
}) {
    return (
        <div
            className={`
                rounded-[1.7rem] border p-5 shadow-xl transition hover:-translate-y-1
                ${
                    urgent
                        ? 'border-[#E8560A]/40 bg-[#E8560A]/10'
                        : 'border-[#2D2D2D] bg-[#111113]'
                }
            `}
        >
            <div className='mb-5 flex items-start justify-between'>
                <div
                    className={`
                        rounded-full p-3
                        ${
                            urgent
                                ? 'bg-[#E8560A] text-white'
                                : 'bg-[#151515] text-[#E8560A]'
                        }
                    `}
                >
                    <Icon className='h-5 w-5' />
                </div>

                {urgent && (
                    <span className='rounded-full bg-[#E8560A] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-white'>
                        Check
                    </span>
                )}
            </div>

            <p className='text-sm font-bold text-[#A1A1AA]'>
                {title}
            </p>

            <h3 className='mt-2 text-4xl font-black tracking-tighter text-white'>
                {value}
            </h3>

            <p className='mt-2 text-xs leading-5 text-[#71717A]'>
                {description}
            </p>
        </div>
    )
}


function AdminLinkCard({
    title,
    description,
    href,
    icon: Icon,
    badge,
}: {
    title: string
    description: string
    href: string
    icon: typeof MessageSquareMore
    badge: string
}) {
    return (
        <Link
            href={href}
            className='group rounded-[1.7rem] border border-[#2D2D2D] bg-[#111113] p-5 transition hover:-translate-y-1 hover:border-[#E8560A]/50 hover:bg-[#151515]'
        >
            <div className='mb-5 flex items-start justify-between gap-4'>
                <div className='rounded-full bg-[#E8560A]/10 p-3 text-[#E8560A] transition group-hover:bg-[#E8560A] group-hover:text-white'>
                    <Icon className='h-5 w-5' />
                </div>

                <ChevronRight className='h-5 w-5 text-[#52525B] transition group-hover:translate-x-1 group-hover:text-[#E8560A]' />
            </div>

            <span className='rounded-full bg-[#151515] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#8B8B92]'>
                {badge}
            </span>

            <h3 className='mt-4 text-lg font-black text-white'>
                {title}
            </h3>

            <p className='mt-2 text-sm leading-6 text-[#A1A1AA]'>
                {description}
            </p>
        </Link>
    )
}


function RecentUsersTable({
    users,
}: {
    users: AdminRecentUser[]
}) {
    return (
        <section className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
            <TableHeader
                eyebrow='Latest accounts'
                title='Recent users'
                href='/admin/users'
                icon={Users}
            />

            <div className='mt-5 overflow-hidden rounded-2xl border border-[#2D2D2D]'>
                {users.length === 0 ? (
                    <EmptyState text='No users found yet.' />
                ) : (
                    <div className='divide-y divide-[#2D2D2D]'>
                        {users.map((item) => (
                            <div
                                key={item.id}
                                className='grid grid-cols-1 gap-3 bg-[#080808] p-4 transition hover:bg-[#101010] sm:grid-cols-[1fr_auto]'
                            >
                                <div className='min-w-0'>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <p className='truncate text-sm font-black text-white'>
                                            {item.display_name}
                                        </p>

                                        {item.is_banned ? (
                                            <StatusPill
                                                text='Banned'
                                                tone='danger'
                                            />
                                        ) : item.is_active ? (
                                            <StatusPill
                                                text='Active'
                                                tone='good'
                                            />
                                        ) : (
                                            <StatusPill
                                                text='Inactive'
                                                tone='muted'
                                            />
                                        )}
                                    </div>

                                    <p className='mt-1 truncate text-xs text-[#8B8B92]'>
                                        @{item.username}
                                    </p>

                                    <p className='mt-1 truncate text-xs text-[#52525B]'>
                                        {item.email || 'No email'}
                                    </p>
                                </div>

                                <p className='text-xs font-medium text-[#71717A] sm:text-right'>
                                    {formatDate(item.created_at)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}


function RecentProjectsTable({
    projects,
}: {
    projects: AdminRecentProject[]
}) {
    return (
        <section className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
            <TableHeader
                eyebrow='Latest builds'
                title='Recent projects'
                href='/admin/projects'
                icon={FolderKanban}
            />

            <div className='mt-5 overflow-hidden rounded-2xl border border-[#2D2D2D]'>
                {projects.length === 0 ? (
                    <EmptyState text='No projects found yet.' />
                ) : (
                    <div className='divide-y divide-[#2D2D2D]'>
                        {projects.map((item) => (
                            <div
                                key={item.id}
                                className='grid grid-cols-1 gap-3 bg-[#080808] p-4 transition hover:bg-[#101010] sm:grid-cols-[1fr_auto]'
                            >
                                <div className='min-w-0'>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <p className='truncate text-sm font-black text-white'>
                                            {item.title}
                                        </p>

                                        {item.is_featured && (
                                            <StatusPill
                                                text='Featured'
                                                tone='orange'
                                            />
                                        )}
                                    </div>

                                    <p className='mt-1 truncate text-xs text-[#8B8B92]'>
                                        /projects/{item.slug}
                                    </p>

                                    <div className='mt-2 flex flex-wrap items-center gap-3 text-xs text-[#71717A]'>
                                        <span>
                                            {item.stars_count} stars
                                        </span>

                                        <span>
                                            {item.views_count} views
                                        </span>
                                    </div>
                                </div>

                                <p className='text-xs font-medium text-[#71717A] sm:text-right'>
                                    {formatDate(item.created_at)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}


function TableHeader({
    eyebrow,
    title,
    href,
    icon: Icon,
}: {
    eyebrow: string
    title: string
    href: string
    icon: typeof Users
}) {
    return (
        <div className='flex items-start justify-between gap-4'>
            <div className='flex items-start gap-3'>
                <div className='rounded-full bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                    <Icon className='h-5 w-5' />
                </div>

                <div>
                    <p className='text-xs font-black uppercase tracking-[0.22em] text-[#E8560A]'>
                        {eyebrow}
                    </p>

                    <h2 className='mt-1 text-xl font-black text-white'>
                        {title}
                    </h2>
                </div>
            </div>

            <Link
                href={href}
                className='inline-flex items-center gap-1 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
            >
                View all
                <ChevronRight className='h-3.5 w-3.5' />
            </Link>
        </div>
    )
}


function StatusRow({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className='flex items-center justify-between gap-4 rounded-2xl border border-[#2D2D2D] bg-[#111113] px-4 py-3'>
            <span className='text-xs text-[#8B8B92]'>
                {label}
            </span>

            <span className='truncate text-right text-xs font-black text-white'>
                {value}
            </span>
        </div>
    )
}


function StatusPill({
    text,
    tone,
}: {
    text: string
    tone: 'good' | 'danger' | 'muted' | 'orange'
}) {
    const classes = {
        good: 'bg-green-500/10 text-green-400 border-green-500/30',
        danger: 'bg-red-500/10 text-red-400 border-red-500/30',
        muted: 'bg-[#151515] text-[#8B8B92] border-[#2D2D2D]',
        orange: 'bg-[#E8560A]/10 text-[#E8560A] border-[#E8560A]/30',
    }

    return (
        <span
            className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-[0.12em] ${classes[tone]}`}
        >
            {text}
        </span>
    )
}


function EmptyState({
    text,
}: {
    text: string
}) {
    return (
        <div className='flex min-h-40 items-center justify-center bg-[#080808] p-6 text-center'>
            <div>
                <CircleDot className='mx-auto h-6 w-6 text-[#52525B]' />

                <p className='mt-3 text-sm text-[#8B8B92]'>
                    {text}
                </p>
            </div>
        </div>
    )
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