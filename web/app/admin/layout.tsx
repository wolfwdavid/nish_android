'use client'

import { useMemo, useState } from 'react'
import type React from 'react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { useUser } from '@clerk/nextjs'

import {
    Activity,
    ArrowLeft,
    BarChart3,
    ChevronRight,
    FolderKanban,
    Home,
    LayoutDashboard,
    LifeBuoy,
    Lock,
    Menu,
    MessageSquareMore,
    Newspaper,
    ShieldCheck,
    Sparkles,
    Users,
    X,
    Megaphone,
} from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import useCurrentUser from '../lib/currentUser'


const ADMIN_NAVIGATION = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        match: ['/admin'],
        exact: true,
    },
    {
        name: 'Feedback',
        href: '/admin/feedback',
        icon: MessageSquareMore,
        match: ['/admin/feedback'],
    },
    {
        name: 'Support',
        href: '/admin/support',
        icon: LifeBuoy,
        match: ['/admin/support'],
    },
    {
        name: 'Users',
        href: '/admin/users',
        icon: Users,
        match: ['/admin/users'],
    },
    {
        name: 'Projects',
        href: '/admin/projects',
        icon: FolderKanban,
        match: ['/admin/projects'],
    },
    {
        name: 'Changelog',
        href: '/admin/changelog',
        icon: Newspaper,
        match: ['/admin/changelog'],
    },
    {
        name: 'App Notices',
        href: '/admin/app-notice',
        icon: Megaphone,
        match: ['/admin/app-notice'],
    },
]




