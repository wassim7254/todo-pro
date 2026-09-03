import {
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

export interface SettingsSection {
  id: string
  label: string
  icon: LucideIcon
}

interface SettingsLayoutProps {
  sections: SettingsSection[]
  activeSection: string
  onSectionChange: (id: string) => void
  children: ReactNode
}

export function SettingsLayout({
  sections,
  activeSection,
  onSectionChange,
  children,
}: SettingsLayoutProps) {
  const active =
    sections.find(
      (section) => section.id === activeSection,
    ) ?? sections[0]

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:gap-7 lg:px-8 lg:py-8">
      {/* Mobile section selector */}
      <div className="lg:hidden">
        <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">
          Settings section
        </label>

        <div className="relative">
          <select
            value={activeSection}
            onChange={(event) =>
              onSectionChange(event.target.value)
            }
            className="w-full appearance-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 pr-12 text-sm font-extrabold text-[var(--text)] shadow-sm outline-none transition focus:border-[var(--accent)]"
          >
            {sections.map((section) => (
              <option
                key={section.id}
                value={section.id}
              >
                {section.label}
              </option>
            ))}
          </select>

          <ChevronRight
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[var(--muted)]"
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-[250px] shrink-0 lg:block">
        <div className="sticky top-6 rounded-[1.7rem] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_12px_40px_rgba(45,41,48,0.06)]">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive =
                activeSection === section.id

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() =>
                    onSectionChange(section.id)
                  }
                  className={[
                    'group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm font-bold transition',
                    isActive
                      ? 'bg-[var(--accent)] text-[#292635] shadow-sm'
                      : 'text-[var(--muted)] hover:bg-black/[0.035] hover:text-[var(--text)] dark:hover:bg-white/[0.06]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'grid size-9 shrink-0 place-items-center rounded-xl transition',
                      isActive
                        ? 'bg-white/40'
                        : 'bg-black/[0.035] dark:bg-white/[0.06]',
                    ].join(' ')}
                  >
                    <Icon size={17} />
                  </span>

                  <span className="min-w-0 flex-1 truncate">
                    {section.label}
                  </span>

                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="shrink-0"
                    />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Current section on mobile */}
      <div className="flex items-center gap-3 lg:hidden">
        {active && (
          <>
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--accent)] text-[#292635]">
              <active.icon size={18} />
            </span>

            <div>
              <p className="text-sm font-extrabold text-[var(--text)]">
                {active.label}
              </p>

              <p className="text-xs font-medium text-[var(--muted)]">
                Customize this part of your app
              </p>
            </div>
          </>
        )}
      </div>

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  )
}