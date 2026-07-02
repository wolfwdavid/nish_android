'use client'

import { useEffect, useMemo, useState } from 'react'
import type React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    AlertTriangle,
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Copy,
    Database,
    Download,
    ExternalLink,
    Eye,
    FileText,
    Fingerprint,
    KeyRound,
    Loader2,
    Lock,
    Mail,
    MessageSquareText,
    RefreshCcw,
    ShieldCheck,
    Sparkles,
    Trash2,
    UserRound,
    X,
    XCircle,
} from 'lucide-react'


type CurrentUser = {
    id: string
    clerk_user_id: string
    username: string
    display_name: string
    email?: string | null
    avatar_url?: string | null
    onboarding_completed?: boolean
    is_active?: boolean
    created_at?: string
    updated_at?: string
}


export default function AccountSettingsPage() {
    const { user, isLoaded } = useUser()

    const [currentUser, setCurrentUser] =
        useState<CurrentUser | null>(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState('')
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const clerkUserId = user?.id

    const primaryEmail =
        user?.primaryEmailAddress?.emailAddress ||
        currentUser?.email ||
        'No email found'

    const createdAt = useMemo(() => {
        return formatDate(
            currentUser?.created_at ||
                user?.createdAt?.toISOString()
        )
    }, [currentUser?.created_at, user?.createdAt])

    useEffect(() => {
        if (!isLoaded) return

        if (!clerkUserId) {
            setLoading(false)
            return
        }

        fetchAccount()
    }, [isLoaded, clerkUserId])

    async function fetchAccount() {
        try {
            setLoading(true)
            setError('')

            const res = await api.get('/profile/me', {
                params: {
                    clerk_user_id: clerkUserId,
                },
            })

            setCurrentUser(res.data)
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not load account settings.'

            setError(String(detail))
        } finally {
            setLoading(false)
        }
    }

    async function copyText(
        label: string,
        value?: string | null
    ) {
        if (!value) return

        await navigator.clipboard.writeText(value)
        setCopied(label)

        window.setTimeout(() => {
            setCopied('')
        }, 1600)
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

                <section className='relative overflow-hidden rounded-4xlrder border-[#2D2D2D] bg-[#111113] p-5 shadow-2xl sm:p-8'>
                    <div className='pointer-events-none absolute -left-32.5 -top-32.5 h-80 w-80 rounded-full bg-[#E8560A]/20 blur-[110px]' />
                    <div className='pointer-events-none absolute -right-30 -bottom-30 h-80 w-80 rounded-full bg-white/5 blur-[110px]' />

                    <div className='relative grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end'>
                        <div>
                            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                                <ShieldCheck className='h-3.5 w-3.5' />
                                Account settings
                            </div>

                            <h1 className='max-w-3xl text-4xl font-black tracking-tighter text-[#F9FAFB] sm:text-5xl lg:text-6xl'>
                                Control your login, identity, and account.
                            </h1>

                            <p className='mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8'>
                                This page is for account-level control: login
                                identity, account status, data controls, and
                                destructive actions. Your public developer
                                profile is managed separately.
                            </p>
                        </div>

                        <AccountIdentityCard
                            loading={loading}
                            user={user}
                            currentUser={currentUser}
                            primaryEmail={primaryEmail}
                            copied={copied}
                            copyText={copyText}
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

                <section className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
                    <div className='space-y-6'>
                        <LoginSecurityCard />

                        <AccountStatusCard
                            loading={loading}
                            currentUser={currentUser}
                            createdAt={createdAt}
                            clerkUserId={clerkUserId}
                        />
                    </div>

                    <div className='space-y-6'>
                        <DataControlsCard />

                        <DangerZoneCard
                            onDeleteClick={() =>
                                setDeleteModalOpen(true)
                            }
                        />
                    </div>
                </section>

                <section className='mt-8 rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center'>
                        <div>
                            <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                                Need account help?
                            </p>

                            <h2 className='mt-2 text-2xl font-black tracking-[-0.03em] text-[#F9FAFB]'>
                                Something wrong with your account?
                            </h2>

                            <p className='mt-3 max-w-2xl text-sm leading-7 text-[#A1A1AA]'>
                                For MVP, serious account actions like deletion,
                                recovery, or data requests should go through
                                support so nothing gets destroyed accidentally.
                            </p>
                        </div>

                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <Link
                                href='/settings/support'
                                className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6a1a]'
                            >
                                Contact support
                                <MessageSquareText className='h-4 w-4' />
                            </Link>

                            <Link
                                href='/privacy'
                                className='inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] px-5 py-3 text-sm font-bold text-[#F9FAFB] transition hover:border-[#E8560A]/50'
                            >
                                Privacy policy
                                <ExternalLink className='h-4 w-4' />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            {deleteModalOpen && (
                <DeleteRequestModal
                    onClose={() => setDeleteModalOpen(false)}
                    clerkUserId={clerkUserId}
                    email={primaryEmail}
                />
            )}
        </main>
    )
}


