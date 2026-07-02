'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

import {
    ArrowUpRight,
    BadgeCheck,
    BookOpen,
    Brain,
    Bug,
    ChartNoAxesCombined,
    ChevronRight,
    Code2,
    Compass,
    FileText,
    Flame,
    GitBranch,
    Layers3,
    Lightbulb,
    Lock,
    MessageSquareText,
    Rocket,
    ShieldCheck,
    Sparkles,
    Target,
    UserRound,
    Zap,
} from 'lucide-react'

const PRODUCT_PILLARS = [
    {
        title: 'Projects',
        description:
            'Finished work becomes proof. Instead of saying you can build, your shipped projects show it.',
        icon: Code2,
    },
    {
        title: 'Live Projects',
        description:
            'Track progress while building. Logs, failures, milestones, fixes, and decisions show consistency.',
        icon: GitBranch,
    },
    {
        title: 'Profile',
        description:
            'Your developer identity, built from actual activity instead of empty resume claims.',
        icon: UserRound,
    },
    {
        title: 'Stack',
        description:
            'Your tech stack becomes evidence-based: what you use, how often you use it, and where you used it.',
        icon: Layers3,
    },
    {
        title: 'Feedback',
        description:
            'Users shape the product by telling us what feels useful, confusing, broken, or missing.',
        icon: MessageSquareText,
    },
]

const ROADMAP = [
    {
        title: 'Admin system',
        description:
            'Internal dashboard for feedback, reports, users, projects, and platform health.',
        icon: ShieldCheck,
    },
    {
        title: 'Better GitHub sync',
        description:
            'Cleaner repo analysis, stack detection, commit insights, and project activity signals.',
        icon: GitBranch,
    },
    {
        title: 'Discovery',
        description:
            'Find builders, projects, stacks, and live progress worth following.',
        icon: Compass,
    },
    {
        title: 'Project analytics',
        description:
            'Views, stars, saves, engagement, stack usage, and growth patterns.',
        icon: ChartNoAxesCombined,
    },
    {
        title: 'Feedback loop',
        description:
            'Turn user feedback into reviewed, planned, shipped, or archived product decisions.',
        icon: Lightbulb,
    },
]

const USEFUL_LINKS = [
    {
        label: 'Feedback',
        description: 'Tell us what to fix, keep, or build next.',
        href: '/settings/feedback',
        icon: MessageSquareText,
    },
    {
        label: 'Support',
        description: 'Report bugs or get help.',
        href: '/settings/support',
        icon: Bug,
    },
    {
        label: 'Terms',
        description: 'Rules for using DevManiac.',
        href: '/terms',
        icon: FileText,
    },
    {
        label: 'Privacy',
        description: 'How your account data is handled.',
        href: '/privacy',
        icon: Lock,
    },
]

export default function SettingsAboutPage() {
    const pageRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!pageRef.current) return

        const ctx = gsap.context(() => {
            gsap.from('.about-fade', {
                opacity: 0,
                y: 22,
                duration: 0.75,
                ease: 'power3.out',
                stagger: 0.08,
            })

            gsap.from('.about-orb', {
                opacity: 0,
                scale: 0.7,
                duration: 1.2,
                ease: 'power3.out',
                stagger: 0.12,
            })

            gsap.from('.about-line', {
                scaleY: 0,
                transformOrigin: 'top',
                duration: 1,
                ease: 'power3.out',
                delay: 0.25,
            })
        }, pageRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={pageRef} className='relative mx-auto max-w-6xl overflow-hidden px-6 py-10'>
            <div className='about-orb pointer-events-none absolute -left-45 top-20 h-80 w-80 rounded-full bg-[#E8560A]/20 blur-[110px]' />
            <div className='about-orb pointer-events-none absolute -right-35 top-105 h-72 w-72 rounded-full bg-[#3B82F6]/10 blur-[100px]' />

            <HeroSection />

            <MissionSection />

            <MvpSection />

            <CoreSystemSection />

            <RoadmapSection />

            <BottomSection />
        </div>
    )
}

