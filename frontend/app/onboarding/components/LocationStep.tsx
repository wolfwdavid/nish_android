'use client'

import {
    ArrowLeft,
    ArrowRight,
    LocateFixed,
    MapPin,
    Navigation,
    ShieldCheck,
} from 'lucide-react'

interface LocationStepProps {
    location: string
    setLocation: React.Dispatch<React.SetStateAction<string>>
    onBack: () => void
    onContinue: () => void
    onSkip: () => void
}

export default function LocationStep({
    location,
    setLocation,
    onBack,
    onContinue,
    onSkip,
}: LocationStepProps) {

    const handleUseLocation = () => {

        if (!navigator.geolocation) {
            alert('Location is not supported by this browser.')
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude.toFixed(4)
                const longitude = position.coords.longitude.toFixed(4)

                setLocation(`${latitude}, ${longitude}`)
            },
            () => {
                alert('Location permission denied or unavailable.')
            },
            {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 1000 * 60 * 10,
            }
        )
    }

    return (
        <div className="space-y-8">
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
                    <MapPin size={14} />
                    Location
                </div>

                <h2
                    className="
                        mt-6
                        text-3xl
                        sm:text-4xl
                        font-black
                        tracking-[-0.06em]
                        leading-tight
                    "
                >
                    Add your
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
                        builder location.
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
                    This helps your profile feel real. You can allow location
                    detection, type it manually, or skip this step.
                </p>
            </div>

            <div
                className="
                    rounded-[28px]
                    border
                    border-white/10
                    bg-white/3
                    p-6
                    backdrop-blur-2xl
                "
            >
                <div className="flex items-start gap-4">
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-orange-500/20
                            bg-orange-500/10
                            text-orange-300
                        "
                    >
                        <ShieldCheck size={22} />
                    </div>

                    <div>
                        <h3 className="font-bold text-white">
                            Privacy note
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-zinc-500">
                            Location is optional. If you use browser location,
                            DevManiac will only save what appears in the input
                            below. You can edit or remove it later.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <button
                    type="button"
                    onClick={handleUseLocation}
                    className="
                        flex
                        h-16
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        border
                        border-orange-500/20
                        bg-orange-500/10
                        text-base
                        font-bold
                        text-orange-300
                        transition-all
                        hover:bg-orange-500/15
                        hover:border-orange-500/40
                    "
                >
                    <LocateFixed size={20} />
                    Allow location detection
                </button>

                <div>
                    <label
                        className="
                            mb-3
                            block
                            text-sm
                            font-medium
                            text-zinc-300
                        "
                    >
                        Or enter location manually
                    </label>

                    <div className="relative">
                        <Navigation
                            className="
                                absolute
                                left-5
                                top-1/2
                                -translate-y-1/2
                                text-zinc-500
                            "
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Brooklyn, NY"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            className="
                                h-16
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                pl-14
                                pr-5
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

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-4
                    pt-4
                    sm:flex-row
                "
            >
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

                <button
                    type="button"
                    onClick={onSkip}
                    className="
                        flex
                        h-16
                        flex-1
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/3
                        text-lg
                        font-semibold
                        text-zinc-400
                        transition-all
                        hover:bg-white/[0.07]
                        hover:text-white
                    "
                >
                    Skip
                </button>

                <button
                    type="button"
                    onClick={onContinue}
                    className="
                        flex
                        h-16
                        flex-1
                        items-center
                        justify-center
                        gap-3
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
                    Continue
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    )
}