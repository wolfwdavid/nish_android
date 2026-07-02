"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Play,
  ArrowRight,
  Flame,
  CheckCircle2,
  BarChart3,
  Users,
  Target,
  Trophy,
  Code2,
  GitBranch,
  Terminal,
  BookOpen,
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import main_logo from "@/public/main_logo.jpg";
import dashboardPreview from "@/public/new_dashboard.png";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const features = [
  {
    title: "Live project journal",
    desc: "Log every build session. What you built, what broke, and what you learned.",
    icon: Flame,
    color: "#E8560A",
  },
  {
    title: "Live → Done pipeline",
    desc: "Turn messy build logs into clean portfolio proof automatically.",
    icon: CheckCircle2,
    color: "#16A34A",
  },
  {
    title: "Real stack identity",
    desc: "Your profile evolves from actual shipped work — not fake badges.",
    icon: BarChart3,
    color: "#3B82F6",
  },
  {
    title: "Build-in-public feed",
    desc: "Follow launches, debugging stories, milestones, and shipped work.",
    icon: Users,
    color: "#7C3AED",
  },
  {
    title: "Missions",
    desc: "Public accountability goals that force consistency and momentum.",
    icon: Target,
    color: "#EAB308",
  },
  {
    title: "Build streak",
    desc: "Track visible momentum over time and stay shipping.",
    icon: Trophy,
    color: "#14B8A6",
  },
];

const steps = [
  {
    number: "1",
    title: "Start a live project",
    desc: "Name your project, connect a repo, and define your mission.",
  },
  {
    number: "2",
    title: "Log every session",
    desc: "Post what changed, what shipped, and what broke.",
  },
  {
    number: "3",
    title: "Build your audience",
    desc: "Developers follow your journey and growth.",
  },
  {
    number: "4",
    title: "Ship and own it",
    desc: "Your build history becomes permanent portfolio proof.",
  },
];

const testimonials = [
  {
    quote:
      "I shipped more in 3 months of building in public than in the previous year of silent coding. The accountability is real.",
    name: "Marcus R.",
    role: "Backend Engineer",
    stack: "Python · FastAPI",
    initials: "MR",
    bg: "#7C3AED",
  },
  {
    quote:
      "The live project journal turned my messy build notes into an actual portfolio piece. I linked it in my resume and got the interview.",
    name: "Sara K.",
    role: "Full-stack Dev",
    stack: "Next.js · Go",
    initials: "SK",
    bg: "#1D4ED8",
  },
  {
    quote:
      "My DevManiac profile shows 8 shipped projects with exact stacks. No recruiter asks me to prove my skills anymore — they can just see it.",
    name: "Jake T.",
    role: "Self-taught Dev",
    stack: "Rust · Svelte",
    initials: "JT",
    bg: "#E8560A",
  },
];

const stats = [
  { num: "20+", label: "active builders" },
  { num: "10+", label: "projects created" },
  { num: "10+", label: "build logs posted" },
  { num: "73%", label: "avg completion rate" },
];

const avatars = [
  { i: "NS", bg: "#E8560A" },
  { i: "JR", bg: "#3B82F6" },
  { i: "MO", bg: "#16A34A" },
  { i: "AK", bg: "#7C3AED" },
];


