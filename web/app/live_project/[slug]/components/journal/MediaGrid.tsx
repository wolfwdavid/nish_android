"use client"

import {
    ImageIcon,
    ExternalLink,
} from "lucide-react"

import RevealWrapper
from "../animations/RevealWrapper"



interface MediaGridProps {

    media_urls: string[]

}



export default function MediaGrid({

    media_urls,

}: MediaGridProps) {



    if (
        !media_urls ||
        media_urls.length === 0
    ) {
        return null
    }



    return (

        <RevealWrapper delay={0.05}>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                "
            >

                {media_urls.map(
                    (url, index) => (

                        <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-[30px]
                                border
                                border-white/10
                                bg-[#0b0b0b]
                            "
                        >

                            {/* GLOW */}

                            <div
                                className="
                                    absolute
                                    -right-20
                                    -top-20
                                    h-55
                                    w-55
                                    rounded-full
                                    bg-orange-500/10
                                    blur-3xl
                                "
                            />



                            {/* IMAGE */}

                            <div
                                className="
                                    relative
                                    aspect-video
                                    overflow-hidden
                                "
                            >

                                <img
                                    src={url}
                                    alt={`media-${index}`}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition-all
                                        duration-700
                                        group-hover:scale-[1.05]
                                    "
                                />



                                {/* OVERLAY */}

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-linear-to-t
                                        from-black/80
                                        via-black/10
                                        to-transparent
                                    "
                                />



                                {/* ICON */}

                                <div
                                    className="
                                        absolute
                                        left-5
                                        top-5
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-black/40
                                        text-orange-300
                                        backdrop-blur-xl
                                    "
                                >

                                    <ImageIcon size={20} />

                                </div>



                                {/* OPEN */}

                                <div
                                    className="
                                        absolute
                                        bottom-5
                                        right-5
                                        flex
                                        items-center
                                        gap-2
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-black/40
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-white
                                        opacity-0
                                        backdrop-blur-xl
                                        transition-all
                                        duration-300
                                        group-hover:opacity-100
                                    "
                                >

                                    <ExternalLink
                                        size={16}
                                    />

                                    Open

                                </div>

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
                                    px-5
                                    py-4
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Build Media
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        Screenshot / UI Preview
                                    </p>

                                </div>



                                <div
                                    className="
                                        rounded-full
                                        border
                                        border-orange-500/20
                                        bg-orange-500/10
                                        px-4
                                        py-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.2em]
                                        text-orange-300
                                    "
                                >
                                    LIVE
                                </div>

                            </div>

                        </a>

                    )
                )}

            </div>

        </RevealWrapper>
    )
}