function AccountIdentityCard({
    loading,
    user,
    currentUser,
    primaryEmail,
    copied,
    copyText,
}: {
    loading: boolean
    user: ReturnType<typeof useUser>['user']
    currentUser: CurrentUser | null
    primaryEmail: string
    copied: string
    copyText: (label: string, value?: string | null) => void
}) {
    const avatar =
        currentUser?.avatar_url ||
        user?.imageUrl ||
        ''

    const displayName =
        currentUser?.display_name ||
        user?.fullName ||
        'Unnamed user'

    const username =
        currentUser?.username ||
        user?.username ||
        'not-set'

    return (
        <div className='rounded-3xl border border-[#2D2D2D] bg-[#0A0A0A]/80 p-5 shadow-2xl backdrop-blur'>
            <div className='mb-5 flex items-center justify-between border-b border-[#2D2D2D] pb-4'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#71717A]'>
                        Signed in as
                    </p>

                    <h2 className='mt-1 text-2xl font-black text-[#F9FAFB]'>
                        {loading ? 'Loading...' : displayName}
                    </h2>
                </div>

                <div className='relative h-14 w-14 overflow-hidden rounded-2xl border border-[#2D2D2D] bg-[#111113]'>
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={displayName}
                            fill
                            className='object-cover'
                        />
                    ) : (
                        <div className='flex h-full w-full items-center justify-center text-[#71717A]'>
                            <UserRound className='h-6 w-6' />
                        </div>
                    )}
                </div>
            </div>

            <div className='space-y-3'>
                <CopyRow
                    icon={Mail}
                    label='Email'
                    value={primaryEmail}
                    copied={copied === 'email'}
                    onCopy={() => copyText('email', primaryEmail)}
                />

                <CopyRow
                    icon={UserRound}
                    label='Username'
                    value={`@${username}`}
                    copied={copied === 'username'}
                    onCopy={() =>
                        copyText('username', username)
                    }
                />

                <CopyRow
                    icon={Fingerprint}
                    label='Clerk ID'
                    value={user?.id || 'Not loaded'}
                    copied={copied === 'clerk'}
                    onCopy={() => copyText('clerk', user?.id)}
                />
            </div>
        </div>
    )
}


