"use client"

import Link from "next/link"

import {
    Heart,
    MessageSquareMore,
    LifeBuoy,
    ScrollText,
    ShieldCheck,
    Newspaper,
} from "lucide-react"


const footerLinks = [
    {
        label: "Feedback",
        href: "/settings/feedback",
        icon: MessageSquareMore,
    },
    {
        label: "Support",
        href: "/settings/support",
        icon: LifeBuoy,
    },
    {
        label: "Changelog",
        href: "/settings/changelog",
        icon: Newspaper,
    },
    {
        label: "Terms",
        href: "/footer/terms",
        icon: ScrollText,
    },
    {
        label: "Privacy",
        href: "/footer/privacy",
        icon: ShieldCheck,
    },
]


export default function AppFooter() {
    return (
        <footer
            className="
                mt-10
                border-t
                border-white/10
                px-4
                py-6
                text-zinc-500
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-3xl
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <p className="text-sm font-semibold text-zinc-300">
                        DevManiac
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-zinc-600">
                        Built for people who actually ship
                        <Heart
                            size={12}
                            className="text-orange-500"
                        />
                    </p>
                </div>

                <nav
                    className="
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    {footerLinks.map((link) => {
                        const Icon = link.icon

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/3
                                    px-3
                                    py-2
                                    text-xs
                                    font-medium
                                    text-zinc-500
                                    transition
                                    hover:border-orange-500/30
                                    hover:bg-orange-500/10
                                    hover:text-orange-300
                                "
                            >
                                <Icon
                                    size={13}
                                    className="
                                        text-zinc-600
                                        transition
                                        group-hover:text-orange-300
                                    "
                                />

                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </footer>
    )
}