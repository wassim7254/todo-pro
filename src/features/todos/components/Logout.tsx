import { motion } from 'framer-motion'
import { ArrowLeft, Heart, LogOut, Sparkles, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAuth } from '../../../context/AuthContext'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function getInitials(name: string) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'U'
  )
}

function Sticker({
  children,
  className = '',
  rotate,
}: {
  children: ReactNode
  className?: string
  rotate?: number
}) {
  return (
    <span
      style={
        rotate !== undefined
          ? {
              transform: `rotate(${rotate}deg)`,
            }
          : undefined
      }
      className={`
        inline-flex items-center rounded-full
        border-2 border-foreground/10
        bg-card px-3 py-1.5
        text-[10px] font-black uppercase
        tracking-[0.12em]
        shadow-[2px_3px_0_rgba(0,0,0,0.08)]
        ${className}
      `}
    >
      {children}
    </span>
  )
}

function DoodleStar({
  className = '',
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 6L58 39L94 50L58 59L50 94L41 59L6 50L41 40L50 6Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DoodleHeart({
  className = '',
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 86C43 78 17 62 12 42C8 27 17 16 30 16C39 16 46 21 50 29C54 21 61 16 70 16C83 16 92 27 88 42C83 62 57 78 50 86Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DoodlePlus({
  className = '',
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 15V85M15 50H85"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Logout() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      // Keep the user on this page if logout fails.
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <main className="fixed inset-0 z-[99999] min-h-screen overflow-y-auto bg-background text-foreground">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-background">
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute -left-20 -top-20
            h-72 w-72 rounded-full
            bg-pink-300/40
            blur-3xl
            dark:bg-pink-500/15
          "
        />

        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute -bottom-24 -right-20
            h-80 w-80 rounded-full
            bg-violet-300/40
            blur-3xl
            dark:bg-violet-500/15
          "
        />

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute left-1/2 top-1/3
            h-48 w-48
            -translate-x-1/2
            rounded-full
            bg-yellow-200/45
            blur-3xl
            dark:bg-yellow-500/10
          "
        />

        <DoodleStar className="absolute left-[8%] top-[20%] h-10 w-10 rotate-12 text-pink-400/50" />
        <DoodleHeart className="absolute right-[9%] top-[18%] h-12 w-12 -rotate-12 text-violet-400/50" />
        <DoodlePlus className="absolute bottom-[20%] left-[10%] h-9 w-9 rotate-12 text-yellow-500/50" />
        <DoodleStar className="absolute bottom-[14%] right-[12%] h-8 w-8 -rotate-12 text-emerald-400/50" />
      </div>

      {/* Completely independent page */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/profile')}
            className="
              inline-flex items-center gap-2
              rounded-full
              border-2 border-border
              bg-card
              px-4 py-2.5
              text-xs font-black
              shadow-[3px_4px_0_rgba(0,0,0,0.07)]
              transition-transform
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Nope, stay!
          </motion.button>

          <Sticker
            rotate={3}
            className="bg-pink-200 dark:bg-pink-400/20"
          >
            🚪 Bye bye?
          </Sticker>
        </header>

        {/* Main */}
        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.45,
              ease: 'easeOut',
            }}
            className="w-full max-w-3xl"
          >
            {/* Main card */}
            <div
              className="
                overflow-hidden
                rounded-[2.5rem]
                border-2 border-border
                bg-card
                shadow-[7px_8px_0_rgba(0,0,0,0.07)]
              "
            >
              {/* Color strip */}
              <div className="h-3 w-full bg-gradient-to-r from-pink-400 via-violet-500 to-yellow-400" />

              <div className="p-6 sm:p-10">
                {/* Funny face */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{
                      rotate: [-3, 3, -3],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="
                      flex h-28 w-28
                      items-center justify-center
                      rounded-[2rem]
                      border-2 border-border
                      bg-gradient-to-br
                      from-pink-200
                      via-fuchsia-200
                      to-violet-200
                      text-6xl
                      shadow-[4px_5px_0_rgba(0,0,0,0.07)]
                      dark:from-pink-500/20
                      dark:via-fuchsia-500/20
                      dark:to-violet-500/20
                    "
                  >
                    🥺
                  </motion.div>
                </div>

                {/* Sticker */}
                <div className="mt-6 flex justify-center">
                  <Sticker
                    rotate={-3}
                    className="bg-yellow-200 dark:bg-yellow-400/20"
                  >
                    WAIT!!!
                  </Sticker>
                </div>

                {/* Heading */}
                <div className="mt-5 text-center">
                  <h1 className="text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
                    You&apos;re really
                    <br />
                    <span className="text-pink-500">
                      leaving me?
                    </span>
                  </h1>

                  <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-6 text-muted-foreground sm:text-base">
                    Are you absolutely sure? Your tasks will still
                    be here when you come back. We just wanted one
                    last chance to be dramatic.
                  </p>
                </div>

                {/* Drama card */}
                <div
                  className="
                    mx-auto mt-8 max-w-xl
                    rounded-[2rem]
                    border-2 border-border
                    bg-background
                    p-5
                    shadow-[3px_4px_0_rgba(0,0,0,0.04)]
                    sm:p-6
                  "
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        flex h-12 w-12 shrink-0
                        items-center justify-center
                        rounded-2xl
                        border-2 border-border
                        bg-pink-100
                        text-xl
                        dark:bg-pink-500/10
                      "
                    >
                      💔
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        Think about what we had.
                      </p>

                      <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
                        You made tasks. You checked tasks.
                        Sometimes you ignored tasks. But we
                        were a team.
                      </p>
                    </div>
                  </div>
                </div>

                {/* User preview */}
                <div className="mt-6 flex justify-center">
                  <div
                    className="
                      inline-flex items-center gap-3
                      rounded-full
                      border-2 border-border
                      bg-background
                      px-4 py-2.5
                    "
                  >
                    <div className="h-9 w-9 overflow-hidden rounded-full">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="
                            flex h-full w-full
                            items-center justify-center
                            bg-gradient-to-br
                            from-pink-400
                            via-fuchsia-400
                            to-violet-500
                            text-[11px]
                            font-black
                            text-white
                          "
                        >
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>

                    <div className="text-left">
                      <p className="text-xs font-black">
                        {user.name}
                      </p>

                      <p className="text-[10px] font-semibold text-muted-foreground">
                        Your tasks will be waiting for you.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/profile')}
                    className="
                      flex min-h-14
                      items-center justify-center
                      gap-2
                      rounded-2xl
                      border-2 border-border
                      bg-background
                      px-5
                      text-sm font-black
                      shadow-[3px_4px_0_rgba(0,0,0,0.06)]
                      transition-all
                    "
                  >
                    🥹 Nope, I&apos;m staying!
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => void handleLogout()}
                    className="
                      flex min-h-14
                      items-center justify-center
                      gap-2
                      rounded-2xl
                      border-2 border-pink-300
                      bg-pink-100
                      px-5
                      text-sm font-black
                      text-pink-700
                      shadow-[3px_4px_0_rgba(236,72,153,0.12)]
                      transition-all
                      hover:bg-pink-200
                      dark:border-pink-400/30
                      dark:bg-pink-500/10
                      dark:text-pink-300
                      dark:hover:bg-pink-500/20
                    "
                  >
                    <LogOut className="h-4 w-4" />
                    Yes, sign me out
                  </motion.button>
                </div>

                {/* Bottom sticker */}
                <div className="mt-8 flex justify-center">
                  <Sticker
                    rotate={-2}
                    className="bg-emerald-100 dark:bg-emerald-400/15"
                  >
                    💚 Come back soon!
                  </Sticker>
                </div>

                {/* Tiny decoration */}
                <div className="mt-7 flex items-center justify-center gap-3 text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <Heart className="h-4 w-4" />
                  <Star className="h-4 w-4" />
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="text-xs font-semibold text-muted-foreground">
                Todo Pro · Your tasks, your rules.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}