function LoginSecurityCard() {
    return (
        <section className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
            <SectionTitle
                eyebrow='Login & security'
                title='Authentication is managed by Clerk'
                description='For MVP, DevManiac does not manage passwords directly. Email, password, OAuth providers, and sessions are handled by Clerk.'
                icon={KeyRound}
            />

            <div className='mt-6 space-y-3'>
                <SecurityRow
                    icon={Mail}
                    title='Email and password'
                    description='Managed by your authentication provider.'
                    status='Protected'
                />

                <SecurityRow
                    icon={Lock}
                    title='OAuth accounts'
                    description='Google, GitHub, or other connected login methods can be managed through auth settings later.'
                    status='Clerk'
                />

                <SecurityRow
                    icon={RefreshCcw}
                    title='Sessions and devices'
                    description='Device/session management is a future upgrade.'
                    status='Coming soon'
                />
            </div>

            <div className='mt-6 rounded-3xl border border-[#E8560A]/20 bg-[#E8560A]/10 p-4'>
                <div className='flex items-start gap-3'>
                    <Sparkles className='mt-0.5 h-4 w-4 shrink-0 text-[#E8560A]' />

                    <p className='text-xs leading-6 text-[#D4D4D8]'>
                        Later you can embed Clerk&apos;s UserProfile component
                        here for full email, password, and connected account
                        management.
                    </p>
                </div>
            </div>
        </section>
    )
}


function AccountStatusCard({
    loading,
    currentUser,
    createdAt,
    clerkUserId,
}: {
    loading: boolean
    currentUser: CurrentUser | null
    createdAt: string
    clerkUserId?: string
}) {
    return (
        <section className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
            <SectionTitle
                eyebrow='Account status'
                title='Current account state'
                description='Useful for debugging account issues and checking whether your profile setup is complete.'
                icon={BadgeCheck}
            />

            {loading ? (
                <div className='mt-6 flex min-h-45 items-center justify-center rounded-3xl border border-[#2D2D2D] bg-[#0A0A0A]'>
                    <div className='flex items-center gap-3 text-sm text-[#9CA3AF]'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Loading account status...
                    </div>
                </div>
            ) : (
                <div className='mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <StatusBox
                        label='Account'
                        value={
                            currentUser?.is_active === false
                                ? 'Inactive'
                                : 'Active'
                        }
                        good={currentUser?.is_active !== false}
                    />

                    <StatusBox
                        label='Onboarding'
                        value={
                            currentUser?.onboarding_completed
                                ? 'Completed'
                                : 'Not completed'
                        }
                        good={Boolean(
                            currentUser?.onboarding_completed
                        )}
                    />

                    <StatusBox
                        label='Security'
                        value='Managed by Clerk'
                        good
                    />

                    <StatusBox
                        label='Created'
                        value={createdAt}
                        good
                    />

                    <StatusBox
                        label='Backend profile'
                        value={currentUser ? 'Found' : 'Missing'}
                        good={Boolean(currentUser)}
                    />

                    <StatusBox
                        label='Clerk session'
                        value={clerkUserId ? 'Loaded' : 'Missing'}
                        good={Boolean(clerkUserId)}
                    />
                </div>
            )}
        </section>
    )
}


function DataControlsCard() {
    return (
        <section className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
            <SectionTitle
                eyebrow='Data controls'
                title='Export and privacy controls'
                description='These controls are important, but for MVP they should be carefully handled and not rushed.'
                icon={Database}
            />

            <div className='mt-6 space-y-3'>
                <DisabledActionRow
                    icon={Download}
                    title='Download my data'
                    description='Export your profile, projects, live projects, feedback, and account data.'
                    badge='Coming soon'
                />

                <DisabledActionRow
                    icon={FileText}
                    title='Request account data'
                    description='Ask support for a copy or review of account-related data.'
                    badge='Manual'
                    href='/settings/support'
                />

                <DisabledActionRow
                    icon={Eye}
                    title='Privacy settings'
                    description='Control what is public, private, or hidden from your developer profile.'
                    badge='Soon'
                    href='/privacy'
                />
            </div>
        </section>
    )
}


