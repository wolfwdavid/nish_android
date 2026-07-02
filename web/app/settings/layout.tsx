'use client'

import { useState } from 'react'
import type React from 'react'

import Link from 'next/link'
import { useClerk } from '@clerk/nextjs'

import {
    usePathname,
    useRouter,
} from 'next/navigation'

import {
    User,
    Shield,
    Lock,
    Github,
    LifeBuoy,
    MessageSquareMore,
    Info,
    ArrowLeft,
    Menu,
    X,
    Sparkles,
    LogOut,
} from 'lucide-react'

import useCurrentUser from '../lib/currentUser'

const SETTINGS_NAVIGATION = [
    {
        section: 'SETTINGS',
        items: [
            {
                name: 'Profile',
                href: '/settings/profile',
                icon: User,
                match: [
                    '/settings/profile',
                    '/profile/edit',
                    '/u',
                ],
            },
            {
                name: 'Account',
                href: '/settings/account',
                icon: Shield,
                match: ['/settings/account'],
            },
            {
                name: 'Privacy',
                href: '/settings/privacy',
                icon: Lock,
                match: ['/settings/privacy'],
            },
            {
                name: 'GitHub',
                href: '/settings/github',
                icon: Github,
                match: ['/settings/github'],
            },
        ],
    },
    {
        section: 'PLATFORM',
        items: [
            {
                name: 'Support',
                href: '/settings/support',
                icon: LifeBuoy,
                match: ['/settings/support'],
            },
            {
                name: 'Feedback',
                href: '/settings/feedback',
                icon: MessageSquareMore,
                match: [
                    '/settings/feedback',
                    '/settings/feedback',
                ],
            },
            {
                name: 'About',
                href: '/settings/about',
                icon: Info,
                match: ['/settings/about'],
            },
        ],
    },
]

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { signOut } = useClerk()

    const { currentUser } = useCurrentUser()

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false)

    const profileHref = currentUser?.username
        ? `/u/${currentUser.username}/profile/edit`
        : '/settings/profile'

    function isNavActive(match: string[]) {
        return match.some((path) => {
            if (path === '/u') {
                return (
                    pathname.startsWith('/u/') &&
                    pathname.endsWith('/profile/edit')
                )
            }

            return pathname.startsWith(path)
        })
    }

    return (
        <div className='min-h-screen bg-[#050505] text-[#F9FAFB]'>
            {mobileSidebarOpen && (
                <button
                    type='button'
                    aria-label='Close settings menu'
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
                                Settings
                            </h1>

                            <p className='text-xs text-[#71717A]'>
                                Manage DevManiac
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
                        fixed inset-y-0 left-0 z-40 w-72.5
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
                            <button
                                type='button'
                                onClick={() => router.push(`/u/${currentUser?.username}`)}
                                className='mb-5 inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2 text-sm font-bold text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>

                            <div className='flex items-center gap-3'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#E8560A] text-white shadow-[0_0_28px_rgba(232,86,10,0.35)]'>
                                    <Sparkles size={20} />
                                </div>

                                <div>
                                    <h1 className='text-2xl font-black tracking-[-0.04em] text-white'>
                                        Settings
                                    </h1>

                                    <p className='mt-1 text-xs leading-5 text-[#8B8B92]'>
                                        Customize your DevManiac experience.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* NAVIGATION */}
                        <nav className='flex-1 overflow-y-auto px-4 py-5'>
                            <div className='space-y-8'>
                                {SETTINGS_NAVIGATION.map((section) => (
                                    <div key={section.section}>
                                        <p className='mb-3 px-3 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#52525B]'>
                                            {section.section}
                                        </p>

                                        <div className='space-y-2'>
                                            {section.items.map((item) => {
                                                const Icon = item.icon

                                                const isActive =
                                                    isNavActive(
                                                        item.match
                                                    )

                                                const href =
                                                    item.name === 'Profile'
                                                        ? profileHref
                                                        : item.href

                                                return (
                                                    <Link
                                                        key={item.name}
                                                        href={href}
                                                        onClick={() =>
                                                            setMobileSidebarOpen(
                                                                false
                                                            )
                                                        }
                                                        className={`
                                                            group relative flex items-center gap-3
                                                            overflow-hidden rounded-full px-4 py-3
                                                            text-sm font-black transition-all duration-200

                                                            ${
                                                                isActive
                                                                    ? 'bg-[#E8560A] text-white shadow-[0_0_28px_rgba(232,86,10,0.35)]'
                                                                    : 'bg-[#151515] text-[#D1D5DB] hover:bg-[#E8560A]/20 hover:text-[#F9FAFB]'
                                                            }
                                                        `}
                                                    >
                                                        <span
                                                            className={`
                                                                flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition
                                                                ${
                                                                    isActive
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

                                                        {isActive && (
                                                            <span className='ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.14em] text-white'>
                                                                On
                                                            </span>
                                                        )}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </nav>

                        {/* FOOTER CARD */}
                        {/* FOOTER CARD */}
                            <div className='border-t border-[#1F1F1F] p-4'>
                                <div className='rounded-[1.7rem] border border-[#2D2D2D] bg-[#111113] p-4'>
                                    <div className='mb-3 flex items-center gap-2'>
                                        <div className='h-2.5 w-2.5 rounded-full bg-[#E8560A] shadow-[0_0_16px_rgba(232,86,10,0.8)]' />

                                        <p className='text-sm font-black text-white'>
                                            DevManiac
                                        </p>
                                    </div>

                                    <p className='text-xs leading-5 text-[#71717A]'>
                                        Developer proof social platform built for
                                        builders.
                                    </p>
                                </div>

                                <button
                                    type='button'
                                    onClick={async () => {
                                        await signOut()
                                        router.push('/')
                                    }}
                                    className='mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-200'
                                >
                                    <LogOut size={16} />
                                    Log out
                                </button>
                            </div>
                    </div>
                </aside>

                {/* CONTENT */}
                <main className='min-h-screen flex-1 px-4 py-6 sm:px-6 lg:px-8'>
                    <div className='mx-auto max-w-5xl'>
                        <div className='mb-7 hidden lg:block'>
                            <h1 className='text-3xl font-black tracking-[-0.04em] text-white'>
                                Settings
                            </h1>

                            <p className='mt-2 text-sm text-[#71717A]'>
                                Manage your account, integrations, and platform
                                preferences.
                            </p>
                        </div>

                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}