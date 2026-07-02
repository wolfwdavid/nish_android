import Link from 'next/link'

import {
    ArrowLeft,
    BadgeCheck,
    Cookie,
    Database,
    Eye,
    FileText,
    Github,
    Lock,
    Mail,
    MessageSquareText,
    Server,
    ShieldCheck,
    Sparkles,
    Trash2,
    UserRound,
} from 'lucide-react'

const DATA_ITEMS = [
    {
        title: 'Account information',
        description:
            'Basic profile details such as display name, username, avatar, email, bio, and public profile information.',
        icon: UserRound,
    },
    {
        title: 'Project information',
        description:
            'Projects, live projects, tech stack, GitHub URLs, descriptions, links, media URLs, journals, and activity connected to your developer profile.',
        icon: FileText,
    },
    {
        title: 'Feedback and support',
        description:
            'Feedback, bug reports, support tickets, page URLs, diagnostics, and optional contact information you choose to provide.',
        icon: MessageSquareText,
    },
    {
        title: 'Technical data',
        description:
            'Basic diagnostics like browser type, user agent, page path, timestamps, and app-related logs used to debug problems.',
        icon: Database,
    },
]

const USE_ITEMS = [
    {
        title: 'Run the product',
        description:
            'We use data to create profiles, save projects, show live progress, handle support, and keep your account working.',
    },
    {
        title: 'Improve DevManiac',
        description:
            'Feedback and usage patterns help us understand what feels confusing, useful, broken, or worth building next.',
    },
    {
        title: 'Protect the platform',
        description:
            'We may use technical data to prevent abuse, debug errors, investigate reports, and keep the service reliable.',
    },
    {
        title: 'Show public identity',
        description:
            'Public profile and project information may be visible to other users depending on your privacy settings.',
    },
]

const RIGHTS = [
    {
        title: 'Update your profile',
        description:
            'You can edit your profile information from settings.',
        icon: UserRound,
    },
    {
        title: 'Remove content',
        description:
            'You can delete or hide supported content where the product allows it.',
        icon: Trash2,
    },
    {
        title: 'Ask for help',
        description:
            'You can contact support if something looks wrong or you need help with your data.',
        icon: Mail,
    },
]

