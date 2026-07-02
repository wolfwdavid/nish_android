'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { useUser } from '@clerk/nextjs'

import api from '@/app/lib/api'

import {
    AlertTriangle,
    BadgeCheck,
    CheckCircle2,
    Copy,
    Eye,
    ExternalLink,
    Github,
    Globe2,
    Loader2,
    RefreshCcw,
    Search,
    Sparkles,
    Star,
    TrendingUp,
    XCircle,
    FolderKanban,
    Code2,
    MousePointerClick,
    MessageSquareText,
} from 'lucide-react'


type AdminProject = {
    id: string
    user_id: string

    title: string
    slug: string
    description: string

    github_url: string
    live_url?: string | null
    thumbnail_url?: string | null

    stars_count: number
    views_count: number
    comments_count: number

    is_featured: boolean

    created_at: string
    updated_at: string
}


type ProjectFilter =
    | 'all'
    | 'featured'
    | 'not_featured'
    | 'popular'
    | 'with_live'
    | 'with_github'


const FILTERS: {
    label: string
    value: ProjectFilter
}[] = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'Featured',
        value: 'featured',
    },
    {
        label: 'Not featured',
        value: 'not_featured',
    },
    {
        label: 'Popular',
        value: 'popular',
    },
    {
        label: 'Live URL',
        value: 'with_live',
    },
    {
        label: 'GitHub',
        value: 'with_github',
    },
]