function DangerZoneCard({
    onDeleteClick,
}: {
    onDeleteClick: () => void
}) {
    return (
        <section className='rounded-4xl border border-red-500/30 bg-red-500/5 p-5 sm:p-6'>
            <div className='mb-5 flex items-start gap-3'>
                <div className='rounded-2xl bg-red-500/10 p-3 text-red-400'>
                    <AlertTriangle className='h-5 w-5' />
                </div>

                <div>
                    <p className='text-xs font-bold uppercase tracking-[0.22em] text-red-400'>
                        Danger zone
                    </p>

                    <h2 className='mt-1 text-xl font-black text-[#F9FAFB]'>
                        Destructive account actions
                    </h2>

                    <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                        Account deletion should not be instant during MVP.
                        Use a request flow so projects, feedback, and profile
                        data are handled safely.
                    </p>
                </div>
            </div>

            <div className='space-y-3'>
                <button
                    type='button'
                    onClick={onDeleteClick}
                    className='flex w-full items-center justify-between gap-4 rounded-2xl border border-red-500/30 bg-[#0A0A0A] p-4 text-left transition hover:bg-red-500/10'
                >
                    <div className='flex items-start gap-3'>
                        <Trash2 className='mt-0.5 h-5 w-5 shrink-0 text-red-400' />

                        <div>
                            <h3 className='text-sm font-bold text-[#F9FAFB]'>
                                Request account deletion
                            </h3>

                            <p className='mt-1 text-xs leading-5 text-[#A1A1AA]'>
                                Creates a support path instead of immediately
                                deleting your account.
                            </p>
                        </div>
                    </div>

                    <ChevronRight className='h-4 w-4 text-red-400' />
                </button>
            </div>
        </section>
    )
}


function DeleteRequestModal({
    onClose,
    clerkUserId,
    email,
}: {
    onClose: () => void
    clerkUserId?: string
    email: string
}) {
    const subject = 'Account deletion request'

    const body = [
        'I want to request account deletion.',
        '',
        `Email: ${email}`,
        `Clerk user ID: ${clerkUserId || 'Not available'}`,
        '',
        'Please review my account and confirm next steps.',
    ].join('\n')

    const supportHref = `/settings/support?subject=${encodeURIComponent(
        subject
    )}`

    const mailHref = `mailto:devmaniacsupport@gmail.com?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent(body)}`

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm'>
            <div className='w-full max-w-lg rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 shadow-2xl sm:p-6'>
                <div className='mb-5 flex items-start justify-between gap-4'>
                    <div className='flex items-start gap-3'>
                        <div className='rounded-2xl bg-red-500/10 p-3 text-red-400'>
                            <Trash2 className='h-5 w-5' />
                        </div>

                        <div>
                            <h2 className='text-xl font-black text-[#F9FAFB]'>
                                Account deletion request
                            </h2>

                            <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                                For MVP, deletion is handled manually to avoid
                                accidental data loss.
                            </p>
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={onClose}
                        className='rounded-xl p-2 text-[#71717A] transition hover:bg-[#0A0A0A] hover:text-[#F9FAFB]'
                    >
                        <X className='h-5 w-5' />
                    </button>
                </div>

                <div className='rounded-2xl border border-red-500/30 bg-red-500/10 p-4'>
                    <p className='text-sm leading-7 text-red-200'>
                        Do not delete accounts instantly until your cascade
                        delete logic is tested. A broken delete can destroy
                        projects, comments, stars, feedback, and analytics in
                        the wrong order.
                    </p>
                </div>

                <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <Link
                        href={supportHref}
                        className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#ff6a1a]'
                    >
                        Go to support
                        <MessageSquareText className='h-4 w-4' />
                    </Link>

                    <a
                        href={mailHref}
                        className='inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] px-4 py-3 text-sm font-bold text-[#F9FAFB] transition hover:border-red-500/50'
                    >
                        Email support
                        <Mail className='h-4 w-4' />
                    </a>
                </div>
            </div>
        </div>
    )
}


function SectionTitle({
    eyebrow,
    title,
    description,
    icon: Icon,
}: {
    eyebrow: string
    title: string
    description: string
    icon: typeof ShieldCheck
}) {
    return (
        <div className='flex items-start gap-3'>
            <div className='rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                <Icon className='h-5 w-5' />
            </div>

            <div>
                <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                    {eyebrow}
                </p>

                <h2 className='mt-1 text-xl font-black text-[#F9FAFB]'>
                    {title}
                </h2>

                <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                    {description}
                </p>
            </div>
        </div>
    )
}


