'use client'

import Image from 'next/image'

import {
    Github,
    Linkedin,
    Globe,
    Instagram,
    MapPin,
    BriefcaseBusiness,
    Save,
} from 'lucide-react'

import { useEffect, useState } from 'react'

import api from '@/app/lib/api'

interface ProfileData {

    display_name: string

    bio: string

    avatar_url: string

    banner_url: string

    location: string

    current_build: string

    github_url: string

    linkedin_url: string

    portfolio_url: string

    instagram_url: string
}

export default function ProfileSettingsPage() {

    const [loading, setLoading] =
        useState(true)

    const [saving, setSaving] =
        useState(false)

    const [isDirty, setIsDirty] =
        useState(false)

    const [profileData, setProfileData] =
        useState<ProfileData>({
            display_name: '',
            bio: '',
            avatar_url: '',
            banner_url: '',
            location: '',
            current_build: '',
            github_url: '',
            linkedin_url: '',
            portfolio_url: '',
            instagram_url: '',
        })

    async function getProfileData() {

        try {

            const response =
                await api.get('/profile/me')

            setProfileData(response.data)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        getProfileData()

    }, [])

    function handleChange(
        field: keyof ProfileData,
        value: string
    ) {

        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }))

        setIsDirty(true)
    }

    async function saveChanges() {

        try {

            setSaving(true)

            await api.patch(
                '/settings/profile',
                profileData
            )

            setIsDirty(false)

        } catch (error) {

            console.log(error)

        } finally {

            setSaving(false)
        }
    }

    if (loading) {

        return (

            <div className='flex h-100 items-center justify-center'>

                <div className='h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent' />

            </div>

        )
    }

    return (

        <div className='space-y-8'>

            {/* HEADER */}

<div className='flex min-h-[70vh] items-center justify-center px-6'>

    <div className='w-full max-w-2xl rounded-3xl border border-white/10 bg-white/3 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12'>

        <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10 text-4xl'>

            🚧

        </div>

        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>

            Under Maintenance

        </h1>

        <p className='mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base'>

            This settings section is currently being upgraded for a better
            experience. Please edit your profile from your profile dashboard
            for now.

        </p>

        <div className='mt-8'>

            <a
                href='/u/yourusername/profile/edit'
                className='inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90'
            >

                Go To Profile Dashboard

            </a>

        </div>

    </div>

</div>
            <div>

                <h1 className='text-3xl font-bold tracking-tight'>
                    Profile Settings
                </h1>

                <p className='mt-2 text-sm text-zinc-400'>
                    Customize your developer identity on DevManiac.
                </p>

            </div>

            {/* PROFILE PREVIEW */}

            <div className='overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f]'>

                {/* BANNER */}

                <div className='relative h-40 w-full bg-zinc-900 sm:h-56'>

                    {
                        profileData.banner_url && (

                            <Image
                                src={profileData.banner_url}
                                alt='Banner'
                                fill
                                className='object-cover'
                            />

                        )
                    }

                </div>

                {/* PROFILE */}

                <div className='relative px-5 pb-6'>

                    {/* AVATAR */}

                    <div className='relative -mt-16 h-28 w-28 overflow-hidden rounded-full border-4 border-black bg-zinc-900 sm:h-32 sm:w-32'>

                        {
                            profileData.avatar_url && (

                                <Image
                                    src={profileData.avatar_url}
                                    alt='Avatar'
                                    fill
                                    className='object-cover'
                                />

                            )
                        }

                    </div>

                    {/* INFO */}

                    <div className='mt-4 space-y-2'>

                        <h2 className='text-2xl font-bold'>

                            {
                                profileData.display_name ||
                                'Your Name'
                            }

                        </h2>

                        <p className='max-w-2xl text-sm leading-relaxed text-zinc-400'>

                            {
                                profileData.bio ||
                                'Your bio will appear here.'
                            }

                        </p>

                        <div className='flex flex-wrap items-center gap-4 pt-2 text-sm text-zinc-500'>

                            {
                                profileData.location && (

                                    <div className='flex items-center gap-1'>

                                        <MapPin size={15} />

                                        {profileData.location}

                                    </div>

                                )
                            }

                            {
                                profileData.current_build && (

                                    <div className='flex items-center gap-1'>

                                        <BriefcaseBusiness size={15} />

                                        {profileData.current_build}

                                    </div>

                                )
                            }

                        </div>

                    </div>

                </div>

            </div>

            {/* BASIC INFO */}

            <div className='rounded-3xl border border-white/10 bg-[#0f0f0f] p-6'>

                <h2 className='mb-6 text-xl font-semibold'>
                    Basic Information
                </h2>

                <div className='grid gap-5'>

                    <div>

                        <label className='mb-2 block text-sm text-zinc-400'>
                            Display Name
                        </label>

                        <input
                            value={profileData.display_name}
                            onChange={(e) =>
                                handleChange(
                                    'display_name',
                                    e.target.value
                                )
                            }
                            className='w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30'
                            placeholder='Your display name'
                        />

                    </div>

                    <div>

                        <label className='mb-2 block text-sm text-zinc-400'>
                            Bio
                        </label>

                        <textarea
                            value={profileData.bio}
                            onChange={(e) =>
                                handleChange(
                                    'bio',
                                    e.target.value
                                )
                            }
                            rows={5}
                            maxLength={280}
                            className='w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30'
                            placeholder='Tell the world what you build...'
                        />

                        <div className='mt-2 text-right text-xs text-zinc-500'>

                            {profileData.bio.length}/280

                        </div>

                    </div>

                    <div className='grid gap-5 sm:grid-cols-2'>

                        <div>

                            <label className='mb-2 block text-sm text-zinc-400'>
                                Location
                            </label>

                            <input
                                value={profileData.location}
                                onChange={(e) =>
                                    handleChange(
                                        'location',
                                        e.target.value
                                    )
                                }
                                className='w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30'
                                placeholder='New York, USA'
                            />

                        </div>

                        <div>

                            <label className='mb-2 block text-sm text-zinc-400'>
                                Current Build
                            </label>

                            <input
                                value={profileData.current_build}
                                onChange={(e) =>
                                    handleChange(
                                        'current_build',
                                        e.target.value
                                    )
                                }
                                className='w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30'
                                placeholder='Building NeuraLearn'
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* IMAGES */}

            <div className='rounded-3xl border border-white/10 bg-[#0f0f0f] p-6'>

                <h2 className='mb-6 text-xl font-semibold'>
                    Profile Images
                </h2>

                <div className='grid gap-5'>

                    <div>

                        <label className='mb-2 block text-sm text-zinc-400'>
                            Avatar URL
                        </label>

                        <input
                            value={profileData.avatar_url}
                            onChange={(e) =>
                                handleChange(
                                    'avatar_url',
                                    e.target.value
                                )
                            }
                            className='w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30'
                            placeholder='https://...'
                        />

                    </div>

                    <div>

                        <label className='mb-2 block text-sm text-zinc-400'>
                            Banner URL
                        </label>

                        <input
                            value={profileData.banner_url}
                            onChange={(e) =>
                                handleChange(
                                    'banner_url',
                                    e.target.value
                                )
                            }
                            className='w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30'
                            placeholder='https://...'
                        />

                    </div>

                </div>

            </div>

            {/* SOCIALS */}

            <div className='rounded-3xl border border-white/10 bg-[#0f0f0f] p-6'>

                <h2 className='mb-6 text-xl font-semibold'>
                    Social Links
                </h2>

                <div className='grid gap-5'>

                    <SocialInput
                        icon={<Github size={18} />}
                        value={profileData.github_url}
                        onChange={(value) =>
                            handleChange(
                                'github_url',
                                value
                            )
                        }
                        placeholder='GitHub URL'
                    />

                    <SocialInput
                        icon={<Linkedin size={18} />}
                        value={profileData.linkedin_url}
                        onChange={(value) =>
                            handleChange(
                                'linkedin_url',
                                value
                            )
                        }
                        placeholder='LinkedIn URL'
                    />

                    <SocialInput
                        icon={<Instagram size={18} />}
                        value={profileData.instagram_url}
                        onChange={(value) =>
                            handleChange(
                                'instagram_url',
                                value
                            )
                        }
                        placeholder='Instagram URL'
                    />

                    <SocialInput
                        icon={<Globe size={18} />}
                        value={profileData.portfolio_url}
                        onChange={(value) =>
                            handleChange(
                                'portfolio_url',
                                value
                            )
                        }
                        placeholder='Portfolio URL'
                    />

                </div>

            </div>

            {/* SAVE BAR */}

            {
                isDirty && (

                    <div className='sticky bottom-4 z-50 flex items-center justify-between rounded-3xl border border-white/10 bg-black/90 px-5 py-4 backdrop-blur-xl'>

                        <div>

                            <p className='text-sm font-medium'>
                                You have unsaved changes
                            </p>

                            <p className='text-xs text-zinc-500'>
                                Save your profile updates.
                            </p>

                        </div>

                        <button
                            onClick={saveChanges}
                            disabled={saving}
                            className='flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50'
                        >

                            <Save size={17} />

                            {
                                saving
                                    ? 'Saving...'
                                    : 'Save Changes'
                            }

                        </button>

                    </div>

                )
            }

        </div>

    )
}

function SocialInput({
    icon,
    value,
    onChange,
    placeholder,
}: {
    icon: React.ReactNode
    value: string
    onChange: (value: string) => void
    placeholder: string
}) {

    return (

        <div className='flex items-center gap-3 rounded-2xl border border-white/10 bg-black px-4 py-3'>

            <div className='text-zinc-400'>
                {icon}
            </div>

            <input
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className='w-full bg-transparent outline-none'
                placeholder={placeholder}
            />

        </div>

    )
}