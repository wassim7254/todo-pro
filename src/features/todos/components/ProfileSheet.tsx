import { AnimatePresence, motion } from 'framer-motion'
import {
  LogOut,
  PenLine,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Profile {
  name: string
  email: string
}

interface ProfileSheetProps {
  isOpen: boolean
  onClose: () => void
}

const PROFILE_STORAGE_KEY = 'todo-pro:profile:v1'

const defaultProfile: Profile = {
  name: 'Wassim',
  email: '',
}

function readProfile(): Profile {
  if (typeof window === 'undefined') {
    return defaultProfile
  }

  try {
    const stored = window.localStorage.getItem(
      PROFILE_STORAGE_KEY,
    )

    if (!stored) return defaultProfile

    const parsed = JSON.parse(stored) as Partial<Profile>

    return {
      name:
        typeof parsed.name === 'string'
          ? parsed.name
          : defaultProfile.name,
      email:
        typeof parsed.email === 'string'
          ? parsed.email
          : defaultProfile.email,
    }
  } catch {
    return defaultProfile
  }
}

export function ProfileSheet({
  isOpen,
  onClose,
}: ProfileSheetProps) {
  const { t } = useTranslation()

  const [profile, setProfile] =
    useState<Profile>(defaultProfile)

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setProfile(readProfile())
      setSaved(false)
    }
  }, [isOpen])

  const updateProfile = (
    field: keyof Profile,
    value: string,
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))

    setSaved(false)
  }

  const saveProfile = () => {
    const normalized = {
      name: profile.name.trim() || 'Wassim',
      email: profile.email.trim(),
    }

    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(normalized),
    )

    setProfile(normalized)
    setSaved(true)
  }

  const signOut = () => {
    window.localStorage.removeItem(
      PROFILE_STORAGE_KEY,
    )

    setProfile(defaultProfile)
    setSaved(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#2b2230]/35 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-sheet-title"
            initial={{
              y: 34,
              opacity: 0.7,
              scale: 0.985,
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              y: 26,
              opacity: 0.6,
              scale: 0.985,
            }}
            transition={{
              type: 'spring',
              stiffness: 410,
              damping: 34,
            }}
            className="w-full max-w-[520px] overflow-hidden rounded-t-[2rem] bg-[#fffaf7] shadow-[0_22px_80px_rgba(42,29,34,0.3)] sm:rounded-[2rem]"
          >
            <div className="px-5 pb-7 pt-4 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a8e89]">
                    {t('profile.account')}
                  </p>

                  <h2
                    id="profile-sheet-title"
                    className="mt-1 text-2xl font-extrabold tracking-[-0.055em] text-[#302b2d]"
                  >
                    {t('profile.title')}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t(
                    'accessibility.closeProfile',
                  )}
                  className="grid size-10 place-items-center rounded-2xl bg-[#f4ece8] text-[#706660] transition hover:bg-[#ece2dd]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center rounded-[1.6rem] bg-[#eee9ff] px-5 py-6">
                <div className="grid size-20 place-items-center rounded-[1.7rem] bg-white text-[#6c5de0] shadow-[0_10px_25px_rgba(90,75,180,0.1)]">
                  <UserRound
                    size={34}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-4 text-lg font-extrabold text-[#373153]">
                  {profile.name ||
                    t('profile.title')}
                </p>

                <p className="mt-1 text-sm font-medium text-[#706995]">
                  {profile.email ||
                    t('profile.emailPlaceholder')}
                </p>
              </div>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#8f837e]">
                    {t('profile.email')}
                  </span>

                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      updateProfile(
                        'email',
                        event.target.value,
                      )
                    }
                    placeholder={t(
                      'profile.emailPlaceholder',
                    )}
                    className="w-full rounded-2xl border border-[#e5d9d2] bg-white px-4 py-3.5 text-sm font-semibold text-[#332e30] placeholder:text-[#b8ada8]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#8f837e]">
                    {t('profile.name')}
                  </span>

                  <div className="relative">
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(event) =>
                        updateProfile(
                          'name',
                          event.target.value,
                        )
                      }
                      placeholder={t(
                        'profile.namePlaceholder',
                      )}
                      className="w-full rounded-2xl border border-[#e5d9d2] bg-white px-4 py-3.5 pr-12 text-sm font-semibold text-[#332e30] placeholder:text-[#b8ada8]"
                    />

                    <PenLine
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#a39892]"
                    />
                  </div>
                </label>

                <button
                  type="button"
                  onClick={saveProfile}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2d293e] px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(45,41,62,0.18)] transition hover:-translate-y-0.5 hover:bg-[#3a354f]"
                >
                  <PenLine size={17} />
                  {saved
                    ? t('actions.profileSaved')
                    : t('actions.saveProfile')}
                </button>

                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-[#c74f61] transition hover:bg-[#fff0f2]"
                >
                  <LogOut size={16} />
                  {t('actions.signOut')}
                </button>

                <p className="text-center text-xs font-medium leading-5 text-[#a09590]">
                  {t('profile.storedLocally')}
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}