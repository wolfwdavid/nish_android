"use client";

import Link from "next/link";

import {
    AlertTriangle,
    CheckCircle2,
    Info,
    Megaphone,
    ShieldAlert,
    Wrench,
    X,
} from "lucide-react";

type AppNotice = {
    id: string;
    title: string;
    message: string;
    notice_type: string;
    cta_label: string | null;
    cta_href: string | null;
    show_once: boolean;
};

type Props = {
    notice: AppNotice;
    onClose: () => void;
};

function getNoticeMeta(type: string) {
    if (type === "warning") {
        return {
            icon: AlertTriangle,
            label: "Important notice",
            color: "text-yellow-300",
            box: "border-yellow-500/20 bg-yellow-500/10",
        };
    }

    if (type === "danger") {
        return {
            icon: ShieldAlert,
            label: "Critical notice",
            color: "text-red-300",
            box: "border-red-500/20 bg-red-500/10",
        };
    }

    if (type === "maintenance") {
        return {
            icon: Wrench,
            label: "Maintenance",
            color: "text-orange-300",
            box: "border-orange-500/20 bg-orange-500/10",
        };
    }

    if (type === "success") {
        return {
            icon: CheckCircle2,
            label: "Resolved",
            color: "text-emerald-300",
            box: "border-emerald-500/20 bg-emerald-500/10",
        };
    }

    if (type === "update") {
        return {
            icon: Megaphone,
            label: "Product update",
            color: "text-orange-300",
            box: "border-orange-500/20 bg-orange-500/10",
        };
    }

    return {
        icon: Info,
        label: "Notice",
        color: "text-sky-300",
        box: "border-sky-500/20 bg-sky-500/10",
    };
}

export default function AppNoticePopup({
    notice,
    onClose,
}: Props) {
    const meta = getNoticeMeta(notice.notice_type);

    const Icon = meta.icon;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 px-4 backdrop-blur-xl">
            <div className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-white/10 bg-[#080808] p-6 shadow-2xl shadow-black">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/15 via-transparent to-red-500/10" />

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                >
                    <X size={18} />
                </button>

                <div className="relative">
                    <div
                        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${meta.box} ${meta.color}`}
                    >
                        <Icon size={26} />
                    </div>

                    <p
                        className={`text-xs font-bold uppercase tracking-[0.22em] ${meta.color}`}
                    >
                        {meta.label}
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">
                        {notice.title}
                    </h2>

                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-400">
                        {notice.message}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        {notice.cta_href && notice.cta_label && (
                            <Link
                                href={notice.cta_href}
                                onClick={onClose}
                                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-orange-500 text-sm font-black text-black transition hover:bg-orange-400"
                            >
                                {notice.cta_label}
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}