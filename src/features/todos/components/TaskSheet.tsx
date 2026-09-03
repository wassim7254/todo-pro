import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CSSProperties } from 'react'
import {
  categories,
  priorityMeta,
} from '../data/categories'
import type {
  Todo,
  TodoDraft,
} from '../types/todo.types'
import {
  formatDueLabel,
  fromDateInput,
  toDateInput,
} from '../utils/date'

interface TaskSheetProps {
  mode: 'create' | 'detail'
  todo: Todo | null
  defaultDraft: TodoDraft
  onClose: () => void
  onCreate: (draft: TodoDraft) => void
  onUpdate: (id: string, draft: TodoDraft) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

function draftFromTodo(
  todo: Todo | null,
  fallback: TodoDraft,
): TodoDraft {
  if (!todo) {
    return {
      ...fallback,
      dueDate: fallback.dueDate
        ? new Date(fallback.dueDate)
        : null,
    }
  }

  return {
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    category: todo.category,
    dueDate: todo.dueDate
      ? new Date(todo.dueDate)
      : null,
    time: todo.time,
  }
}

function getTaskColors(categoryId: string) {
  switch (categoryId) {
    case 'personal':
      return {
        light: '#fff0f5',
        dark: '#35212c',
        borderLight: '#ffd4e1',
        borderDark: '#653746',
        accent: '#ee6f96',
      }

    case 'work':
      return {
        light: '#f1eeff',
        dark: '#282542',
        borderLight: '#ddd5ff',
        borderDark: '#4d4676',
        accent: '#7764e8',
      }

    case 'study':
      return {
        light: '#eaf8f3',
        dark: '#153631',
        borderLight: '#cceee3',
        borderDark: '#286158',
        accent: '#35a995',
      }

    case 'sport':
      return {
        light: '#fff5d9',
        dark: '#3a301c',
        borderLight: '#ffe4a0',
        borderDark: '#725b24',
        accent: '#e7ad39',
      }

    case 'health':
      return {
        light: '#fff0e8',
        dark: '#3b2822',
        borderLight: '#ffd7c5',
        borderDark: '#6d493d',
        accent: '#ed8664',
      }

    default:
      return {
        light: '#f5f1ff',
        dark: '#292640',
        borderLight: '#e3dcff',
        borderDark: '#4c4670',
        accent: '#806ee8',
      }
  }
}

/**
 * Small category character.
 *
 * IMPORTANT:
 * We deliberately do NOT animate the SVG `d` attribute.
 * Framer Motion path interpolation can produce undefined values
 * when two paths don't have identical command structures.
 */
function CategoryCharacter({
  category,
  completed,
}: {
  category: string
  completed: boolean
}) {
  let body: JSX.Element

  switch (category) {
    case 'personal':
      body = (
        <>
          <path
            d="M34 57h40c5 0 9 4 9 9v32c0 5-4 9-9 9H34c-5 0-9-4-9-9V66c0-5 4-9 9-9Z"
            fill="#fff"
            stroke="#342b3c"
            strokeWidth="4"
          />
          <path
            d="M35 68h38M35 79h25M35 90h19"
            fill="none"
            stroke="#ee6f96"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M78 48c0-7-10-9-13-2-3-7-13-5-13 2 0 7 13 14 13 14s13-7 13-14Z"
            fill="#ee6f96"
            stroke="#342b3c"
            strokeWidth="3"
          />
        </>
      )
      break

    case 'work':
      body = (
        <>
          <rect
            x="22"
            y="57"
            width="76"
            height="49"
            rx="8"
            fill="#fff"
            stroke="#342b3c"
            strokeWidth="4"
          />
          <path
            d="M42 50h36c3 0 5 3 5 7v4H37v-4c0-4 2-7 5-7Z"
            fill="#7764e8"
            stroke="#342b3c"
            strokeWidth="4"
          />
          <path
            d="M40 72h40M40 83h25M40 94h16"
            fill="none"
            stroke="#7764e8"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="82" cy="72" r="4" fill="#7764e8" />
        </>
      )
      break

    case 'study':
      body = (
        <>
          <path
            d="M28.5 8.5c-4.2-2-8.1-1.7-11.5.8v18c3.4-2.5 7.3-2.8 11.5-.8v-18Z"
            transform="translate(16 48)"
            fill="#35a995"
            stroke="#342b3c"
            strokeWidth="3"
          />
          <path
            d="M28.5 8.5c4.2-2 8.1-1.7 11.5.8v18c-3.4-2.5-7.3-2.8-11.5-.8v-18Z"
            transform="translate(16 48)"
            fill="#fff"
            stroke="#342b3c"
            strokeWidth="3"
          />
          <path
            d="M49 57v25"
            fill="none"
            stroke="#342b3c"
            strokeWidth="3"
          />
          <path
            d="M35 68h10M54 68h10M35 76h8M54 76h9"
            fill="none"
            stroke="#35a995"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </>
      )
      break

    case 'health':
      body = (
        <>
          <rect
            x="25"
            y="57"
            width="70"
            height="50"
            rx="10"
            fill="#fff"
            stroke="#342b3c"
            strokeWidth="4"
          />
          <path
            d="M60 68v28M46 82h28"
            stroke="#ed8664"
            strokeLinecap="round"
            strokeWidth="7"
          />
          <path
            d="M50 52c0-5 4-9 10-9s10 4 10 9"
            fill="none"
            stroke="#342b3c"
            strokeWidth="4"
          />
        </>
      )
      break

    case 'sport':
      body = (
        <>
          <circle
            cx="60"
            cy="81"
            r="28"
            fill="#e7ad39"
            stroke="#342b3c"
            strokeWidth="4"
          />
          <path
            d="M60 53v13M36 74l13 8M84 74 71 82M47 101l7-12M73 101l-7-12"
            fill="none"
            stroke="#342b3c"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      )
      break

    default:
      body = (
        <>
          <rect
            x="27"
            y="57"
            width="66"
            height="50"
            rx="8"
            fill="#fff"
            stroke="#342b3c"
            strokeWidth="4"
          />
          <path
            d="M42 57v-8c0-4 3-7 7-7h22c4 0 7 3 7 7v8"
            fill="none"
            stroke="#806ee8"
            strokeWidth="5"
          />
          <path
            d="M42 72h36M42 84h26M42 96h17"
            fill="none"
            stroke="#806ee8"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      )
  }

  return (
    <motion.svg
      width="112"
      height="108"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={false}
      animate={
        completed
          ? {
              y: -3,
              rotate: -2,
              scale: 1.03,
            }
          : {
              y: 0,
              rotate: 0,
              scale: 1,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 18,
      }}
      aria-hidden="true"
    >
      {/* Head */}
      <circle
        cx="60"
        cy="38"
        r="24"
        fill="#ffd8bf"
        stroke="#342b3c"
        strokeWidth="4"
      />

      {/* Hair */}
      <path
        d="M38 36c1-16 11-25 23-25 12 0 22 8 23 24-6-5-11-7-17-7-8 0-14 3-20 8-2 2-5 2-9 0Z"
        fill="#342b3c"
      />

      {/* Eyes */}
      <motion.circle
        cx="51"
        cy="39"
        r="3"
        initial={false}
        animate={{
          scaleY: completed ? 0.35 : 1,
        }}
        transition={{
          duration: 0.18,
        }}
        fill="#342b3c"
      />

      <motion.circle
        cx="69"
        cy="39"
        r="3"
        initial={false}
        animate={{
          scaleY: completed ? 0.35 : 1,
        }}
        transition={{
          duration: 0.18,
        }}
        fill="#342b3c"
      />

      {/* Blush */}
      <motion.ellipse
        cx="46"
        cy="48"
        rx="5"
        ry="2.5"
        initial={false}
        animate={{
          opacity: completed ? 0.85 : 0.35,
        }}
        transition={{
          duration: 0.2,
        }}
        fill="#ee6f96"
      />

      <motion.ellipse
        cx="74"
        cy="48"
        rx="5"
        ry="2.5"
        initial={false}
        animate={{
          opacity: completed ? 0.85 : 0.35,
        }}
        transition={{
          duration: 0.2,
        }}
        fill="#ee6f96"
      />

      {/* Mouth — static path selection, no d animation */}
      {completed ? (
        <path
          d="M51 51c3 5 15 5 18 0"
          fill="none"
          stroke="#342b3c"
          strokeLinecap="round"
          strokeWidth="3"
        />
      ) : (
        <path
          d="M54 51c4 2 8 2 12 0"
          fill="none"
          stroke="#342b3c"
          strokeLinecap="round"
          strokeWidth="3"
        />
      )}

      {/* Body */}
      <path
        d="M39 67c0-7 6-12 13-12h16c7 0 13 5 13 12v39H39V67Z"
        fill="#fff"
        stroke="#342b3c"
        strokeWidth="4"
      />

      {/* Category object */}
      {body}

      {/* Left arm */}
      <motion.path
        d={
          completed
            ? 'M39 76c-6-2-11-7-13-14'
            : 'M39 78c-7 2-11 7-12 13'
        }
        fill="none"
        stroke="#342b3c"
        strokeLinecap="round"
        strokeWidth="6"
        initial={false}
        animate={{
          x: completed ? -2 : 0,
          y: completed ? -3 : 0,
          rotate: completed ? -4 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 18,
        }}
      />

      {/* Right arm */}
      <motion.path
        d={
          completed
            ? 'M81 76c7-3 11-8 13-15'
            : 'M81 78c7 2 11 7 12 13'
        }
        fill="none"
        stroke="#342b3c"
        strokeLinecap="round"
        strokeWidth="6"
        initial={false}
        animate={{
          x: completed ? 2 : 0,
          y: completed ? -3 : 0,
          rotate: completed ? 4 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 18,
        }}
      />

      {/* Hands */}
      <motion.circle
        cx="25"
        cy="61"
        r="5"
        fill="#ffd8bf"
        stroke="#342b3c"
        strokeWidth="3"
        initial={false}
        animate={{
          x: completed ? -1 : 0,
          y: completed ? -3 : 0,
        }}
      />

      <motion.circle
        cx="95"
        cy="61"
        r="5"
        fill="#ffd8bf"
        stroke="#342b3c"
        strokeWidth="3"
        initial={false}
        animate={{
          x: completed ? 1 : 0,
          y: completed ? -3 : 0,
        }}
      />

      {/* Tiny feet */}
      <path
        d="M48 106v6M72 106v6"
        stroke="#342b3c"
        strokeLinecap="round"
        strokeWidth="5"
      />

      <motion.path
        d="M43 113h10M67 113h10"
        stroke="#342b3c"
        strokeLinecap="round"
        strokeWidth="5"
        initial={false}
        animate={{
          x: completed ? -2 : 0,
        }}
      />
    </motion.svg>
  )
}

function TaskBuddy({
  category,
  completed,
}: {
  category: string
  completed: boolean
}) {
  return (
    <motion.div
      className="
        relative
        flex
        h-[108px]
        w-[112px]
        shrink-0
        items-center
        justify-center
        sm:h-[118px]
        sm:w-[122px]
      "
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: completed ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 20,
      }}
    >
      <CategoryCharacter
        category={category}
        completed={completed}
      />

