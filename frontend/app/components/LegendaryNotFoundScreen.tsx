"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
    ArrowLeft,
    Bug,
    Code2,
    Compass,
    Ghost,
    Home,
    Radar,
    Rocket,
    Search,
    ShieldAlert,
    Sparkles,
    Terminal,
    Zap,
} from "lucide-react";

const debugLines = [
    {
        key: "route",
        label: "requested.path",
        value: "undefined",
        color: "text-red-300",
    },
    {
        key: "status",
        label: "response.status",
        value: "404",
        color: "text-orange-300",
    },
    {
        key: "fix",
        label: "recommended.action",
        value: "return_to_base",
        color: "text-emerald-300",
    },
];

export default function LegendaryNotFoundScreen() {
    const rootRef = useRef<HTMLElement | null>(null);
    const orbitOneRef = useRef<HTMLDivElement | null>(null);
    const orbitTwoRef = useRef<HTMLDivElement | null>(null);
    const coreRef = useRef<HTMLDivElement | null>(null);
    const scanRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(
                [
                    ".nf-badge",
                    ".nf-title",
                    ".nf-copy",
                    ".nf-actions",
                    ".nf-mini-card",
                    ".nf-terminal",
                    ".nf-panel",
                ],
                {
                    opacity: 0,
                    y: 30,
                },
            );

            gsap.set(".nf-visual", {
                opacity: 0,
                scale: 0.92,
                y: 40,
                rotateX: 10,
            });

            gsap.timeline({
                defaults: {
                    ease: "power4.out",
                    duration: 0.85,
                },
            })
                .to(".nf-badge", {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                })
                .to(
                    ".nf-title",
                    {
                        opacity: 1,
                        y: 0,
                    },
                    "-=0.25",
                )
                .to(
                    ".nf-copy",
                    {
                        opacity: 1,
                        y: 0,
                    },
                    "-=0.48",
                )
                .to(
                    ".nf-actions",
                    {
                        opacity: 1,
                        y: 0,
                    },
                    "-=0.45",
                )
                .to(
                    ".nf-mini-card",
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                    },
                    "-=0.45",
                )
                .to(
                    ".nf-visual",
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        rotateX: 0,
                    },
                    "-=0.65",
                )
                .to(
                    ".nf-terminal",
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                    },
                    "-=0.42",
                )
                .to(
                    ".nf-panel",
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                    },
                    "-=0.5",
                );

            gsap.to(orbitOneRef.current, {
                rotate: 360,
                duration: 11,
                ease: "none",
                repeat: -1,
            });

            gsap.to(orbitTwoRef.current, {
                rotate: -360,
                duration: 16,
                ease: "none",
                repeat: -1,
            });

            gsap.to(coreRef.current, {
                y: -16,
                scale: 1.04,
                duration: 1.8,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });

            gsap.to(".nf-float", {
                y: -12,
                rotate: 4,
                duration: 2,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                stagger: {
                    each: 0.22,
                    from: "random",
                },
            });

            gsap.to(scanRef.current, {
                xPercent: 140,
                duration: 1.5,
                ease: "power2.inOut",
                repeat: -1,
                repeatDelay: 0.25,
            });

            gsap.to(".nf-pulse-line", {
                opacity: 0.35,
                duration: 0.75,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                stagger: 0.18,
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <main
            ref={rootRef}
            className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-size-[54px_54px]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_12%,rgba(249,115,22,0.24),transparent_34%),radial-gradient(circle_at_86%_82%,rgba(239,68,68,0.13),transparent_34%),radial-gradient(circle_at_12%_78%,rgba(245,158,11,0.10),transparent_30%)]" />

            <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-orange-500/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-trom-black to-transparent" />

            {/* Top scan line */}
            <div className="absolute left-0 right-0 top-0 h-px overflow-hidden bg-white/5">
                <div
                    ref={scanRef}
                    className="h-full w-1/2 -translate-x-full bg-linear-to-r from-transparent via-orange-400 to-transparent"
                />
            </div>

            {/* Floating decorations */}
            <div className="nf-float absolute left-[7%] top-[16%] hidden rounded-3xl border border-orange-500/20 bg-orange-500/5 p-5 backdrop-blur-xl lg:block">
                <Bug className="h-7 w-7 text-orange-300" />
            </div>

            <div className="nf-float absolute right-[8%] top-[14%] hidden rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl lg:block">
                <Radar className="h-7 w-7 text-orange-300" />
            </div>

            <div className="nf-float absolute bottom-[14%] left-[10%] hidden rounded-3xl border border-orange-500/20 bg-orange-500/5 p-5 backdrop-blur-xl lg:block">
                <ShieldAlert className="h-7 w-7 text-orange-300" />
            </div>

            <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.04fr_560px] lg:px-10">
                {/* Left content */}
                <div>
                    <div className="nf-badge mb-8 inline-flex items-center gap-3 rounded-full border border-orange-400/25 bg-orange-500/10 px-5 py-3 text-sm font-bold text-orange-100 shadow-[0_0_50px_rgba(249,115,22,0.18)] backdrop-blur-xl">
                        <span className="relative flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-400" />
                        </span>
                        Route anomaly detected
                    </div>

                    <h1 className="nf-title max-w-5xl text-7xl font-black leading-[0.86] tracking-tight sm:text-8xl lg:text-9xl">
                        404
                        <span className="block bg-linear-to-r from-orange-200 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            Lost in the stack.
                        </span>
                    </h1>

                    <p className="nf-copy mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
                        This page didn’t ship, got renamed, or vanished into the
                        production void. No drama. Great builders hit broken
                        routes, patch the map, and keep moving.
                    </p>

                    {/* Big buttons */}
                    <div className="nf-actions mt-11 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/"
                            className="group inline-flex min-h-16 items-center justify-center gap-3 rounded-3xl bg-orange-500 px-8 py-5 text-base font-black text-black shadow-[0_0_45px_rgba(249,115,22,0.28)] transition hover:-translate-y-1 hover:bg-orange-400 hover:shadow-[0_0_70px_rgba(249,115,22,0.45)]"
                        >
                            <Home className="h-5 w-5 transition group-hover:-translate-y-0.5" />
                            Return Home
                        </Link>

                        <Link
                            href="/explore"
                            className="group inline-flex min-h-16 items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-8 py-5 text-base font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:border-orange-400/40 hover:bg-orange-500/10"
                        >
                            <Compass className="h-5 w-5 transition group-hover:rotate-12" />
                            Explore Builds
                        </Link>
                    </div>

                    {/* Large secondary cards */}
                    <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
                        <Link
                            href="/dashboard"
                            className="nf-mini-card group rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-orange-400/40 hover:bg-orange-500/10"
                        >
                            <ArrowLeft className="mb-4 h-7 w-7 text-orange-300 transition group-hover:-translate-x-1" />
                            <p className="font-black text-white">Dashboard</p>
                            <p className="mt-1 text-sm text-zinc-500">
                                back to base
                            </p>
                        </Link>

                        <Link
                            href="/live_project"
                            className="nf-mini-card group rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-orange-400/40 hover:bg-orange-500/10"
                        >
                            <Rocket className="mb-4 h-7 w-7 text-orange-300 transition group-hover:-translate-y-1" />
                            <p className="font-black text-white">Live Projects</p>
                            <p className="mt-1 text-sm text-zinc-500">
                                ship logs
                            </p>
                        </Link>

                        <Link
                            href="/bookmarks"
                            className="nf-mini-card group rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-orange-400/40 hover:bg-orange-500/10"
                        >
                            <Search className="mb-4 h-7 w-7 text-orange-300 transition group-hover:scale-110" />
                            <p className="font-black text-white">Bookmarks</p>
                            <p className="mt-1 text-sm text-zinc-500">
                                saved builds
                            </p>
                        </Link>
                    </div>
                </div>

                {/* Right visual */}
                <div className="nf-visual relative">
                    <div className="absolute -inset-6 rounded-[3rem] bg-linear-to-br from-orange-500/25 via-transparent to-red-500/25 blur-2xl" />

                    <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                        <div className="absolute inset-0 bg-linear-to-br from-white/[0.07] via-transparent to-orange-500/8" />

                        <div className="relative">
                            {/* Window top */}
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                                    <span className="h-3.5 w-3.5 rounded-full bg-yellow-500" />
                                    <span className="h-3.5 w-3.5 rounded-full bg-green-500" />
                                </div>

                                <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-bold text-zinc-400">
                                    route-rescue.tsx
                                </div>
                            </div>

                            {/* Orbit graphic */}
                            <div className="relative mx-auto mb-10 flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
                                <div
                                    ref={orbitOneRef}
                                    className="absolute inset-0 rounded-full border border-dashed border-orange-400/35"
                                />

                                <div
                                    ref={orbitTwoRef}
                                    className="absolute inset-9 rounded-full border border-dashed border-red-400/25"
                                />

                                <div className="absolute h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />

                                <div className="absolute left-7 top-12 rounded-2xl border border-white/10 bg-black/60 p-3 shadow-xl backdrop-blur-xl">
                                    <Zap className="h-6 w-6 text-orange-300" />
                                </div>

                                <div className="absolute bottom-12 right-7 rounded-2xl border border-white/10 bg-black/60 p-3 shadow-xl backdrop-blur-xl">
                                    <Sparkles className="h-6 w-6 text-orange-300" />
                                </div>

                                <div
                                    ref={coreRef}
                                    className="relative flex h-40 w-40 items-center justify-center rounded-[2.5rem] border border-orange-400/30 bg-black/65 shadow-[0_0_90px_rgba(249,115,22,0.34)] backdrop-blur-xl"
                                >
                                    <Ghost className="h-20 w-20 text-orange-300" />

                                    <div className="absolute -bottom-5 rounded-full border border-orange-400/30 bg-orange-500 px-5 py-2 text-sm font-black text-black shadow-[0_0_35px_rgba(249,115,22,0.45)]">
                                        404
                                    </div>
                                </div>
                            </div>

                            {/* Terminal */}
                            <div className="space-y-3 rounded-3xl border border-white/10 bg-black/45 p-5 font-mono text-sm">
                                <div className="nf-terminal flex items-center gap-3 text-zinc-500">
                                    <Terminal className="h-4 w-4 text-orange-300" />
                                    <span>$ codegram routes.inspect</span>
                                </div>

                                {debugLines.map((line) => (
                                    <div
                                        key={line.key}
                                        className="nf-terminal nf-pulse-line flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/3 px-4 py-3"
                                    >
                                        <span className="text-zinc-500">
                                            {line.label}
                                        </span>
                                        <span className={line.color}>
                                            {line.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom stats */}
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="nf-panel rounded-3xl border border-white/10 bg-white/4 p-5">
                                    <Code2 className="mb-4 h-7 w-7 text-orange-300" />
                                    <p className="text-3xl font-black text-white">
                                        0
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        pages found here
                                    </p>
                                </div>

                                <div className="nf-panel rounded-3xl border border-orange-500/20 bg-orange-500/10 p-5">
                                    <Rocket className="mb-4 h-7 w-7 text-orange-300" />
                                    <p className="text-3xl font-black text-orange-300">
                                        ∞
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        things left to build
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}