function CopyRow({
    icon: Icon,
    label,
    value,
    copied,
    onCopy,
}: {
    icon: typeof Mail
    label: string
    value: string
    copied: boolean
    onCopy: () => void
}) {
    return (
        <div className='flex items-center justify-between gap-4 rounded-2xl border border-[#2D2D2D] bg-[#111113] px-4 py-3'>
            <div className='flex min-w-0 items-center gap-3'>
                <Icon className='h-4 w-4 shrink-0 text-[#71717A]' />

                <div className='min-w-0'>
                    <p className='text-xs text-[#71717A]'>
                        {label}
                    </p>

                    <p className='truncate text-sm font-bold text-[#F9FAFB]'>
                        {value}
                    </p>
                </div>
            </div>

            <button
                type='button'
                onClick={onCopy}
                className='shrink-0 rounded-xl p-2 text-[#71717A] transition hover:bg-[#0A0A0A] hover:text-[#E8560A]'
            >
                {copied ? (
                    <CheckCircle2 className='h-4 w-4 text-green-400' />
                ) : (
                    <Copy className='h-4 w-4' />
                )}
            </button>
        </div>
    )
}


function SecurityRow({
    icon: Icon,
    title,
    description,
    status,
}: {
    icon: typeof Mail
    title: string
    description: string
    status: string
}) {
    return (
        <div className='flex items-center justify-between gap-4 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] p-4'>
            <div className='flex items-start gap-3'>
                <Icon className='mt-0.5 h-5 w-5 shrink-0 text-[#E8560A]' />

                <div>
                    <h3 className='text-sm font-bold text-[#F9FAFB]'>
                        {title}
                    </h3>

                    <p className='mt-1 text-xs leading-5 text-[#9CA3AF]'>
                        {description}
                    </p>
                </div>
            </div>

            <span className='shrink-0 rounded-full border border-[#2D2D2D] bg-[#111113] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#A1A1AA]'>
                {status}
            </span>
        </div>
    )
}


function StatusBox({
    label,
    value,
    good,
}: {
    label: string
    value: string
    good?: boolean
}) {
    return (
        <div className='rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] p-4'>
            <p className='text-xs text-[#71717A]'>
                {label}
            </p>

            <div className='mt-2 flex items-center gap-2'>
                <span
                    className={`h-2 w-2 rounded-full ${
                        good ? 'bg-green-400' : 'bg-[#E8560A]'
                    }`}
                />

                <p className='text-sm font-bold text-[#F9FAFB]'>
                    {value}
                </p>
            </div>
        </div>
    )
}


function DisabledActionRow({
    icon: Icon,
    title,
    description,
    badge,
    href,
}: {
    icon: typeof Download
    title: string
    description: string
    badge: string
    href?: string
}) {
    const content = (
        <>
            <div className='flex items-start gap-3'>
                <Icon className='mt-0.5 h-5 w-5 shrink-0 text-[#E8560A]' />

                <div>
                    <h3 className='text-sm font-bold text-[#F9FAFB]'>
                        {title}
                    </h3>

                    <p className='mt-1 text-xs leading-5 text-[#9CA3AF]'>
                        {description}
                    </p>
                </div>
            </div>

            <span className='shrink-0 rounded-full border border-[#2D2D2D] bg-[#111113] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#A1A1AA]'>
                {badge}
            </span>
        </>
    )

    if (href) {
        return (
            <Link
                href={href}
                className='flex items-center justify-between gap-4 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] p-4 transition hover:border-[#E8560A]/40'
            >
                {content}
            </Link>
        )
    }

    return (
        <div className='flex items-center justify-between gap-4 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] p-4 opacity-80'>
            {content}
        </div>
    )
}


function formatDate(value?: string | null): string {
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