// app/privacy/page.tsx
//
// DevManiac — Privacy Policy
// ---------------------------------------------------------------------------
// Server component. Static legal content, so no "use client" needed.
// Matches the Terms page: same fonts, stone + burnt-orange system, TOC, helpers.
//
// Fonts (set in your layout.tsx via next/font):
//   --font-instrument-serif   (display / headings)
//   --font-jetbrains-mono     (mono labels / eyebrows)
//   body text inherits your global Geist sans.
//
// ⚠️  LEGAL: tailored starting draft, NOT legal advice. Replace every
// [BRACKETED] placeholder and have it reviewed before launch. A privacy policy
// must accurately describe what you ACTUALLY collect — keep this in sync with
// your real data flows (Clerk, Postgres, analytics, OAuth imports).
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const LAST_UPDATED = "May 28, 2026";
const ENTITY = "[DevManiac / Your Legal Entity Name]";
const CONTACT_EMAIL = "[privacy@DevManiac.dev]";
const GOVERNING_STATE = "the State of New York, USA";

export const metadata: Metadata = {
  title: "Privacy Policy · DevManiac",
  description:
    "How DevManiac collects, uses, shares, and protects your information.",
};

type Section = {
  id: string;
  title: string;
  body: ReactNode;
};

const sections: Section[] = [
  {
    id: "intro",
    title: "1. Introduction",
    body: (
      <>
        <P>
          This Privacy Policy explains how {ENTITY} (&ldquo;DevManiac,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses,
          shares, and protects your information when you use the DevManiac website,
          applications, and services (the &ldquo;Service&rdquo;).
        </P>
        <P>
          It works alongside our <A href="/terms">Terms of Service</A>. By using the
          Service, you agree to the practices described here.
        </P>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "2. Information We Collect",
    body: (
      <>
        <P>
          <Strong>Information you provide.</Strong> Account details (such as name,
          email, and username), profile information (bio, links, avatar), and any
          content you submit — code, repositories, commits and build history,
          project pages, comments, and support requests.
        </P>
        <P>
          <Strong>Information from authentication.</Strong> We use Clerk to
          authenticate accounts. When you sign up or log in — including via
          third-party providers such as GitHub or Google — we receive identifiers and
          basic profile data from Clerk and those providers as permitted by your
          settings with them.
        </P>
        <P>
          <Strong>Information you import.</Strong> If you connect an external account
          to import repositories or build history, we collect the data you authorize
          that integration to share.
        </P>
        <P>
          <Strong>Information collected automatically.</Strong> Log and usage data
          such as IP address, device and browser type, pages viewed, referring
          pages, and timestamps, collected through cookies and similar technologies.
        </P>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Information",
    body: (
      <>
        <P>We use information to:</P>
        <List>
          <LI>Provide, maintain, and improve the Service.</LI>
          <LI>Create and secure your account and authenticate logins.</LI>
          <LI>
            Display your public profile and build history according to your
            visibility settings.
          </LI>
          <LI>Communicate with you about updates, security, and support.</LI>
          <LI>
            Monitor for abuse, fraud, and policy violations, and to enforce our
            Terms.
          </LI>
          <LI>Analyze usage to understand and improve performance and features.</LI>
          <LI>Comply with legal obligations.</LI>
        </List>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "4. Legal Bases (EEA/UK Users)",
    body: (
      <>
        <P>
          If you are in the European Economic Area or the UK, we process your data
          on these legal bases:
        </P>
        <List>
          <LI>
            <Strong>Contract</Strong> — to provide the Service you request.
          </LI>
          <LI>
            <Strong>Legitimate interests</Strong> — to secure, improve, and promote
            the Service, balanced against your rights.
          </LI>
          <LI>
            <Strong>Consent</Strong> — where required, such as for certain cookies or
            marketing. You may withdraw consent at any time.
          </LI>
          <LI>
            <Strong>Legal obligation</Strong> — to comply with applicable law.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "how-we-share",
    title: "5. How We Share Information",
    body: (
      <>
        <P>We do not sell your personal information. We share it only as follows:</P>
        <List>
          <LI>
            <Strong>Public content.</Strong> Content and profile details you mark
            public are visible to other users and visitors per your settings.
          </LI>
          <LI>
            <Strong>Service providers.</Strong> Vendors who process data on our
            behalf — for example Clerk (authentication), our hosting and database
            providers, and analytics — under contractual confidentiality and
            security obligations.
          </LI>
          <LI>
            <Strong>Legal and safety.</Strong> When required by law, or to protect
            the rights, safety, and security of DevManiac, our users, or the public.
          </LI>
          <LI>
            <Strong>Business transfers.</Strong> In connection with a merger,
            acquisition, or sale of assets, subject to this Policy.
          </LI>
          <LI>
            <Strong>With your direction.</Strong> When you choose to connect or share
            with a third-party integration.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "cookies",
    title: "6. Cookies &amp; Tracking",
    body: (
      <P>
        We use cookies and similar technologies for essential functions (such as
        keeping you signed in via Clerk session cookies), to remember preferences,
        and to measure usage. You can control cookies through your browser settings;
        disabling some cookies may affect functionality. Where required, we will ask
        for your consent before setting non-essential cookies.
      </P>
    ),
  },
  {
    id: "retention",
    title: "7. Data Retention",
    body: (
      <P>
        We keep your information for as long as your account is active or as needed
        to provide the Service. After account deletion we delete or anonymize your
        personal information within a reasonable period, except where we must retain
        it to comply with legal obligations, resolve disputes, enforce our
        agreements, or maintain limited backups. Public content others have already
        copied or shared may persist outside our control.
      </P>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your Rights &amp; Choices",
    body: (
      <>
        <P>
          Depending on where you live, you may have rights to access, correct,
          delete, export, or restrict the processing of your personal information,
          and to object to certain processing. You can manage much of your data
          directly in your account settings, including exporting Your Content and
          deleting your account.
        </P>
        <P>
          <Strong>EEA/UK (GDPR)</Strong> and <Strong>California (CCPA/CPRA)</Strong>{" "}
          residents have additional rights, including the right to know what we
          collect, to request deletion, and to not be discriminated against for
          exercising those rights. To make a request, contact us at {CONTACT_EMAIL}.
          We will verify your identity before acting and respond within the time
          required by applicable law.
        </P>
      </>
    ),
  },
  {
    id: "security",
    title: "9. Security",
    body: (
      <P>
        We use technical and organizational measures designed to protect your
        information, including encryption in transit and access controls. No method
        of transmission or storage is completely secure, however, and we cannot
        guarantee absolute security. Please use a strong, unique password and keep
        your credentials confidential.
      </P>
    ),
  },
  {
    id: "transfers",
    title: "10. International Data Transfers",
    body: (
      <P>
        We are based in {GOVERNING_STATE} and may process and store information in
        the United States and other countries where we or our service providers
        operate. Where we transfer data internationally, we rely on appropriate
        safeguards, such as Standard Contractual Clauses, where required by law.
      </P>
    ),
  },
  {
    id: "children",
    title: "11. Children&rsquo;s Privacy",
    body: (
      <P>
        The Service is not directed to children under 13, and we do not knowingly
        collect personal information from them. If you believe a child under 13 has
        provided us information, contact us at {CONTACT_EMAIL} and we will take steps
        to delete it.
      </P>
    ),
  },
  {
    id: "third-party",
    title: "12. Third-Party Links &amp; Services",
    body: (
      <P>
        The Service may contain links to, or integrations with, third-party
        websites and services that we do not control. Their privacy practices are
        governed by their own policies, and we are not responsible for them. Review
        the privacy policies of any third party before sharing your information.
      </P>
    ),
  },
  {
    id: "changes",
    title: "13. Changes to This Policy",
    body: (
      <P>
        We may update this Privacy Policy from time to time. If we make material
        changes, we will provide reasonable notice — for example, by posting the
        updated policy with a new &ldquo;last updated&rdquo; date or by notifying you
        in-product. Your continued use of the Service after changes take effect
        constitutes acceptance of the updated Policy.
      </P>
    ),
  },
  {
    id: "contact",
    title: "14. Contact",
    body: (
      <P>
        For questions or privacy requests, contact us at{" "}
        <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
      </P>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen scroll-smooth bg-stone-950 text-stone-300 antialiased">
      {/* Header */}
      <header className="border-b border-stone-800/80">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <Link
            href="/"
            className="font-(family-name:--font-jetbrains-mono) text-xs uppercase tracking-[0.2em] text-orange-500/90 transition-colors hover:text-orange-400"
          >
            ← DevManiac
          </Link>
          <h1 className="mt-6 font-(family-name:--font-instrument-serif) text-5xl leading-tight text-stone-50 sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-xl text-stone-400">
            How DevManiac collects, uses, shares, and protects your information.
          </p>
          <p className="mt-6 font-(family-name:--font-jetbrains-mono) text-xs uppercase tracking-[0.15em] text-stone-500">
            Last updated · {LAST_UPDATED}
          </p>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
        {/* Table of contents */}
        <nav aria-label="Table of contents" className="mb-12 lg:mb-0">
          <div className="lg:sticky lg:top-12">
            <p className="font-(family-name:--font-jetbrains-mono) text-[0.7rem] uppercase tracking-[0.2em] text-stone-500">
              On this page
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-stone-400 transition-colors hover:text-orange-400"
                    dangerouslySetInnerHTML={{ __html: s.title }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Sections */}
        <article className="max-w-2xl">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-14 scroll-mt-12">
              <h2
                className="mb-5 font-(family-name:--font-instrument-serif) text-3xl text-stone-50"
                dangerouslySetInnerHTML={{ __html: s.title }}
              />
              <div className="space-y-4 leading-relaxed text-stone-300">
                {s.body}
              </div>
            </section>
          ))}

          {/* Footer note */}
          <footer className="mt-16 rounded-lg border border-stone-800 bg-stone-900/50 p-6">
            <p className="font-(family-name:--font-jetbrains-mono) text-[0.7rem] uppercase tracking-[0.18em] text-orange-500/80">
              Notice
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              This document is a tailored starting draft and is not legal advice.
              Keep it accurate to what you actually collect, replace all bracketed
              placeholders, and have a qualified attorney review it before launch.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}

/* ----------------------------- prose helpers ----------------------------- */

function P({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={className}>{children}</p>;
}

function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-stone-100">{children}</strong>;
}

function List({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5 pl-1">{children}</ul>;
}

function LI({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-5 text-stone-300">
      <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-orange-500/80" />
      {children}
    </li>
  );
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-orange-400 underline decoration-orange-400/40 underline-offset-2 transition-colors hover:decoration-orange-400"
    >
      {children}
    </Link>
  );
}