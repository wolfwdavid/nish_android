'use client'

import { useState } from 'react'

import Image from 'next/image'

import {
    ArrowLeft,
    ArrowRight,
    ImageIcon,
    Sparkles,
    Upload,
    Loader2,
} from 'lucide-react'

import { uploadToCloudinary }
    from '@/app/lib/cloudinary'


interface VisualStepProps {

    avatarUrl: string
    setAvatarUrl: React.Dispatch<React.SetStateAction<string>>

    bannerUrl: string
    setBannerUrl: React.Dispatch<React.SetStateAction<string>>

    onBack: () => void

    onContinue: () => void
}


export default function VisualStep({

    avatarUrl,
    setAvatarUrl,

    bannerUrl,
    setBannerUrl,

    onBack,

    onContinue,

}: VisualStepProps) {


    const [avatarUploading, setAvatarUploading]
        = useState(false)

    const [bannerUploading, setBannerUploading]
        = useState(false)



    // =========================================
    // AVATAR UPLOAD
    // =========================================

const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
) => {
    try {
        const file = e.target.files?.[0]

        if (!file) return

        setAvatarUploading(true)

        const uploadResult =
            await uploadToCloudinary(file)

        if (!uploadResult.secure_url) {
            throw new Error(
                "Cloudinary secure_url missing"
            )
        }

        setAvatarUrl(uploadResult.secure_url)
    } catch (error) {
        console.error("Avatar upload failed:", error)
    } finally {
        setAvatarUploading(false)
    }
}



    // =========================================
    // BANNER UPLOAD
    // =========================================

    const handleBannerUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file = e.target.files?.[0]

            if (!file) return

            setBannerUploading(true)

            const uploadResult =
                await uploadToCloudinary(file)

            if (!uploadResult.secure_url) {
                throw new Error(
                    "Cloudinary secure_url missing"
                )
            }

            setBannerUrl(uploadResult.secure_url)
        } catch (error) {
            console.error("Banner upload failed:", error)
        } finally {
            setBannerUploading(false)
        }
}


    return (

        <div className="space-y-8">

            {/* HERO */}

            <div>

                <div
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-orange-500/20
                        bg-orange-500/10
                        px-4
                        py-2
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.2em]
                        text-orange-300
                    "
                >
                    <Sparkles size={14} />
                    Visual Layer
                </div>


                <h2
                    className="
                        mt-6
                        text-4xl
                        font-black
                        tracking-[-0.06em]
                        leading-tight
                    "
                >
                    Customize your

                    <span
                        className="
                            block
                            bg-linear-to-r
                            from-red-500
                            via-orange-400
                            to-red-600
                            bg-clip-text
                            text-transparent
                        "
                    >
                        visual identity.
                    </span>

                </h2>


                <p
                    className="
                        mt-5
                        max-w-xl
                        text-base
                        leading-8
                        text-zinc-400
                    "
                >
                    Upload images or paste direct
                    image URLs for your developer
                    profile.
                </p>

            </div>



            {/* LIVE PREVIEW */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[34px]
                    border
                    border-white/10
                    bg-white/3
                    backdrop-blur-2xl
                "
            >

                {/* BANNER */}

                <div
                    className="
                        relative
                        h-44
                        overflow-hidden
                        border-b
                        border-white/10
                        bg-linear-to-br
                        from-red-500/20
                        via-orange-500/10
                        to-black
                    "
                >

                    {bannerUrl ? (

                        <Image
                            src={bannerUrl}
                            alt="Banner Preview"
                            fill
                            className="object-cover"
                        />

                    ) : (

                        <div
                            className="
                                flex
                                h-full
                                items-center
                                justify-center
                                text-zinc-600
                            "
                        >
                            Banner Preview
                        </div>

                    )}

                </div>


                {/* CONTENT */}

                <div className="relative px-8 pb-8">

                    {/* AVATAR */}

                    <div
                        className="
                            relative
                            -mt-14
                            flex
                            h-28
                            w-28
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-3xl
                            border-4
                            border-black
                            bg-linear-to-br
                            from-red-500
                            to-orange-500
                            shadow-[0_0_50px_rgba(249,115,22,0.25)]
                        "
                    >

                        {avatarUrl ? (

                            <Image
                                src={avatarUrl}
                                alt="Avatar Preview"
                                fill
                                className="object-cover"
                            />

                        ) : (

                            <ImageIcon size={30} />

                        )}

                    </div>


                    {/* TEXT */}

                    <div className="mt-6">

                        <h3
                            className="
                                text-2xl
                                font-black
                                tracking-tighter
                            "
                        >
                            Your visual profile
                        </h3>


                        <p
                            className="
                                mt-3
                                max-w-lg
                                text-sm
                                leading-7
                                text-zinc-400
                            "
                        >
                            Your banner and avatar
                            become part of your
                            developer identity across
                            DevManiac.
                        </p>

                    </div>

                </div>

            </div>



            {/* FORM */}

            <div className="grid gap-8">


                {/* AVATAR SECTION */}

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-6
                    "
                >

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-orange-500/10
                                text-orange-400
                            "
                        >
                            <ImageIcon size={20} />
                        </div>

                        <div>

                            <h3 className="font-semibold">
                                Avatar
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                Upload or paste image URL
                            </p>

                        </div>

                    </div>



                    {/* UPLOAD */}

                    <label
                        className="
                            flex
                            h-32
                            cursor-pointer
                            flex-col
                            items-center
                            justify-center
                            rounded-3xl
                            border
                            border-dashed
                            border-white/10
                            bg-white/3
                            transition-all
                            hover:border-orange-500/30
                            hover:bg-orange-500/3
                        "
                    >

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                        />


                        {
                            avatarUploading ? (

                                <>

                                    <Loader2
                                        size={28}
                                        className="
                                            animate-spin
                                            text-orange-400
                                        "
                                    />

                                    <p
                                        className="
                                            mt-4
                                            text-sm
                                            text-zinc-400
                                        "
                                    >
                                        Uploading avatar...
                                    </p>

                                </>

                            ) : (

                                <>

                                    <Upload
                                        size={28}
                                        className="
                                            text-orange-400
                                        "
                                    />

                                    <p
                                        className="
                                            mt-4
                                            text-sm
                                            text-zinc-300
                                        "
                                    >
                                        Click to upload avatar
                                    </p>

                                </>

                            )
                        }

                    </label>



                    {/* URL INPUT */}

                    <div className="mt-5">

                        <input
                            type="text"
                            placeholder="https://..."
                            value={avatarUrl}
                            onChange={(e) =>
                                setAvatarUrl(e.target.value)
                            }
                            className="
                                h-16
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                px-5
                                text-white
                                outline-none
                                transition-all
                                placeholder:text-zinc-500
                                focus:border-orange-500/40
                                focus:bg-white/8
                                focus:ring-4
                                focus:ring-orange-500/10
                            "
                        />

                    </div>

                </div>



                {/* BANNER SECTION */}

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/3
                        p-6
                    "
                >

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-orange-500/10
                                text-orange-400
                            "
                        >
                            <ImageIcon size={20} />
                        </div>

                        <div>

                            <h3 className="font-semibold">
                                Banner
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                Upload or paste image URL
                            </p>

                        </div>

                    </div>



                    {/* UPLOAD */}

                    <label
                        className="
                            flex
                            h-32
                            cursor-pointer
                            flex-col
                            items-center
                            justify-center
                            rounded-3xl
                            border
                            border-dashed
                            border-white/10
                            bg-white/3
                            transition-all
                            hover:border-orange-500/30
                            hover:bg-orange-500/3
                        "
                    >

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleBannerUpload}
                        />


                        {
                            bannerUploading ? (

                                <>

                                    <Loader2
                                        size={28}
                                        className="
                                            animate-spin
                                            text-orange-400
                                        "
                                    />

                                    <p
                                        className="
                                            mt-4
                                            text-sm
                                            text-zinc-400
                                        "
                                    >
                                        Uploading banner...
                                    </p>

                                </>

                            ) : (

                                <>

                                    <Upload
                                        size={28}
                                        className="
                                            text-orange-400
                                        "
                                    />

                                    <p
                                        className="
                                            mt-4
                                            text-sm
                                            text-zinc-300
                                        "
                                    >
                                        Click to upload banner
                                    </p>

                                </>

                            )
                        }

                    </label>



                    {/* URL INPUT */}

                    <div className="mt-5">

                        <input
                            type="text"
                            placeholder="https://..."
                            value={bannerUrl}
                            onChange={(e) =>
                                setBannerUrl(e.target.value)
                            }
                            className="
                                h-16
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                px-5
                                text-white
                                outline-none
                                transition-all
                                placeholder:text-zinc-500
                                focus:border-orange-500/40
                                focus:bg-white/8
                                focus:ring-4
                                focus:ring-orange-500/10
                            "
                        />

                    </div>

                </div>

            </div>



            {/* ACTIONS */}

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-4
                    pt-4
                    sm:flex-row
                "
            >

                {/* BACK */}

                <button
                    type="button"
                    onClick={onBack}
                    className="
                        flex
                        h-16
                        flex-1
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/4
                        text-lg
                        font-semibold
                        text-zinc-300
                        transition-all
                        hover:bg-white/8
                    "
                >

                    <ArrowLeft size={20} />

                    Back

                </button>



                {/* CONTINUE */}

                <button
                    type="button"
                    onClick={onContinue}
                    className="
                        group
                        relative
                        flex
                        h-16
                        flex-1
                        items-center
                        justify-center
                        gap-3
                        overflow-hidden
                        rounded-2xl
                        bg-linear-to-r
                        from-red-500
                        via-orange-500
                        to-red-600
                        text-lg
                        font-bold
                        text-white
                        transition-all
                        hover:scale-[1.01]
                        hover:shadow-[0_0_60px_rgba(249,115,22,0.35)]
                    "
                >

                    <div
                        className="
                            absolute
                            inset-0
                            opacity-0
                            transition-opacity
                            duration-500
                            group-hover:opacity-100
                            bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)]
                            translate-x-[-200%]
                            group-hover:translate-x-[200%]
                        "
                    />

                    Continue

                    <ArrowRight size={20} />

                </button>

            </div>

        </div>

    )
}