export default function Page() {
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* Hero intro */
      gsap.from(".nav-item", {
        y: -12,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
      });

      gsap.from(".hero-reveal", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });

      gsap.from(".dashboard-window", {
        y: 60,
        opacity: 0,
        scale: 0.96,
        rotateX: 5,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.55,
      });

      /* Floating dashboard */
      gsap.to(".dashboard-window", {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* Coding badge pulse */
      gsap.to(".live-pulse", {
        scale: 1.4,
        opacity: 0.35,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* Section reveal */
      gsap.utils.toArray<HTMLElement>(".section-reveal").forEach((section) => {
        gsap.from(section, {
          y: 45,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
          },
        });
      });

      /* Cards reveal */
      gsap.utils.toArray<HTMLElement>(".card-reveal").forEach((card, index) => {
        gsap.from(card, {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          delay: (index % 3) * 0.07,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
        });
      });

      /* Code particles */
      gsap.to(".code-chip", {
        y: -8,
        opacity: 0.75,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.25,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#050505] text-white antialiased"
    >
      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}

      <section className="relative overflow-hidden border-b border-white/5">
        {/* Ambient grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(circle at top, black 0%, transparent 62%)",
          }}
        />

        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute left-1/2 top-0 h-190 w-190 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#E8560A]/10 blur-[150px]" />
          <div className="absolute left-[15%] top-[22%] h-65 w-65 rounded-full bg-[#E8560A]/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
          {/* Navbar */}
          <nav className="flex h-16 items-center justify-between">
            <div className="nav-item flex items-center gap-10">
              <Link href="/" className="shrink-0">
                <Image
                  src={main_logo}
                  alt="DevManiac"
                  width={180}
                  height={48}
                  priority
                  className="h-10 w-auto object-contain"
                />
              </Link>

              <div className="hidden items-center gap-8 md:flex">
                {["Features", "Explore", "Community"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="nav-item flex items-center gap-3">
              <Link
                href="/sign-in"
                className="hidden rounded-xl border border-white/10 bg-white/3 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.07] md:block"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="rounded-xl bg-[#E8560A] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(232,86,10,0.24)] transition hover:bg-[#ff6a1a]"
              >
                Get started free
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div className="flex flex-col items-center pb-16 pt-20 text-center md:pb-20 md:pt-28">
            <div className="hero-reveal mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs text-zinc-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-[#E8560A]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E8560A]" />
              </span>
              Now in public beta — join 1,200+ builders
            </div>

            <div className="hero-reveal mb-5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-zinc-500">
              <Terminal size={14} className="text-[#E8560A]" />
              <span className="font-mono">git commit -m "ship publicly"</span>
            </div>

            <h1 className="hero-reveal max-w-4xl text-center text-5xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-[82px]">
              GitHub tracks your code.
              <br />
              Twitter tracks your takes.
              <br />
              <span className="text-[#E8560A]">
                DevManiac tracks your journey.
              </span>
            </h1>

            <p className="hero-reveal mt-8 max-w-xl text-center text-[17px] leading-8 text-zinc-400">
              The platform for developers who build in public. Document every
              session, auto-build your portfolio, and prove your skills with
              real shipped work.
            </p>

            <div className="hero-reveal mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E8560A] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_42px_rgba(232,86,10,0.24)] transition hover:-translate-y-0.5 hover:bg-[#ff6a1a]"
              >
                <Play size={16} />
                Start building free
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
              >
                See how it works
              </a>
              <a
                href="https://docs.devmaniac.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E8560A]/30 bg-[#E8560A]/10 px-6 py-3 text-sm font-semibold text-[#ff8a3d] transition hover:-translate-y-0.5 hover:border-[#E8560A]/50 hover:bg-[#E8560A]/15"
              >
                <BookOpen size={16} />
                Visit docs
              </a>
            </div>

            <div className="hero-reveal mt-10 flex flex-wrap items-center justify-center gap-4">
              <div className="flex">
                {avatars.map(({ i, bg }, idx) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#050505] text-xs font-bold text-white"
                    style={{
                      backgroundColor: bg,
                      marginLeft: idx === 0 ? 0 : -10,
                    }}
                  >
                    {i}
                  </div>
                ))}
              </div>

              <p className="text-sm text-zinc-500">
                Joined by{" "}
                <span className="font-medium text-zinc-300">
                  20+ developers
                </span>{" "}
                building in public this week
              </p>
            </div>
          </div>

          {/* Dashboard screenshot */}
          <div className="flex justify-center pb-24">
            <div className="dashboard-window relative w-full max-w-275 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c] shadow-[0_40px_140px_rgba(0,0,0,0.88)]">
              <div className="pointer-events-none absolute inset-0 z-0 bg-[#E8560A]/[0.035] blur-[120px]" />

              {/* Mac top bar */}
              <div className="relative z-20 flex h-12 items-center gap-2.5 border-b border-white/5 bg-[#101014] px-5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />

                <div className="ml-4 flex h-7 items-center rounded-md border border-white/5 bg-black/35 px-4 font-mono text-xs text-zinc-600">
                  DevManiac.dev/feed
                </div>

                <div className="ml-auto hidden items-center gap-2 text-xs text-zinc-600 md:flex">
                  <GitBranch size={13} />
                  <span>main</span>
                </div>
              </div>

              {/* dashboard */}
              <div className="relative z-10">
                <Image
                  src={dashboardPreview}
                  alt="DevManiac dashboard"
                  priority
                  className="h-auto w-full object-cover brightness-[1.04]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════ */}

      <section
        id="features"
        className="section-reveal border-b border-white/5 py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8560A]">
              Everything you need
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Built for developers who ship
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Every feature exists to turn your daily building into something
              visible, valuable, and provable.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ title, desc, icon: Icon, color }) => (
              <div
                key={title}
                className="card-reveal group rounded-[28px] border border-white/10 bg-[#0d0d0f] p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#121214]"
              >
                <div
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/4"
                  style={{ color }}
                >
                  <Icon size={22} />
                </div>

                <h3 className="text-xl font-bold tracking-[-0.02em] text-white">
                  {title}
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-zinc-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}

      <section
        id="how-it-works"
        className="section-reveal border-b border-white/5 bg-[#080809] py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8560A]">
              How it works
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              From idea to portfolio artifact
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Four steps. No friction. Your journey documents itself.
            </p>
          </div>

          <div className="mt-20 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ number, title, desc }, i) => (
              <div key={number} className="card-reveal">
                <div
                  className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold"
                  style={{
                    backgroundColor:
                      i === 0 ? "#E8560A" : "rgba(255,255,255,0.03)",
                    borderColor:
                      i === 0 ? "#E8560A" : "rgba(255,255,255,0.10)",
                    color: i === 0 ? "#fff" : "#a1a1aa",
                  }}
                >
                  {number}
                </div>

                <h3 className="text-lg font-bold text-white">{title}</h3>

                <p className="mt-3 leading-7 text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}

      <section
        id="community"
        className="section-reveal border-b border-white/5 py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8560A]">
              From the community
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Builders who ship in public
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map(
              ({ quote, name, role, stack, initials, bg }) => (
                <div
                  key={name}
                  className="card-reveal flex flex-col rounded-[28px] border border-white/10 bg-[#0d0d0f] p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <p className="mb-8 flex-1 text-[15px] leading-7 text-zinc-300">
                    &ldquo;{quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: bg }}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{name}</p>
                      <p className="text-xs text-zinc-500">{role}</p>
                    </div>

                    <span className="shrink-0 text-[11px] font-medium text-[#E8560A]">
                      {stack}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS
      ═══════════════════════════════════════ */}

      <section className="section-reveal border-b border-white/5 bg-[#080809] py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {stats.map(({ num, label }) => (
              <div key={label} className="card-reveal">
                <p className="text-4xl font-black tracking-tight text-[#E8560A]">
                  {num}
                </p>
                <p className="mt-2 text-sm text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}

      <section className="section-reveal relative overflow-hidden py-28 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8560A]/10 blur-[140px]" />

        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
          <h2 className="mx-auto max-w-4xl text-5xl font-black leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-[78px]">
            Stop building in the dark.
            <br />
            <span className="text-[#E8560A]">
              Ship where people can see.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-zinc-400">
            Free forever. No credit card. Start your first live project today.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#E8560A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#ff6a1a]"
            >
              <Play size={16} />
              Start building free
            </Link>

            <Link
              href="/explore"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
            >
              Explore the feed
              <ArrowRight size={16} />
            </Link>
          </div>

          <p className="mt-6 text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#E8560A] transition-colors hover:text-[#ff6a1a]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}

      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-zinc-500 md:flex-row lg:px-8">
          <Image
            src={main_logo}
            alt="DevManiac"
            width={150}
            height={40}
            className="h-8 w-auto object-contain opacity-90"
          />

          <div className="flex flex-wrap items-center justify-center gap-6">
            {["Features", "Explore", "Privacy", "Terms"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          <p>2026 DevManiac. Built in public.</p>
        </div>
      </footer>
    </main>
  );
}