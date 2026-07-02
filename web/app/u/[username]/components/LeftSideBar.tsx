"use client"

import Link from "next/link"
import Image from "next/image"

import { usePathname, useRouter } from "next/navigation"

import {
    Plus,
    X,
    ArrowLeft,
    Pencil,
    User,
} from "lucide-react"

import { SignOutButton } from "@clerk/nextjs"
import { useState } from "react"
import CreatePickerModal from "./CreatePickerModal"



type NavItem = {
    name: string
    href: string
    icon: React.ElementType
}



type LeftSidebarProps = {
    navItems: NavItem[]
    avatarUrl: string | null
    displayName: string
    username: string
}

import useCurrentUser from "@/app/lib/currentUser"



export default function LeftSidebar({
    navItems,
    avatarUrl,
    displayName,
    username,
}: LeftSidebarProps) {

    const pathname = usePathname()
    const router = useRouter()

    const [showDPModal, setShowDPModal] = useState(false)
    const [ showNewPostModal , setShowNewPostModal ] = useState(false)

    const { currentUser } = useCurrentUser();

    const options = [

    {
        type: "post",
        title: "Post",
        description: "Share a thought or discussion",
        href: "/create/post",
    },

    {
        type: "project",
        title: "Project",
        description: "Show something you shipped",
        href: `/u/${currentUser?.username}/create/project`,
    },

    {
        type: "live",
        title: "Live Project",
        description: "Share what you're building now",
        href: "/live_project/create",
    },

]





    return (

        <>

            <aside
                className="
                    hidden
                    md:flex
                    sticky
                    top-0
                    h-screen
                    w-67.5
                    flex-col
                    border-r
                    border-white/10
                    bg-black
                    px-4
                    py-6
                    z-999
                "
            >

                {/* LOGO */}

                <div className="px-3">

                    <h1
                        className="
                            bg-linear-to-r
                            from-red-500
                            to-orange-400
                            bg-clip-text
                            text-3xl
                            font-black
                            tracking-[-0.08em]
                            text-transparent
                        "
                    >
                        DevManiac
                    </h1>

                </div>



                {/* NAVIGATION */}

                <nav className="mt-10 space-y-1">

                    {
                        navItems.map((item) => {

                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (

                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex
                                        items-center
                                        gap-4
                                        rounded-2xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        transition-all

                                        ${
                                            isActive
                                                ? `
                                                    border
                                                    border-orange-500/20
                                                    bg-linear-to-r
                                                    from-orange-500/20
                                                    to-red-500/10
                                                    text-white
                                                `
                                                : `
                                                    text-zinc-400
                                                    hover:bg-white/4
                                                    hover:text-white
                                                `
                                        }
                                    `}
                                >

                                    <Icon size={18} />

                                    {item.name}

                                </Link>

                            )

                        })
                    }

                </nav>



                {/* BOTTOM */}

                <div className="mt-auto">

                    {/* NEW POST */}

                    <button
                        className="
                            flex
                            h-14
                            w-full
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-linear-to-r
                            from-red-500
                            to-orange-500
                            font-semibold
                            transition-all
                            hover:scale-[1.02]
                            
                        "
                        onClick={() => setShowNewPostModal(true)}
                    >

                        <Plus size={18} />

                        Create

                    </button>

                    {showNewPostModal && (
                        <CreatePickerModal
                            onClose={() => setShowNewPostModal(false)}
                            onSelect={(type) => {

                                setShowNewPostModal(false)

                                const selectedOption = options.find(
                                    (option) => option.type === type
                                )

                                if (selectedOption) {
                                    router.push(selectedOption.href)
                                }

                            }}
                                                    />
                    )}



                    {/* PROFILE CARD */}

                    <div
                        className="
                            mt-4
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/3
                            p-3
                            text-left
                            transition-all
                            hover:bg-white/5
                        "
                    >

                        {/* AVATAR CLICK OPENS MODAL */}

                        <button
                            type="button"
                            onClick={() => setShowDPModal(true)}
                            className="
                                relative
                                h-12
                                w-12
                                shrink-0
                                overflow-hidden
                                rounded-full
                                border
                                border-white/10
                            "
                        >

                            {
                                avatarUrl ? (

                                    <Image
                                        src={avatarUrl}
                                        alt="Profile"
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-full
                                            w-full
                                            items-center
                                            justify-center
                                            bg-white/10
                                        "
                                    >

                                        <User
                                            size={20}
                                            className="text-zinc-500"
                                        />

                                    </div>

                                )
                            }

                        </button>



                        {/* PROFILE TEXT */}

                        <Link
                            href={`/u/${username}/me`}
                            className="min-w-0 flex-1"
                        >

                            <p className="truncate font-semibold">
                                {displayName}
                            </p>

                            <p
                                className="
                                    truncate
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                @{username}
                            </p>

                        </Link>



                        {/* LOGOUT ONLY HERE */}

                        <SignOutButton>

                            <button
                                type="button"
                                className="
                                    text-xs
                                    font-medium
                                    text-red-400
                                    transition
                                    hover:text-red-300
                                "
                            >
                                Logout
                            </button>

                        </SignOutButton>

                    </div>

                </div>

            </aside>



            {/* IMAGE MODAL */}

            {
                showDPModal && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/80
                            p-4
                            backdrop-blur-md
                        "
                    >

                        <div
                            className="
                                relative
                                w-full
                                max-w-md
                                rounded-3xl
                                border
                                border-white/10
                                bg-zinc-950
                                p-5
                                shadow-2xl
                            "
                        >

                            {/* TOP BAR */}

                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() => setShowDPModal(false)}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-white/5
                                        px-4
                                        py-2
                                        text-sm
                                        text-zinc-300
                                        transition
                                        hover:bg-white/10
                                        hover:text-white
                                    "
                                >

                                    <ArrowLeft size={16} />

                                    Back

                                </button>



                                <button
                                    type="button"
                                    onClick={() => setShowDPModal(false)}
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-white/5
                                        transition
                                        hover:bg-white/10
                                    "
                                >

                                    <X size={18} />

                                </button>

                            </div>



                            {/* IMAGE */}

                            <button
                                type="button"
                                onClick={() => setShowDPModal(false)}
                                className="
                                    relative
                                    mx-auto
                                    block
                                    h-72
                                    w-72
                                    overflow-hidden
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-zinc-900
                                "
                            >

                                {
                                    avatarUrl ? (

                                        <Image
                                            src={avatarUrl}
                                            alt="Profile large"
                                            fill
                                            sizes="288px"
                                            className="object-cover"
                                        />

                                    ) : (

                                        <div
                                            className="
                                                flex
                                                h-full
                                                w-full
                                                items-center
                                                justify-center
                                            "
                                        >

                                            <User
                                                size={80}
                                                className="text-zinc-600"
                                            />

                                        </div>

                                    )
                                }

                            </button>



                            {/* USER INFO */}

                            <div className="mt-5 text-center">

                                <h2 className="text-xl font-bold">
                                    {displayName}
                                </h2>

                                <p className="text-sm text-zinc-500">
                                    @{username}
                                </p>

                            </div>



                            {/* ACTIONS */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    justify-center
                                    gap-3
                                "
                            >

                                

                            </div>

                        </div>

                    </div>

                )
            }

        </>

    )

}