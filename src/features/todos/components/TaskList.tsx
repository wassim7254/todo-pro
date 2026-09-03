import { AnimatePresence, motion } from 'framer-motion'
import { CheckCheck, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { Todo } from '../types/todo.types'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  todos: Todo[]
  hasActiveFilters: boolean
  onToggle: (id: string) => void
  onOpen: (todo: Todo) => void
  onCreate: () => void
  onClearCompleted: () => void
}

/* -------------------------------------------------------------------------- */
/* PRODUCTIVITY DOODLE                                                        */
/*                                                                            */
/* Work   -> laptop                                                           */
/* Study  -> book + pencil                                                     */
/* Health -> dumbbell                                                          */
/* Tasks  -> checklist                                                         */
/*                                                                            */
/* Hand-drawn SVG only. No emoji characters.                                  */
/* -------------------------------------------------------------------------- */

function DoodleProductivityCreature({
  className = '',
}: {
  className?: string
}) {
  return (
    <motion.svg
      viewBox="0 0 260 190"
      className={`h-48 w-64 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ y: 0, rotate: -1 }}
      animate={{
        y: [0, -4, 0],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Ground shadow */}
      <ellipse
        cx="130"
        cy="171"
        rx="72"
        ry="9"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="none"
      />

      {/* ------------------------------------------------------------------ */}
      {/* BODY                                                               */}
      {/* ------------------------------------------------------------------ */}

      <path
        d="
          M91 76
          C91 59 105 49 128 49
          C151 49 166 60 166 78
          V126
          C166 143 153 153 130 153
          C107 153 91 142 91 126
          Z
        "
        fill="currentColor"
        fillOpacity="0.08"
      />

      {/* ------------------------------------------------------------------ */}
      {/* HEAD                                                               */}
      {/* ------------------------------------------------------------------ */}

      <path
        d="
          M100 55
          C100 35 114 23 132 23
          C151 23 165 36 165 56
          V69
          C165 85 151 95 132 95
          C113 95 100 84 100 69
          Z
        "
        fill="currentColor"
        fillOpacity="0.05"
      />

      {/* Hair */}
      <path d="M119 25 Q121 14 128 23 Q134 12 138 24" />

      {/* ------------------------------------------------------------------ */}
      {/* FACE                                                               */}
      {/* ------------------------------------------------------------------ */}

      {/* Happy eyes */}
      <path d="M114 53 Q119 48 124 53" />
      <path d="M140 53 Q145 48 150 53" />

      {/* Nose */}
      <circle cx="132" cy="62" r="1.8" fill="currentColor" />

      {/* Confident smile */}
      <path d="M119 68 Q132 80 145 68" />

      {/* Cheeks */}
      <path d="M106 64 L111 62" strokeWidth="3" />
      <path d="M153 62 L158 64" strokeWidth="3" />

      {/* ------------------------------------------------------------------ */}
      {/* LEFT ARM                                                           */}
      {/* ------------------------------------------------------------------ */}

      <path d="M94 92 Q78 96 70 111" />
      <path d="M70 111 Q65 116 70 121" />

      {/* ------------------------------------------------------------------ */}
      {/* BOOK — STUDY                                                       */}
      {/* ------------------------------------------------------------------ */}

      <g transform="translate(38 104) rotate(-7)">
        {/* Left page */}
        <path
          d="
            M0 5
            Q15 0 29 7
            V39
            Q15 32 0 38
            Z
          "
          fill="currentColor"
          fillOpacity="0.1"
        />

        {/* Right page */}
        <path
          d="
            M29 7
            Q44 0 58 5
            V38
            Q44 32 29 39
            Z
          "
          fill="currentColor"
          fillOpacity="0.1"
        />

        {/* Spine */}
        <path d="M29 7 V39" />

        {/* Text */}
        <path d="M8 13 H22" strokeWidth="3" />
        <path d="M8 20 H22" strokeWidth="3" />
        <path d="M36 13 H50" strokeWidth="3" />
        <path d="M36 20 H50" strokeWidth="3" />
      </g>

      {/* Pencil */}
      <path d="M51 98 L67 84" />
      <path d="M48 101 L51 98 L48 96" strokeWidth="3" />

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT ARM                                                          */}
      {/* ------------------------------------------------------------------ */}

      <path d="M164 92 Q181 99 188 114" />

      {/* Hand */}
      <circle
        cx="188"
        cy="114"
        r="5"
        fill="currentColor"
        fillOpacity="0.08"
      />

      {/* ------------------------------------------------------------------ */}
      {/* DUMBBELL — HEALTH                                                  */}
      {/* ------------------------------------------------------------------ */}

      <g transform="translate(180 105)">
        {/* Bar */}
        <path d="M0 14 H48" strokeWidth="5" />

        {/* Left weights */}
        <path d="M0 5 V23" strokeWidth="7" />
        <path d="M8 2 V26" strokeWidth="7" />

        {/* Right weights */}
        <path d="M40 2 V26" strokeWidth="7" />
        <path d="M48 5 V23" strokeWidth="7" />
      </g>

      {/* ------------------------------------------------------------------ */}
      {/* LEGS                                                               */}
      {/* ------------------------------------------------------------------ */}

      <path d="M112 150 L108 166" />
      <path d="M146 150 L151 166" />

      {/* Shoes */}
      <path d="M100 166 Q109 162 118 166" />
      <path d="M143 166 Q152 162 161 166" />

      {/* ------------------------------------------------------------------ */}
      {/* LAPTOP — WORK                                                      */}
      {/* ------------------------------------------------------------------ */}

      <g transform="translate(82 116)">
        {/* Screen */}
        <rect
          x="0"
          y="0"
          width="50"
          height="29"
          rx="4"
          fill="currentColor"
          fillOpacity="0.1"
        />

        {/* Code */}
        <path d="M8 9 H27" strokeWidth="3" />
        <path d="M8 16 H36" strokeWidth="3" />
        <path d="M8 23 H22" strokeWidth="3" />

        {/* Laptop base */}
        <path d="M-5 30 H55 Q51 37 45 37 H5 Q-1 37 -5 30 Z" />
      </g>

      {/* ------------------------------------------------------------------ */}
      {/* CHECKLIST — TASKS                                                  */}
      {/* ------------------------------------------------------------------ */}

      <g transform="translate(184 34)">
        {/* Flag pole */}
        <path d="M3 0 V42" />

        {/* Flag */}
        <path
          d="
            M3 2
            H37
            L30 13
            L37 24
            H3
            Z
          "
          fill="currentColor"
          fillOpacity="0.1"
        />

        {/* Check */}
        <path d="M10 13 L16 19 L28 8" strokeWidth="4" />
      </g>

      {/* ------------------------------------------------------------------ */}
      {/* ENERGY LINES                                                       */}
      {/* ------------------------------------------------------------------ */}

      <path d="M62 62 H48" strokeWidth="3" />
      <path d="M58 70 H43" strokeWidth="3" />

      <path d="M194 76 H209" strokeWidth="3" />
      <path d="M198 84 H214" strokeWidth="3" />
    </motion.svg>
  )
}

/* -------------------------------------------------------------------------- */
/* SMALL SECTION LABEL                                                        */
/* -------------------------------------------------------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#35a995]" />

      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
        {children}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* TASK LIST                                                                  */
/* -------------------------------------------------------------------------- */

export function TaskList({
  todos,
  hasActiveFilters,
  onToggle,
  onOpen,
  onCreate,
  onClearCompleted,
}: TaskListProps) {
  const { t } = useTranslation()

  const completed = todos.filter((todo) => todo.isCompleted).length
  const pending = todos.length - completed

  return (
    <section className="pb-28 lg:pb-3">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-5 flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionEyebrow>
            {t('app.focus', {
              defaultValue: 'Current queue',
            })}
          </SectionEyebrow>

          <div className="flex items-end gap-3">
            <h2 className="text-2xl font-black tracking-[-0.05em] text-foreground sm:text-3xl">
              {t('app.focus', {
                defaultValue: 'Focus',
              })}
            </h2>

            {todos.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="
                  mb-1
                  rounded-full
                  border-2
                  border-foreground
                  bg-[#d9a62e]/15
                  px-2.5
                  py-1
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-foreground
                  shadow-[2px_2px_0_rgba(0,0,0,0.08)]
                "
              >
                {pending}{' '}
                {t('app.open', {
                  defaultValue: 'open',
                })}
              </motion.div>
            )}
          </div>

          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {todos.length
              ? t(
                  todos.length === 1
                    ? 'app.tasksInViewOne'
                    : 'app.tasksInViewMany',
                )
              : t('app.roomToBreathe')}
          </p>
        </div>

        {completed > 0 && (
          <motion.button
            type="button"
            onClick={onClearCompleted}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border-2
              border-foreground
              bg-card
              px-4
              py-2
              text-[10px]
              font-black
              uppercase
              tracking-[0.12em]
              text-muted-foreground
              shadow-[3px_3px_0_rgba(0,0,0,0.1)]
              transition-colors
              hover:bg-muted
              hover:text-foreground
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-foreground
              focus-visible:ring-offset-2
            "
          >
            <CheckCheck size={14} strokeWidth={3} />

            {t('app.clearDone')}
          </motion.button>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TASK GRID / EMPTY STATE                                             */}
      {/* ------------------------------------------------------------------ */}

      <AnimatePresence mode="popLayout" initial={false}>
        {todos.length > 0 ? (
          <motion.div
            key="tasks"
            layout
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                layout
                initial={{
                  opacity: 0,
                  y: 14,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(index * 0.035, 0.18),
                }}
              >
                <TaskCard
                  todo={todo}
                  onToggle={onToggle}
                  onOpen={onOpen}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 24,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: -10,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
            }}
            className="
              relative
              min-h-[390px]
              overflow-hidden
              rounded-[40px]
              border-2
              border-foreground
              bg-card
              px-6
              py-10
              text-center
              shadow-[8px_8px_0_rgba(0,0,0,0.07)]
            "
          >
            {/* ------------------------------------------------------------ */}
            {/* DECORATIVE BACKGROUND                                         */}
            {/* ------------------------------------------------------------ */}

            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ee6f96]/15" />

            <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-[#7764e8]/10" />

            <div className="pointer-events-none absolute left-1/2 top-8 h-3 w-14 -translate-x-1/2 rotate-[-4deg] rounded-full bg-[#d9a62e]/30" />

            {/* ------------------------------------------------------------ */}
            {/* ILLUSTRATION                                                   */}
            {/* ------------------------------------------------------------ */}

            <div className="relative mx-auto mb-4 flex h-48 w-full max-w-[280px] items-center justify-center">
              {hasActiveFilters ? (
                <motion.div
                  initial={{
                    rotate: -8,
                    scale: 0.8,
                  }}
                  animate={{
                    rotate: [-8, 4, -4, 0],
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                  className="
                    relative
                    grid
                    size-24
                    place-items-center
                    rounded-[28px]
                    border-2
                    border-foreground
                    bg-muted
                    text-muted-foreground
                    shadow-[5px_5px_0_rgba(0,0,0,0.1)]
                  "
                >
                  <SearchX
                    size={42}
                    strokeWidth={3}
                  />

                  {/* Tiny decorative magnifier handle */}
                  <span className="absolute -bottom-3 -right-3 h-6 w-6 rotate-12 rounded-lg border-2 border-foreground bg-[#d9a62e]" />
                </motion.div>
              ) : (
                <>
                  {/* Background blob */}
                  <div className="absolute left-1/2 top-3 h-40 w-52 -translate-x-1/2 rounded-[45%] bg-[#35a995]/10" />

                  {/* Main character */}
                  <DoodleProductivityCreature className="relative z-10 text-[#7764e8]" />

                  {/* Status sticker */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                      rotate: 8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: [8, 5, 8],
                    }}
                    transition={{
                      opacity: {
                        delay: 0.25,
                      },
                      scale: {
                        delay: 0.25,
                      },
                      rotate: {
                        delay: 0.5,
                        duration: 2.5,
                        repeat: Infinity,
                      },
                    }}
                    className="
                      absolute
                      right-1
                      top-1
                      z-20
                      rounded-2xl
                      border-2
                      border-foreground
                      bg-[#d9a62e]
                      px-3
                      py-2
                      text-[9px]
                      font-black
                      uppercase
                      tracking-wider
                      text-foreground
                      shadow-[3px_3px_0_rgba(0,0,0,0.12)]
                    "
                  >
                    {t('app.buildChill', {
                      defaultValue: 'build: ready',
                    })}
                  </motion.div>
                </>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* TITLE                                                          */}
            {/* ------------------------------------------------------------ */}

            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-[-0.045em] text-foreground sm:text-3xl">
                {hasActiveFilters
                  ? t('app.noMatches', {
                      defaultValue: 'Nothing matched the query.',
                    })
                  : t('app.readyForTheNextOne', {
                      defaultValue: 'Ready for the next mission.',
                    })}
              </h3>

              {/* ---------------------------------------------------------- */}
              {/* DESCRIPTION                                                 */}
              {/* ---------------------------------------------------------- */}

              <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-relaxed text-muted-foreground">
                {hasActiveFilters
                  ? t('app.noMatchesDescription', {
                      defaultValue:
                        'The query returned zero results. The database is innocent. Try changing the filters.',
                    })
                  : t('app.productivityCreatureDescription', {
                      defaultValue:
                        'Work is handled. Knowledge is loading. Health is compiling. Give this little professional another task.',
                    })}
              </p>

              {/* ---------------------------------------------------------- */}
              {/* SYSTEM STATUS                                               */}
              {/* ---------------------------------------------------------- */}

              {!hasActiveFilters && (
                <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border-2 border-border bg-background px-3 py-1.5">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#35a995] opacity-60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-[#35a995]" />
                  </span>

                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {t('app.systemIdle', {
                      defaultValue: 'System idle',
                    })}
                  </span>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* CREATE TASK                                                  */}
              {/* ---------------------------------------------------------- */}

              <motion.button
                type="button"
                onClick={onCreate}
                whileHover={{
                  y: -3,
                  rotate: -1,
                }}
                whileTap={{
                  y: 2,
                  rotate: 0,
                }}
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border-2
                  border-foreground
                  bg-gradient-to-r
                  from-[#7764e8]
                  to-[#ee6f96]
                  px-7
                  py-3.5
                  text-sm
                  font-black
                  text-white
                  shadow-[5px_5px_0_rgba(0,0,0,0.18)]
                  transition-shadow
                  hover:shadow-[7px_7px_0_rgba(0,0,0,0.18)]
                  active:shadow-none
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-foreground
                  focus-visible:ring-offset-2
                "
              >
                <CheckCheck
                  size={18}
                  strokeWidth={3}
                />

                {t('app.createTask', {
                  defaultValue: 'Create task',
                })}
              </motion.button>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* DECORATIVE FOOTER                                             */}
            {/* ------------------------------------------------------------ */}

            <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 opacity-40">
              <span className="h-1.5 w-8 rotate-[-3deg] rounded-full bg-[#ee6f96]" />
              <span className="h-1.5 w-12 rotate-[2deg] rounded-full bg-[#7764e8]" />
              <span className="h-1.5 w-6 rotate-[-2deg] rounded-full bg-[#35a995]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}