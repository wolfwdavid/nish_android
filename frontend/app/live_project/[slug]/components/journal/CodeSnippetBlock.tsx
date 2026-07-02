"use client"

import { useState } from "react"

import {
    Check,
    Copy,
    Code2,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface CodeSnippetBlockProps {

    language?: string

    code: string

}



export default function CodeSnippetBlock({

    language = "typescript",

    code,

}: CodeSnippetBlockProps) {



    const [copied, setCopied] =
        useState(false)



    async function handleCopy() {

        try {

            await navigator.clipboard.writeText(
                code
            )

            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 2000)

        }

        catch (error) {

            console.error(
                "Failed to copy code:",
                error
            )

        }

    }



    return (

        <RevealWrapper delay={0.05}>

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-[#090909]
                "
            >

                {/* GLOW */}

                <div
                    className="
                        absolute
                        -right-15
                        -top-15
                        h-40
                        w-40
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />



                {/* HEADER */}

                <div
                    className="
                        relative
                        z-10
                        flex
                        items-center
                        justify-between
                        border-b
                        border-white/10
                        bg-white/2
                        px-5
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                text-orange-300
                            "
                        >

                            <Code2 size={18} />

                        </div>



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
                                Code Snippet
                            </p>



                            <p
                                className="
                                    mt-1
                                    font-mono
                                    text-sm
                                    text-zinc-300
                                "
                            >
                                {language}
                            </p>

                        </div>

                    </div>



                    {/* COPY */}

                    <button
                        onClick={handleCopy}
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-2xl
                            border
                            px-4
                            py-2
                            text-sm
                            font-medium
                            transition-all
                            ${
                                copied
                                    ? `
                                        border-emerald-500/20
                                        bg-emerald-500/10
                                        text-emerald-300
                                      `
                                    : `
                                        border-white/10
                                        bg-white/3
                                        text-zinc-300
                                        hover:border-orange-500/20
                                        hover:bg-orange-500/10
                                        hover:text-orange-300
                                      `
                            }
                        `}
                    >

                        {copied ? (

                            <>
                                <Check size={16} />
                                Copied
                            </>

                        ) : (

                            <>
                                <Copy size={16} />
                                Copy
                            </>

                        )}

                    </button>

                </div>



                {/* CODE */}

                <div
                    className="
                        relative
                        z-10
                        overflow-x-auto
                    "
                >

                    <pre
                        className="
                            p-6
                            text-sm
                            leading-7
                            text-zinc-300
                        "
                    >

                        <code
                            className="
                                font-mono
                            "
                        >
                            {code}
                        </code>

                    </pre>

                </div>



                {/* FOOTER */}

                <div
                    className="
                        relative
                        z-10
                        flex
                        items-center
                        justify-between
                        border-t
                        border-white/10
                        bg-white/2
                        px-5
                        py-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-zinc-500
                        "
                    >

                        <div
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-orange-400
                            "
                        />

                        Live Project Journal

                    </div>



                    <div
                        className="
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-zinc-600
                        "
                    >
                        DevManiac
                    </div>

                </div>

            </div>

        </RevealWrapper>
    )
}