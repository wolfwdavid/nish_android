"use client"

import { useEffect, useState } from "react"

import { useUser } from "@clerk/nextjs"

import api from "@/app/lib/api"

import Image from "next/image"

import no_cover from "@/public/no_cover.png"

import { uploadToCloudinary } from "@/app/lib/cloudinary"
import { use } from "react"

import {
    User,
    Loader2,
    Save,
    Pencil,
    X,
    ImagePlus,
} from "lucide-react"



export default function EditProfile({
    params,
}: {
    params: Promise<{username : string}>
}) {

    const { user, isLoaded } = useUser()
    const { username } = use(params)



    const [profileData, setProfileData] = useState({

        username: "",

        display_name: "",

        bio: "",

        avatar_url: "",

        banner_url: "",

        github_url: "",

        linkedin_url: "",

        portfolio_url: "",

    })



    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)

    const [error, setError] = useState("")

    const [success, setSuccess] = useState("")



    const [showAvatarModal, setShowAvatarModal] = useState(false)

    const [showBannerModal, setShowBannerModal] = useState(false)



    useEffect(() => {

        if (!isLoaded) return

        if (!user?.id) return



        const getProfileData = async () => {

            try {

                setLoading(true)

                setError("")



                const result = await api.get(
                    `/profile/${username}`
                )


 
                setProfileData({

                    username:
                        result.data.username || "",

                    display_name:
                        result.data.display_name || "",

                    bio:
                        result.data.bio || "",

                    avatar_url:
                        result.data.avatar_url || "",

                    banner_url:
                        result.data.banner_url || "",

                    github_url:
                        result.data.github_url || "",

                    linkedin_url:
                        result.data.linkedin_url || "",

                    portfolio_url:
                        result.data.portfolio_url || "",

                })

            } catch (err) {

                console.error(err)

                setError(
                    "Failed to fetch profile data"
                )

            } finally {

                setLoading(false)

            }

        }



        getProfileData()

    }, [isLoaded, user?.id])



    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        const { name, value } = e.target



        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }))

    }



    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault()

        if (!user?.id) return



        try {

            setSaving(true)

            setError("")

            setSuccess("")



            await api.patch(
                `/profile/me?clerk_user_id=${user.id}`,
                profileData
            )



            setSuccess(
                "Profile updated successfully"
            )

        } catch (err) {

            console.error(err)

            setError(
                "Failed to update profile"
            )

        } finally {

            setSaving(false)

        }

    }



    if (loading) {

        return (

            <div
                className="
                    flex
                    min-h-[60vh]
                    items-center
                    justify-center
                "
            >

                <Loader2
                    size={40}
                    className="
                        animate-spin
                        text-orange-500
                    "
                />

            </div>

        )

    }



    return (

        <div
            className="
                mx-auto
                max-w-4xl
                px-4
                py-8
            "
        >

            <div
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-black
                "
            >



                {/* BANNER */}

                <div
                    className="
                        relative
                        h-52
                        overflow-hidden
                        border-b
                        border-white/10
                        bg-zinc-900
                    "
                    onClick={() =>
                            setShowBannerModal(true)
                        }
                >

                    {
                        profileData.banner_url ? (

                            <Image
                                src={
                                    profileData.banner_url
                                }
                                alt="Banner"
                                fill
                                className="
                                    object-cover
                                    opacity-80
                                "
                            />

                        ) : (

                            <Image
                                src={no_cover}
                                alt="No Banner"
                                fill
                                className="
                                    object-cover
                                    opacity-70
                                "
                            />

                        )
                    }



                    {/* EDIT BANNER BUTTON */}

                    <button
                        type="button"
                        
                        className="
                            absolute
                            right-4
                            top-4
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-black/60
                            backdrop-blur-md
                            transition-all
                            hover:scale-110
                            hover:bg-black/80
                        "
                    >

                        <Pencil size={18} />

                    </button>

                </div>



                <form
                    onSubmit={handleSubmit}
                    className="
                        p-6
                        lg:p-8
                    "
                >



                    {/* AVATAR */}

                    <div
                        className="
                            relative
                            -mt-20
                            mb-6
                            h-32
                            w-32
                        "
                    >

                        <div
                            className="
                                relative
                                h-full
                                w-full
                                overflow-hidden
                                rounded-full
                                border-4
                                border-black
                                bg-zinc-900
                            "
                             onClick={() =>
                                setShowAvatarModal(true)
                            }
                        >

                            {
                                profileData.avatar_url ? (

                                    <Image
                                        src={
                                            profileData.avatar_url
                                        }
                                        alt="Avatar"
                                        fill
                                        className="
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-full
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <User
                                            size={42}
                                            className="
                                                text-zinc-600
                                            "
                                        />

                                    </div>

                                )
                            }

                        </div>



                        {/* EDIT AVATAR BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowAvatarModal(true)
                            }
                            className="
                                absolute
                                bottom-1
                                right-1
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-orange-500
                                text-white
                                shadow-lg
                                transition-all
                                hover:scale-110
                            "
                        >

                            <Pencil size={16} />

                        </button>

                    </div>



                    {/* ERROR */}

                    {
                        error && (

                            <div
                                className="
                                    mb-5
                                    rounded-2xl
                                    border
                                    border-red-500/20
                                    bg-red-500/10
                                    p-4
                                    text-sm
                                    text-red-400
                                "
                            >
                                {error}
                            </div>

                        )
                    }



                    {/* SUCCESS */}

                    {
                        success && (

                            <div
                                className="
                                    mb-5
                                    rounded-2xl
                                    border
                                    border-green-500/20
                                    bg-green-500/10
                                    p-4
                                    text-sm
                                    text-green-400
                                "
                            >
                                {success}
                            </div>

                        )
                    }



                    {/* INPUTS */}

                    <div
                        className="
                            grid
                            gap-5
                        "
                    >

                        <InputField
                            label="Username"
                            name="username"
                            value={
                                profileData.username
                            }
                            onChange={handleChange}
                        />



                        <InputField
                            label="Display Name"
                            name="display_name"
                            value={
                                profileData.display_name
                            }
                            onChange={handleChange}
                        />



                        <TextAreaField
                            label="Bio"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleChange}
                        />



                        <InputField
                            label="GitHub URL"
                            name="github_url"
                            value={
                                profileData.github_url
                            }
                            onChange={handleChange}
                        />



                        <InputField
                            label="LinkedIn URL"
                            name="linkedin_url"
                            value={
                                profileData.linkedin_url
                            }
                            onChange={handleChange}
                        />



                        <InputField
                            label="Portfolio URL"
                            name="portfolio_url"
                            value={
                                profileData.portfolio_url
                            }
                            onChange={handleChange}
                        />

                    </div>



                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={saving}
                        className="
                            mt-8
                            flex
                            items-center
                            gap-2
                            rounded-2xl
                            bg-linear-to-r
                            from-orange-500
                            to-red-500
                            px-6
                            py-3
                            font-semibold
                            text-white
                            transition-all
                            hover:scale-[1.02]
                            disabled:opacity-50
                        "
                    >

                        {
                            saving ? (

                                <Loader2
                                    size={18}
                                    className="
                                        animate-spin
                                    "
                                />

                            ) : (

                                <Save size={18} />

                            )
                        }

                        Save Changes

                    </button>

                </form>

            </div>



            {/* AVATAR MODAL */}

            {
                showAvatarModal && (

                    <ImageModal
                        title="Edit Avatar"
                        image={profileData.avatar_url}
                        onClose={() =>
                            setShowAvatarModal(false)
                        }
                        onSave={(value) => {

                            setProfileData(prev => ({
                                ...prev,
                                avatar_url: value,
                            }))

                            setShowAvatarModal(false)

                        }}
                    />

                )
            }



            {/* BANNER MODAL */}

            {
                showBannerModal && (

                    <ImageModal
                        title="Edit Banner"
                        image={profileData.banner_url}
                        onClose={() =>
                            setShowBannerModal(false)
                        }
                        onSave={(value) => {

                            setProfileData(prev => ({
                                ...prev,
                                banner_url: value,
                            }))

                            setShowBannerModal(false)

                        }}
                    />

                )
            }

        </div>

    )

}