      <AnimatePresence>
        {completed && (
          <>
            <motion.span
              className="
                absolute
                left-2
                top-5
                h-2
                w-2
                rounded-full
                bg-[#ee6f96]
              "
              initial={{
                opacity: 0,
                scale: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: -4,
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.35,
              }}
            />

            <motion.span
              className="
                absolute
                right-2
                top-8
                h-2
                w-2
                rounded-full
                bg-[#7764e8]
              "
              initial={{
                opacity: 0,
                scale: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: -5,
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{
                delay: 0.05,
                duration: 0.35,
              }}
            />

            <motion.span
              className="
                absolute
                bottom-3
                right-5
                h-1.5
                w-1.5
                rounded-full
                bg-[#35a995]
              "
              initial={{
                opacity: 0,
                scale: 0,
                y: -4,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 2,
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.3,
              }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function TaskSheet({
  mode,
  todo,
  defaultDraft,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onToggle,
}: TaskSheetProps) {
  const { t } = useTranslation()

  const [isEditing, setIsEditing] = useState(
    mode === 'create',
  )

  const [draft, setDraft] = useState<TodoDraft>(() =>
    draftFromTodo(todo, defaultDraft),
  )

  const [isCompleted, setIsCompleted] = useState(
    todo?.isCompleted ?? false,
  )

  useEffect(() => {
    setIsEditing(mode === 'create')
    setDraft(draftFromTodo(todo, defaultDraft))
    setIsCompleted(todo?.isCompleted ?? false)
  }, [
    mode,
    todo?.id,
    todo?.isCompleted,
    defaultDraft,
  ])

  if (mode === 'detail' && !todo) {
    return null
  }

  const categoryColors = todo
    ? getTaskColors(todo.category)
    : getTaskColors(draft.category)

  const activeCategory = todo
    ? todo.category
    : draft.category

  const categoryStyle = {
    '--task-bg-light': categoryColors.light,
    '--task-bg-dark': categoryColors.dark,
    '--task-border-light': categoryColors.borderLight,
    '--task-border-dark': categoryColors.borderDark,
    '--task-accent': categoryColors.accent,
  } as CSSProperties

  const inputClassName = `
    w-full
    rounded-2xl
    border
    border-[var(--border)]
    bg-[var(--surface-muted)]
    px-4
    py-3
    text-[var(--text)]
    outline-none
    transition
    placeholder:text-[var(--muted)]
    focus:border-[var(--accent)]
    focus:ring-4
    focus:ring-[color-mix(in_srgb,var(--accent)_14%,transparent)]
  `

  const buttonBase = `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-2xl
    border-2
    px-4
    py-3
    font-semibold
    transition-all
    duration-200
    active:translate-y-[1px]
    active:shadow-none
  `

  function updateDraft(
    patch: Partial<TodoDraft>,
  ) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }))
  }

  function handleSave() {
    const title = draft.title.trim()
    const description = draft.description.trim()

    if (!title) {
      return
    }

    const nextDraft: TodoDraft = {
      ...draft,
      title,
      description,
    }

    if (mode === 'create') {
      onCreate(nextDraft)
    } else if (todo) {
      onUpdate(todo.id, nextDraft)
    }

    onClose()
  }

  function handleToggle() {
    if (!todo) return

    setIsCompleted((current) => !current)
    onToggle(todo.id)
  }

  const categoryLabel =
    categories.find(
      (category) => category.id === activeCategory,
    )?.label ?? activeCategory

  const priority = todo
    ? priorityMeta[todo.priority]
    : priorityMeta[draft.priority]

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-end justify-center
        bg-[rgba(30,24,38,0.34)]
        p-0
        backdrop-blur-[5px]
        sm:items-center
        sm:p-5
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 30,
        }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 32,
        }}
        className="
          max-h-[94vh]
          w-full
          max-w-[560px]
          overflow-y-auto
          rounded-t-[2rem]
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-5
          pb-[calc(1.5rem+env(safe-area-inset-bottom))]
          pt-3
          text-[var(--text)]
          shadow-[0_24px_90px_rgba(35,25,45,0.25)]
          sm:max-h-[88vh]
          sm:rounded-[2rem]
          sm:p-7
        "
        style={categoryStyle}
      >
        {/* Mobile drag handle */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--border)] sm:hidden" />

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div
              className="
                mb-2
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[var(--accent)]
              "
            >
              {mode === 'create'
                ? t(
                    'todos.taskSheet.newTask',
                    'New task',
                  )
                : t(
                    'todos.taskSheet.taskDetails',
                    'Task details',
                  )}
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[var(--text)]">
              {mode === 'create'
                ? t(
                    'todos.taskSheet.createTitle',
                    'Create a task',
                  )
                : t(
                    'todos.taskSheet.detailsTitle',
                    'Task details',
                  )}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t(
              'common.close',
              'Close',
            )}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--surface-muted)]
              text-[var(--muted)]
              transition
              hover:scale-105
              hover:text-[var(--text)]
            "
          >
            <X size={18} />
          </button>
        </div>

        {mode === 'detail' && todo && !isEditing ? (
          <>
            {/* Detail card */}
            <div
              className="
                rounded-[1.5rem]
                border
                border-border
                bg-card
                p-5
                text-foreground
                shadow-[0_4px_18px_rgba(35,25,45,0.05)]
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div
                    className="
                      mb-3
                      inline-flex
                      items-center
                      rounded-full
                      border
                      px-3
                      py-1
                      text-xs
                      font-bold
                    "
                    style={{
                      color: categoryColors.accent,
                      backgroundColor:
                        'var(--task-bg-light)',
                      borderColor:
                        'var(--task-border-light)',
                    }}
                  >
                    {categoryLabel}
                  </div>

                  <h3 className="text-xl font-black leading-tight text-foreground">
                    {todo.title}
                  </h3>

                  {todo.description && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {todo.description}
                    </p>
                  )}
                </div>

                <TaskBuddy
                  category={activeCategory}
                  completed={isCompleted}
                />
              </div>

              <div className="mt-5 grid gap-2">
                <div className="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
                  <CalendarDays
                    size={17}
                    className="shrink-0 text-muted-foreground"
                  />

                  <span className="text-sm text-muted-foreground">
                    {t(
                      'todos.taskSheet.dueDate',
                      'Due date',
                    )}
                  </span>

                  <span className="ml-auto text-sm font-semibold text-foreground">
                    {todo.dueDate
                      ? formatDueLabel(
                          new Date(todo.dueDate),
                        )
                      : t(
                          'todos.taskSheet.noDueDate',
                          'No due date',
                        )}
                  </span>
                </div>

                {todo.time && (
                  <div className="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
                    <Clock3
                      size={17}
                      className="shrink-0 text-muted-foreground"
                    />

                    <span className="text-sm text-muted-foreground">
                      {t(
                        'todos.taskSheet.time',
                        'Time',
                      )}
                    </span>

                    <span className="ml-auto text-sm font-semibold text-foreground">
                      {todo.time}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`
                    inline-flex
                    items-center
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    ${priority.className}
                  `}
                >
                  {priority.label}
                </span>

                <motion.span
                  layout
                  className={`
                    inline-flex
                    items-center
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    ${
                      isCompleted
                        ? 'border-[#bde8dd] bg-[#e6f8f3] text-[#247665] dark:border-[#286158] dark:bg-[#153631] dark:text-[#8ee1cf]'
                        : 'border-[var(--task-border-light)] bg-[var(--task-bg-light)] text-[var(--task-accent)] dark:border-[var(--task-border-dark)] dark:bg-[var(--task-bg-dark)]'
                    }
                  `}
                >
                  {isCompleted
                    ? t(
                        'todos.taskSheet.completed',
                        'Completed',
                      )
                    : t(
                        'todos.taskSheet.inProgress',
                        'In progress',
                      )}
                </motion.span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.button
                  key={
                    isCompleted
                      ? 'mark-incomplete'
                      : 'complete'
                  }
                  type="button"
                  onClick={handleToggle}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: 4,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: -4,
                  }}
                  transition={{
                    duration: 0.16,
                  }}
                  className={`
                    ${buttonBase}
                    ${
                      isCompleted
                        ? `
                          border-[#bde8dd]
                          bg-[#e6f8f3]
                          text-[#247665]
                          shadow-[0_4px_0_#bde8dd]
                          hover:bg-[#d9f3ec]
                          dark:border-[#286158]
                          dark:bg-[#153631]
                          dark:text-[#8ee1cf]
                          dark:shadow-[0_4px_0_#286158]
                        `
                        : `
                          border-[var(--accent)]
                          bg-[var(--accent)]
                          text-white
                          shadow-[0_4px_0_color-mix(in_srgb,var(--accent)_65%,#000)]
                          hover:brightness-[1.04]
                        `
                    }
                  `}
                >
                  <motion.span
                    initial={false}
                    animate={{
                      rotate: isCompleted ? 0 : -8,
                      scale: isCompleted ? 1 : 1.05,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 18,
                    }}
                  >
                    <Check size={18} />
                  </motion.span>

                  {isCompleted
                    ? t(
                        'todos.taskSheet.markIncomplete',
                        'Mark incomplete',
                      )
                    : t(
                        'todos.taskSheet.complete',
                        'Complete',
                      )}
                </motion.button>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={`
                  ${buttonBase}
                  border-[#8fcbd7]
                  bg-[#B0E0E6]
                  text-[#356d78]
                  shadow-[0_4px_0_#8fcbd7]
                  hover:bg-[#a4d8e0]
                  hover:border-[#7fc1ce]
                  dark:border-[#5f9eaa]
                  dark:bg-[#31545b]
                  dark:text-[#c9f1f6]
                  dark:shadow-[0_4px_0_#5f9eaa]
                  dark:hover:bg-[#3b646c]
                `}
              >
                <Pencil size={17} />
                {t(
                  'todos.taskSheet.edit',
                  'Edit',
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onDelete(todo.id)
                  onClose()
                }}
                className={`
                  ${buttonBase}
                  border-[#f0aebe]
                  bg-[#FFD1DC]
                  text-[#a84f69]
                  shadow-[0_4px_0_#f0aebe]
                  hover:bg-[#ffc3d1]
                  hover:border-[#e99caf]
                  dark:border-[#a86176]
                  dark:bg-[#59303d]
                  dark:text-[#ffcbd8]
                  dark:shadow-[0_4px_0_#a86176]
                  dark:hover:bg-[#693847]
                  sm:col-span-2
                `}
              >
                <Trash2 size={17} />
                {t(
                  'todos.taskSheet.delete',
                  'Delete',
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit/Create form */}
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="task-title"
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-[var(--text)]
                  "
                >
                  {t(
                    'todos.taskSheet.title',
                    'Title',
                  )}
                </label>

                <input
                  id="task-title"
                  value={draft.title}
                  onChange={(event) =>
                    updateDraft({
                      title: event.target.value,
                    })
                  }
                  placeholder={t(
                    'todos.taskSheet.titlePlaceholder',
                    'What needs to be done?',
                  )}
                  className={inputClassName}
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="task-description"
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-[var(--text)]
                  "
                >
                  {t(
                    'todos.taskSheet.description',
                    'Description',
                  )}
                </label>

                <textarea
                  id="task-description"
                  value={draft.description}
                  onChange={(event) =>
                    updateDraft({
                      description:
                        event.target.value,
                    })
                  }
                  placeholder={t(
                    'todos.taskSheet.descriptionPlaceholder',
                    'Add a little more detail...',
                  )}
                  rows={4}
                  className={`${inputClassName} resize-none`}
                />
              </div>

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-[var(--text)]
                  "
                >
                  {t(
                    'todos.taskSheet.category',
                    'Category',
                  )}
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categories.map((category) => {
                    const colors = getTaskColors(
                      category.id,
                    )

                    const selected =
                      draft.category === category.id

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          updateDraft({
                            category:
                              category.id,
                          })
                        }
                        className={`
                          rounded-2xl
                          border-2
                          px-3
                          py-3
                          text-sm
                          font-bold
                          transition
                          ${
                            selected
                              ? 'scale-[1.02] shadow-[0_4px_0_color-mix(in_srgb,var(--task-accent)_55%,#000)]'
                              : 'opacity-80 hover:opacity-100'
                          }
                        `}
                        style={{
                          color: colors.accent,
                          backgroundColor:
                            colors.light,
                          borderColor: selected
                            ? colors.accent
                            : colors.borderLight,
                        }}
                      >
                        {category.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-[var(--text)]
                  "
                >
                  {t(
                    'todos.taskSheet.priority',
                    'Priority',
                  )}
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(priorityMeta).map(
                    ([priorityId, meta]) => {
                      const selected =
                        draft.priority ===
                        priorityId

                      return (
                        <button
                          key={priorityId}
                          type="button"
                          onClick={() =>
                            updateDraft({
                              priority:
                                priorityId as TodoDraft['priority'],
                            })
                          }
                          className={`
                            rounded-2xl
                            border-2
                            px-3
                            py-3
                            text-sm
                            font-bold
                            transition
                            ${
                              selected
                                ? 'border-[var(--accent)] bg-[var(--surface-muted)] shadow-[0_3px_0_var(--accent)]'
                                : 'border-[var(--border)] bg-[var(--surface-muted)] opacity-70 hover:opacity-100'
                            }
                          `}
                        >
                          {meta.label}
                        </button>
                      )
                    },
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="task-date"
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-[var(--text)]
                    "
                  >
                    {t(
                      'todos.taskSheet.dueDate',
                      'Due date',
                    )}
                  </label>

                  <input
                    id="task-date"
                    type="date"
                    value={toDateInput(
                      draft.dueDate,
                    )}
                    onChange={(event) =>
                      updateDraft({
                        dueDate:
                          fromDateInput(
                            event.target.value,
                          ),
                      })
                    }
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-time"
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-[var(--text)]
                    "
                  >
                    {t(
                      'todos.taskSheet.time',
                      'Time',
                    )}
                  </label>

                  <input
                    id="task-time"
                    type="time"
                    value={draft.time ?? ''}
                    onChange={(event) =>
                      updateDraft({
                        time: event.target.value || undefined,
                      })
                    }
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={
                  mode === 'detail'
                    ? () => setIsEditing(false)
                    : onClose
                }
                className={`
                  ${buttonBase}
                  border-[var(--border)]
                  bg-[var(--surface-muted)]
                  text-[var(--text)]
                  shadow-[0_4px_0_var(--border)]
                  hover:brightness-[0.98]
                `}
              >
                <X size={17} />
                {t(
                  'common.cancel',
                  'Cancel',
                )}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!draft.title.trim()}
                className={`
                  ${buttonBase}
                  border-[var(--accent)]
                  bg-[var(--accent)]
                  text-white
                  shadow-[0_4px_0_color-mix(in_srgb,var(--accent)_65%,#000)]
                  hover:brightness-[1.04]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  disabled:shadow-none
                `}
              >
                <Check size={17} />

                {mode === 'create'
                  ? t(
                      'todos.taskSheet.create',
                      'Create task',
                    )
                  : t(
                      'todos.taskSheet.save',
                      'Save changes',
                    )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default TaskSheet
