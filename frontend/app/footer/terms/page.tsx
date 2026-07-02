// app/terms/page.tsx
//
// DevManiac — Terms of Service
// ---------------------------------------------------------------------------
// Server component. Static legal content, so no "use client" needed.
//
// Fonts: this page assumes your next/font setup exposes these CSS variables
// on <html> / <body> (adjust the names below to match your layout.tsx):
//   --font-instrument-serif   (display / headings)
//   --font-jetbrains-mono     (mono labels / eyebrows)
//   body text inherits your global Geist sans — not overridden here.
//
// Color: uses Tailwind's `stone` (warm neutral, espresso-friendly) + `orange`
// as the burnt-orange accent. To bind it to your design tokens instead, swap
// `orange-500/600` for your primary token and `stone-*` for your surface scale.
//
// ⚠️  LEGAL: this is a strong, tailored starting draft — NOT legal advice.
// Replace every [BRACKETED] placeholder and have it reviewed before launch.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const LAST_UPDATED = "May 28, 2026";
const ENTITY = "[DevManiac / Your Legal Entity Name]";
const CONTACT_EMAIL = "[devmaniacsupport@gmail.com]"; // [TODO : add real email]
const DMCA_EMAIL = "[dmca@DevManiac.dev]";
const GOVERNING_STATE = "the State of New York, USA";
const VENUE = "the state and federal courts located in [New York County], New York";

export const metadata: Metadata = {
  title: "Terms of Service · DevManiac",
  description:
    "The terms that govern your use of DevManiac — the platform where your build history is your portfolio.",
};

type Section = {
  id: string;
  title: string;
  body: ReactNode;
};