type InputProps = {

    label: string

    name: string

    value: string

    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void

}



function InputField({
    label,
    name,
    value,
    onChange,
}: InputProps) {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-sm
                    text-zinc-400
                "
            >
                {label}
            </label>

            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                    outline-none
                    transition-all
                    focus:border-orange-500
                "
            />

        </div>

    )

}



type TextAreaProps = {

    label: string

    name: string

    value: string

    onChange: (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => void

}



function TextAreaField({
    label,
    name,
    value,
    onChange,
}: TextAreaProps) {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-sm
                    text-zinc-400
                "
            >
                {label}
            </label>

            <textarea
                rows={5}
                name={name}
                value={value}
                onChange={onChange}
                className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                    outline-none
                    transition-all
                    focus:border-orange-500
                "
            />

        </div>

    )

}



type ImageModalProps = {

    title: string

    image: string

    onClose: () => void

    onSave: (value: string) => void

}



function ImageModal({
    title,
    image,
    onClose,
    onSave,
}: ImageModalProps) {

    const [url, setUrl] = useState(image || "")

    const [uploading, setUploading] =
        useState(false)



const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
) => {
    try {
        const file = e.target.files?.[0]

        if (!file) return

        setUploading(true)

        const uploadResult = await uploadToCloudinary(file)

        const uploadedUrl = uploadResult.secure_url

        if (!uploadedUrl) {
            throw new Error(
                "Cloudinary upload succeeded but secure_url was missing"
            )
        }

        setUrl(uploadedUrl)
    } catch (err) {
        console.error(err)
    } finally {
        setUploading(false)
    }
}



    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/70
                p-4
                backdrop-blur-sm
            "
        >

            <div
                className="
                    w-full
                    max-w-lg
                    rounded-3xl
                    border
                    border-white/10
                    bg-zinc-950
                    p-6
                "
            >



                {/* HEADER */}

                <div
                    className="
                        mb-6
                        flex
                        items-center
                        justify-between
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-bold
                        "
                    >
                        {title}
                    </h2>



                    <button
                        onClick={onClose}
                    >

                        <X />

                    </button>

                </div>



                {/* PREVIEW */}

                <div
                    className="
                        relative
                        mb-5
                        h-56
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-zinc-900
                    "
                >

                    {
                        url ? (

                            <Image
                                src={url}
                                alt="Preview"
                                fill
                                className="
                                    object-cover
                                "
                            />

                        ) : (

                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                    text-zinc-500
                                "
                            >

                                <ImagePlus size={42} />

                            </div>

                        )
                    }

                </div>



                {/* URL INPUT */}

                <input
                    type="text"
                    placeholder="Paste image URL..."
                    value={url}
                    onChange={(e) =>
                        setUrl(e.target.value)
                    }
                    className="
                        mb-4
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        px-4
                        py-3
                        outline-none
                        focus:border-orange-500
                    "
                />



                {/* FILE INPUT */}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="
                        mb-6
                        block
                        w-full
                        text-sm
                    "
                />



                {
                    uploading && (

                        <div
                            className="
                                mb-4
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-orange-400
                            "
                        >

                            <Loader2
                                size={16}
                                className="
                                    animate-spin
                                "
                            />

                            Uploading image...

                        </div>

                    )
                }



                {/* BUTTONS */}

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                    "
                >

                    <button
                        onClick={onClose}
                        className="
                            rounded-2xl
                            border
                            border-white/10
                            px-5
                            py-2
                        "
                    >
                        Cancel
                    </button>



                    <button
                        onClick={() =>
                            onSave(url)
                        }
                        disabled={uploading}
                        className="
                            rounded-2xl
                            bg-orange-500
                            px-5
                            py-2
                            font-semibold
                            text-white
                            disabled:opacity-50
                        "
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>

    )

}