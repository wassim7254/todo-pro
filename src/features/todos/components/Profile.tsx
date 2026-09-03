import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Camera,
  Check,
  Crown,
  ImagePlus,
  LogOut,
  Mail,
  Pencil,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  UserRound,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../../../context/AuthContext'
import { useTodoManager } from '../hooks/useTodoManager'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) {
    return 'T'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase()
  }

  return `${parts[0].slice(0, 1)}${parts[
    parts.length - 1
  ].slice(0, 1)}`.toUpperCase()
}

function formatJoinedDate(value?: string) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Unable to read image.'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Unable to read image.'))
    }

    reader.readAsDataURL(file)
  })
}

async function compressAvatar(file: File): Promise<string> {
  const source = await readFileAsDataUrl(file)

  const image = new Image()
  image.src = source

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => {
      reject(new Error('Unable to process image.'))
    }
  })

  const maxSize = 640

  const ratio = Math.min(
    maxSize / image.width,
    maxSize / image.height,
    1,
  )

  const width = Math.max(
    1,
    Math.round(image.width * ratio),
  )

  const height = Math.max(
    1,
    Math.round(image.height * ratio),
  )

  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  if (!context) {
    return source
  }

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  )

  return canvas.toDataURL('image/jpeg', 0.84)
}

/* -------------------------------------------------------------------------- */
/* Doodle components                                                          */
/* -------------------------------------------------------------------------- */

