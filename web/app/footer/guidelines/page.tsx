// app/community/page.tsx
//
// DevManiac — Community Guidelines
// ---------------------------------------------------------------------------
// Server component. Matches the Terms & Privacy pages: same fonts, stone +
// burnt-orange system, TOC, helpers. Voice is warmer and more direct — these
// are house rules, not a contract (the binding rules live in /terms).
//
// Fonts (set in your layout.tsx via next/font):
//   --font-instrument-serif   (display / headings)
//   --font-jetbrains-mono     (mono labels / eyebrows)
//   body text inherits your global Geist sans.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const LAST_UPDATED = "May 28, 2026";
const REPORT_EMAIL = "[report@DevManiac.dev]";

export const metadata: Metadata = {
  title: "Community Guidelines · DevManiac",
  description:
    "How we keep DevManiac a place worth building in public — the house rules for our community.",
};

type Section = {
  id: string;
  title: string;
  body: ReactNode;
};

const sections: Section[] = [
  {
    id: "what-for",
    title: "1. What DevManiac Is For",
    body: (
      <>
        <P>
          DevManiac exists so your real work can speak for you. Here, your build
          history <Strong>is</Strong> your portfolio — the commits, the projects,
          the messy middle, the things you shipped. That only works if the
          community treats the place with care.
        </P>
        <P>
          These guidelines describe the kind of community we&rsquo;re building. They
          work alongside our <A href="/terms">Terms of Service</A>, which set the
          binding rules. When in doubt, build in good faith and treat other
          developers the way you&rsquo;d want your own work treated.
        </P>
      </>
    ),
  },
  {
    id: "keep-it-real",
    title: "2. Keep It Real",
    body: (
      <>
        <P>
          Authenticity is the whole point. Your build history should reflect work you
          actually did.
        </P>
        <List>
          <LI>Show real projects and honest progress — including the rough parts.</LI>
          <LI>
            Don&rsquo;t fabricate, inflate, or manipulate commits, contribution
            activity, or other portfolio signals.
          </LI>
          <LI>
            Don&rsquo;t pass off someone else&rsquo;s work as your own. Forking,
            following a tutorial, or building on a template is fine — claiming you
            wrote it from scratch is not.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "give-credit",
    title: "3. Give Credit",
    body: (
      <>
        <P>
          Good developers stand on others&rsquo; shoulders and say so.
        </P>
        <List>
          <LI>
            Attribute code, designs, and ideas you borrow. Link the source when you
            can.
          </LI>
          <LI>
            Respect open-source licenses — honor attribution, copyleft, and other
            terms of any code you reuse or publish.
          </LI>
          <LI>
            Don&rsquo;t post code you don&rsquo;t have the right to share, including
            an employer&rsquo;s or client&rsquo;s proprietary or confidential work.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "build-up",
    title: "4. Build Each Other Up",
    body: (
      <>
        <P>
          The best part of building in public is the feedback. Make it the kind
          people want to receive.
        </P>
        <List>
          <LI>
            Critique the code, not the coder. Be specific and constructive — point at
            the line, suggest the fix.
          </LI>
          <LI>
            Assume good intent, especially with beginners. Everyone&rsquo;s build
            history starts somewhere.
          </LI>
          <LI>
            Share what you learned, not just what you shipped. Process helps the next
            person.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "respect-people",
    title: "5. Respect People",
    body: (
      <>
        <P>There&rsquo;s no version of this community that includes the following:</P>
        <List>
          <LI>
            Harassment, threats, bullying, or sustained targeting of any individual.
          </LI>
          <LI>
            Hate speech or discrimination based on who someone is.
          </LI>
          <LI>
            Posting someone&rsquo;s private information (doxxing) or impersonating
            others.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "keep-safe",
    title: "6. Keep It Safe",
    body: (
      <>
        <P>This is a place for builders, not for harm.</P>
        <List>
          <LI>
            No malware, exploits, or code designed to attack, deceive, or gain
            unauthorized access to systems.
          </LI>
          <LI>
            Don&rsquo;t use the platform to leak secrets, credentials, or stolen
            data.
          </LI>
          <LI>
            If you find a security issue in DevManiac itself, please report it
            privately to {REPORT_EMAIL} rather than posting it publicly.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "no-gaming",
    title: "7. Don&rsquo;t Game the System",
    body: (
      <>
        <P>
          Reputation on DevManiac should be earned. Don&rsquo;t shortcut it.
        </P>
        <List>
          <LI>
            No spam, mass self-promotion, or unsolicited advertising.
          </LI>
          <LI>
            No fake engagement — vote rings, star/follow manipulation, bot accounts,
            or coordinated inauthentic activity.
          </LI>
          <LI>
            No scraping, crawling, or bulk-harvesting data, and no circumventing rate
            limits or access controls.
          </LI>
        </List>
      </>
    ),
  },
  {
    id: "appropriate",
    title: "8. Keep It On-Topic &amp; Appropriate",
    body: (
      <P>
        DevManiac is a developer community. Keep content relevant to building and
        learning. No sexually explicit material, no content promoting violence or
        illegal activity, and no flooding feeds with off-topic noise. We&rsquo;d
        rather have a focused community than a loud one.
      </P>
    ),
  },
  {
    id: "enforcement",
    title: "9. Reporting &amp; Enforcement",
    body: (
      <>
        <P>
          If you see something that breaks these guidelines, report it — use the
          in-product report option where available, or email {REPORT_EMAIL}. Reports
          are reviewed and kept confidential where possible.
        </P>
        <P>
          Depending on severity and context, we may issue a warning, remove content,
          limit features, suspend an account, or — for serious or repeated violations
          — permanently remove it. We aim to be fair and proportionate, and we may
          act immediately when there&rsquo;s a risk to people or the platform. These
          actions are taken under our <A href="/terms">Terms of Service</A>.
        </P>
      </>
    ),
  },
  {
    id: "final-word",
    title: "10. A Final Word",
    body: (
      <P>
        Rules can only do so much — the rest is on all of us. Ship honest work, give
        credit generously, help the person a few commits behind you, and assume the
        best of each other. That&rsquo;s the community worth building in public.
      </P>
    ),
  },
];

export default function CommunityGuidelinesPage() {
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
            Community Guidelines
          </h1>
          <p className="mt-4 max-w-xl text-stone-400">
            How we keep DevManiac a place worth building in public.
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

          {/* Reporting callout */}
          <footer className="mt-16 rounded-lg border border-stone-800 bg-stone-900/50 p-6">
            <p className="font-(family-name:--font-jetbrains-mono) text-[0.7rem] uppercase tracking-[0.18em] text-orange-500/80">
              See something off?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              Report it in-product where available, or email{" "}
              <A href={`mailto:${REPORT_EMAIL}`}>{REPORT_EMAIL}</A>. Enforcement is
              handled under our <A href="/terms">Terms of Service</A>.
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