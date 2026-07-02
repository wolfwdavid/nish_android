'use client'

import { SignUp, useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/lib/api'
import gsap from 'gsap'
import Link from 'next/link'

export default function Page() {
  const router = useRouter()

  const { user, isLoaded } = useUser()

  const glowRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoaded) return
    if (!user?.id) return

    const redirectExistingUser = async () => {
      try {
        const res = await api.get(
          `/sync_user/onboarding?clerk_user_id=${user.id}`
        )

        const currentUser = res.data

        if (!currentUser?.onboarding_completed) {
          router.replace('/onboarding')
          return
        }

        router.replace(`/u/${currentUser.username}`)
      } catch (err) {
        console.error(err)
        router.replace('/sync')
      }
    }

    redirectExistingUser()
  }, [isLoaded, user?.id, router])

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

      {/* MAIN */}
      <div
        className="sign-up-grid"
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

          {/* BADGE */}
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

            Join the developer network
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
            Start building
            <br />
            your identity.
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
            Create your DevManiac profile, showcase your projects,
            and connect with developers who actually build.
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
                $ initializing developer profile
              </p>

              <p style={{ color: '#4ade80' }}>
                ✓ username reserved
              </p>

              <p style={{ color: '#60a5fa' }}>
                ✓ reputation system connected
              </p>

              <p style={{ color: '#E8560A' }}>
                → welcome to DevManiac
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

          {/* GLOW */}
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
                Create account
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

            {/* SIGNUP */}
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/sync"
              signInFallbackRedirectUrl="/sync"

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

                  header: {
                    display: 'none',
                  },

                  footer: {
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

                  formFieldHintText: {
                    color: '#9ca3af',
                    fontSize: '13px',
                    lineHeight: '1.6',
                  },

                  formFieldErrorText: {
                    color: '#f87171',
                  },

                  formFieldSuccessText: {
                    color: '#4ade80',
                  },

                  formFieldInputShowPasswordButton: {
                    color: '#9ca3af',
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

                  phoneInputBox: {
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                  },

                  phoneInput: {
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                  },

                  phoneInputInput: {
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                  },

                  phoneInputCountryCode: {
                    color: '#ffffff',
                  },

                  phoneInputCountryCodeText: {
                    color: '#ffffff',
                  },

                  phoneInputCountryCodeButton: {
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: '#ffffff',
                    borderRight: '1px solid rgba(255,255,255,0.08)',
                  },

                  phoneInputCountryCodeButtonText: {
                    color: '#ffffff',
                  },

                  phoneInputCountryCodeButtonArrow: {
                    color: '#9ca3af',
                  },

                  selectButton: {
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.1)',
                  },

                  selectButtonText: {
                    color: '#ffffff',
                  },

                  selectIcon: {
                    color: '#9ca3af',
                  },

                  selectOptionsContainer: {
                    backgroundColor: '#111113',
                    border: '1px solid rgba(255,255,255,0.1)',
                  },

                  selectOption: {
                    backgroundColor: '#111113',
                    color: '#ffffff',
                  },

                  selectOptionText: {
                    color: '#ffffff',
                  },

                  selectOption__focused: {
                    backgroundColor: '#1f1f23',
                    color: '#ffffff',
                  },

                  otpCodeFieldInput: {
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
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
                },
              }}
            />
            <div
              style={{
                marginTop: 18,
                textAlign: 'center',
                fontSize: 14,
                color: '#8b8b95',
              }}
            >
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/sign-in')}
                style={{
                  color: '#E8560A',
                  fontWeight: 600,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Sign in
              </button>
            </div>
            

     <div className="mt-6">
      <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
      <p className="mt-4 text-balance text-center text-[0.8rem] leading-6 text-zinc-500">
        By continuing, you agree to DevManiac&rsquo;s{" "}
        <Link
          href="/footer/terms"
          className="font-medium text-orange-400! underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300 hover:decoration-orange-300"
        >
          Terms
        </Link>{" "}
        and acknowledge our{" "}
        <Link
          href="/footer/privacy"
          className="font-medium text-orange-400! underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300 hover:decoration-orange-300"
        >
          Privacy Policy
        </Link>{" "}
        and follow our{" "}
        <Link 
        href="/footer/guidelines"
        className="font-medium text-orange-400! underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300 hover:decoration-orange-300"
>
         Community Guidelines
        </Link>
        .
      </p>
    </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sign-up-grid {
            grid-template-columns: 1fr !important;
            padding: 32px 24px !important;
            gap: 48px !important;
          }
        }
      `}</style>

    </main>
  )
}