function HeroSection() {
    return (
        <section className='about-fade relative overflow-hidden rounded-4xlrder border-[#2D2D2D] bg-[#111113] px-6 py-8 shadow-2xl sm:px-8 sm:py-10'>
            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(232,86,10,0.22),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_25%)]' />

            <div className='relative grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'>
                <div>
                    <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#E8560A]'>
                        <Sparkles className='h-3.5 w-3.5' />
                        About DevManiac
                    </div>

                    <h1 className='max-w-3xl text-5xl font-black tracking-[-0.06em] text-[#F9FAFB] sm:text-6xl lg:text-7xl'>
                        Developer proof,
                        <span className='block bg-linear-to-r from-[#F9FAFB] via-[#E8560A] to-[#F9FAFB] bg-clip-text text-transparent'>
                            not developer noise.
                        </span>
                    </h1>

                    <p className='mt-6 max-w-2xl text-base leading-8 text-[#A1A1AA]'>
                        DevManiac is a developer consistency and experience identity.
                        It shows how much you know, how much of that knowledge you use,
                        and how you use it through projects, stack history, live progress,
                        and visible growth.
                    </p>

                    <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                        <Link
                            href='/settings/feedback'
                            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6a1a]'
                        >
                            Give feedback
                            <ArrowUpRight className='h-4 w-4' />
                        </Link>

                        <Link
                            href='/settings/support'
                            className='inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A]/70 px-5 py-3 text-sm font-semibold text-[#F9FAFB] transition hover:border-[#E8560A]/50'
                        >
                            Support
                            <ChevronRight className='h-4 w-4' />
                        </Link>
                    </div>
                </div>

                <div className='relative'>
                    <div className='rounded-3xl border border-[#2D2D2D] bg-[#0A0A0A]/80 p-5 shadow-2xl backdrop-blur'>
                        <div className='flex items-center justify-between border-b border-[#2D2D2D] pb-4'>
                            <div>
                                <p className='text-xs uppercase tracking-[0.22em] text-[#71717A]'>
                                    Identity score
                                </p>
                                <h2 className='mt-1 text-2xl font-black text-[#F9FAFB]'>
                                    Built from proof
                                </h2>
                            </div>

                            <div className='rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                                <BadgeCheck className='h-6 w-6' />
                            </div>
                        </div>

                        <div className='mt-5 space-y-4'>
                            <MetricRow label='Projects shipped' value='Proof' progress='88%' />
                            <MetricRow label='Live consistency' value='Active' progress='72%' />
                            <MetricRow label='Stack evidence' value='Tracked' progress='80%' />
                        </div>

                        <div className='mt-5 rounded-2xl border border-[#2D2D2D] bg-[#111113] p-4'>
                            <p className='text-sm leading-7 text-[#A1A1AA]'>
                                A profile should not only say “full-stack developer.”
                                It should show the work, stack, decisions, consistency,
                                and growth behind the claim.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function MissionSection() {
    return (
        <section className='mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <BigInfoCard
                icon={Flame}
                eyebrow='Mission'
                title='Why this exists'
                description='People keep learning, especially now with AI multiplying how fast they consume tutorials, docs, and courses. But learning alone does not create proof. Many developers end up with project zero, resume zero, and real experience zero.'
            />

            <BigInfoCard
                icon={Brain}
                eyebrow='Future vision'
                title='Where this is going'
                description='Today DevManiac starts with project tracking. Later it should track personalized developer plans and collect growth signals from hackathons, projects, blogs, research papers, newsletters, GitHub, and real-world execution.'
            />
        </section>
    )
}