export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, isLoaded } = useUser()

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false)

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

    function isNavActive(item: (typeof ADMIN_NAVIGATION)[number]) {
        if (item.exact) {
            return pathname === item.href
        }

        return item.match.some((path) =>
            pathname.startsWith(path)
        )
    }

    const { currentUser: c } = useCurrentUser();

    if (!isLoaded) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white'>
                <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 text-center shadow-2xl'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#2D2D2D] border-t-[#E8560A]' />

                    <h1 className='mt-5 text-xl font-black'>
                        Checking admin access
                    </h1>

                    <p className='mt-2 text-sm text-[#8B8B92]'>
                        Loading your secure command center...
                    </p>
                </div>
            </div>
        )
    }

    if (!user?.id || !isAdmin) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white'>
                <div className='w-full max-w-lg rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 text-center shadow-2xl sm:p-8'>
                    <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8560A]/10 text-[#E8560A]'>
                        <Lock className='h-7 w-7' />
                    </div>

                    <h1 className='mt-6 text-3xl font-black tracking-[-0.04em]'>
                        Admin access required
                    </h1>

                    <p className='mt-3 text-sm leading-7 text-[#A1A1AA]'>
                        This area is private. Your account is not listed as an
                        approved admin account.
                    </p>

                    <Link
                        href={`/u/${c?.username}`}
                        className='mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#E8560A] px-5 py-3 text-sm font-black text-white transition hover:bg-[#ff6a1a]'
                    >
                        Go back home
                        <Home className='h-4 w-4' />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[#050505] text-white'>
            {mobileSidebarOpen && (
                <button
                    type='button'
                    aria-label='Close admin menu'
                    onClick={() => setMobileSidebarOpen(false)}
                    className='fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden'
                />
            )}

            {/* MOBILE TOPBAR */}
            <div className='sticky top-0 z-50 border-b border-[#1F1F1F] bg-[#050505]/90 backdrop-blur-xl lg:hidden'>
                <div className='flex items-center justify-between px-4 py-4'>
                    <div className='flex items-center gap-3'>
                        <button
                            type='button'
                            onClick={() => router.back()}
                            className='rounded-full bg-[#151515] p-2 text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div>
                            <h1 className='text-lg font-black tracking-[-0.03em]'>
                                Admin
                            </h1>

                            <p className='text-xs text-[#71717A]'>
                                DevManiac command center
                            </p>
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={() =>
                            setMobileSidebarOpen((prev) => !prev)
                        }
                        className='rounded-full bg-[#151515] p-2 text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                    >
                        {mobileSidebarOpen ? (
                            <X size={20} />
                        ) : (
                            <Menu size={20} />
                        )}
                    </button>
                </div>
            </div>

            <div className='mx-auto flex max-w-7xl'>
                {/* SIDEBAR */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-40 w-73
                        border-r border-[#1F1F1F]
                        bg-[#080808]/95 backdrop-blur-xl
                        transition-transform duration-300
                        lg:sticky lg:top-0 lg:h-screen

                        ${
                            mobileSidebarOpen
                                ? 'translate-x-0'
                                : '-translate-x-full lg:translate-x-0'
                        }
                    `}
                >
                    <div className='flex h-full flex-col'>
                        {/* HEADER */}
                        <div className='border-b border-[#1F1F1F] p-5'>
                            <Link
                                href={`/u/${c?.username}`}
                                className='mb-5 inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2 text-sm font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                            >
                                <ArrowLeft size={16} />
                                Back to app
                            </Link>

                            <div className='flex items-center gap-3'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#E8560A] text-white shadow-[0_0_28px_rgba(232,86,10,0.35)]'>
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <h1 className='text-2xl font-black tracking-[-0.04em] text-white'>
                                        Admin
                                    </h1>

                                    <p className='mt-1 text-xs leading-5 text-[#8B8B92]'>
                                        Private DevManiac control room.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ADMIN STATUS */}
                        <div className='px-4 pt-5'>
                            <div className='rounded-[1.6rem] border border-[#E8560A]/30 bg-[#E8560A]/10 p-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#E8560A] text-white'>
                                        <Sparkles size={16} />
                                    </div>

                                    <div className='min-w-0'>
                                        <p className='truncate text-sm font-black text-white'>
                                            Admin verified
                                        </p>

                                        <p className='truncate text-xs text-[#E8B59F]'>
                                            {user.primaryEmailAddress
                                                ?.emailAddress ||
                                                user.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NAVIGATION */}
                        <nav className='flex-1 overflow-y-auto px-4 py-5'>
                            <p className='mb-3 px-3 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#52525B]'>
                                Command
                            </p>

                            <div className='space-y-2'>
                                {ADMIN_NAVIGATION.map((item) => {
                                    const Icon = item.icon
                                    const active = isNavActive(item)

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() =>
                                                setMobileSidebarOpen(false)
                                            }
                                            className={`
                                                group relative flex items-center gap-3
                                                overflow-hidden rounded-full px-4 py-3
                                                text-sm font-black transition-all duration-200

                                                ${
                                                    active
                                                        ? 'bg-[#E8560A] text-white shadow-[0_0_28px_rgba(232,86,10,0.35)]'
                                                        : 'bg-[#151515] text-[#D1D5DB] hover:bg-[#E8560A]/20 hover:text-[#F9FAFB]'
                                                }
                                            `}
                                        >
                                            <span
                                                className={`
                                                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition
                                                    ${
                                                        active
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-[#0A0A0A] text-[#9CA3AF] group-hover:bg-[#E8560A]/15 group-hover:text-[#E8560A]'
                                                    }
                                                `}
                                            >
                                                <Icon size={16} />
                                            </span>

                                            <span className='truncate'>
                                                {item.name}
                                            </span>

                                            {active && (
                                                <span className='ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.14em] text-white'>
                                                    On
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>

                            <div className='mt-8'>
                                <p className='mb-3 px-3 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#52525B]'>
                                    Quick
                                </p>

                                <div className='space-y-2'>
                                    <QuickLink
                                        href='/settings'
                                        icon={BarChart3}
                                        title='Settings'
                                    />

                                    <QuickLink
                                        href='/settings/support'
                                        icon={LifeBuoy}
                                        title='Support form'
                                    />

                                    <QuickLink
                                        href='/feedback'
                                        icon={MessageSquareMore}
                                        title='Public feedback'
                                    />
                                </div>
                            </div>
                        </nav>

                        {/* FOOTER */}
                        <div className='border-t border-[#1F1F1F] p-4'>
                            <div className='rounded-[1.7rem] border border-[#2D2D2D] bg-[#111113] p-4'>
                                <div className='mb-3 flex items-center gap-2'>
                                    <div className='h-2.5 w-2.5 rounded-full bg-[#E8560A] shadow-[0_0_16px_rgba(232,86,10,0.8)]' />

                                    <p className='text-sm font-black text-white'>
                                        DevManiac Admin
                                    </p>
                                </div>

                                <p className='text-xs leading-5 text-[#71717A]'>
                                    Manage users, projects, feedback, and
                                    support without touching the public product.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CONTENT */}
                <main className='min-h-screen flex-1 px-4 py-6 sm:px-6 lg:px-8'>
                    <div className='mx-auto max-w-6xl'>
                        <div className='mb-7 hidden lg:block'>
                            <div className='flex items-start justify-between gap-4'>
                                <div>
                                    <p className='text-xs font-black uppercase tracking-[0.24em] text-[#E8560A]'>
                                        Private area
                                    </p>

                                    <h1 className='mt-2 text-3xl font-black tracking-[-0.04em] text-white'>
                                        Admin Panel
                                    </h1>

                                    <p className='mt-2 text-sm text-[#71717A]'>
                                        Product visibility, moderation, and
                                        support operations.
                                    </p>
                                </div>

                                <div className='hidden items-center gap-2 rounded-full border border-[#2D2D2D] bg-[#111113] px-4 py-2 text-xs font-black text-[#D1D5DB] xl:flex'>
                                    <Activity className='h-4 w-4 text-[#E8560A]' />
                                    Live admin mode
                                </div>
                            </div>
                        </div>

                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}


function QuickLink({
    href,
    icon: Icon,
    title,
}: {
    href: string
    icon: typeof BarChart3
    title: string
}) {
    return (
        <Link
            href={href}
            className='group flex items-center justify-between gap-3 rounded-full bg-[#111113] px-4 py-3 text-sm font-bold text-[#A1A1AA] transition hover:bg-[#E8560A]/15 hover:text-white'
        >
            <span className='flex items-center gap-3'>
                <span className='flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0A0A] text-[#71717A] transition group-hover:text-[#E8560A]'>
                    <Icon size={16} />
                </span>

                {title}
            </span>

            <ChevronRight className='h-4 w-4 text-[#52525B] transition group-hover:translate-x-1 group-hover:text-[#E8560A]' />
        </Link>
    )
}