const sections: Section[] = [
  {
    id: "agreement",
    title: "1. Agreement to These Terms",
    body: (
      <>
        <P>
          These Terms of Service (the &ldquo;Terms&rdquo;) form a binding agreement
          between you and {ENTITY} (&ldquo;DevManiac,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;) and govern your access to and use
          of the DevManiac website, applications, and services (together, the
          &ldquo;Service&rdquo;).
        </P>
        <P>
          By creating an account, accessing, or using the Service, you agree to be
          bound by these Terms and by our{" "}
          <A href="/privacy">Privacy Policy</A>, which is incorporated here by
          reference. If you do not agree, do not use the Service.
        </P>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    body: (
      <>
        <P>
          You must be at least 13 years old to use the Service. If you are under
          the age of majority in your jurisdiction, you may use the Service only
          with the involvement of a parent or legal guardian. By using the Service
          you represent that you meet these requirements and that you are not barred
          from using it under any applicable law.
        </P>
        <P>
          If you use the Service on behalf of an organization, you represent that
          you are authorized to bind that organization to these Terms.
        </P>
      </>
    ),
  },
  {
    id: "account",
    title: "3. Your Account",
    body: (
      <>
        <P>
          Account registration and authentication are handled through our identity
          provider, Clerk. You are responsible for safeguarding your credentials and
          for all activity that occurs under your account. You agree to provide
          accurate information and to keep it current.
        </P>
        <List>
          <LI>One account per person; do not share, sell, or transfer your account.</LI>
          <LI>
            Notify us immediately at {CONTACT_EMAIL} if you suspect unauthorized
            access.
          </LI>
          <LI>
            We are not liable for any loss arising from your failure to secure your
            account.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "your-content",
    title: "4. Your Content &amp; Ownership",
    body: (
      <>
        <P>
          &ldquo;Your Content&rdquo; means anything you submit to the Service —
          including code, repositories, commits and build history, project pages,
          profiles, comments, and other materials.
        </P>
        <P>
          <Strong>You own Your Content. We do not claim ownership of it.</Strong> To
          operate the Service, you grant us a worldwide, non-exclusive,
          royalty-free, sublicensable license to host, store, reproduce, modify (for
          technical purposes such as formatting and generating previews), publicly
          display, and distribute Your Content — <Strong>solely to the extent
          necessary to provide, secure, and promote the Service.</Strong>
        </P>
        <List>
          <LI>
            <Strong>Public content.</Strong> Content you mark public (e.g. a public
            build history or profile) may be displayed to other users and visitors
            and surfaced in search, feeds, and previews, consistent with your
            visibility settings.
          </LI>
          <LI>
            <Strong>Private content.</Strong> The license above is limited to
            operating the Service for you and is not used to display private content
            to others.
          </LI>
          <LI>
            This license ends when you delete Your Content or your account, except
            for (a) reasonable backup copies retained for a limited period and (b)
            content others have already copied or shared.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "code-rights",
    title: "5. Code, Repositories &amp; Third-Party Rights",
    body: (
      <>
        <P>
          Because DevManiac centers on code and build history, you make the following
          representations every time you post:
        </P>
        <List>
          <LI>
            You own Your Content or have all rights, licenses, and permissions
            necessary to post it and to grant the license in Section 4.
          </LI>
          <LI>
            Your Content does not include proprietary or confidential code belonging
            to an employer, client, or third party that you are not authorized to
            publish.
          </LI>
          <LI>
            Any open-source or third-party components in Your Content are used in
            compliance with their licenses, and you are responsible for honoring
            those license terms (including attribution and copyleft obligations).
          </LI>
        </List>
        <P>
          You agree to indemnify and hold DevManiac harmless from any claim arising
          out of Your Content or your breach of these representations, as described
          in Section 11.
        </P>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "6. Acceptable Use",
    body: (
      <>
        <P>You agree not to:</P>
        <List>
          <LI>
            Upload, host, or distribute malware, exploits, or code designed to harm
            or gain unauthorized access to systems.
          </LI>
          <LI>
            Scrape, crawl, or harvest data from the Service except as expressly
            permitted, or circumvent rate limits, access controls, or security
            measures.
          </LI>
          <LI>
            Fabricate or manipulate build history, contribution activity, or other
            portfolio signals, or otherwise misrepresent your work.
          </LI>
          <LI>
            Post content that is unlawful, infringing, harassing, hateful, or that
            violates others&rsquo; privacy or intellectual-property rights.
          </LI>
          <LI>Spam, phish, or send unsolicited promotional content.</LI>
          <LI>
            Reverse-engineer, decompile, or attempt to extract source code of the
            Service except where such restriction is prohibited by law.
          </LI>
        </List>
        <P>
          We may remove content or restrict access for any violation, at our
          discretion.
        </P>
      </>
    ),
  },
  {
    id: "our-ip",
    title: "7. DevManiac&rsquo;s Intellectual Property",
    body: (
      <P>
        The Service itself — including its software, design, layout, the DevManiac
        name and logo, and all related marks — is owned by DevManiac or its licensors
        and is protected by intellectual-property laws. Except for the rights
        expressly granted to you here, nothing in these Terms transfers any of those
        rights to you. You may not use our branding without prior written permission.
      </P>
    ),
  },
  {
    id: "termination",
    title: "8. Suspension &amp; Termination",
    body: (
      <>
        <P>
          You may stop using the Service and delete your account at any time. We may
          suspend or terminate your access if you breach these Terms, create risk or
          legal exposure for us, or for prolonged inactivity, with notice where
          reasonably practicable.
        </P>
        <P>
          Before termination takes effect (except in cases of serious abuse or legal
          requirement), we will make reasonable efforts to let you export Your
          Content. After termination, we may delete Your Content subject to the
          backup and legal-retention exceptions in Section 4.
        </P>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers",
    body: (
      <P>
        THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
        WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
        INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, AND NON-INFRINGEMENT. We do not warrant that the Service will be
        uninterrupted, secure, or error-free, or that any content will be preserved
        without loss. You are responsible for keeping your own backups of Your
        Content.
      </P>
    ),
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    body: (
      <P>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, DevManiac AND ITS AFFILIATES WILL NOT
        BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
        DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR GOODWILL, ARISING FROM OR RELATED
        TO YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM WILL NOT EXCEED
        THE GREATER OF (A) THE AMOUNTS YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM
        OR (B) USD $100. Some jurisdictions do not allow certain limitations, so some
        of the above may not apply to you.
      </P>
    ),
  },
  {
    id: "indemnification",
    title: "11. Indemnification",
    body: (
      <P>
        You agree to defend, indemnify, and hold harmless DevManiac and its officers,
        employees, and agents from and against any claims, damages, liabilities, and
        expenses (including reasonable legal fees) arising out of Your Content, your
        use of the Service, or your breach of these Terms — including any claim that
        Your Content infringes a third party&rsquo;s rights.
      </P>
    ),
  },
  {
    id: "dmca",
    title: "12. Copyright &amp; DMCA",
    body: (
      <>
        <P>
          We respect intellectual-property rights and respond to valid notices under
          the Digital Millennium Copyright Act (DMCA). If you believe content on
          DevManiac infringes your copyright, send a notice to our designated agent at{" "}
          {DMCA_EMAIL} including: identification of the work, the infringing
          material&rsquo;s location, your contact information, a good-faith
          statement, a statement of accuracy under penalty of perjury, and your
          signature.
        </P>
        <P>
          We may remove allegedly infringing content and terminate repeat
          infringers. Affected users may submit a counter-notice with the
          information required under the DMCA.
        </P>
        <P className="text-stone-500">
          [Register a designated DMCA agent with the U.S. Copyright Office before
          relying on safe-harbor protection.]
        </P>
      </>
    ),
  },
  {
    id: "changes",
    title: "13. Changes to the Service or Terms",
    body: (
      <P>
        We may modify the Service or these Terms from time to time. If we make
        material changes, we will provide reasonable notice (for example, by posting
        the updated Terms with a new &ldquo;last updated&rdquo; date or by notifying
        you in-product). Your continued use of the Service after changes take effect
        constitutes acceptance of the revised Terms.
      </P>
    ),
  },
  {
    id: "governing-law",
    title: "14. Governing Law &amp; Disputes",
    body: (
      <P>
        These Terms are governed by the laws of {GOVERNING_STATE}, without regard to
        its conflict-of-laws rules. You agree that any dispute not subject to
        informal resolution will be brought exclusively in {VENUE}, and you consent
        to the personal jurisdiction of those courts.
      </P>
    ),
  },
  {
    id: "contact",
    title: "15. Contact",
    body: (
      <P>
        Questions about these Terms? Reach us at{" "}
        <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
      </P>
    ),
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-4 max-w-xl text-stone-400">
            The terms that govern your use of DevManiac — where your build history is
            your portfolio.
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
                Legal Notice
            </p>

            <p className="mt-3 text-sm leading-relaxed text-stone-400">
                These Terms are provided for informational purposes and may be updated
                as DevManiac evolves. Continued use of the platform constitutes acceptance
                of the latest version of these Terms.
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
  return (
    <ul className="space-y-2.5 pl-1">
      {children}
    </ul>
  );
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