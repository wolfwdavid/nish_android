import type { MetadataRoute } from "next"

const baseUrl = "https://devmaniac.com"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin",
                "/settings",
                "/sync",
                "/sign-in",
                "/sign-up",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}