export default function PrivacyPage() {
    return (
        <main className='min-h-screen bg-[#0A0A0A] px-4 py-8 text-[#F9FAFB] sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='mb-6'>
                    <Link
                        href='/settings/about'
                        className='inline-flex items-center gap-2 text-sm text-[#9CA3AF] transition-colors hover:text-[#F9FAFB]'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back to about
                    </Link>
                </div>

                <section className='relative overflow-hidden rounded-4xl border border-[#2D2D2D] bg-[#111113] p-6 shadow-2xl sm:p-8 lg:p-10'>
                    <div className='pointer-events-none absolute -left-30 -top-30 h-80 w-80 rounded-full bg-[#E8560A]/20 blur-[110px]' />
                    <div className='pointer-events-none absolute -right-30 -bottom-30 h-80 w-80 rounded-full bg-white/5 blur-[110px]' />

                    <div className='relative grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end'>
                        <div>
                            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                                <ShieldCheck className='h-3.5 w-3.5' />
                                Privacy Policy
                            </div>

                            <h1 className='max-w-3xl text-4xl font-black tracking-tighter text-[#F9FAFB] sm:text-5xl lg:text-6xl'>
                                Your data should support your growth, not expose you.
                            </h1>

                            <p className='mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8'>
                                DevManiac is a developer consistency and
                                experience identity platform. This page explains
                                what data we collect, why we collect it, and how
                                we use it during the MVP stage.
                            </p>
                        </div>

                        <div className='rounded-3xl border border-[#2D2D2D] bg-[#0A0A0A]/80 p-5 shadow-2xl backdrop-blur'>
                            <div className='mb-5 flex items-center justify-between border-b border-[#2D2D2D] pb-4'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#71717A]'>
                                        Privacy status
                                    </p>

                                    <h2 className='mt-1 text-2xl font-black text-[#F9FAFB]'>
                                        MVP policy
                                    </h2>
                                </div>

                                <div className='rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                                    <Lock className='h-6 w-6' />
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <StatusRow
                                    label='Private repos'
                                    value='Not accessed'
                                />

                                <StatusRow
                                    label='Public profiles'
                                    value='User controlled'
                                />

                                <StatusRow
                                    label='Feedback diagnostics'
                                    value='Used for debugging'
                                />

                                <StatusRow
                                    label='Last updated'
                                    value='June 2026'
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className='mt-6 rounded-4xl border border-[#E8560A]/20 bg-[#E8560A]/10 p-5 sm:p-6'>
                    <div className='flex items-start gap-4'>
                        <Sparkles className='mt-1 h-5 w-5 shrink-0 text-[#E8560A]' />

                        <div>
                            <h2 className='text-lg font-black text-[#F9FAFB]'>
                                Plain-English summary
                            </h2>

                            <p className='mt-2 text-sm leading-7 text-[#D4D4D8]'>
                                We collect the information needed to run
                                DevManiac: your account, profile, projects,
                                feedback, support reports, and basic technical
                                diagnostics. For the MVP, GitHub usage is based
                                on public URLs you provide. We do not access
                                private repositories or GitHub secrets.
                            </p>
                        </div>
                    </div>
                </section>

                <section className='mt-10'>
                    <SectionHeader
                        eyebrow='Information we collect'
                        title='What DevManiac stores'
                        description='The platform is built around developer proof: projects, live progress, stack usage, and feedback.'
                    />

                    <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {DATA_ITEMS.map((item) => (
                            <DataCard
                                key={item.title}
                                {...item}
                            />
                        ))}
                    </div>
                </section>

                <section className='mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
                    <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
                        <div className='mb-5 flex items-start gap-3'>
                            <div className='rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                                <Github className='h-5 w-5' />
                            </div>

                            <div>
                                <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                                    GitHub privacy
                                </p>

                                <h2 className='mt-1 text-xl font-black text-[#F9FAFB]'>
                                    Public URLs only for MVP
                                </h2>
                            </div>
                        </div>

                        <p className='text-sm leading-7 text-[#A1A1AA]'>
                            DevManiac may inspect public GitHub repository URLs
                            that you add to projects. This can help detect tech
                            stack, README context, and project credibility.
                            DevManiac does not access private repositories,
                            GitHub tokens, secrets, or private source code in
                            the MVP.
                        </p>
                    </div>

                    <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
                        <div className='mb-5 flex items-start gap-3'>
                            <div className='rounded-2xl bg-[#E8560A]/10 p-3 text-[#E8560A]'>
                                <Eye className='h-5 w-5' />
                            </div>

                            <div>
                                <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                                    Public visibility
                                </p>

                                <h2 className='mt-1 text-xl font-black text-[#F9FAFB]'>
                                    Some things are meant to be public
                                </h2>
                            </div>
                        </div>

                        <p className='text-sm leading-7 text-[#A1A1AA]'>
                            DevManiac is built around public developer identity.
                            Your public profile, public projects, public live
                            projects, stack usage, and visible activity may be
                            shown to other users. Private or hidden features
                            should only be considered private when the product
                            clearly marks them that way.
                        </p>
                    </div>
                </section>

                <section className='mt-10'>
                    <SectionHeader
                        eyebrow='How we use information'
                        title='Why the data exists'
                        description='We do not collect data just to hoard it. Each piece should help the product work or improve.'
                    />

                    <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {USE_ITEMS.map((item, index) => (
                            <UseCard
                                key={item.title}
                                index={index + 1}
                                {...item}
                            />
                        ))}
                    </div>
                </section>

                <section className='mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    <PolicyBlock
                        icon={Cookie}
                        eyebrow='Cookies and auth'
                        title='Authentication and session data'
                    >
                        DevManiac may use cookies or similar technologies
                        through authentication providers, hosting providers, or
                        analytics/debugging tools. These help keep you signed
                        in, secure your account, and understand app behavior.
                    </PolicyBlock>

                    <PolicyBlock
                        icon={Server}
                        eyebrow='Service providers'
                        title='Tools that help run the app'
                    >
                        DevManiac may rely on third-party services for
                        authentication, hosting, database, image storage,
                        analytics, email, or error tracking. These services may
                        process data only as needed to provide the product.
                    </PolicyBlock>

                    <PolicyBlock
                        icon={BadgeCheck}
                        eyebrow='Security'
                        title='We try to protect your data'
                    >
                        We use reasonable technical and organizational measures
                        to protect your information. But no internet service is
                        perfectly secure, especially during an MVP stage, so you
                        should avoid posting secrets or sensitive information.
                    </PolicyBlock>

                    <PolicyBlock
                        icon={Database}
                        eyebrow='Retention'
                        title='How long data is kept'
                    >
                        We keep data as long as needed to provide DevManiac,
                        improve the product, comply with obligations, prevent
                        abuse, or resolve issues. Deleted data may take time to
                        disappear from backups or logs.
                    </PolicyBlock>
                </section>

                <section className='mt-10'>
                    <SectionHeader
                        eyebrow='Your control'
                        title='What you can do'
                        description='You should be able to correct, remove, or ask about your information.'
                    />

                    <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-3'>
                        {RIGHTS.map((item) => (
                            <DataCard
                                key={item.title}
                                {...item}
                            />
                        ))}
                    </div>
                </section>

                <section className='mt-10 rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center'>
                        <div>
                            <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                                Questions
                            </p>

                            <h2 className='mt-2 text-2xl font-black tracking-[-0.03em] text-[#F9FAFB]'>
                                Need help with privacy?
                            </h2>

                            <p className='mt-3 max-w-2xl text-sm leading-7 text-[#A1A1AA]'>
                                If you have questions about your data, account,
                                public profile, or deletion requests, contact
                                support or send feedback.
                            </p>
                        </div>

                        <div className='flex flex-col gap-3 sm:flex-row lg:flex-col'>
                            <Link
                                href='/settings/support'
                                className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8560A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6a1a]'
                            >
                                Contact support
                                <Mail className='h-4 w-4' />
                            </Link>

                            <Link
                                href='/settings/feedback'
                                className='inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2D2D2D] bg-[#0A0A0A] px-5 py-3 text-sm font-bold text-[#F9FAFB] transition hover:border-[#E8560A]/50'
                            >
                                Send feedback
                                <MessageSquareText className='h-4 w-4' />
                            </Link>
                        </div>
                    </div>
                </section>

                <p className='mt-8 text-center text-xs leading-6 text-[#71717A]'>
                    This privacy page is an MVP policy draft and may be updated
                    as DevManiac grows. Last updated: June 2026.
                </p>
            </div>
        </main>
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
        <div>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8560A]'>
                {eyebrow}
            </p>

            <h2 className='mt-2 text-2xl font-black tracking-[-0.03em] text-[#F9FAFB] sm:text-3xl'>
                {title}
            </h2>

            <p className='mt-3 max-w-2xl text-sm leading-7 text-[#A1A1AA]'>
                {description}
            </p>
        </div>
    )
}

