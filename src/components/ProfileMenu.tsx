import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { Avatar } from './Avatar'

export function ProfileMenu() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClick,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClick,
      )
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <div
      className="relative"
      ref={ref}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full p-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
        aria-expanded={open}
      >
        <Avatar
          name={user.name}
          src={user.avatar}
          size="sm"
        />

        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold">
            {user.name}
          </p>

          <p className="text-xs text-[var(--muted)]">
            @{user.name}
          </p>
        </div>

        <span className="text-xs">
          ⌄
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[var(--border)] p-3">
            <Avatar
              name={user.name}
              src={user.avatar}
            />

            <div className="min-w-0">
              <p className="truncate font-semibold">
                {user.name}
              </p>

              <p className="truncate text-sm text-[var(--muted)]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="p-1">
            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => {
                window.history.pushState(
                  {},
                  '',
                  '/settings',
                )

                window.dispatchEvent(
                  new PopStateEvent('popstate'),
                )

                setOpen(false)
              }}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />

                {t('navigation.settings')}
              </div>
            </button>

            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
              onClick={logout}
            >
              ↪ {t('navigation.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}