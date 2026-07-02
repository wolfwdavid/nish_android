import Link from "next/link";

export const metadata = {
    title: "Data Deletion Instructions | Devmaniac",
    description:
        "Instructions for deleting your Devmaniac account data and third-party login data.",
};

export default function DataDeletionPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
                <div className="rounded-3xl border border-white/10 bg-white/3 p-8 shadow-2xl shadow-orange-500/10 md:p-10">
                    <div className="mb-8">
                        <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
                            Devmaniac
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                            Data Deletion Instructions
                        </h1>

                        <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
                            This page explains how users can request deletion of
                            their Devmaniac account data, including data
                            connected through third-party login providers such as
                            Facebook, Google, or GitHub.
                        </p>
                    </div>

                    <div className="space-y-8 text-zinc-300">
                        <section>
                            <h2 className="mb-3 text-xl font-semibold text-white">
                                How to request data deletion
                            </h2>

                            <p className="leading-7">
                                To request deletion of your data from Devmaniac,
                                please send an email to:
                            </p>

                            <a
                                href="mailto:support@devmaniac.com"
                                className="mt-3 inline-flex rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 font-medium text-orange-300 transition hover:bg-orange-500/20"
                            >
                                support@devmaniac.com
                            </a>

                            <p className="mt-4 leading-7">
                                In your email, include the email address linked
                                to your Devmaniac account and mention that you
                                want your account data deleted.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-semibold text-white">
                                What data will be deleted
                            </h2>

                            <ul className="list-inside list-disc space-y-2 leading-7">
                                <li>Your Devmaniac user profile</li>
                                <li>Your saved account information</li>
                                <li>Your linked third-party login information</li>
                                <li>Your projects, posts, comments, and activity data where applicable</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-semibold text-white">
                                Processing time
                            </h2>

                            <p className="leading-7">
                                Data deletion requests are usually processed
                                within 7 business days. Once your request is
                                completed, your account data will no longer be
                                available in Devmaniac.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-semibold text-white">
                                Contact
                            </h2>

                            <p className="leading-7">
                                For any privacy or account-related questions,
                                contact us at{" "}
                                <a
                                    href="mailto:support@devmaniac.com"
                                    className="text-orange-300 underline underline-offset-4 hover:text-orange-200"
                                >
                                    support@devmaniac.com
                                </a>
                                .
                            </p>
                        </section>
                    </div>

                    <div className="mt-10 border-t border-white/10 pt-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-zinc-400 transition hover:text-orange-300"
                        >
                            ← Back to Devmaniac
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}