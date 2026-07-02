import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://devmaniac.com"),

    title: {
        default: "DevManiac — Build in Public for Developers",
        template: "%s | DevManiac",
    },

    description:
        "DevManiac is a developer platform to showcase projects, document live builds, track progress, and build in public.",

    keywords: [
        "DevManiac",
        "developer portfolio",
        "build in public",
        "project showcase",
        "full stack projects",
        "developer tools",
        "software engineering portfolio",
        "Next.js projects",
        "FastAPI projects",
    ],

    authors: [
        {
            name: "DevManiac",
            url: "https://devmaniac.com",
        },
    ],

    creator: "DevManiac",
    publisher: "DevManiac",

    openGraph: {
        title: "DevManiac — Build in Public for Developers",
        description:
            "Showcase completed projects, document live builds, and build your developer reputation publicly.",
        url: "https://devmaniac.com",
        siteName: "DevManiac",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "DevManiac — Build in Public for Developers",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "DevManiac — Build in Public for Developers",
        description:
            "Showcase projects, document live builds, and build your developer reputation publicly.",
        images: ["/og-image.png"],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    icons: {
        icon: "/icon.jpg",
        apple: "/icon.jpg",
    },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-(--bg-base) text-(--text-primary) antialiased">
    <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-C5EWZN8SPP"
        strategy="afterInteractive"
    />

    <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C5EWZN8SPP');
        `}
    </Script>
        <ClerkProvider>
          {children}

        </ClerkProvider>
      </body>
    </html>
  );
}