export default function AdminProjectsPage() {
    const { user, isLoaded } = useUser()

    const [projects, setProjects] = useState<AdminProject[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [updatingProjectId, setUpdatingProjectId] =
        useState<string | null>(null)

    const [query, setQuery] = useState('')
    const [filter, setFilter] =
        useState<ProjectFilter>('all')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [copied, setCopied] = useState('')

    const clerkUserId = user?.id

    const filteredProjects = useMemo(() => {
        const search = query.trim().toLowerCase()

        return projects.filter((item) => {
            const matchesSearch =
                !search ||
                item.title?.toLowerCase().includes(search) ||
                item.slug?.toLowerCase().includes(search) ||
                item.description
                    ?.toLowerCase()
                    .includes(search) ||
                item.github_url?.toLowerCase().includes(search) ||
                item.live_url?.toLowerCase().includes(search) ||
                item.user_id?.toLowerCase().includes(search)

            const matchesFilter =
                filter === 'all' ||
                (filter === 'featured' && item.is_featured) ||
                (filter === 'not_featured' &&
                    !item.is_featured) ||
                (filter === 'popular' &&
                    (item.views_count >= 50 ||
                        item.stars_count >= 5)) ||
                (filter === 'with_live' && Boolean(item.live_url)) ||
                (filter === 'with_github' &&
                    Boolean(item.github_url))

            return matchesSearch && matchesFilter
        })
    }, [projects, query, filter])

    const stats = useMemo(() => {
        return {
            total: projects.length,
            featured: projects.filter((item) => item.is_featured)
                .length,
            withLive: projects.filter((item) => item.live_url)
                .length,
            withGithub: projects.filter((item) => item.github_url)
                .length,
            totalStars: projects.reduce(
                (sum, item) => sum + item.stars_count,
                0
            ),
            totalViews: projects.reduce(
                (sum, item) => sum + item.views_count,
                0
            ),
        }
    }, [projects])

    useEffect(() => {
        if (!isLoaded) return

        if (!clerkUserId) {
            setLoading(false)
            return
        }

        fetchProjects()
    }, [isLoaded, clerkUserId])

    async function fetchProjects() {
        try {
            setError('')
            setRefreshing(true)

            const res = await api.get('/admin/projects', {
                params: {
                    clerk_user_id: clerkUserId,
                    limit: 100,
                },
            })

            setProjects(res.data)
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not load admin projects.'

            setError(String(detail))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function updateProject(
        projectId: string,
        payload: Partial<Pick<AdminProject, 'is_featured'>>
    ) {
        try {
            setUpdatingProjectId(projectId)
            setError('')
            setSuccess('')

            const res = await api.patch(
                `/admin/projects/${projectId}`,
                payload,
                {
                    params: {
                        clerk_user_id: clerkUserId,
                    },
                }
            )

            setProjects((prev) =>
                prev.map((item) =>
                    item.id === projectId ? res.data : item
                )
            )

            setSuccess('Project updated successfully.')
        } catch (err: any) {
            console.error(err)

            const detail =
                err?.response?.data?.detail ||
                'Could not update project.'

            setError(String(detail))
        } finally {
            setUpdatingProjectId(null)
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
                        Loading projects
                    </h1>

                    <p className='mt-2 text-sm text-[#8B8B92]'>
                        Fetching all DevManiac projects...
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
                            <FolderKanban className='h-3.5 w-3.5' />
                            Project control
                        </div>

                        <h1 className='max-w-3xl text-4xl font-black tracking-tighter text-white sm:text-5xl'>
                            All projects
                        </h1>

                        <p className='mt-4 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8'>
                            Review projects, feature strong builds, inspect
                            GitHub/live links, and understand what users are
                            shipping.
                        </p>
                    </div>

                    <button
                        type='button'
                        onClick={fetchProjects}
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
                                Refresh projects
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
                    icon={FolderKanban}
                />

                <MiniStatCard
                    label='Featured'
                    value={stats.featured}
                    icon={Sparkles}
                    orange
                />

                <MiniStatCard
                    label='Live links'
                    value={stats.withLive}
                    icon={Globe2}
                />

                <MiniStatCard
                    label='GitHub'
                    value={stats.withGithub}
                    icon={Github}
                />

                <MiniStatCard
                    label='Stars'
                    value={stats.totalStars}
                    icon={Star}
                />

                <MiniStatCard
                    label='Views'
                    value={stats.totalViews}
                    icon={MousePointerClick}
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
                            placeholder='Search title, slug, URL, owner ID...'
                            className='w-full bg-transparent text-sm text-white outline-none placeholder:text-[#52525B]'
                        />
                    </div>

                    <div className='flex gap-2 overflow-x-auto pb-1 xl:pb-0'>
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
                                {filteredProjects.length} projects found
                            </h2>
                        </div>

                        <p className='text-xs text-[#71717A]'>
                            Showing max 100 projects from backend
                        </p>
                    </div>
                </div>

                {filteredProjects.length === 0 ? (
                    <EmptyProjects />
                ) : (
                    <>
                        {/* DESKTOP TABLE */}
                        <div className='hidden overflow-x-auto xl:block'>
                            <table className='w-full min-w-275'>
                                <thead className='bg-[#080808]'>
                                    <tr className='border-b border-[#2D2D2D] text-left text-xs font-black uppercase tracking-[0.16em] text-[#71717A]'>
                                        <th className='px-5 py-4'>
                                            Project
                                        </th>

                                        <th className='px-5 py-4'>
                                            Links
                                        </th>

                                        <th className='px-5 py-4'>
                                            Stats
                                        </th>

                                        <th className='px-5 py-4'>
                                            Status
                                        </th>

                                        <th className='px-5 py-4'>
                                            Created
                                        </th>

                                        <th className='px-5 py-4 text-right'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-[#2D2D2D]'>
                                    {filteredProjects.map((item) => (
                                        <ProjectTableRow
                                            key={item.id}
                                            item={item}
                                            copied={copied}
                                            updating={
                                                updatingProjectId ===
                                                item.id
                                            }
                                            onCopy={copyText}
                                            onUpdate={updateProject}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE / TABLET CARDS */}
                        <div className='grid grid-cols-1 gap-4 p-4 xl:hidden'>
                            {filteredProjects.map((item) => (
                                <ProjectMobileCard
                                    key={item.id}
                                    item={item}
                                    copied={copied}
                                    updating={
                                        updatingProjectId === item.id
                                    }
                                    onCopy={copyText}
                                    onUpdate={updateProject}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}


function ProjectTableRow({
    item,
    copied,
    updating,
    onCopy,
    onUpdate,
}: {
    item: AdminProject
    copied: string
    updating: boolean
    onCopy: (label: string, value: string) => void
    onUpdate: (
        projectId: string,
        payload: Partial<Pick<AdminProject, 'is_featured'>>
    ) => void
}) {
    return (
        <tr className='bg-[#0A0A0A] transition hover:bg-[#101010]'>
            <td className='px-5 py-5'>
                <ProjectIdentity
                    item={item}
                    copied={copied}
                    onCopy={onCopy}
                />
            </td>

            <td className='px-5 py-5'>
                <ProjectLinks item={item} />
            </td>

            <td className='px-5 py-5'>
                <ProjectStats item={item} />
            </td>

            <td className='px-5 py-5'>
                <StatusGroup item={item} />
            </td>

            <td className='px-5 py-5'>
                <p className='text-sm text-[#A1A1AA]'>
                    {formatDate(item.created_at)}
                </p>
            </td>

            <td className='px-5 py-5'>
                <div className='flex justify-end'>
                    <ProjectActions
                        item={item}
                        updating={updating}
                        onUpdate={onUpdate}
                    />
                </div>
            </td>
        </tr>
    )
}


function ProjectMobileCard({
    item,
    copied,
    updating,
    onCopy,
    onUpdate,
}: {
    item: AdminProject
    copied: string
    updating: boolean
    onCopy: (label: string, value: string) => void
    onUpdate: (
        projectId: string,
        payload: Partial<Pick<AdminProject, 'is_featured'>>
    ) => void
}) {
    return (
        <div className='rounded-[1.7rem] border border-[#2D2D2D] bg-[#080808] p-4'>
            <ProjectIdentity
                item={item}
                copied={copied}
                onCopy={onCopy}
            />

            <div className='mt-4'>
                <StatusGroup item={item} />
            </div>

            <div className='mt-4 grid grid-cols-3 gap-3'>
                <SmallInfo
                    label='Stars'
                    value={String(item.stars_count)}
                />

                <SmallInfo
                    label='Views'
                    value={String(item.views_count)}
                />

                <SmallInfo
                    label='Comments'
                    value={String(item.comments_count)}
                />
            </div>

            <div className='mt-4'>
                <ProjectLinks item={item} />
            </div>

            <div className='mt-4'>
                <ProjectActions
                    item={item}
                    updating={updating}
                    onUpdate={onUpdate}
                    mobile
                />
            </div>
        </div>
    )
}


function ProjectIdentity({
    item,
    copied,
    onCopy,
}: {
    item: AdminProject
    copied: string
    onCopy: (label: string, value: string) => void
}) {
    const copyKey = `project-${item.id}`

    return (
        <div className='flex min-w-0 items-start gap-3'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2D2D2D] bg-[#151515] text-[#E8560A]'>
                {item.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className='h-full w-full object-cover'
                    />
                ) : (
                    <Code2 className='h-5 w-5' />
                )}
            </div>

            <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-2'>
                    <p className='line-clamp-1 text-sm font-black text-white'>
                        {item.title || 'Untitled project'}
                    </p>

                    {item.is_featured && (
                        <Sparkles className='h-4 w-4 text-[#E8560A]' />
                    )}
                </div>

                <p className='mt-1 truncate text-xs font-bold text-[#A1A1AA]'>
                    /projects/{item.slug}
                </p>

                <p className='mt-1 line-clamp-2 max-w-md text-xs leading-5 text-[#71717A]'>
                    {item.description || 'No description'}
                </p>

                <button
                    type='button'
                    onClick={() => onCopy(copyKey, item.id)}
                    className='mt-2 inline-flex items-center gap-1 rounded-full bg-[#151515] px-2.5 py-1 text-[0.65rem] font-bold text-[#8B8B92] transition hover:bg-[#E8560A]/20 hover:text-white'
                >
                    {copied === copyKey ? (
                        <CheckCircle2 className='h-3.5 w-3.5 text-green-400' />
                    ) : (
                        <Copy className='h-3.5 w-3.5' />
                    )}
                    Project ID
                </button>
            </div>
        </div>
    )
}


function ProjectLinks({
    item,
}: {
    item: AdminProject
}) {
    return (
        <div className='flex flex-wrap gap-2'>
            <Link
                href={`/projects/${item.slug}`}
                className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
            >
                <Eye className='h-3.5 w-3.5' />
                View
            </Link>

            {item.github_url && (
                <a
                    href={item.github_url}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                >
                    <Github className='h-3.5 w-3.5' />
                    GitHub
                    <ExternalLink className='h-3 w-3' />
                </a>
            )}

            {item.live_url && (
                <a
                    href={item.live_url}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center justify-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB] transition hover:bg-[#E8560A]/20 hover:text-white'
                >
                    <Globe2 className='h-3.5 w-3.5' />
                    Live
                    <ExternalLink className='h-3 w-3' />
                </a>
            )}
        </div>
    )
}


function ProjectStats({
    item,
}: {
    item: AdminProject
}) {
    return (
        <div className='flex flex-wrap gap-2'>
            <SmallStat
                icon={Star}
                value={item.stars_count}
                label='stars'
            />

            <SmallStat
                icon={MousePointerClick}
                value={item.views_count}
                label='views'
            />

            <SmallStat
                icon={MessageSquareText}
                value={item.comments_count}
                label='comments'
            />
        </div>
    )
}


function StatusGroup({
    item,
}: {
    item: AdminProject
}) {
    return (
        <div className='flex flex-wrap gap-2'>
            {item.is_featured ? (
                <StatusPill
                    text='Featured'
                    tone='orange'
                />
            ) : (
                <StatusPill
                    text='Normal'
                    tone='muted'
                />
            )}

            {item.live_url ? (
                <StatusPill
                    text='Live'
                    tone='good'
                />
            ) : (
                <StatusPill
                    text='No live'
                    tone='muted'
                />
            )}

            {item.github_url ? (
                <StatusPill
                    text='GitHub'
                    tone='orange'
                />
            ) : (
                <StatusPill
                    text='No repo'
                    tone='danger'
                />
            )}
        </div>
    )
}


function ProjectActions({
    item,
    updating,
    mobile,
    onUpdate,
}: {
    item: AdminProject
    updating: boolean
    mobile?: boolean
    onUpdate: (
        projectId: string,
        payload: Partial<Pick<AdminProject, 'is_featured'>>
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
            <button
                type='button'
                disabled={updating}
                onClick={() =>
                    onUpdate(item.id, {
                        is_featured: !item.is_featured,
                    })
                }
                className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    item.is_featured
                        ? 'bg-[#151515] text-[#D1D5DB] hover:bg-[#E8560A]/20 hover:text-white'
                        : 'bg-[#E8560A] text-white hover:bg-[#ff6a1a]'
                }`}
            >
                {updating ? (
                    <Loader2 className='h-3.5 w-3.5 animate-spin' />
                ) : item.is_featured ? (
                    <BadgeCheck className='h-3.5 w-3.5' />
                ) : (
                    <Sparkles className='h-3.5 w-3.5' />
                )}

                {item.is_featured ? 'Unfeature' : 'Feature'}
            </button>
        </div>
    )
}


function MiniStatCard({
    label,
    value,
    icon: Icon,
    orange,
}: {
    label: string
    value: number
    icon: typeof FolderKanban
    orange?: boolean
}) {
    return (
        <div
            className={`rounded-3xl border p-4 ${
                orange
                    ? 'border-[#E8560A]/40 bg-[#E8560A]/10'
                    : 'border-[#2D2D2D] bg-[#111113]'
            }`}
        >
            <div className='mb-4 flex items-center justify-between'>
                <div
                    className={`rounded-full p-2.5 ${
                        orange
                            ? 'bg-[#E8560A] text-white'
                            : 'bg-[#E8560A]/10 text-[#E8560A]'
                    }`}
                >
                    <Icon className='h-4 w-4' />
                </div>

                {orange && value > 0 && (
                    <TrendingUp className='h-4 w-4 text-[#E8560A]' />
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


function SmallStat({
    icon: Icon,
    value,
    label,
}: {
    icon: typeof Star
    value: number
    label: string
}) {
    return (
        <div className='inline-flex items-center gap-2 rounded-full bg-[#151515] px-3 py-2 text-xs font-black text-[#D1D5DB]'>
            <Icon className='h-3.5 w-3.5 text-[#E8560A]' />
            {value}
            <span className='font-bold text-[#71717A]'>
                {label}
            </span>
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
        <div className='rounded-2xl border border-[#2D2D2D] bg-[#111113] p-3'>
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


function EmptyProjects() {
    return (
        <div className='flex min-h-80 items-center justify-center bg-[#080808] p-6 text-center'>
            <div>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-[#71717A]'>
                    <FolderKanban className='h-6 w-6' />
                </div>

                <h3 className='mt-4 text-xl font-black text-white'>
                    No projects found
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