"use client"

import { Plus } from "lucide-react"

type FloatingCreateButtonProps = {
    onClick?: () => void
}

export default function FloatingCreateButton({
    onClick,
}: FloatingCreateButtonProps) {

    return (

        <button
            onClick={onClick}
            className="
                fixed
                bottom-24
                right-5
                z-50

                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-full

                border
                border-orange-500/20

                bg-linear-to-br
                from-red-500
                via-orange-500
                to-orange-400

                text-white

                shadow-[0_10px_40px_rgba(249,115,22,0.45)]

                backdrop-blur-xl

                transition-all
                duration-200

                hover:scale-105
                active:scale-95

                md:hidden
            "
        >

            <Plus
                size={24}
                strokeWidth={2.5}
            />

        </button>

    )

}