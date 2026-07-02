"use client"

import Link from "next/link"
import Image from "next/image"

import { usePathname } from "next/navigation"

import {
    User,
} from "lucide-react"

type NavItem = {
    name: string
    href: string
    icon: React.ElementType
}

type MobileBottomNavProps = {

    navItems: NavItem[]

    avatarUrl: string | null
}

export default function MobileBottomNav({

    navItems,

    avatarUrl,

}: MobileBottomNavProps) {

    const pathname = usePathname()

    return (

        <nav
            className="
                fixed
                bottom-0
                left-0
                right-0
                z-50

                flex
                items-center
                justify-around

                border-t
                border-white/10

                bg-black/90

                px-2
                py-2

                backdrop-blur-xl

                md:hidden
            "
        >

            {
                navItems.slice(0, 5).map((item) => {

                    const Icon = item.icon

                    const isActive =
                        pathname === item.href

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex
                                flex-col
                                items-center
                                justify-center
                                gap-1

                                px-2
                                py-1

                                text-[10px]

                                transition-all

                                ${
                                    isActive
                                    ? 'text-orange-400'
                                    : 'text-zinc-500'
                                }
                            `}
                        >

                            {
                                item.name === "Profile" ? (

                                    avatarUrl ? (

                                        <Image
                                            src={avatarUrl}
                                            alt="Profile"
                                            width={22}
                                            height={22}
                                            className="
                                                rounded-full
                                                object-cover
                                                border
                                                border-white/10
                                            "
                                        />

                                    ) : (

                                        <User size={20} />

                                    )

                                ) : (

                                    <Icon size={20} />

                                )
                            }

                            {item.name}

                        </Link>

                    )

                })
            }

        </nav>

    )

}