"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
    Activity,
    Code2,
    GitBranch,
    Loader2,
    Rocket,
    Sparkles,
    Terminal,
    Zap,
} from "lucide-react";

const bootLines = [
    "initializing route engine...",
    "hydrating builder timeline...",
    "syncing project signals...",
    "warming up Codegram...",
];

export default function CodegramLoadingScreen() {
    const rootRef = useRef<HTMLElement | null>(null);
    const heroRef = useRef<HTMLDivElement | null>(null);
    const orbRef = useRef<HTMLDivElement | null>(null);
    const ringOneRef = useRef<HTMLDivElement | null>(null);
    const ringTwoRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const chipsRef = useRef<HTMLDivElement | null>(null);
    const lineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(
                [
                    ".cg-badge",
                    ".cg-title",
                    ".cg-copy",
                    ".cg-terminal",
                    ".cg-chip",
                    ".cg-status-card",
                ],
                {
                    opacity: 0,
                    y: 24,
                },
            );

            gsap.set(".cg-side-card", {
                opacity: 0,
                scale: 0.94,
                y: 28,
                rotateX: 8,
            });

            gsap.timeline({
                defaults: {
                    ease: "power3.out",
                    duration: 0.8,
                },
            })
                .to(".cg-badge", {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                })
                .to(
                    ".cg-title",
                    {
                        opacity: 1,
                        y: 0,
                    },
                    "-=0.25",
                )
                .to(
                    ".cg-copy",
                    {
                        opacity: 1,
                        y: 0,
                    },
                    "-=0.45",
                )
                .to(
                    ".cg-side-card",
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        rotateX: 0,
                    },
                    "-=0.55",
                )
                .to(
                    ".cg-terminal",
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                    },
                    "-=0.35",
                )
                .to(
                    ".cg-status-card",
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                    },
                    "-=0.4",
                )
                .to(
                    ".cg-chip",
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.07,
                    },
                    "-=0.45",
                );

            gsap.to(orbRef.current, {
                y: -14,
                scale: 1.04,
                duration: 1.7,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });

            gsap.to(ringOneRef.current, {
                rotate: 360,
                duration: 8,
                ease: "none",
                repeat: -1,
            });

            gsap.to(ringTwoRef.current, {
                rotate: -360,
                duration: 12,
                ease: "none",
                repeat: -1,
            });

            gsap.to(".cg-float", {
                y: -10,
                duration: 1.8,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                stagger: {
                    each: 0.2,
                    from: "random",
                },
            });

            gsap.to(lineRef.current, {
                xPercent: 130,
                duration: 1.35,
                ease: "power2.inOut",
                repeat: -1,
                repeatDelay: 0.25,
            });

            gsap.to(".cg-code-line", {
                opacity: 0.35,
                duration: 0.7,
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(249,115,22,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(239,68,68,0.12),transparent_34%),radial-gradient(circle_at_15%_75%,rgba(245,158,11,0.10),transparent_32%)]" />
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-brom-orange-500/10 to-transparent" />

            {/* Moving scan line */}
            <div className="absolute left-0 right-0 top-0 h-px overflow-hidden bg-white/5">
                <div
                    ref={lineRef}
                    className="h-full w-1/2 -translate-x-full bg-linear-to-r from-transparent via-orange-400 to-transparent"
                />
            </div>

            {/* Floating blobs */}
            <div className="cg-float absolute left-[8%] top-[16%] h-24 w-24 rounded-full border border-orange-500/20 bg-orange-500/5 blur-sm" />
            <div className="cg-float absolute right-[10%] top-[18%] h-16 w-16 rounded-3xl border border-white/10 bg-white/3 rotate-12" />
            <div className="cg-float absolute bottom-[14%] left-[14%] h-20 w-20 rounded-3xl border border-orange-500/20 bg-orange-500/5 -rotate-12" />

            <section
                ref={heroRef}
                className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_520px] lg:px-10"
            >
                {/* Left */}
                <div>
                    <div className="cg-badge mb-7 inline-flex items-center gap-3 rounded-full border border-orange-400/25 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-100 shadow-[0_0_50px_rgba(249,115,22,0.18)] backdrop-blur-xl">
                        <span className="relative flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-400" />
                        </span>
                        Codegram boot sequence running
                    </div>

                    <h1 className="cg-title max-w-4xl text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                        Loading the
                        <span className="block bg-linear-to-r from-orange-200 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            builder universe.
                        </span>
                    </h1>

                    <p className="cg-copy mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
                        Projects are compiling, routes are waking up, and the
                        timeline is getting ready to flex your work.
                    </p>

                    {/* Big non-congested status buttons/chips */}
                    <div
                        ref={chipsRef}
                        className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3"
                    >
                        <div className="cg-chip rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition hover:border-orange-400/40 hover:bg-orange-500/10">
                            <GitBranch className="mb-4 h-7 w-7 text-orange-300" />
                            <p className="text-base font-bold text-white">
                                Commits
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                                syncing
                            </p>
                        </div>

                        <div className="cg-chip rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition hover:border-orange-400/40 hover:bg-orange-500/10">
                            <Activity className="mb-4 h-7 w-7 text-orange-300" />
                            <p className="text-base font-bold text-white">
                                Feed
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                                hydrating
                            </p>
                        </div>

                        <div className="cg-chip rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition hover:border-orange-400/40 hover:bg-orange-500/10">
                            <Rocket className="mb-4 h-7 w-7 text-orange-300" />
                            <p className="text-base font-bold text-white">
                                Launch
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                                almost ready
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right cinematic card */}
                <div ref={cardRef} className="cg-side-card perspective-1000 relative">
                    <div className="absolute -inset-5 rounded-[2.5rem] bg-linear-to-br from-orange-500/25 via-transparent to-red-500/25 blur-2xl" />

                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                        <div className="absolute inset-0 bg-linear-to-br from-white/6 via-transparent to-orange-500/8" />

                        <div className="relative">
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                                    <span className="h-3.5 w-3.5 rounded-full bg-yellow-500" />
                                    <span className="h-3.5 w-3.5 rounded-full bg-green-500" />
                                </div>

                                <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-zinc-400">
                                    codegram.loader.tsx
                                </div>
                            </div>

                            {/* Orb */}
                            <div className="relative mx-auto mb-10 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
                                <div
                                    ref={ringOneRef}
                                    className="absolute inset-0 rounded-full border border-dashed border-orange-400/35"
                                />
                                <div
                                    ref={ringTwoRef}
                                    className="absolute inset-8 rounded-full border border-dashed border-red-400/25"
                                />

                                <div className="absolute h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

                                <div
                                    ref={orbRef}
                                    className="relative flex h-36 w-36 items-center justify-center rounded-[2.2rem] border border-orange-400/30 bg-black/60 shadow-[0_0_80px_rgba(249,115,22,0.32)] backdrop-blur-xl"
                                >
                                    <Code2 className="h-16 w-16 text-orange-300" />

                                    <div className="absolute -right-4 -top-4 rounded-2xl border border-white/10 bg-zinc-950 p-3 shadow-xl">
                                        <Zap className="h-6 w-6 text-orange-300" />
                                    </div>

                                    <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/10 bg-zinc-950 p-3 shadow-xl">
                                        <Sparkles className="h-6 w-6 text-orange-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Terminal */}
                            <div className="space-y-3 rounded-3xl border border-white/10 bg-black/45 p-5 font-mono text-sm">
                                <div className="cg-terminal flex items-center gap-3 text-zinc-500">
                                    <Terminal className="h-4 w-4 text-orange-300" />
                                    <span>$ pnpm codegram:start</span>
                                </div>

                                {bootLines.map((line) => (
                                    <div
                                        key={line}
                                        className="cg-terminal cg-code-line flex items-center gap-3 text-zinc-300"
                                    >
                                        <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                                        <span>{line}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="cg-status-card rounded-3xl border border-white/10 bg-white/4 p-5">
                                    <p className="text-3xl font-black text-white">
                                        99%
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        route energy
                                    </p>
                                </div>

                                <div className="cg-status-card rounded-3xl border border-orange-500/20 bg-orange-500/10 p-5">
                                    <p className="text-3xl font-black text-orange-300">
                                        live
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        builder mode
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