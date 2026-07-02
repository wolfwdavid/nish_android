"use client";

import { Sparkles } from "lucide-react";

import RevealWrapper from "../animations/RevealWrapper";
import JournalEntryCard from "./JournalEntryCard";

import type {
    GetLiveProjectJournal,
} from "@/app/lib/type/liveproject";

interface JournalTimelineProps {
    journals: GetLiveProjectJournal[];
}

export default function JournalTimeline({
    journals,
}: JournalTimelineProps) {
    if (!journals.length) {
        return (
            <div className="rounded-3xl border border-white/10 bg-white/3 p-6 text-sm text-zinc-400">
                No journal logs yet. Start shipping and write the first one.
            </div>
        );
    }

    return (
        <div className="relative flex flex-col gap-8">
            {/* TIMELINE LINE */}

            <div
                className="
                    absolute
                    left-6
                    top-0
                    hidden
                    h-full
                    w-0.5
                    bg-linear-to-b
                    from-orange-500/40
                    via-orange-500/10
                    to-transparent
                    md:block
                "
            />

            {journals.map((journal, index) => (
                <RevealWrapper
                    key={journal.id}
                    delay={index * 0.04}
                >
                    <div className="relative flex gap-6">
                        {/* NODE */}

                        <div
                            className="
                                relative
                                z-10
                                hidden
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                text-orange-300
                                shadow-[0_0_30px_rgba(249,115,22,0.25)]
                                backdrop-blur-xl
                                md:flex
                            "
                        >
                            <div
                                className="
                                    absolute
                                    inset-0
                                    animate-ping
                                    rounded-full
                                    bg-orange-500/10
                                "
                            />

                            <Sparkles
                                size={18}
                                className="relative z-10"
                            />
                        </div>

                        {/* CARD */}

                        <div className="min-w-0 flex-1">
                            <JournalEntryCard journal={journal} />
                        </div>
                    </div>
                </RevealWrapper>
            ))}
        </div>
    );
}