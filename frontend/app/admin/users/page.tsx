'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    AlertTriangle,
    BadgeCheck,
    Ban,
    CheckCircle2,
    ChevronRight,
    Copy,
    Eye,
    Loader2,
    RefreshCcw,
    Search,
    ShieldCheck,
    UserCheck,
    UserRound,
    Users,
    XCircle,
} from 'lucide-react'


type AdminUser = {
    id: string
    clerk_user_id: string

    username: string
    display_name: string
    email?: string | null

    project_count: number
    reports_count: number

    is_verified: boolean
    is_active: boolean
    is_private: boolean
    is_banned: boolean

    created_at: string
    updated_at: string
}


type UserFilter =
    | 'all'
    | 'active'
    | 'verified'
    | 'banned'
    | 'private'


const FILTERS: {
    label: string
    value: UserFilter
}[] = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'Active',
        value: 'active',
    },
    {
        label: 'Verified',
        value: 'verified',
    },
    {
        label: 'Banned',
        value: 'banned',
    },
    {
        label: 'Private',
        value: 'private',
    },
]


export default function AdminUsersPage() {
    const { user, isLoaded } = useUser()

    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [updatingUserId, setUpdatingUserId] =
        useState<string | null>(null)

    const [query, setQuery] = useState('')
    const [filter, setFilter] =
        useState<UserFilter>('all')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [copied, setCopied] = useState('')

    const clerkUserId = user?.id

    const filteredUsers = useMemo(() => {
        const search = query.trim().toLowerCase()

        return users.filter((item) => {
            const matchesSearch =
                !search ||
                item.username?.toLowerCase().includes(search) ||
                item.display_name
                    ?.toLowerCase()
                    .includes(search) ||
                item.email?.toLowerCase().includes(search) ||
                item.clerk_user_id
                    ?.toLowerCase()
                    .includes(search)

            const matchesFilter =
                filter === 'all' ||
                (filter === 'active' && item.is_active) ||
                (filter === 'verified' && item.is_verified) ||
                (filter === 'banned' && item.is_banned) ||
                (filter === 'private' && item.is_private)

            return matchesSearch && matchesFilter
        })
    }, [users, query, filter])

    const stats = useMemo(() => {
        return {
            total: users.length,
            active: users.filter((item) => item.is_active).length,
            verified: users.filter((item) => item.is_verified)
                .length,
            banned: users.filter((item) => item.is_banned).length,
            private: users.filter((item) => item.is_private).length,
        }
    }, [users])

    useEffect(() => {
        if (!isLoaded) return

        if (!clerkUserId) {
            setLoading(false)
            return
        }

        fetchUsers()
    }, [isLoaded, clerkUserId])

    async function fetchUsers() {
        try {
            setError('')
            setRefreshing(true)

            const res = await api.get('/admin/users', {
                params: {
                    clerk_user_id: clerkUserId,
                    limit: 100,
                },
            })

            setUsers(res.data)
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not load admin users.'

            setError(String(detail))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function updateUser(
        userId: string,
        payload: Partial<
            Pick<
                AdminUser,
                'is_verified' | 'is_active' | 'is_banned'
            >
        >
    ) {
        try {
            setUpdatingUserId(userId)
            setError('')
            setSuccess('')

            const res = await api.patch(
                `/admin/users/${userId}`,
                payload,
                {
                    params: {
                        clerk_user_id: clerkUserId,
                    },
                }
            )

            setUsers((prev) =>
                prev.map((item) =>
                    item.id === userId ? res.data : item
                )
            )

            setSuccess('User updated successfully.')
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not update user.'

            setError(String(detail))
        } finally {
            setUpdatingUserId(null)
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
                        Loading users
                    </h1>

                    <p className='mt-2 text-sm text-[#8B8B92]'>
                        Fetching all DevManiac accounts...
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
                            <Users className='h-3.5 w-3.5' />
                            User control
                        </div>

                        <h1 className='max-w-3xl text-4xl font-black tracking-tighter text-white sm:text-5xl'>
                            All users
                        </h1>

                        <p className='mt-4 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8'>
                            Review accounts, verify builders, ban bad actors,
                            and inspect user status from one private admin
                            screen.
                        </p>
                    </div>

                    <button
                        type='button'
                        onClick={fetchUsers}
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
                                Refresh users
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

            <section className='mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5'>
                <MiniStatCard
                    label='Total'
                    value={stats.total}
                    icon={Users}
                />

                <MiniStatCard
                    label='Active'
                    value={stats.active}
                    icon={CheckCircle2}
                />

                <MiniStatCard
                    label='Verified'
                    value={stats.verified}
                    icon={BadgeCheck}
                />

                <MiniStatCard
                    label='Banned'
                    value={stats.banned}
                    icon={Ban}
                    danger
                />

                <MiniStatCard
                    label='Private'
                    value={stats.private}
                    icon={ShieldCheck}
                />
            </section>

            <section className='mt-6 rounded-4xl border border-[#2D2D2D] bg-[#111113] p-4 sm:p-5'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex w-full items-center gap-3 rounded-full border border-[#2D2D2D] bg-[#080808] px-4 py-3 lg:max-w-md'>
                        <Search className='h-4 w-4 shrink-0 text-[#71717A]' />

                        <input
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            placeholder='Search username, email, Clerk ID...'
                            className='w-full bg-transparent text-sm text-white outline-none placeholder:text-[#52525B]'
                        />
                    </div>

                    <div className='flex gap-2 overflow-x-auto pb-1 lg:pb-0'>
                        {FILTERS.map((item) => {
                            const active = filter === item.value

                            return (
                                <button
                                    key={item.value}
                                    type='button'
                                    onClick={() =>
                                        setFilter(item.value)
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

            <section className='mt-6 overflow-hidden rounded-4xl border border-[#2D2D2D] bg-[#111113]'>
                <div className='border-b border-[#2D2D2D] p-5'>
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
                        <div>
                            <p className='text-xs font-black uppercase tracking-[0.22em] text-[#E8560A]'>
                                Results
                            </p>

                            <h2 className='mt-1 text-2xl font-black tracking-[-0.03em] text-white'>
                                {filteredUsers.length} users found
                            </h2>
                        </div>

                        <p className='text-xs text-[#71717A]'>
                            Showing max 100 users from backend
                        </p>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <EmptyUsers />
                ) : (
                    <>
                        {/* DESKTOP TABLE */}
                        <div className='hidden overflow-x-auto lg:block'>
                            <table className='w-full min-w-245'>
                                <thead className='bg-[#080808]'>
                                    <tr className='border-b border-[#2D2D2D] text-left text-xs font-black uppercase tracking-[0.16em] text-[#71717A]'>
                                        <th className='px-5 py-4'>
                                            User
                                        </th>

                                        <th className='px-5 py-4'>
                                            Status
                                        </th>

                                        <th className='px-5 py-4'>
                                            Projects
                                        </th>

                                        <th className='px-5 py-4'>
                                            Reports
                                        </th>

                                        <th className='px-5 py-4'>
                                            Joined
                                        </th>

                                        <th className='px-5 py-4 text-right'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-[#2D2D2D]'>
                                    {filteredUsers.map((item) => (
                                        <UserTableRow
                                            key={item.id}
                                            item={item}
                                            copied={copied}
                                            updating={
                                                updatingUserId ===
                                                item.id
                                            }
                                            onCopy={copyText}
                                            onUpdate={updateUser}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE CARDS */}
                        <div className='grid grid-cols-1 gap-4 p-4 lg:hidden'>
                            {filteredUsers.map((item) => (
                                <UserMobileCard
                                    key={item.id}
                                    item={item}
                                    copied={copied}
                                    updating={
                                        updatingUserId === item.id
                                    }
                                    onCopy={copyText}
                                    onUpdate={updateUser}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}


function UserTableRow({
    item,
    copied,
    updating,
    onCopy,
    onUpdate,
}: {
    item: AdminUser
    copied: string
    updating: boolean
    onCopy: (label: string, value: string) => void
    onUpdate: (
        userId: string,
        payload: Partial<
            Pick<
                AdminUser,
                'is_verified' | 'is_active' | 'is_banned'
            >
        >
    ) => void
}) {
    return (
        <tr className='bg-[#0A0A0A] transition hover:bg-[#101010]'>
            <td className='px-5 py-5'>
                <UserIdentity
                    item={item}
                    copied={copied}
                    onCopy={onCopy}
                />
            </td>

            <td className='px-5 py-5'>
                <StatusGroup item={item} />
            </td>

            <td className='px-5 py-5'>
                <p className='text-sm font-black text-white'>
                    {item.project_count}
                </p>
            </td>

            <td className='px-5 py-5'>
                <p
                    className={`text-sm font-black ${
                        item.reports_count > 0
                            ? 'text-red-400'
                            : 'text-white'
                    }`}
                >
                    {item.reports_count}
                </p>
            </td>

            <td className='px-5 py-5'>
                <p className='text-sm text-[#A1A1AA]'>
                    {formatDate(item.created_at)}
                </p>
            </td>

            <td className='px-5 py-5'>
                <div className='flex justify-end'>
                    <UserActions
                        item={item}
                        updating={updating}
                        onUpdate={onUpdate}
                    />
                </div>
            </td>
        </tr>
    )
}


function UserMobileCard({
    item,
    copied,
    updating,
    onCopy,
    onUpdate,
}: {
    item: AdminUser
    copied: string
    updating: boolean
    onCopy: (label: string, value: string) => void
    onUpdate: (
        userId: string,
        payload: Partial<
            Pick<
                AdminUser,
                'is_verified' | 'is_active' | 'is_banned'
            >
        >
    ) => void
}) {
    return (
        <div className='rounded-[1.7rem] border border-[#2D2D2D] bg-[#080808] p-4'>
            <UserIdentity
                item={item}
                copied={copied}
                onCopy={onCopy}
            />

            <div className='mt-4'>
                <StatusGroup item={item} />
            </div>

            <div className='mt-4 grid grid-cols-3 gap-3'>
                <SmallInfo
                    label='Projects'
                    value={String(item.project_count)}
                />

                <SmallInfo
                    label='Reports'
                    value={String(item.reports_count)}
                    danger={item.reports_count > 0}
                />

                <SmallInfo
                    label='Joined'
                    value={formatDate(item.created_at)}
                />
            </div>

            <div className='mt-4'>
                <UserActions
                    item={item}
                    updating={updating}
                    onUpdate={onUpdate}
                    mobile
                />
            </div>
        </div>
    )
}


function UserIdentity({
    item,
    copied,
    onCopy,
}: {
    item: AdminUser
    copied: string
    onCopy: (label: string, value: string) => void
}) {
    const copyKey = `clerk-${item.id}`

    return (
        <div className='flex min-w-0 items-start gap-3'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#151515] text-[#E8560A]'>
                <UserRound className='h-5 w-5' />
            </div>

            <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-2'>
                    <p className='truncate text-sm font-black text-white'>
                        {item.display_name || 'Unnamed user'}
                    </p>

                    {item.is_verified && (
                        <BadgeCheck className='h-4 w-4 text-[#E8560A]' />
                    )}
                </div>

                <p className='mt-1 truncate text-xs font-bold text-[#A1A1AA]'>
                    @{item.username}
                </p>

                <p className='mt-1 truncate text-xs text-[#71717A]'>
                    {item.email || 'No email'}
                </p>

                <button
                    type='button'
                    onClick={() =>
                        onCopy(copyKey, item.clerk_user_id)
                    }
                    className='mt-2 inline-flex items-center gap-1 rounded-full bg-[#151515] px-2.5 py-1 text-[0.65rem] font-bold text-[#8B8B92] transition hover:bg-[#E8560A]/20 hover:text-white'
                >
                    {copied === copyKey ? (
                        <CheckCircle2 className='h-3.5 w-3.5 text-green-400' />
                    ) : (
                        <Copy className='h-3.5 w-3.5' />
                    )}
                    Clerk ID
                </button>
            </div>
        </div>
    )
}


function StatusGroup({
    item,
}: {
    item: AdminUser
}) {
    return (
        <div className='flex flex-wrap gap-2'>
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

            {item.is_verified && (
                <StatusPill
                    text='Verified'
                    tone='orange'
                />
            )}

            {item.is_private && (
                <StatusPill
                    text='Private'
                    tone='muted'
                />
            )}
        </div>
    )
}


function UserActions({
    item,
    updating,
    onUpdate,
    mobile,
}: {
    item: AdminUser
    updating: boolean
    mobile?: boolean
    onUpdate: (
        userId: string,
        payload: Partial<
            Pick<
                AdminUser,
                'is_verified' | 'is_active' | 'is_banned'
            >
        >
    ) => void
}) {
    return (
        <div
            className={`flex gap-2 ${
                mobile
                    ? 'flex-col'
                    : 'flex-wrap justify-end'
            }`}
        >
            <Link
                href={`/u/${item.username}`}
                className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
            >
                <Eye className='h-3.5 w-3.5' />
                View
            </Link>

            <button
                type='button'
                disabled={updating}
                onClick={() =>
                    onUpdate(item.id, {
                        is_verified: !item.is_verified,
                    })
                }
                className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
            >
                {updating ? (
                    <Loader2 className='h-3.5 w-3.5 animate-spin' />
                ) : (
                    <UserCheck className='h-3.5 w-3.5' />
                )}

                {item.is_verified ? 'Unverify' : 'Verify'}
            </button>

            <button
                type='button'
                disabled={updating}
                onClick={() =>
                    onUpdate(item.id, {
                        is_active: !item.is_active,
                    })
                }
                className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
            >
                {item.is_active ? 'Deactivate' : 'Activate'}
            </button>

            <button
                type='button'
                disabled={updating}
                onClick={() =>
                    onUpdate(item.id, {
                        is_banned: !item.is_banned,
                    })
                }
                className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    item.is_banned
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                }`}
            >
                <Ban className='h-3.5 w-3.5' />
                {item.is_banned ? 'Unban' : 'Ban'}
            </button>
        </div>
    )
}


function MiniStatCard({
    label,
    value,
    icon: Icon,
    danger,
}: {
    label: string
    value: number
    icon: typeof Users
    danger?: boolean
}) {
    return (
        <div
            className={`rounded-3xl border p-4 ${
                danger
                    ? 'border-red-500/30 bg-red-500/10'
                    : 'border-[#2D2D2D] bg-[#111113]'
            }`}
        >
            <div className='mb-4 flex items-center justify-between'>
                <div
                    className={`rounded-full p-2.5 ${
                        danger
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-[#E8560A]/10 text-[#E8560A]'
                    }`}
                >
                    <Icon className='h-4 w-4' />
                </div>

                {danger && value > 0 && (
                    <AlertTriangle className='h-4 w-4 text-red-400' />
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
    danger,
}: {
    label: string
    value: string
    danger?: boolean
}) {
    return (
        <div className='rounded-2xl border border-[#2D2D2D] bg-[#111113] p-3'>
            <p className='text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#71717A]'>
                {label}
            </p>

            <p
                className={`mt-1 truncate text-xs font-black ${
                    danger ? 'text-red-400' : 'text-white'
                }`}
            >
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
    tone: 'good' | 'danger' | 'muted' | 'orange'
}) {
    const classes = {
        good: 'border-green-500/30 bg-green-500/10 text-green-400',
        danger: 'border-red-500/30 bg-red-500/10 text-red-400',
        muted: 'border-[#2D2D2D] bg-[#151515] text-[#8B8B92]',
        orange: 'border-[#E8560A]/30 bg-[#E8560A]/10 text-[#E8560A]',
    }

    return (
        <span
            className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] ${classes[tone]}`}
        >
            {text}
        </span>
    )
}


function EmptyUsers() {
    return (
        <div className='flex min-h-80 items-center justify-center bg-[#080808] p-6 text-center'>
            <div>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-[#71717A]'>
                    <Users className='h-6 w-6' />
                </div>

                <h3 className='mt-4 text-xl font-black text-white'>
                    No users found
                </h3>

                <p className='mt-2 text-sm text-[#8B8B92]'>
                    Try changing your search or filter.
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