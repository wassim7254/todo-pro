import React, {
  useRef,
  useState,
} from 'react'

import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Mail,
  Save,
  User,
  X,
} from 'lucide-react'

export interface LocalProfile {
  name: string
  email: string
  avatar: string
}

interface ProfilePanelProps {
  profile: LocalProfile
  onSave: (profile: LocalProfile) => void
  onClose: () => void
}

const MAX_IMAGE_SIZE = 512
const MAX_IMAGE_BYTES = 3 * 1024 * 1024

async function processImage(
  file: File,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error(
      'Please select an image file.',
    )
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(
      'Please choose an image smaller than 3 MB.',
    )
  }

  const objectUrl =
    URL.createObjectURL(file)

  try {
    const image = new Image()

    await new Promise<void>(
      (resolve, reject) => {
        image.onload = () => resolve()

        image.onerror = () =>
          reject(
            new Error(
              'Could not read this image.',
            ),
          )

        image.src = objectUrl
      },
    )

    const scale = Math.min(
      1,
      MAX_IMAGE_SIZE /
        Math.max(
          image.width,
          image.height,
        ),
    )

    const width = Math.max(
      1,
      Math.round(image.width * scale),
    )

    const height = Math.max(
      1,
      Math.round(image.height * scale),
    )

    const canvas =
      document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const context =
      canvas.getContext('2d')

    if (!context) {
      throw new Error(
        'Unable to process the image.',
      )
    }

    context.drawImage(
      image,
      0,
      0,
      width,
      height,
    )

    return canvas.toDataURL(
      'image/jpeg',
      0.82,
    )
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) {
    return 'U'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase()
}

export default function ProfilePanel({
  profile,
  onSave,
  onClose,
}: ProfilePanelProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    )

  const [name, setName] =
    useState(profile.name)

  const [email, setEmail] =
    useState(profile.email)

  const [avatar, setAvatar] =
    useState(profile.avatar || '')

  const [imageLoading, setImageLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [saved, setSaved] =
    useState(false)

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    setError('')
    setSaved(false)
    setImageLoading(true)

    try {
      const image =
        await processImage(file)

      setAvatar(image)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to use this image.',
      )
    } finally {
      setImageLoading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSave = () => {
    const cleanName = name.trim()

    const cleanEmail =
      email.trim().toLowerCase()

    if (!cleanName) {
      setError(
        'Please enter your name.',
      )
      return
    }

    if (!cleanEmail) {
      setError(
        'Please enter your email address.',
      )
      return
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail,
      )
    ) {
      setError(
        'Please enter a valid email address.',
      )
      return
    }

    setError('')

    onSave({
      name: cleanName,
      email: cleanEmail,
      avatar: avatar || '',
    })

    setSaved(true)

    window.setTimeout(() => {
      onClose()
    }, 350)
  }

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl">
      <div className="relative overflow-hidden border-b border-border px-6 pb-6 pt-6 sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <User className="h-3.5 w-3.5" />

              Personal profile
            </div>

            <h2 className="text-2xl font-black tracking-tight">
              Edit profile
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update your photo, name and email.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close profile editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-7 p-6 sm:p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-28 w-28 rounded-[34px] bg-gradient-to-br from-primary via-violet-500 to-pink-500 p-[3px] shadow-xl shadow-primary/20">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[31px] bg-card">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-pink-500/20 text-3xl font-black text-primary">
                    {getInitials(name)}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={imageLoading}
              className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-card bg-foreground text-background shadow-lg transition hover:scale-105 disabled:opacity-60"
              aria-label="Change profile photo"
            >
              {imageLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={imageLoading}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
          >
            <ImagePlus className="h-4 w-4" />

            {imageLoading
              ? 'Processing…'
              : 'Change photo'}
          </button>

          <p className="mt-1 text-xs text-muted-foreground">
            JPG or PNG • maximum 3 MB
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="profile-name"
            className="text-sm font-bold"
          >
            Name
          </label>

          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setSaved(false)
                setError('')
              }}
              autoComplete="name"
              placeholder="Your name"
              className="h-13 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm font-medium outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="profile-email"
            className="text-sm font-bold"
          >
            Email address
          </label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setSaved(false)
                setError('')
              }}
              autoComplete="email"
              placeholder="you@example.com"
              className="h-13 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm font-medium outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Sync info */}
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Check className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold">
                Profile synced with your account
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Changes are saved locally and
                will appear throughout Todo Pro.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl border border-border px-5 text-sm font-bold transition hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={imageLoading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-500 to-pink-500 px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:scale-[1.01] disabled:opacity-60"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export { ProfilePanel }