function MvpSection() {
    return (
        <section className='about-fade mt-10 rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 sm:p-8'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center'>
                <div>
                    <p className='text-xs font-bold uppercase tracking-[0.24em] text-[#E8560A]'>
                        MVP status
                    </p>

                    <h2 className='mt-3 text-3xl font-black tracking-[-0.04em] text-[#F9FAFB] sm:text-4xl'>
                        First version: project and stack tracking.
                    </h2>
                </div>

                <div className='rounded-3xl border border-[#2D2D2D] bg-[#0A0A0A] p-5'>
                    <div className='flex items-start justify-between gap-6'>
                        <div>
                            <h3 className='text-lg font-bold text-[#F9FAFB]'>
                                Current focus
                            </h3>

                            <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                                This MVP focuses on finished projects, live project progress,
                                profile identity, stack usage, support, and feedback. It is
                                intentionally narrow because the goal is to prove that developer
                                progress can be tracked through real work.
                            </p>
                        </div>

                        <span className='shrink-0 rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-3 py-1.5 text-xs font-bold text-[#E8560A]'>
                            v0.1.0
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

function CoreSystemSection() {
    return (
        <section className='mt-12'>
            <SectionHeader
                eyebrow='What you can do'
                title='The core system'
                description='Each part turns developer activity into visible evidence.'
            />

            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {PRODUCT_PILLARS.map((item, index) => (
                    <FeatureCard
                        key={item.title}
                        index={index + 1}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                    />
                ))}
            </div>
        </section>
    )
}

function RoadmapSection() {
    return (
        <section className='mt-14'>
            <SectionHeader
                eyebrow='Roadmap preview'
                title='What comes next'
                description='The product gets smarter when it connects proof, activity, and feedback.'
            />

            <div className='mt-7 rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6'>
                <div className='relative space-y-6'>
                    <div className='about-line absolute bottom-4 left-4.5 top-4 w-px bg-linear-to-b from-[#E8560A] via-[#E8560A]/40 to-transparent' />

                    {ROADMAP.map((item) => {
                        const Icon = item.icon

                        return (
                            <div key={item.title} className='about-fade relative flex gap-5'>
                                <div className='relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8560A]/40 bg-[#1C1C1E] text-[#E8560A]'>
                                    <Icon className='h-4 w-4' />
                                </div>

                                <div className='flex-1 rounded-3xl border border-[#2D2D2D] bg-[#0A0A0A] p-5 transition hover:border-[#E8560A]/40'>
                                    <h3 className='font-bold text-[#F9FAFB]'>
                                        {item.title}
                                    </h3>

                                    <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function BottomSection() {
    return (
        <section className='mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
            <div>
                <SectionHeader
                    eyebrow='Useful links'
                    title='Important places'
                    description='Fast access to feedback, support, policy pages, and product direction.'
                />

                <div className='mt-6 overflow-hidden rounded-4xl border border-[#2D2D2D] bg-[#111113]'>
                    {USEFUL_LINKS.map((link, index) => {
                        const Icon = link.icon

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#0A0A0A] ${
                                    index !== USEFUL_LINKS.length - 1
                                        ? 'border-b border-[#2D2D2D]'
                                        : ''
                                }`}
                            >
                                <div className='flex items-center gap-4'>
                                    <div className='rounded-2xl bg-[#0A0A0A] p-3 text-[#A1A1AA] transition group-hover:text-[#E8560A]'>
                                        <Icon className='h-5 w-5' />
                                    </div>

                                    <div>
                                        <h3 className='text-sm font-bold text-[#F9FAFB] transition group-hover:text-[#E8560A]'>
                                            {link.label}
                                        </h3>

                                        <p className='mt-1 text-xs text-[#71717A]'>
                                            {link.description}
                                        </p>
                                    </div>
                                </div>

                                <ChevronRight className='h-4 w-4 text-[#52525B] transition group-hover:text-[#E8560A]' />
                            </Link>
                        )
                    })}
                </div>
            </div>

            <VersionCard />
        </section>
    )
}

function BigInfoCard({
    icon: Icon,
    eyebrow,
    title,
    description,
}: {
    icon: typeof Flame
    eyebrow: string
    title: string
    description: string
}) {
    return (
        <div className='about-fade rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 transition hover:border-[#E8560A]/40'>
            <div className='mb-5 flex items-center gap-3'>
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
                </div>
            </div>

            <p className='text-sm leading-7 text-[#A1A1AA]'>
                {description}
            </p>
        </div>
    )
}

function SectionHeader({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string
    title: string
    description: string
}) {
    return (
        <div className='about-fade'>
            <p className='text-xs font-bold uppercase tracking-[0.24em] text-[#E8560A]'>
                {eyebrow}
            </p>

            <h2 className='mt-2 text-3xl font-black tracking-[-0.04em] text-[#F9FAFB] sm:text-4xl'>
                {title}
            </h2>

            <p className='mt-3 max-w-2xl text-sm leading-7 text-[#A1A1AA]'>
                {description}
            </p>
        </div>
    )
}

function FeatureCard({
    icon: Icon,
    title,
    description,
    index,
}: {
    icon: typeof Code2
    title: string
    description: string
    index: number
}) {
    return (
        <div className='about-fade group relative overflow-hidden rounded-[1.75rem] border border-[#2D2D2D] bg-[#111113] p-5 transition hover:-translate-y-1 hover:border-[#E8560A]/40'>
            <div className='pointer-events-none absolute -right-7.5 -top-7.5 h-24 w-24 rounded-full bg-[#E8560A]/0 blur-2xl transition group-hover:bg-[#E8560A]/20' />

            <div className='relative'>
                <div className='mb-7 flex items-center justify-between'>
                    <div className='rounded-2xl bg-[#0A0A0A] p-3 text-[#E8560A]'>
                        <Icon className='h-5 w-5' />
                    </div>

                    <span className='text-xs font-black text-[#3F3F46]'>
                        0{index}
                    </span>
                </div>

                <h3 className='text-lg font-black text-[#F9FAFB]'>
                    {title}
                </h3>

                <p className='mt-3 text-sm leading-7 text-[#A1A1AA]'>
                    {description}
                </p>
            </div>
        </div>
    )
}

function MetricRow({
    label,
    value,
    progress,
}: {
    label: string
    value: string
    progress: string
}) {
    return (
        <div>
            <div className='mb-2 flex items-center justify-between text-sm'>
                <span className='text-[#A1A1AA]'>{label}</span>
                <span className='font-bold text-[#F9FAFB]'>{value}</span>
            </div>

            <div className='h-2 overflow-hidden rounded-full bg-[#27272A]'>
                <div
                    className='h-full rounded-full bg-linear-to-r from-[#E8560A] to-[#ff9a3d]'
                    style={{ width: progress }}
                />
            </div>
        </div>
    )
}

function VersionCard() {
    return (
        <aside className='about-fade h-fit rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6'>
            <div className='mb-6 flex items-center gap-3'>
                <div className='rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                    <Rocket className='h-5 w-5' />
                </div>

                <div>
                    <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                        Version card
                    </p>

                    <h2 className='text-xl font-black text-[#F9FAFB]'>
                        MVP release
                    </h2>
                </div>
            </div>

            <div className='space-y-3'>
                <VersionRow label='Version' value='0.1.0' />
                <VersionRow label='Environment' value='MVP' />
                <VersionRow label='Release stage' value='Early product' />
                <VersionRow label='Main focus' value='Project tracking' />
            </div>

            <div className='mt-6 rounded-3xl border border-[#E8560A]/20 bg-[#E8560A]/10 p-4'>
                <div className='flex items-start gap-3'>
                    <BookOpen className='mt-0.5 h-4 w-4 shrink-0 text-[#E8560A]' />

                    <p className='text-xs leading-6 text-[#D4D4D8]'>
                        DevManiac is still evolving. Feedback during this stage
                        directly affects what gets fixed, removed, redesigned,
                        or shipped next.
                    </p>
                </div>
            </div>

            <Link
                href='/settings/feedback'
                className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#ff6a1a]'
            >
                Give feedback
                <ArrowUpRight className='h-4 w-4' />
            </Link>
        </aside>
    )
}

function VersionRow({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className='flex items-center justify-between gap-4 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] px-4 py-3'>
            <span className='text-xs text-[#71717A]'>{label}</span>
            <span className='text-sm font-bold text-[#F9FAFB]'>{value}</span>
        </div>
    )
}