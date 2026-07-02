'use client'

interface ProgressBarProps {
    step: number
}

const steps = [
    'Identity',
    'Visuals',
    'Socials',
    'Location',
    'Guide',
]

function getStepDescription(step: number) {
    if (step === 1) return 'Create your identity'
    if (step === 2) return 'Customize your visuals'
    if (step === 3) return 'Connect your developer graph'
    if (step === 4) return 'Set your builder location'
    return 'Learn how DevManiac works'
}

export default function ProgressBar({
    step,
}: ProgressBarProps) {

    const progress = `${(step / steps.length) * 100}%`

    return (
        <div className="space-y-4">

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    overflow-x-auto
                    scrollbar-hide
                    text-[10px]
                    sm:text-xs
                    font-medium
                    uppercase
                    tracking-[0.16em]
                "
            >
                {steps.map((label, index) => {
                    const currentStep = index + 1

                    return (
                        <div
                            key={label}
                            className={
                                step >= currentStep
                                    ? 'shrink-0 text-orange-400'
                                    : 'shrink-0 text-zinc-600'
                            }
                        >
                            {label}
                        </div>
                    )
                })}
            </div>

            <div
                className="
                    relative
                    h-3
                    overflow-hidden
                    rounded-full
                    border
                    border-white/10
                    bg-white/4
                    backdrop-blur-xl
                "
            >
                <div
                    className="
                        absolute
                        left-0
                        top-0
                        h-full
                        rounded-full
                        bg-linear-to-r
                        from-red-500
                        via-orange-400
                        to-red-600
                        transition-all
                        duration-500
                        ease-out
                    "
                    style={{
                        width: progress,
                    }}
                />

                <div
                    className="
                        absolute
                        top-0
                        h-full
                        w-24
                        blur-xl
                        bg-orange-400/40
                        transition-all
                        duration-500
                    "
                    style={{
                        left: `calc(${progress} - 48px)`,
                    }}
                />
            </div>

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-xs
                    sm:text-sm
                    text-zinc-500
                "
            >
                <p>
                    Step {step} of 5
                </p>

                <p className="text-right">
                    {getStepDescription(step)}
                </p>
            </div>

        </div>
    )
}