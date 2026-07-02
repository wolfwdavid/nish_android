"use client";

/**
 * BuyMeCoffee — DevManiac edition
 * ────────────────────────────────
 * Requires: npm i gsap @gsap/react
 * Image:    /public/rat-cry-coffee.jpg  (the crying hamster)
 * Theme:    burnt orange #E8560A · near-black · Instrument Serif · JetBrains Mono
 */

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Coffee,
    QrCode,
    X,
    Copy,
    Check,
    ExternalLink,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ────────────────────────────────────────────────────────── */

type BuyMeCoffeeProps = {
    variant?: "card" | "compact" | "button";

    username?: string;

    coffeeUrl?: string;

    qrImageSrc?: string;

    hamsterSrc?: string;

    title?: string;

    description?: string;

    showQr?: boolean;

    showOfficialButton?: boolean;

    className?: string;
};

const BRAND = "#E8560A";
const LOW_CAFFEINE = 13;

export default function BuyMeCoffee({
    username = "nish489",
    coffeeUrl,
    qrImageSrc = "/coffeeqr.svg",
    hamsterSrc = "/rat-cry-coffee.jpg",
    variant = "card",
    showQr = true,
    className = "",
    title = "Every line of DevManiac runs on caffeine.",
    description = "Built solo — 4am café shifts, late-night commits, one very tired developer. A coffee keeps the servers (and me) running.",
}: BuyMeCoffeeProps) {
    const [qrOpen, setQrOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const finalCoffeeUrl =
        coffeeUrl || `https://www.buymeacoffee.com/${username}`;

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(finalCoffeeUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    }, [finalCoffeeUrl]);

    if (variant === "compact") {
        return (
            <>
                <div className={`flex items-center gap-2 ${className}`}>
                    <a
                        href={finalCoffeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#E8560A]/30 bg-[#E8560A]/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-orange-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E8560A]/60 hover:bg-[#E8560A]/20 hover:shadow-[0_0_28px_rgba(232,86,10,0.25)]"
                    >
                        <Coffee className="h-4 w-4" />
                        Fuel the build
                    </a>

                    {showQr && (
                        <button
                            type="button"
                            onClick={() => setQrOpen(true)}
                            aria-label="Show Buy Me a Coffee QR code"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all duration-300 hover:border-[#E8560A]/50 hover:text-orange-200"
                        >
                            <QrCode className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <CoffeeQrModal
                    open={qrOpen}
                    onClose={() => setQrOpen(false)}
                    coffeeUrl={finalCoffeeUrl}
                    qrImageSrc={qrImageSrc}
                    copied={copied}
                    onCopy={handleCopy}
                />
            </>
        );
    }

    if (variant === "button") {
        return (
            <>
                <div
                    className={`flex flex-col gap-3 sm:flex-row sm:items-center ${className}`}
                >
                    <a
                        href={finalCoffeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8560A] px-5 py-3 text-sm font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(232,86,10,0.45)]"
                    >
                        <Coffee className="h-4 w-4" />
                        Buy me a coffee
                        <ExternalLink className="h-4 w-4" />
                    </a>

                    {showQr && (
                        <button
                            type="button"
                            onClick={() => setQrOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E8560A]/50 hover:bg-[#E8560A]/10 hover:text-orange-100"
                        >
                            <QrCode className="h-4 w-4" />
                            QR code
                        </button>
                    )}
                </div>

                <CoffeeQrModal
                    open={qrOpen}
                    onClose={() => setQrOpen(false)}
                    coffeeUrl={finalCoffeeUrl}
                    qrImageSrc={qrImageSrc}
                    copied={copied}
                    onCopy={handleCopy}
                />
            </>
        );
    }

    return (
        <>
            <LegendaryCard
                coffeeUrl={finalCoffeeUrl}
                hamsterSrc={hamsterSrc}
                showQr={showQr}
                onOpenQr={() => setQrOpen(true)}
                className={className}
                title={title}
                description={description}
            />

            <CoffeeQrModal
                open={qrOpen}
                onClose={() => setQrOpen(false)}
                coffeeUrl={finalCoffeeUrl}
                qrImageSrc={qrImageSrc}
                copied={copied}
                onCopy={handleCopy}
            />
        </>
    );
}

/* ────────────────────────────────────────────────────────── */
/*  THE CARD                                                   */
/* ────────────────────────────────────────────────────────── */

function LegendaryCard({
    coffeeUrl,
    hamsterSrc,
    showQr,
    onOpenQr,
    className,
    title,
    description,
}: {
    coffeeUrl: string;
    hamsterSrc: string;
    showQr: boolean;
    onOpenQr: () => void;
    className?: string;
    title: string;
    description: string;
}) {
    const scope = useRef<HTMLElement>(null);
    const hamsterRef = useRef<HTMLDivElement>(null);
    const gaugeFillRef = useRef<HTMLDivElement>(null);
    const gaugePctRef = useRef<HTMLSpanElement>(null);
    const gaugeStatusRef = useRef<HTMLSpanElement>(null);
    const ctaRef = useRef<HTMLAnchorElement>(null);

    const breatheTl = useRef<gsap.core.Tween | null>(null);
    const tearTl = useRef<gsap.core.Timeline | null>(null);
    const reduced = useRef(false);
    const fueled = useRef(false);

    useGSAP(
        () => {
            reduced.current = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            const entrance = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: scope.current,
                    start: "top 78%",
                },
            });

            entrance
                .from(".bmc-frame", {
                    opacity: 0,
                    y: 36,
                    duration: 0.7,
                })
                .from(
                    ".bmc-hamster-wrap",
                    {
                        opacity: 0,
                        scale: 0.86,
                        rotate: -6,
                        duration: 0.8,
                        ease: "back.out(1.6)",
                    },
                    "-=0.35",
                )
                .from(
                    ".bmc-reveal",
                    {
                        opacity: 0,
                        y: 18,
                        stagger: 0.09,
                        duration: 0.55,
                    },
                    "-=0.45",
                )
                .fromTo(
                    gaugeFillRef.current,
                    { width: "0%" },
                    {
                        width: `${LOW_CAFFEINE}%`,
                        duration: 1.1,
                        ease: "power2.inOut",
                    },
                    "-=0.2",
                );

            if (reduced.current) return;

            breatheTl.current = gsap.to(".bmc-hamster-img", {
                scale: 1.022,
                y: -2,
                duration: 2.4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
            });

            gsap.utils.toArray<HTMLElement>(".bmc-steam").forEach((el, i) => {
                gsap.fromTo(
                    el,
                    {
                        y: 0,
                        opacity: 0,
                        scaleX: 0.7,
                    },
                    {
                        y: -44,
                        opacity: 0.55,
                        scaleX: 1.25,
                        duration: 2.6,
                        delay: i * 0.85,
                        ease: "sine.out",
                        repeat: -1,
                        repeatDelay: 0.4,
                        keyframes: {
                            opacity: [0, 0.55, 0],
                        },
                    },
                );
            });

            tearTl.current = gsap
                .timeline({
                    repeat: -1,
                    repeatDelay: 3.2,
                })
                .fromTo(
                    ".bmc-tear",
                    {
                        y: 0,
                        opacity: 0,
                        scaleY: 0.6,
                    },
                    {
                        opacity: 0.9,
                        scaleY: 1,
                        duration: 0.35,
                        ease: "power1.in",
                    },
                )
                .to(".bmc-tear", {
                    y: 56,
                    opacity: 0,
                    duration: 0.9,
                    ease: "power2.in",
                });

            gsap.to(".bmc-glow", {
                opacity: 0.7,
                duration: 3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
            });
        },
        { scope },
    );

    const { contextSafe } = useGSAP({ scope });

    const refuel = contextSafe(() => {
        if (fueled.current) return;

        fueled.current = true;

        gsap.to(gaugeFillRef.current, {
            width: "100%",
            duration: 0.9,
            ease: "power3.out",
        });

        animateCounter(gaugePctRef.current, LOW_CAFFEINE, 100);

        if (gaugeStatusRef.current) {
            gaugeStatusRef.current.textContent = "FULLY OPERATIONAL";
            gaugeStatusRef.current.style.color = "#7CCB8B";
        }

        if (!reduced.current) {
            tearTl.current?.pause(0);
            gsap.set(".bmc-tear", { opacity: 0 });

            gsap.to(hamsterRef.current, {
                rotate: -3,
                scale: 1.05,
                duration: 0.5,
                ease: "back.out(2.2)",
            });

            gsap.fromTo(
                ".bmc-thanks",
                {
                    opacity: 0,
                    y: 8,
                    scale: 0.9,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.8)",
                },
            );
        } else {
            const thanks =
                scope.current?.querySelector<HTMLElement>(".bmc-thanks");

            if (thanks) thanks.style.opacity = "1";
        }
    });

    const drain = contextSafe(() => {
        if (!fueled.current) return;

        fueled.current = false;

        gsap.to(gaugeFillRef.current, {
            width: `${LOW_CAFFEINE}%`,
            duration: 1.2,
            ease: "power2.inOut",
            delay: 0.3,
        });

        animateCounter(gaugePctRef.current, 100, LOW_CAFFEINE);

        if (gaugeStatusRef.current) {
            gaugeStatusRef.current.textContent = "CRITICALLY LOW";
            gaugeStatusRef.current.style.color = BRAND;
        }

        if (!reduced.current) {
            tearTl.current?.play();
            gsap.to(hamsterRef.current, {
                rotate: 0,
                scale: 1,
                duration: 0.6,
            });
            gsap.to(".bmc-thanks", {
                opacity: 0,
                duration: 0.3,
            });
        }
    });

    const magnet = contextSafe((e: React.MouseEvent) => {
        if (reduced.current || !ctaRef.current) return;

        const r = ctaRef.current.getBoundingClientRect();

        gsap.to(ctaRef.current, {
            x: (e.clientX - (r.left + r.width / 2)) * 0.18,
            y: (e.clientY - (r.top + r.height / 2)) * 0.22,
            duration: 0.4,
            ease: "power3.out",
        });
    });

    const demagnet = contextSafe(() => {
        if (!ctaRef.current) return;

        gsap.to(ctaRef.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
        });
    });

    return (
        <section
            ref={scope}
            className={`relative w-full min-w-0 overflow-hidden ${className ?? ""}`}
            aria-label="Support DevManiac"
        >
            <div className="bmc-frame relative w-full min-w-0 overflow-hidden rounded-3xl border border-[#E8560A]/20 bg-[#0A0908] p-5 sm:p-6">
                <div className="bmc-glow pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-[#E8560A]/12 opacity-40 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-amber-500/8 blur-3xl" />

                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)",
                    }}
                />

                <div className="relative z-10 grid min-w-0 gap-7 bmc-wide:grid-cols-[200px_1fr] bmc-wide:items-center">
                    <div
                        ref={hamsterRef}
                        className="bmc-hamster-wrap relative mx-auto w-36 max-w-full sm:w-40"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                            <Image
                                src={hamsterSrc}
                                alt="A very sad hamster clutching a tiny cup of coffee"
                                fill
                                sizes="160px"
                                className="bmc-hamster-img object-contain p-1"
                            />

                            <span
                                aria-hidden
                                className="bmc-tear absolute left-[33%] top-[44%] h-3 w-1.5 rounded-full bg-sky-200/90 opacity-0 blur-[0.5px]"
                            />

                            <span
                                aria-hidden
                                className="bmc-steam absolute bottom-[24%] left-[36%] h-5 w-1 rounded-full bg-white/60 opacity-0 blur-[2px]"
                            />

                            <span
                                aria-hidden
                                className="bmc-steam absolute bottom-[26%] left-[41%] h-6 w-1 rounded-full bg-white/50 opacity-0 blur-[2px]"
                            />

                            <span
                                aria-hidden
                                className="bmc-steam absolute bottom-[24%] left-[46%] h-4 w-1 rounded-full bg-white/60 opacity-0 blur-[2px]"
                            />
                        </div>

                        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                            dev.exe — pre-coffee state
                        </p>

                        <span className="bmc-thanks pointer-events-none absolute -top-3 right-0 rounded-full bg-[#E8560A] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black opacity-0">
                            you did this ♥
                        </span>
                    </div>

                    <div className="min-w-0">
                        <div className="bmc-reveal mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-[#E8560A]/25 bg-[#E8560A]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-orange-200">
                            <Coffee className="h-3 w-3 shrink-0" />
                            <span className="truncate">Fuel the build</span>
                        </div>

                        <h3
                            className="bmc-reveal text-2xl leading-tight text-white bmc-wide:text-4xl"
                            style={{
                                fontFamily:
                                    "'Instrument Serif', 'DM Serif Display', serif",
                            }}
                        >
                            {title.includes("DevManiac") ? (
                                <>
                                    Every line of DevManiac
                                    <br />
                                    runs on{" "}
                                    <em className="not-italic text-[#E8560A]">
                                        caffeine.
                                    </em>
                                </>
                            ) : (
                                title
                            )}
                        </h3>

                        <p className="bmc-reveal mt-3 max-w-md text-sm leading-6 text-zinc-400">
                            {description}
                        </p>

                        <div className="bmc-reveal mt-5 max-w-md">
                            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                                <span className="text-zinc-500">
                                    caffeine_level
                                </span>

                                <span className="whitespace-nowrap">
                                    <span
                                        ref={gaugePctRef}
                                        className="font-bold text-white"
                                    >
                                        {LOW_CAFFEINE}
                                    </span>
                                    <span className="text-zinc-500">% · </span>
                                    <span
                                        ref={gaugeStatusRef}
                                        className="font-bold"
                                        style={{ color: BRAND }}
                                    >
                                        CRITICALLY LOW
                                    </span>
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-white/5">
                                <div
                                    ref={gaugeFillRef}
                                    className="h-full rounded-full bg-linear-to-r from-[#E8560A] to-amber-400"
                                    style={{
                                        width: `${LOW_CAFFEINE}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-1.5 font-mono text-[10px] text-zinc-600">
                                hover the button to see what your coffee does ↓
                            </p>
                        </div>

                        <div className="bmc-reveal mt-5 flex w-full min-w-0 flex-col gap-3">
                            <a
                                ref={ctaRef}
                                href={coffeeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={refuel}
                                onMouseLeave={() => {
                                    drain();
                                    demagnet();
                                }}
                                onMouseMove={magnet}
                                onFocus={refuel}
                                onBlur={drain}
                                className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full bg-[#E8560A] px-4 py-3 text-center text-xs font-extrabold text-black transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(232,86,10,0.45)] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                            >
                                <Coffee className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    Buy me a coffee — $5
                                </span>
                                <ExternalLink className="h-4 w-4 shrink-0" />
                            </a>

                            {showQr && (
                                <button
                                    type="button"
                                    onClick={onOpenQr}
                                    className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-xs font-semibold text-zinc-200 transition-all duration-300 hover:border-[#E8560A]/50 hover:bg-[#E8560A]/10 hover:text-orange-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#E8560A]"
                                >
                                    <QrCode className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                        Scan instead
                                    </span>
                                </button>
                            )}
                        </div>

                        <p className="bmc-reveal mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                            100% goes to hosting bills + espresso · no
                            subscription
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* number ticker for the gauge percentage */
function animateCounter(el: HTMLElement | null, from: number, to: number) {
    if (!el) return;

    const obj = { v: from };

    gsap.to(obj, {
        v: to,
        duration: 0.9,
        ease: "power3.out",
        onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
        },
    });
}

/* ────────────────────────────────────────────────────────── */
/*  QR MODAL                                                   */
/* ────────────────────────────────────────────────────────── */

type CoffeeQrModalProps = {
    open: boolean;
    onClose: () => void;
    coffeeUrl: string;
    qrImageSrc: string;
    copied: boolean;
    onCopy: () => void;
};

function CoffeeQrModal({
    open,
    onClose,
    coffeeUrl,
    qrImageSrc,
    copied,
    onCopy,
}: CoffeeQrModalProps) {
    const scope = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!open) return;

            const reduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            if (reduced) return;

            gsap.fromTo(
                ".bmc-modal-panel",
                {
                    opacity: 0,
                    y: 24,
                    scale: 0.96,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.45,
                    ease: "back.out(1.5)",
                },
            );

            gsap.fromTo(
                ".bmc-modal-backdrop",
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.3,
                },
            );
        },
        { scope, dependencies: [open] },
    );

    if (!open) return null;

    return (
        <div
            ref={scope}
            role="dialog"
            aria-modal="true"
            aria-label="Buy Me a Coffee QR code"
            className="fixed inset-0 z-9999 flex items-center justify-center px-4"
            onClick={onClose}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
            <div className="bmc-modal-backdrop absolute inset-0 bg-black/80 backdrop-blur-md" />

            <div
                className="bmc-modal-panel relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#E8560A]/20 bg-[#0A0908] p-5 shadow-[0_0_90px_rgba(232,86,10,0.2)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#E8560A]/10 blur-3xl" />

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close QR modal"
                    className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:border-red-400/40 hover:text-red-300"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8560A]/25 bg-[#E8560A]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-orange-200">
                        <Coffee className="h-3 w-3" />
                        Fuel the build
                    </div>

                    <h3
                        className="text-2xl text-white"
                        style={{
                            fontFamily:
                                "'Instrument Serif', 'DM Serif Display', serif",
                        }}
                    >
                        Scan to support
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Point your phone camera at the code — it opens the
                        support page directly.
                    </p>

                    <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white p-4">
                        <Image
                            src={qrImageSrc}
                            alt="QR code linking to the Buy Me a Coffee page"
                            width={420}
                            height={420}
                            className="h-auto w-full rounded-2xl object-cover"
                        />
                    </div>

                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                        <p className="truncate font-mono text-xs text-zinc-400">
                            {coffeeUrl}
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={onCopy}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-[#E8560A]/50 hover:bg-[#E8560A]/10 hover:text-orange-100"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Copy link
                                </>
                            )}
                        </button>

                        <a
                            href={coffeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8560A] px-4 py-3 text-sm font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(232,86,10,0.4)]"
                        >
                            Open
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}