"use client"

import {
    Pencil,
    Check,
    X,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface SetupFieldProps {

    label: string

    value: string

    placeholder: string

    editing: boolean

    multiline?: boolean

    onEdit: () => void

    onCancel: () => void

    onChange: (
        value: string
    ) => void

}



export default function SetupField({

    label,

    value,

    placeholder,

    editing,

    multiline = false,

    onEdit,

    onCancel,

    onChange,

}: SetupFieldProps) {



    return (

        <RevealWrapper delay={0.04}>

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/10
                    bg-white/3
                    p-5
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        -right-15
                        -top-15
                        h-45
                        w-45
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />



                <div className="relative z-10">

                    {/* HEADER */}

                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-zinc-500
                                "
                            >
                                Setup Field
                            </p>



                            <h3
                                className="
                                    mt-2
                                    text-xl
                                    font-black
                                    tracking-tight
                                    text-white
                                "
                            >
                                {label}
                            </h3>

                        </div>



                        {!editing ? (

                            <button
                                onClick={onEdit}
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-black/20
                                    text-zinc-400
                                    transition-all
                                    hover:border-orange-500/20
                                    hover:bg-orange-500/10
                                    hover:text-orange-300
                                "
                            >

                                <Pencil size={18} />

                            </button>

                        ) : (

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <button
                                    onClick={onCancel}
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-red-500/20
                                        bg-red-500/10
                                        text-red-300
                                        transition-all
                                        hover:scale-[1.03]
                                    "
                                >

                                    <X size={18} />

                                </button>



                                <button
                                    onClick={onCancel}
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-emerald-500/20
                                        bg-emerald-500/10
                                        text-emerald-300
                                        transition-all
                                        hover:scale-[1.03]
                                    "
                                >

                                    <Check size={18} />

                                </button>

                            </div>

                        )}

                    </div>



                    {/* CONTENT */}

                    {editing ? (

                        multiline ? (

                            <textarea
                                autoFocus
                                value={value}
                                onChange={(e) =>
                                    onChange(
                                        e.target.value
                                    )
                                }
                                rows={6}
                                placeholder={placeholder}
                                className="
                                    w-full
                                    resize-none
                                    rounded-3xl
                                    border
                                    border-orange-500/20
                                    bg-black/30
                                    p-5
                                    text-sm
                                    leading-8
                                    text-white
                                    outline-none
                                    transition-all
                                    placeholder:text-zinc-600
                                    focus:bg-orange-500/3
                                "
                            />

                        ) : (

                            <input
                                autoFocus
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    onChange(
                                        e.target.value
                                    )
                                }
                                placeholder={placeholder}
                                className="
                                    w-full
                                    rounded-3xl
                                    border
                                    border-orange-500/20
                                    bg-black/30
                                    px-5
                                    py-5
                                    text-sm
                                    text-white
                                    outline-none
                                    transition-all
                                    placeholder:text-zinc-600
                                    focus:bg-orange-500/3
                                "
                            />

                        )

                    ) : (

                        <div
                            className="
                                rounded-3xl
                                border
                                border-white/10
                                bg-black/20
                                p-5
                            "
                        >

                            {value ? (

                                <p
                                    className="
                                        whitespace-pre-wrap
                                        text-sm
                                        leading-8
                                        text-zinc-300
                                    "
                                >
                                    {value}
                                </p>

                            ) : (

                                <p
                                    className="
                                        text-sm
                                        italic
                                        text-zinc-600
                                    "
                                >
                                    {placeholder}
                                </p>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </RevealWrapper>
    )
}