function DoodleStar({
  className = '',
}: {
  className?: string
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none text-[#d9a62e] ${className}`}
      animate={{
        rotate: [0, 8, -6, 0],
        scale: [1, 1.08, 0.98, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      ✦
    </motion.span>
  )
}

function DoodleHeart({
  className = '',
}: {
  className?: string
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none text-[#ee6f96] ${className}`}
      animate={{
        y: [0, -5, 0],
        rotate: [-4, 4, -4],
      }}
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      ♥
    </motion.span>
  )
}

function DoodlePlus({
  className = '',
}: {
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none font-black text-[#7764e8]/50 ${className}`}
    >
      +
    </span>
  )
}

function Sticker({
  children,
  className = '',
  rotate = 0,
}: {
  children: React.ReactNode
  className?: string
  rotate?: number
}) {
  return (
    <span
      style={{ rotate: `${rotate}deg` }}
      className={`
        inline-flex
        items-center
        rounded-full
        border-2
        border-foreground/10
        bg-card
        px-3
        py-1.5
        text-[10px]
        font-black
        uppercase
        tracking-[0.12em]
        shadow-[2px_3px_0_rgba(0,0,0,0.08)]
        ${className}
      `}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

function Avatar({
  src,
  name,
  size = 'large',
}: {
  src?: string
  name: string
  size?: 'large' | 'medium'
}) {
  const isLarge = size === 'large'

  return (
    <div
      className={`
        relative
        shrink-0
        ${isLarge ? 'size-28 sm:size-36' : 'size-24'}
      `}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="
            h-full
            w-full
            rounded-[34%]
            border-[3px]
            border-foreground
            object-cover
            shadow-[6px_7px_0_rgba(0,0,0,0.13)]
          "
        />
      ) : (
        <div
          className={`
            grid
            h-full
            w-full
            place-items-center
            rounded-[34%]
            border-[3px]
            border-foreground
            bg-gradient-to-br
            from-[#7764e8]
            via-[#a47cf0]
            to-[#ee6f96]
            font-black
            text-white
            shadow-[6px_7px_0_rgba(0,0,0,0.13)]
            ${isLarge ? 'text-4xl sm:text-5xl' : 'text-3xl'}
          `}
        >
          {getInitials(name)}
        </div>
      )}

      <span
        className="
          absolute
          -bottom-2
          -right-2
          grid
          size-9
          place-items-center
          rounded-[30%]
          border-[3px]
          border-foreground
          bg-[#35a995]
          text-white
          shadow-[3px_4px_0_rgba(0,0,0,0.12)]
        "
      >
        <Check size={17} strokeWidth={3} />
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export function Profile() {
  const { t } = useTranslation()

  const {
    user,
    updateUser,
  } = useAuth()

  const manager = useTodoManager()

  const fileInputRef =
    useRef<HTMLInputElement | null>(null)

  const [editing, setEditing] =
    useState(false)

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [avatar, setAvatar] =
    useState('')

  const [error, setError] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  const [uploading, setUploading] =
    useState(false)

  const [saved, setSaved] =
    useState(false)

  useEffect(() => {
    if (!user) {
      return
    }

    setName(user.name ?? '')
    setEmail(user.email ?? '')
    setAvatar(user.avatar ?? '')
  }, [user])

  const displayName =
    user?.name?.trim() || 'there'

  const displayEmail =
    user?.email?.trim() || ''

  const initials =
    getInitials(
      name.trim() || displayName,
    )

  const totalTasks =
    manager.metrics.total

  const completedTasks =
    manager.metrics.completed

  const overdueTasks =
    manager.metrics.overdue

  const openTasks =
    manager.todos.filter(
      (todo) => !todo.isCompleted,
    ).length

  const completionRatio =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100,
        )
      : 0

  const joinedDate = useMemo(
    () =>
      formatJoinedDate(
        user?.createdAt,
      ),
    [user?.createdAt],
  )

  const productivityMessage =
    completionRatio >= 80
      ? t(
          'profile.productivityExcellent',
          {
            defaultValue:
              'You are absolutely crushing it!',
          },
        )
      : completionRatio >= 50
        ? t(
            'profile.productivityGood',
            {
              defaultValue:
                'Look at that momentum!',
            },
          )
        : totalTasks > 0
          ? t(
              'profile.productivityStart',
              {
                defaultValue:
                  'Tiny steps still count!',
              },
            )
          : t(
              'profile.productivityEmpty',
              {
                defaultValue:
                  'Your productivity story starts here!',
              },
            )

  /* ---------------------------------------------------------------------- */
  /* Editing                                                                */
  /* ---------------------------------------------------------------------- */

  const startEditing = () => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setAvatar(user?.avatar ?? '')
    setError('')
    setSaved(false)
    setEditing(true)
  }

  const cancelEditing = () => {
    if (saving) {
      return
    }

    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setAvatar(user?.avatar ?? '')
    setError('')
    setSaved(false)
    setEditing(false)
  }

  const openFilePicker = () => {
    if (!uploading) {
      fileInputRef.current?.click()
    }
  }

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    event.target.value = ''

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError(
        t('profile.invalidImage', {
          defaultValue:
            'Please choose an image file.',
        }),
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        t('profile.imageTooLarge', {
          defaultValue:
            'Please choose an image smaller than 5 MB.',
        }),
      )
      return
    }

    try {
      setUploading(true)
      setError('')

      const processed =
        await compressAvatar(file)

      setAvatar(processed)
    } catch {
      setError(
        t('profile.imageError', {
          defaultValue:
            'We could not process that image.',
        }),
      )
    } finally {
      setUploading(false)
    }
  }

  const removeAvatar = () => {
    if (uploading) {
      return
    }

    setAvatar('')
  }

  const validate = () => {
    const cleanName =
      name.trim()

    const cleanEmail =
      email.trim()

    if (cleanName.length < 2) {
      setError(
        t('profile.nameRequired', {
          defaultValue:
            'Please enter at least 2 characters for your name.',
        }),
      )

      return false
    }

    if (
      cleanEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail,
      )
    ) {
      setError(
        t('profile.invalidEmail', {
          defaultValue:
            'Please enter a valid email address.',
        }),
      )

      return false
    }

    return true
  }

  const handleSave = async () => {
    setError('')
    setSaved(false)

    if (!validate()) {
      return
    }

    try {
      setSaving(true)

      await updateUser({
        name: name.trim(),
        email: email.trim(),
        avatar: avatar || undefined,
      })

      setSaved(true)

      window.setTimeout(() => {
        setEditing(false)
        setSaved(false)
      }, 700)
    } catch {
      setError(
        t('profile.saveError', {
          defaultValue:
            'We could not save your profile. Please try again.',
        }),
      )
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return null
  }

  /* ====================================================================== */
  /* EDIT PROFILE — FULL PAGE                                               */
  /* ====================================================================== */

  if (editing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          fixed
          inset-0
          z-[100]
          overflow-y-auto
          bg-background
          text-foreground
        "
      >
        {/* ================================================================ */}
        {/* PLAYFUL BACKGROUND                                                */}
        {/* ================================================================ */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            inset-0
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              -left-24
              -top-24
              size-72
              rounded-full
              bg-[#7764e8]/15
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -right-24
              top-24
              size-80
              rounded-full
              bg-[#ee6f96]/15
              blur-3xl
            "
          />

          <div
            className="
              absolute
              bottom-[-180px]
              left-1/4
              size-96
              rounded-full
              bg-[#35a995]/12
              blur-3xl
            "
          />

          <motion.div
            animate={{
              rotate: [0, 8, -4, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute
              left-[7%]
              top-[25%]
              size-12
              rounded-full
              border-[3px]
              border-[#d9a62e]/40
            "
          />

          <motion.div
            animate={{
              rotate: [0, -7, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute
              right-[8%]
              bottom-[24%]
              size-16
              rounded-full
              border-[3px]
              border-[#ee6f96]/35
            "
          />

          <span
            className="
              absolute
              left-[12%]
              top-[48%]
              rotate-[-12deg]
              text-4xl
              font-black
              text-[#7764e8]/20
            "
          >
            +
          </span>

          <span
            className="
              absolute
              right-[14%]
              top-[38%]
              rotate-[15deg]
              text-3xl
              font-black
              text-[#35a995]/25
            "
          >
            +
          </span>
        </div>

        {/* ================================================================ */}
        {/* PAGE                                                              */}
        {/* ================================================================ */}

        <main
          className="
            relative
            mx-auto
            min-h-screen
            w-full
            max-w-[1080px]
            px-4
            pb-10
            pt-4
            sm:px-6
            sm:pb-14
            sm:pt-7
            lg:px-8
          "
        >
          {/* ============================================================ */}
          {/* HEADER                                                        */}
          {/* ============================================================ */}

          <header
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-[18px]
                border-2
                border-foreground
                bg-card
                px-4
                py-2.5
                text-sm
                font-black
                shadow-[3px_4px_0_rgba(0,0,0,0.1)]
                transition
                hover:-translate-y-0.5
                hover:shadow-[4px_5px_0_rgba(0,0,0,0.13)]
                active:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <ArrowLeft
                size={18}
                className="
                  transition-transform
                  group-hover:-translate-x-1
                "
              />

              {t('actions.back', {
                defaultValue: 'Back',
              })}
            </button>

            <div className="flex items-center gap-2">
              <Sticker
                className="
                  rotate-2
                  bg-[#35a995]/10
                  text-[#35a995]
                "
              >
                <Sparkles
                  size={12}
                  className="mr-1.5"
                />

                Todo Pro
              </Sticker>

              <Sticker
                className="
                  hidden
                  -rotate-2
                  bg-[#ee6f96]/10
                  text-[#ee6f96]
                  sm:inline-flex
                "
              >
                {t('profile.edit', {
                  defaultValue:
                    'Edit profile',
                })}
              </Sticker>
            </div>
          </header>

          {/* ============================================================ */}
          {/* FUNNY HERO                                                    */}
          {/* ============================================================ */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
              rotate: -1,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 22,
            }}
            className="
              relative
              mt-5
              overflow-hidden
              rounded-[34px]
              border-[3px]
              border-foreground
              bg-card
              shadow-[8px_9px_0_rgba(0,0,0,0.12)]
              sm:mt-7
            "
          >
            <div
              className="
                h-5
                bg-gradient-to-r
                from-[#7764e8]
                via-[#ee6f96]
                to-[#d9a62e]
              "
            />

            <div
              className="
                relative
                px-5
                py-7
                sm:px-9
                sm:py-9
              "
            >
              <DoodleStar
                className="
                  right-8
                  top-7
                  text-3xl
                "
              />

              <DoodleHeart
                className="
                  right-20
                  top-16
                  text-xl
                "
              />

              <DoodlePlus
                className="
                  bottom-8
                  right-12
                  text-3xl
                  rotate-12
                "
              />

              <div
                className="
                  absolute
                  left-5
                  top-5
                  -rotate-3
                  rounded-full
                  border-2
                  border-foreground/20
                  bg-[#d9a62e]/10
                  px-3
                  py-1
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-[#d9a62e]
                  sm:left-9
                "
              >
                ✦ makeover time
              </div>

              <div
                className="
                  mx-auto
                  max-w-2xl
                  pt-8
                  text-center
                "
              >
                <motion.div
                  animate={{
                    rotate: [-2, 2, -2],
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="
                    mx-auto
                    inline-flex
                    rounded-full
                    border-2
                    border-foreground
                    bg-[#7764e8]/10
                    px-4
                    py-2
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-[#7764e8]
                    shadow-[3px_3px_0_rgba(0,0,0,0.07)]
                  "
                >
                  <Pencil
                    size={12}
                    className="mr-1.5"
                  />

                  {t('profile.edit', {
                    defaultValue:
                      'Edit profile',
                  })}
                </motion.div>

                <h1
                  className="
                    mt-4
                    text-4xl
                    font-black
                    tracking-[-0.065em]
                    sm:text-6xl
                  "
                >
                  {t(
                    'profile.editDescription',
                    {
                      defaultValue:
                        'Give your Todo identity a little makeover.',
                    },
                  )}
                </h1>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-xl
                    text-sm
                    font-bold
                    leading-6
                    text-muted-foreground
                    sm:text-base
                  "
                >
                  Make it yours. Pick a photo, fix your
                  name, update your email and make your
                  little Todo corner feel like home.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ============================================================ */}
          {/* MAIN EDIT GRID                                                */}
          {/* ============================================================ */}

          <div
            className="
              mt-7
              grid
              gap-6
              lg:grid-cols-[0.85fr_1.15fr]
              lg:items-start
            "
          >
            {/* ========================================================== */}
            {/* AVATAR                                                      */}
            {/* ========================================================== */}

            <motion.section
              initial={{
                opacity: 0,
                x: -20,
                rotate: -1,
              }}
              animate={{
                opacity: 1,
                x: 0,
                rotate: 0,
              }}
              transition={{
                delay: 0.08,
                type: 'spring',
                stiffness: 220,
                damping: 22,
              }}
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border-[3px]
                border-foreground
                bg-card
                p-5
                shadow-[7px_8px_0_rgba(0,0,0,0.1)]
                sm:p-7
              "
            >
              <DoodleStar
                className="
                  right-7
                  top-6
                  text-2xl
                "
              />

              <DoodleHeart
                className="
                  left-6
                  top-9
                  text-lg
                "
              />

              <div className="relative">
                <div
                  className="
                    inline-flex
                    -rotate-2
                    rounded-full
                    bg-[#35a995]/10
                    px-3
                    py-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-[#35a995]
                  "
                >
                  Your little face
                </div>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-black
                    tracking-[-0.045em]
                  "
                >
                  Make it cute ✦
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    font-bold
                    leading-5
                    text-muted-foreground
                  "
                >
                  Choose a photo or let Todo create
                  your initials avatar.
                </p>
              </div>

              <div
                className="
                  relative
                  mt-6
                  overflow-hidden
                  rounded-[28px]
                  border-2
                  border-foreground
                  bg-gradient-to-br
                  from-[#7764e8]/10
                  via-[#ee6f96]/10
                  to-[#d9a62e]/10
                  p-7
                  sm:p-9
                "
              >
                <span
                  className="
                    absolute
                    left-5
                    top-5
                    size-3
                    rounded-full
                    bg-[#ee6f96]
                  "
                />

                <span
                  className="
                    absolute
                    right-7
                    top-7
                    size-4
                    rounded-full
                    bg-[#d9a62e]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-6
                    left-8
                    size-3
                    rounded-full
                    bg-[#35a995]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-5
                    right-6
                    text-2xl
                    font-black
                    text-[#7764e8]/40
                  "
                >
                  +
                </span>

                <div className="relative flex flex-col items-center">
                  <motion.div
                    whileHover={{
                      rotate: -3,
                      scale: 1.04,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 18,
                    }}
                  >
                    <Avatar
                      src={avatar}
                      name={
                        name ||
                        displayName
                      }
                      size="large"
                    />
                  </motion.div>

                  <div className="mt-7 text-center">
                    <p className="text-lg font-black">
                      {name.trim() ||
                        displayName}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        font-bold
                        text-muted-foreground
                      "
                    >
                      Looking good already ✨
                    </p>
                  </div>

                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      justify-center
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={openFilePicker}
                      disabled={uploading}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-[17px]
                        border-2
                        border-foreground
                        bg-[#7764e8]/10
                        px-4
                        py-3
                        text-xs
                        font-black
                        text-[#7764e8]
                        shadow-[3px_3px_0_rgba(0,0,0,0.07)]
                        transition
                        hover:-translate-y-0.5
                        hover:rotate-1
                        active:translate-y-0
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {uploading ? (
                        <span
                          className="
                            size-4
                            animate-spin
                            rounded-full
                            border-2
                            border-[#7764e8]/30
                            border-t-[#7764e8]
                          "
                        />
                      ) : (
                        <Camera size={16} />
                      )}

                      {uploading
                        ? 'Working...'
                        : t(
                            'profile.changePhoto',
                            {
                              defaultValue:
                                'Change photo',
                            },
                          )}
                    </button>

                    {avatar && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        disabled={uploading}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-[17px]
                          border-2
                          border-foreground
                          bg-[#ee6f96]/10
                          px-4
                          py-3
                          text-xs
                          font-black
                          text-[#ee6f96]
                          shadow-[3px_3px_0_rgba(0,0,0,0.07)]
                          transition
                          hover:-translate-y-0.5
                          hover:-rotate-1
                          active:translate-y-0
                          disabled:opacity-50
                        "
                      >
                        <Trash2 size={15} />

                        {t(
                          'profile.removePhoto',
                          {
                            defaultValue:
                              'Remove',
                          },
                        )}
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={
                      handleImageChange
                    }
                  />

                  <div
                    className="
                      mt-5
                      rounded-[15px]
                      border-2
                      border-dashed
                      border-foreground/15
                      bg-background/70
                      px-4
                      py-2.5
                      text-center
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-bold
                        text-muted-foreground
                      "
                    >
                      JPG · PNG · WebP · GIF
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        font-black
                        text-muted-foreground
                      "
                    >
                      Maximum 5 MB
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ========================================================== */}
            {/* FORM                                                        */}
            {/* ========================================================== */}

            <motion.section
              initial={{
                opacity: 0,
                x: 20,
                rotate: 1,
              }}
              animate={{
                opacity: 1,
                x: 0,
                rotate: 0,
              }}
              transition={{
                delay: 0.12,
                type: 'spring',
                stiffness: 220,
                damping: 22,
              }}
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border-[3px]
                border-foreground
                bg-card
                p-5
                shadow-[7px_8px_0_rgba(0,0,0,0.1)]
                sm:p-7
              "
            >
              <DoodlePlus
                className="
                  right-7
                  top-6
                  text-3xl
                  rotate-12
                "
              />

              <DoodleStar
                className="
                  left-7
                  bottom-8
                  text-xl
                "
              />

              <div>
                <div
                  className="
                    inline-flex
                    rotate-2
                    rounded-full
                    bg-[#ee6f96]/10
                    px-3
                    py-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-[#ee6f96]
                  "
                >
                  The serious-ish stuff
                </div>

                <h2
                  className="
                    mt-3
                    text-2xl
                    font-black
                    tracking-[-0.045em]
                  "
                >
                  Tell us about you
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    font-bold
                    text-muted-foreground
                  "
                >
                  Don't worry. No boring paperwork.
                </p>
              </div>

              {/* ======================================================== */}
              {/* ERROR                                                      */}
              {/* ======================================================== */}

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    rotate: -1,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                  }}
                  role="alert"
                  className="
                    mt-6
                    rounded-[20px]
                    border-2
                    border-[#ee6f96]
                    bg-[#ee6f96]/10
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-[#ee6f96]
                  "
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="
                        mt-0.5
                        shrink-0
                        text-lg
                      "
                    >
                      Oops!
                    </span>

                    <span>{error}</span>
                  </div>
                </motion.div>
              )}

              {/* ======================================================== */}
              {/* NAME                                                        */}
              {/* ======================================================== */}

              <div className="mt-7">
                <label
                  htmlFor="profile-name"
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    font-black
                  "
                >
                  <span
                    className="
                      grid
                      size-9
                      rotate-[-4deg]
                      place-items-center
                      rounded-[12px]
                      border-2
                      border-foreground
                      bg-[#7764e8]/10
                      text-[#7764e8]
                    "
                  >
                    <UserRound size={16} />
                  </span>

                  <span>
                    {t('profile.name', {
                      defaultValue:
                        'Name',
                    })}
                  </span>
                </label>

                <div className="relative mt-2">
                  <input
                    id="profile-name"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value,
                      )
                    }
                    autoComplete="name"
                    className="
                      h-16
                      w-full
                      rounded-[20px]
                      border-[3px]
                      border-foreground
                      bg-background
                      px-5
                      text-base
                      font-black
                      text-foreground
                      outline-none
                      shadow-[3px_4px_0_rgba(0,0,0,0.06)]
                      transition
                      placeholder:text-muted-foreground
                      focus:-translate-y-0.5
                      focus:border-[#7764e8]
                      focus:shadow-[4px_5px_0_rgba(119,100,232,0.14)]
                    "
                    placeholder={t(
                      'profile.namePlaceholder',
                      {
                        defaultValue:
                          'Your name',
                      },
                    )}
                  />

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-lg
                    "
                  >
                    ✦
                  </span>
                </div>
              </div>

              {/* ======================================================== */}
              {/* EMAIL                                                       */}
              {/* ======================================================== */}

              <div className="mt-6">
                <label
                  htmlFor="profile-email"
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    font-black
                  "
                >
                  <span
                    className="
                      grid
                      size-9
                      rotate-[4deg]
                      place-items-center
                      rounded-[12px]
                      border-2
                      border-foreground
                      bg-[#ed8664]/10
                      text-[#ed8664]
                    "
                  >
                    <Mail size={16} />
                  </span>

                  <span>
                    {t('profile.email', {
                      defaultValue:
                        'Email',
                    })}
                  </span>
                </label>

                <div className="relative mt-2">
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                    autoComplete="email"
                    className="
                      h-16
                      w-full
                      rounded-[20px]
                      border-[3px]
                      border-foreground
                      bg-background
                      px-5
                      text-base
                      font-black
                      text-foreground
                      outline-none
                      shadow-[3px_4px_0_rgba(0,0,0,0.06)]
                      transition
                      placeholder:text-muted-foreground
                      focus:-translate-y-0.5
                      focus:border-[#ed8664]
                      focus:shadow-[4px_5px_0_rgba(237,134,100,0.14)]
                    "
                    placeholder={t(
                      'profile.emailPlaceholder',
                      {
                        defaultValue:
                          'you@example.com',
                      },
                    )}
                  />

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-lg
                    "
                  >
                    ♥
                  </span>
                </div>
              </div>

              {/* ======================================================== */}
              {/* MINI PREVIEW                                               */}
              {/* ======================================================== */}

              <div
                className="
                  relative
                  mt-7
                  overflow-hidden
                  rounded-[24px]
                  border-2
                  border-foreground
                  bg-gradient-to-r
                  from-[#35a995]/10
                  via-[#7764e8]/10
                  to-[#ee6f96]/10
                  p-4
                "
              >
                <DoodleStar
                  className="
                    right-5
                    top-3
                    text-xl
                  "
                />

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-muted-foreground
                  "
                >
                  Tiny preview
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="
                      grid
                      size-12
                      shrink-0
                      place-items-center
                      overflow-hidden
                      rounded-[15px]
                      border-2
                      border-foreground
                      bg-gradient-to-br
                      from-[#7764e8]
                      to-[#ee6f96]
                      font-black
                      text-white
                      shadow-[2px_3px_0_rgba(0,0,0,0.1)]
                    "
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt=""
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-black
                      "
                    >
                      {name.trim() ||
                        'Your name'}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        font-bold
                        text-muted-foreground
                      "
                    >
                      {email.trim() ||
                        'you@example.com'}
                    </p>
                  </div>

                  <span
                    className="
                      ml-auto
                      shrink-0
                      rotate-2
                      rounded-full
                      bg-[#35a995]/15
                      px-2.5
                      py-1
                      text-[9px]
                      font-black
                      text-[#35a995]
                    "
                  >
                    ✦ me
                  </span>
                </div>
              </div>

              {/* ======================================================== */}
              {/* ACTIONS                                                     */}
              {/* ======================================================== */}

              <div
                className="
                  mt-7
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="
                    inline-flex
                    min-h-[58px]
                    items-center
                    justify-center
                    gap-2
                    rounded-[19px]
                    border-[3px]
                    border-foreground
                    bg-muted
                    px-5
                    py-3
                    text-sm
                    font-black
                    shadow-[3px_4px_0_rgba(0,0,0,0.08)]
                    transition
                    hover:-translate-y-0.5
                    hover:rotate-[-1deg]
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <X size={17} />

                  {t(
                    'actions.cancel',
                    {
                      defaultValue:
                        'Cancel',
                    },
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleSave()
                  }
                  disabled={
                    saving ||
                    uploading
                  }
                  className="
                    group
                    inline-flex
                    min-h-[58px]
                    items-center
                    justify-center
                    gap-2
                    rounded-[19px]
                    border-[3px]
                    border-foreground
                    bg-gradient-to-r
                    from-[#7764e8]
                    via-[#a47cf0]
                    to-[#ee6f96]
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-white
                    shadow-[4px_5px_0_rgba(0,0,0,0.17)]
                    transition
                    hover:-translate-y-1
                    hover:rotate-[1deg]
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {saving ? (
                    <span
                      className="
                        size-5
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      "
                    />
                  ) : saved ? (
                    <Check
                      size={19}
                      strokeWidth={3}
                    />
                  ) : (
                    <Sparkles
                      size={19}
                      className="
                        transition-transform
                        group-hover:rotate-12
                      "
                    />
                  )}

                  {saved
                    ? t(
                        'actions.saved',
                        {
                          defaultValue:
                            'Saved!',
                        },
                      )
                    : t(
                        'actions.save',
                        {
                          defaultValue:
                            'Save changes',
                        },
                      )}
                </button>
              </div>

              <div className="mt-5 text-center">
                <p
                  className="
                    text-[10px]
                    font-bold
                    text-muted-foreground
                  "
                >
                  ✦ Your profile, your rules, your
                  little productivity universe. ✦
                </p>
              </div>
            </motion.section>
          </div>

          {/* ============================================================ */}
          {/* BOTTOM FUNNY CARD                                             */}
          {/* ============================================================ */}

          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.22,
            }}
            className="
              relative
              mt-7
              overflow-hidden
              rounded-[30px]
              border-[3px]
              border-foreground
              bg-card
              p-5
              shadow-[6px_7px_0_rgba(0,0,0,0.08)]
              sm:p-6
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                gap-4
                text-center
                sm:flex-row
                sm:text-left
              "
            >
              <motion.div
                animate={{
                  rotate: [-4, 4, -4],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="
                  grid
                  size-14
                  shrink-0
                  place-items-center
                  rounded-[20px]
                  border-2
                  border-foreground
                  bg-[#d9a62e]/15
                  text-3xl
                  shadow-[3px_4px_0_rgba(0,0,0,0.08)]
                "
              >
                🐾
              </motion.div>

              <div className="min-w-0 flex-1">
                <p className="text-lg font-black">
                  Almost done!
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-bold
                    leading-5
                    text-muted-foreground
                  "
                >
                  Hit save when your profile feels
                  like{' '}
                  <span className="text-[#ee6f96]">
                    you
                  </span>
                  . No pressure. The tasks aren't going
                  anywhere.
                </p>
              </div>

              <div
                className="
                  rotate-2
                  rounded-full
                  border-2
                  border-foreground
                  bg-[#35a995]/10
                  px-4
                  py-2
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.13em]
                  text-[#35a995]
                "
              >
                ✦ ready
              </div>
            </div>
          </motion.section>

          {/* ============================================================ */}
          {/* FOOTER                                                        */}
          {/* ============================================================ */}

          <footer className="pb-3 pt-8 text-center">
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <span className="text-lg">
                ✦
              </span>

              <span
                className="
                  text-xs
                  font-black
                  text-muted-foreground
                "
                >
                Small steps. Big progress.
              </span>

              <span className="text-lg">
                ✦
              </span>
            </div>
          </footer>
        </main>
      </motion.div>
    )
  }

  /* ====================================================================== */
  /* NORMAL PROFILE PAGE                                                    */
  /* ====================================================================== */

  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-background
        text-foreground
      "
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                         */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-32
            -top-32
            size-80
            rounded-full
            bg-[#7764e8]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-32
            top-1/3
            size-96
            rounded-full
            bg-[#ee6f96]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            left-1/3
            size-96
            rounded-full
            bg-[#35a995]/10
            blur-3xl
          "
        />
      </div>

      <main
        className="
          relative
          mx-auto
          min-h-screen
          w-full
          max-w-[1180px]
          px-4
          pb-10
          pt-4
          sm:px-6
          sm:pt-7
          lg:px-8
        "
      >
        {/* ================================================================= */}
        {/* HEADER                                                            */}
        {/* ================================================================= */}

        <header
          className="
            flex
            items-center
            justify-between
          "
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-[18px]
              border-2
              border-foreground
              bg-card
              px-4
              py-2.5
              text-sm
              font-black
              shadow-[3px_4px_0_rgba(0,0,0,0.1)]
              transition
              hover:-translate-y-0.5
              hover:shadow-[4px_5px_0_rgba(0,0,0,0.12)]
              active:translate-y-0
            "
          >
            <ArrowLeft
              size={18}
              className="
                transition-transform
                group-hover:-translate-x-0.5
              "
            />

            {t('actions.back', {
              defaultValue: 'Back',
            })}
          </button>

          <div
            className="
              hidden
              items-center
              gap-2
              sm:flex
            "
          >
            <Sticker
              className="
                rotate-2
                bg-[#35a995]/10
                text-[#35a995]
              "
            >
              <Sparkles
                size={12}
                className="mr-1.5"
              />

              Todo Pro
            </Sticker>

            <Sticker
              className="
                -rotate-2
                bg-[#ee6f96]/10
                text-[#ee6f96]
              "
            >
              {t('profile.title', {
                defaultValue:
                  'Profile',
              })}
            </Sticker>
          </div>
        </header>

        {/* ================================================================= */}
        {/* HERO                                                              */}
        {/* ================================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            relative
            mt-5
            overflow-hidden
            rounded-[34px]
            border-2
            border-foreground
            bg-card
            shadow-[7px_8px_0_rgba(0,0,0,0.1)]
            sm:mt-7
          "
        >
          <div
            className="
              h-4
              bg-gradient-to-r
              from-[#7764e8]
              via-[#ee6f96]
              to-[#d9a62e]
            "
          />

          <div
            className="
              relative
              px-5
              py-7
              sm:px-9
              sm:py-9
            "
          >
            <DoodleStar
              className="
                right-8
                top-7
                text-3xl
                sm:right-14
              "
            />

            <DoodleHeart
              className="
                right-24
                top-16
                text-xl
                sm:right-40
              "
            />

            <DoodlePlus
              className="
                bottom-8
                right-12
                text-3xl
                rotate-12
              "
            />

            <div
              className="
                flex
                flex-col
                items-center
                gap-7
                text-center
                sm:flex-row
                sm:items-center
                sm:text-left
              "
            >
              <motion.div
                whileHover={{
                  rotate: -2,
                  scale: 1.02,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <Avatar
                  src={user.avatar}
                  name={displayName}
                />
              </motion.div>

              <div className="min-w-0 flex-1">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                    sm:justify-start
                  "
                >
                  <Sticker
                    className="
                      rotate-[-2deg]
                      bg-[#7764e8]/10
                      text-[#7764e8]
                    "
                  >
                    {t(
                      'profile.yourProfile',
                      {
                        defaultValue:
                          'Your profile',
                      },
                    )}
                  </Sticker>

                  {joinedDate && (
                    <span
                      className="
                        text-xs
                        font-bold
                        text-muted-foreground
                      "
                    >
                      {t(
                        'profile.memberSince',
                        {
                          defaultValue:
                            'Member since {{date}}',
                          date: joinedDate,
                        },
                      )}
                    </span>
                  )}
                </div>

                <h1
                  className="
                    mt-3
                    break-words
                    text-4xl
                    font-black
                    tracking-[-0.06em]
                    sm:text-5xl
                  "
                >
                  {displayName}
                </h1>

                <p
                  className="
                    mt-2
                    flex
                    items-center
                    justify-center
                    gap-2
                    break-all
                    text-sm
                    font-bold
                    text-muted-foreground
                    sm:justify-start
                  "
                >
                  <Mail
                    size={15}
                    className="
                      shrink-0
                      text-[#ed8664]
                    "
                  />

                  {displayEmail ||
                    t(
                      'profile.noEmail',
                      {
                        defaultValue:
                          'No email added',
                      },
                    )}
                </p>

                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    justify-center
                    gap-2
                    sm:justify-start
                  "
                >
                  <button
                    type="button"
                    onClick={startEditing}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-[17px]
                      border-2
                      border-foreground
                      bg-gradient-to-r
                      from-[#7764e8]
                      to-[#ee6f96]
                      px-5
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-[3px_4px_0_rgba(0,0,0,0.18)]
                      transition
                      hover:-translate-y-0.5
                      active:translate-y-0
                      active:shadow-[1px_2px_0_rgba(0,0,0,0.15)]
                    "
                  >
                    <Pencil size={16} />

                    {t(
                      'profile.edit',
                      {
                        defaultValue:
                          'Edit profile',
                      },
                    )}
                  </button>

                  <Sticker
                    className="
                      rotate-1
                      bg-[#d9a62e]/10
                      text-[#d9a62e]
                    "
                  >
                    <Crown
                      size={13}
                      className="mr-1.5"
                    />

                    {t(
                      'profile.member',
                      {
                        defaultValue:
                          'Member',
                      },
                    )}
                  </Sticker>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================================================================= */}
        {/* PRODUCTIVITY                                                       */}
        {/* ================================================================= */}

        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[#7764e8]
                "
                >
                {t(
                  'productivity.title',
                  {
                    defaultValue:
                      'Productivity',
                  },
                )}
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-black
                  tracking-[-0.055em]
                "
                >
                {t(
                  'profile.yourProgress',
                  {
                    defaultValue:
                      'Your progress',
                  },
                )}
              </h2>
            </div>

            <motion.div
              initial={{
                rotate: -8,
                scale: 0,
              }}
              animate={{
                rotate: 4,
                scale: 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 18,
              }}
              className="
                hidden
                rounded-full
                border-2
                border-foreground
                bg-[#7764e8]/10
                px-4
                py-2
                text-xl
                font-black
                text-[#7764e8]
                shadow-[3px_3px_0_rgba(0,0,0,0.08)]
                sm:block
              "
            >
              {completionRatio}%
            </motion.div>
          </div>

          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              border-2
              border-foreground
              bg-card
              p-5
              shadow-[5px_6px_0_rgba(0,0,0,0.08)]
              sm:p-7
            "
          >
            <DoodleStar
              className="
                right-8
                top-5
                text-2xl
              "
            />

            <DoodlePlus
              className="
                right-16
                top-12
                text-xl
              "
            />

            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  grid
                  size-12
                  shrink-0
                  place-items-center
                  rounded-[18px]
                  border-2
                  border-foreground
                  bg-gradient-to-br
                  from-[#7764e8]
                  to-[#ee6f96]
                  text-white
                  shadow-[3px_4px_0_rgba(0,0,0,0.1)]
                "
              >
                <Sparkles size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-lg font-black">
                  {productivityMessage}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-bold
                    text-muted-foreground
                  "
                >
                  {totalTasks}{' '}
                  {t(
                    'profile.totalTasks',
                    {
                      defaultValue:
                        'tasks tracked',
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div
                className="
                  relative
                  h-5
                  overflow-hidden
                  rounded-full
                  border-2
                  border-foreground/10
                  bg-muted
                "
              >
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${completionRatio}%`,
                  }}
                  transition={{
                    duration: 1,
                    ease: 'easeOut',
                  }}
                  className="
                    relative
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-[#7764e8]
                    via-[#ee6f96]
                    to-[#d9a62e]
                  "
                >
                  <span
                    className="
                      absolute
                      right-2
                      top-1/2
                      size-2
                      -translate-y-1/2
                      rounded-full
                      bg-white
                    "
                  />
                </motion.div>
              </div>

              <div
                className="
                  mt-2
                  flex
                  justify-between
                  text-[10px]
                  font-black
                  text-muted-foreground
                "
              >
                <span>0%</span>
                <span>{completionRatio}%</span>
                <span>100%</span>
              </div>
            </div>

            <div
              className="
                mt-6
                grid
                grid-cols-3
                gap-2.5
                sm:gap-4
              "
            >
              <div
                className="
                  relative
                  rounded-[21px]
                  border-2
                  border-[#35a995]/30
                  bg-[#35a995]/8
                  p-4
                  text-center
                "
              >
                <DoodlePlus
                  className="
                    right-2
                    top-1
                    text-sm
                    text-[#35a995]/40
                  "
                />

                <p className="text-2xl font-black">
                  {openTasks}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#35a995]
                  "
                >
                  {t(
                    'productivity.open',
                    {
                      defaultValue:
                        'Open',
                    },
                  )}
                </p>
              </div>

              <div
                className="
                  rounded-[21px]
                  border-2
                  border-[#7764e8]/25
                  bg-[#7764e8]/8
                  p-4
                  text-center
                "
              >
                <p className="text-2xl font-black">
                  {completedTasks}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#7764e8]
                  "
                >
                  {t(
                    'productivity.complete',
                    {
                      defaultValue:
                        'Complete',
                    },
                  )}
                </p>
              </div>

              <div
                className="
                  rounded-[21px]
                  border-2
                  border-[#ed8664]/25
                  bg-[#ed8664]/8
                  p-4
                  text-center
                "
              >
                <p className="text-2xl font-black">
                  {overdueTasks}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#ed8664]
                  "
                >
                  {t(
                    'productivity.overdue',
                    {
                      defaultValue:
                        'Overdue',
                    },
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* ACCOUNT                                                            */}
        {/* ================================================================= */}

        <section className="mt-7">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="
                grid
                size-11
                rotate-[-4deg]
                place-items-center
                rounded-[17px]
                border-2
                border-foreground
                bg-[#35a995]/10
                text-[#35a995]
                shadow-[3px_3px_0_rgba(0,0,0,0.08)]
              "
            >
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="text-xl font-black">
                {t(
                  'profile.account',
                  {
                    defaultValue:
                      'Your account',
                  },
                )}
              </h2>

              <p
                className="
                  text-xs
                  font-bold
                  text-muted-foreground
                "
                >
                {t(
                  'profile.accountSubtitle',
                  {
                    defaultValue:
                      'A little home for your Todo identity.',
                  },
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className="
                flex
                items-center
                gap-4
                rounded-[25px]
                border-2
                border-foreground
                bg-card
                p-4
                shadow-[4px_5px_0_rgba(0,0,0,0.07)]
              "
            >
              <div
                className="
                  grid
                  size-12
                  shrink-0
                  place-items-center
                  rounded-[17px]
                  bg-[#7764e8]/10
                  text-[#7764e8]
                "
              >
                <UserRound size={20} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-muted-foreground
                  "
                >
                  {t(
                    'profile.name',
                    {
                      defaultValue:
                        'Name',
                    },
                  )}
                </p>

                <p className="mt-1 truncate text-base font-black">
                  {displayName}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
                rounded-[25px]
                border-2
                border-foreground
                bg-card
                p-4
                shadow-[4px_5px_0_rgba(0,0,0,0.07)]
              "
            >
              <div
                className="
                  grid
                  size-12
                  shrink-0
                  place-items-center
                  rounded-[17px]
                  bg-[#ed8664]/10
                  text-[#ed8664]
                "
              >
                <Mail size={20} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-muted-foreground
                  "
                >
                  {t(
                    'profile.email',
                    {
                      defaultValue:
                        'Email',
                    },
                  )}
                </p>

                <p className="mt-1 truncate text-base font-black">
                  {displayEmail ||
                    t(
                      'profile.notSet',
                      {
                        defaultValue:
                          'Not set',
                      },
                    )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* ACHIEVEMENT                                                        */}
        {/* ================================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.1,
          }}
          className="
            relative
            mt-7
            overflow-hidden
            rounded-[30px]
            border-2
            border-foreground
            bg-gradient-to-br
            from-[#d9a62e]/10
            via-card
            to-[#ee6f96]/10
            p-5
            shadow-[5px_6px_0_rgba(0,0,0,0.08)]
            sm:p-7
          "
        >
          <DoodleStar
            className="
              right-7
              top-5
              text-3xl
            "
          />

          <DoodleHeart
            className="
              bottom-6
              right-16
              text-xl
            "
          />

          <div className="flex items-center gap-4">
            <div
              className="
                grid
                size-14
                shrink-0
                rotate-[-5deg]
                place-items-center
                rounded-[19px]
                border-2
                border-foreground
                bg-[#d9a62e]/15
                text-[#d9a62e]
                shadow-[3px_4px_0_rgba(0,0,0,0.08)]
              "
            >
              <Trophy size={25} />
            </div>

            <div>
              <Sticker
                className="
                  bg-[#d9a62e]/10
                  text-[#d9a62e]
                "
              >
                <Star
                  size={11}
                  className="mr-1.5"
                />

                {t(
                  'profile.smallWin',
                  {
                    defaultValue:
                      'Little win',
                  },
                )}
              </Sticker>

              <h3 className="mt-2 text-lg font-black">
                {completedTasks > 0
                  ? t(
                      'profile.completedMessage',
                      {
                        defaultValue:
                          'You already finished {{count}} task!',
                        count:
                          completedTasks,
                      },
                    )
                  : t(
                      'profile.firstWin',
                      {
                        defaultValue:
                          'Finish your first task and start your streak!',
                      },
                    )}
              </h3>
            </div>
          </div>
        </motion.section>

        {/* ================================================================= */}
        {/* LOGOUT                                                            */}
        {/* ================================================================= */}

        <section className="mt-7">
          <button
            type="button"
            onClick={() =>
              navigate('/logout')
            }
            className="
              group
              flex
              w-full
              items-center
              gap-4
              rounded-[25px]
              border-2
              border-[#ee6f96]
              bg-[#ee6f96]/8
              p-4
              text-left
              transition
              hover:-translate-y-0.5
              hover:bg-[#ee6f96]/12
              active:translate-y-0
            "
          >
            <span
              className="
                grid
                size-12
                shrink-0
                place-items-center
                rounded-[17px]
                bg-[#ee6f96]/12
                text-[#ee6f96]
              "
            >
              <LogOut size={20} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black">
                {t(
                  'auth.signOut',
                  {
                    defaultValue:
                      'Sign out',
                  },
                )}
              </span>

              <span
                className="
                  mt-0.5
                  block
                  text-xs
                  font-bold
                  text-muted-foreground
                "
                >
                {t(
                  'profile.signOutDescription',
                  {
                    defaultValue:
                      'See you next time, {{name}}.',
                    name: displayName,
                  },
                )}
              </span>
            </span>

            <span
              className="
                text-2xl
                transition-transform
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </button>
        </section>

        {/* ================================================================= */}
        {/* FOOTER                                                            */}
        {/* ================================================================= */}

        <footer className="pb-3 pt-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">
              ✦
            </span>

            <span
              className="
                text-xs
                font-black
                text-muted-foreground
              "
            >
              {t(
                'profile.footer',
                {
                  defaultValue:
                    'Small steps. Big progress.',
                },
              )}
            </span>

            <span className="text-lg">
              ✦
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}