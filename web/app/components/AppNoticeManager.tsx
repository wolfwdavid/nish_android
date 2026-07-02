"use client";

import { useEffect, useState } from "react";

import api from "@/app/lib/api";

import AppNoticePopup from "./AppNoticePopup";

type AppNotice = {
    id: string;
    title: string;
    message: string;
    notice_type: string;
    cta_label: string | null;
    cta_href: string | null;
    show_once: boolean;
};

export default function AppNoticeManager() {
    const [notice, setNotice] = useState<AppNotice | null>(null);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await api.get<AppNotice | null>(
                    "/app-notices/active"
                );

                const activeNotice = res.data;

                if (!activeNotice) return;

                const seenKey = `devmaniac_seen_notice_${activeNotice.id}`;

                const alreadySeen =
                    localStorage.getItem(seenKey) === "true";

                if (activeNotice.show_once && alreadySeen) {
                    return;
                }

                setNotice(activeNotice);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotice();
    }, []);

    const handleClose = () => {
        if (notice) {
            localStorage.setItem(
                `devmaniac_seen_notice_${notice.id}`,
                "true"
            );
        }

        setNotice(null);
    };

    if (!notice) return null;

    return (
        <AppNoticePopup
            notice={notice}
            onClose={handleClose}
        />
    );
}