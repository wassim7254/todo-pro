import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { Todo } from '../types/todo.types'
import {
  addDays,
  formatDay,
  isSameDay,
  startOfDay,
} from '../utils/date'

interface CalendarStripProps {
  selectedDate: Date
  todos: Todo[]
  onSelectDate: (date: Date) => void
  onPreviousWeek: () => void
  onNextWeek: () => void
}

/* -------------------------------------------------------------------------- */
/* Playful Components                                                         */
/* -------------------------------------------------------------------------- */

function DoodleStar({ className = '' }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none text-[#d9a62e] ${className}`}
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 0.9, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      ✦
    </motion.span>
  )
}

function Sticker({ children, className = '', rotate = 0 }: { children: React.ReactNode; className?: string; rotate?: number }) {
  return (
    <span
      style={{ rotate: `${rotate}deg` }}
      className={`
        inline-flex items-center rounded-full border-2 border-foreground/10
        bg-card px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]
        shadow-[2px_3px_0_rgba(0,0,0,0.08)] ${className}
      `}
    >
      {children}
    </span>
  )
}

function getWeekDays(anchor: Date): Date[] {
  const first = startOfDay(anchor)
  const day = first.getDay()
  const daysSinceMonday = day === 0 ? 6 : day - 1

  return Array.from(
    { length: 7 },
    (_, index) => addDays(first, index - daysSinceMonday),
  )
}

export function CalendarStrip({
  selectedDate,
  todos,
  onSelectDate,
  onPreviousWeek,
  onNextWeek,
}: CalendarStripProps) {
  const { t } = useTranslation()
  const days = getWeekDays(selectedDate)
  const now = new Date()

  return (
    <section
      aria-label={t('calendar.weekCalendar', { defaultValue: 'Week calendar' })}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border-2
        border-foreground
        bg-card
        p-4
        text-card-foreground
        shadow-[6px_7px_0_rgba(0,0,0,0.1)]
        transition-all
        duration-200
      "
    >
      {/* Playful Top Gradient Strip */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#7764e8] via-[#ee6f96] to-[#d9a62e]" />

      {/* Doodles for vibe */}
      <DoodleStar className="right-4 top-8 text-xl" />
      <span className="absolute left-6 bottom-10 rotate-12 text-2xl font-black text-[#7764e8]/20 pointer-events-none">
        +
      </span>

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="relative z-10 mb-5 flex items-center justify-between px-1 pt-2">
        <div className="min-w-0">
          <Sticker className="bg-[#35a995]/10 text-[#35a995]" rotate={-2}>
            <Sparkles size={10} className="mr-1" />
            {t('calendar.thisWeek', { defaultValue: 'This week' })}
          </Sticker>
          
          <p className="mt-2 text-xs font-black text-muted-foreground uppercase tracking-wider">
            {t('calendar.selectDay', { defaultValue: 'Pick your vibe' })}
          </p>
        </div>

        {/* Week navigation */}
        <div className="flex shrink-0 items-center gap-2 rounded-2xl border-2 border-foreground bg-background p-1 shadow-[3px_3px_0_rgba(0,0,0,0.1)]">
          <button
            type="button"
            onClick={onPreviousWeek}
            className="
              grid size-8 place-items-center rounded-xl 
              text-foreground transition-all duration-200
              hover:bg-muted active:scale-90
            "
          >
            <ChevronLeft size={18} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={onNextWeek}
            className="
              grid size-8 place-items-center rounded-xl 
              text-foreground transition-all duration-200
              hover:bg-muted active:scale-90
            "
          >
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* =================================================
          DAYS
      ================================================== */}

      <div className="relative z-10 grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((day) => {
          const selected = isSameDay(day, selectedDate)
          const today = isSameDay(day, now)
          const taskCount = todos.filter(
            (todo) => !todo.isCompleted && isSameDay(todo.dueDate, day),
          ).length

          return (
            <motion.button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className={`
                group relative flex min-h-[70px] flex-col items-center justify-center 
                rounded-2xl border-2 px-1 py-2 transition-all duration-200
                sm:min-h-[80px]
                ${
                  selected
                    ? `
                      border-foreground 
                      bg-gradient-to-br from-[#7764e8] to-[#ee6f96] 
                      text-white shadow-[4px_4px_0_rgba(0,0,0,0.2)]
                    `
                    : `
                      border-transparent bg-muted/40 text-foreground
                      hover:border-foreground hover:bg-muted
                    `
                }
              `}
            >
              {/* Today Indicator - Cute little dot */}
              {today && (
                <span
                  className={`
                    absolute right-2 top-2 size-2 rounded-full
                    ${selected ? 'bg-white' : 'bg-[#ee6f96]'}
                  `}
                />
              )}

              {/* Day Name */}
              <span
                className={`
                  text-[9px] font-black uppercase tracking-tighter sm:text-[10px]
                  ${selected ? 'text-white/70' : 'text-muted-foreground'}
                `}
              >
                {formatDay(day)}
              </span>

              {/* Date Number */}
              <span
                className={`
                  mt-1 text-lg font-black leading-none tracking-tighter sm:text-xl
                  ${selected ? 'text-white' : 'text-foreground'}
                `}
              >
                {day.getDate()}
              </span>

              {/* Task Indicator - Small chunky pill */}
              <div className="mt-2 flex h-1.5 items-center justify-center">
                {taskCount > 0 ? (
                  <span
                    className={`
                      rounded-full transition-all duration-200
                      ${selected ? 'h-1 w-4 bg-white/50' : 'h-1 w-1 bg-[#7764e8]'}
                    `}
                  />
                ) : (
                  <span className="h-1 w-1 opacity-0" />
                )}
              </div>

              {/* Task Count Badge */}
              {taskCount > 0 && (
                <span
                  className={`
                    absolute -bottom-1 -right-1 
                    grid size-5 place-items-center rounded-full 
                    border-2 border-foreground text-[8px] font-black
                    ${selected ? 'bg-white text-foreground' : 'bg-[#d9a62e] text-white'}
                  `}
                >
                  {taskCount}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}