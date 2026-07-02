'use client'

import { SignIn } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Page() {

  const glowRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const tl = gsap.timeline({
      defaults: {
        ease: 'power4.out',
      },
    })

    tl.fromTo(
      leftRef.current,
      {
        y: 40,
        opacity: 0,
        filter: 'blur(12px)',
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
      }
    )

    tl.fromTo(
      cardRef.current,
      {
        x: 40,
        opacity: 0,
        filter: 'blur(10px)',
      },
      {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
      },
      '-=0.9'
    )

    gsap.to(glowRef.current, {
      x: 60,
      y: 40,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    gsap.to(gridRef.current, {
      backgroundPosition: '0px 60px',
      duration: 14,
      repeat: -1,
      ease: 'none',
    })

  }, [])

  return (
    <main
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

      {/* GRID */}
      <div
        ref={gridRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.06,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* RED GLOW */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.18)',
          filter: 'blur(180px)',
          pointerEvents: 'none',
        }}
      />

      {/* CENTER LIGHT */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.025)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />

      {/* MAIN LAYOUT */}
      <div
        className="sign-in-grid"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 1280,
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: 64,
          padding: '48px',
        }}
      >

        {/* LEFT */}
        <div
          ref={leftRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >

          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 999,
              padding: '8px 18px',
              fontSize: 13,
              color: '#a1a1aa',
              marginBottom: 32,
              width: 'fit-content',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 16px rgba(239,68,68,0.9)',
                flexShrink: 0,
              }}
            />
            Developer network initializing
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize: 'clamp(3rem, 5.5vw, 5rem)',
              fontWeight: 900,
              lineHeight: 0.93,
              letterSpacing: '-0.07em',
              marginBottom: 28,
            }}
          >
            Enter the
            <br />
            builder graph.
          </h1>

          {/* DESC */}
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.8,
              color: '#a1a1aa',
              maxWidth: 480,
              marginBottom: 48,
            }}
          >
            DevManiac is where developers share projects,
            build reputation, and connect with people
            who actually ship products.
          </p>

          {/* TERMINAL */}
          <div
            style={{
              maxWidth: 480,
              borderRadius: 28,
              border: '1px solid rgba(255,255,255,0.09)',
              background: 'rgba(18,18,20,0.85)',
              backdropFilter: 'blur(24px)',
              padding: '28px 32px',
              boxShadow: '0 30px 100px rgba(0,0,0,0.7)',
            }}
          >

            {/* dots */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 24,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
            </div>

            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 14,
                lineHeight: 2,
              }}
            >
              <p style={{ color: '#52525b' }}>
                $ DevManiac auth:start
              </p>

              <p style={{ color: '#4ade80' }}>
                ✓ identity verified
              </p>

              <p style={{ color: '#60a5fa' }}>
                ✓ developer profile loaded
              </p>

              <p style={{ color: '#E8560A' }}>
                → welcome back, builder
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          ref={cardRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >

          {/* CARD GLOW */}
          <div
            style={{
              position: 'absolute',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.08)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 460,
            }}
          >

            {/* CUSTOM HEADER */}
            <div
              style={{
                marginBottom: 24,
                paddingLeft: 8,
              }}
            >

              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  color: '#ffffff',
                  marginBottom: 10,
                  lineHeight: 1,
                }}
              >
                Welcome back
              </h2>

              <p
                style={{
                  color: '#8b8b95',
                  fontSize: '15px',
                  lineHeight: 1.7,
                }}
              >
                Enter the builder graph.
              </p>

            </div>

            {/* CLERK */}
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl="/sync"
              appearance={{
                variables: {
                  colorPrimary: '#E8560A',
                  colorBackground: '#0f0f11',
                  colorInputBackground: 'rgba(255,255,255,0.06)',
                  colorInputText: '#ffffff',
                  colorText: '#ffffff',
                  colorTextSecondary: '#a1a1aa',
                  borderRadius: '1.1rem',
                  fontFamily: 'var(--font-geist), system-ui, sans-serif',
                  fontSize: '15px',
                },

                elements: {

                  /* REMOVE DEFAULT HEADER */
                  header: {
                    display: 'none',
                  },

                  rootBox: {
                    width: '100%',
                  },

                  card: {
                    width: '100%',
                    backgroundColor: '#111113',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '28px',
                    boxShadow:
                      '0 40px 140px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)',
                    padding: '32px 36px',
                  },

                  socialButtonsBlockButton: {
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    transition: 'all 0.25s ease',
                    backdropFilter: 'blur(12px)',
                  },

                  socialButtonsBlockButtonText: {
                    color: '#ffffff',
                    fontWeight: '500',
                  },

                  socialButtonsProviderIcon__github: {
                    filter: 'invert(1)',
                  },

                  dividerLine: {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },

                  dividerText: {
                    color: '#52525b',
                  },

                  formFieldLabel: {
                    color: '#a1a1aa',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '6px',
                  },

                  formFieldInput: {
                    height: '52px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '14px',
                  },

                  formButtonPrimary: {
                    height: '52px',
                    backgroundColor: '#E8560A',
                    borderRadius: '14px',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(232,86,10,0.35)',
                    transition: 'all 0.2s',
                  },

                  footerActionText: {
                    color: '#8b8b95',
                    fontSize: '13px',
                  },

                  footerActionLink: {
                    color: '#ffffff',
                    fontWeight: '600',
                    textDecoration: 'none',
                  },

                  formResendCodeLink: {
                    color: '#E8560A',
                  },

                  identityPreviewText: {
                    color: '#fff',
                  },

                  identityPreviewEditButton: {
                    color: '#E8560A',
                  },

                  formFieldSuccessText: {
                    color: '#4ade80',
                  },

                  formFieldErrorText: {
                    color: '#f87171',
                  },

                  otpCodeFieldInput: {
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  },

                  footer: {
                    display: 'none',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <style>{`
        @media (max-width: 768px) {
          .sign-in-grid {
            grid-template-columns: 1fr !important;
            padding: 32px 24px !important;
            gap: 48px !important;
          }
        }
      `}</style>

    </main>
  )
}