function DataCard({
    title,
    description,
    icon: Icon,
}: {
    title: string
    description: string
    icon: typeof UserRound
}) {
    return (
        <div className='rounded-3xler border-[#2D2D2D] bg-[#111113] p-5 transition hover:-translate-y-1 hover:border-[#E8560A]/40'>
            <div className='mb-5 inline-flex rounded-2xl bg-[#0A0A0A] p-3 text-[#E8560A]'>
                <Icon className='h-5 w-5' />
            </div>

            <h3 className='text-base font-black text-[#F9FAFB]'>
                {title}
            </h3>

            <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                {description}
            </p>
        </div>
    )
}

function UseCard({
    title,
    description,
    index,
}: {
    title: string
    description: string
    index: number
}) {
    return (
        <div className='rounded-3xl border border-[#2D2D2D] bg-[#111113] p-5'>
            <div className='mb-5 flex items-center justify-between'>
                <span className='rounded-2xl bg-[#E8560A]/10 px-3 py-2 text-sm font-black text-[#E8560A]'>
                    0{index}
                </span>

                <ShieldCheck className='h-5 w-5 text-[#3F3F46]' />
            </div>

            <h3 className='text-base font-black text-[#F9FAFB]'>
                {title}
            </h3>

            <p className='mt-2 text-sm leading-7 text-[#A1A1AA]'>
                {description}
            </p>
        </div>
    )
}

function PolicyBlock({
    icon: Icon,
    eyebrow,
    title,
    children,
}: {
    icon: typeof Cookie
    eyebrow: string
    title: string
    children: React.ReactNode
}) {
    return (
        <div className='rounded-4xl border border-[#2D2D2D] bg-[#111113] p-5 sm:p-6'>
            <div className='mb-5 flex items-start gap-3'>
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
                {children}
            </p>
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
            <span className='text-xs text-[#9CA3AF]'>
                {label}
            </span>

            <span className='text-right text-xs font-bold text-[#F9FAFB]'>
                {value}
            </span>
        </div>
    )
}