import { motion } from 'framer-motion'
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { CSSProperties } from 'react'
import type { Todo } from '../types/todo.types'
import { priorityMeta } from '../data/categories'
import {
  formatDueLabel,
  isPast,
} from '../utils/date'

interface TaskCardProps {
  todo: Todo
  onToggle: (id: string) => void
  onOpen: (todo: Todo) => void
}

function getTaskColors(categoryId: string) {
  switch (categoryId) {
    case 'personal':
      return { accent: '#ee6f96', soft: 'rgba(238, 111, 150, 0.15)', border: '#ee6f96' }
    case 'work':
      return { accent: '#7764e8', soft: 'rgba(119, 100, 232, 0.15)', border: '#7764e8' }
    case 'study':
      return { accent: '#35a995', soft: 'rgba(53, 169, 149, 0.15)', border: '#35a995' }
    case 'health':
      return { accent: '#ed8664', soft: 'rgba(237, 134, 100, 0.15)', border: '#ed8664' }
    case 'other':
    default:
      return { accent: '#d9a62e', soft: 'rgba(217, 166, 46, 0.15)', border: '#d9a62e' }
  }
}

// ✅ IMPORTANT: Named Export. Do NOT use "export default"
export function TaskCard({
  todo,
  onToggle,
  onOpen,
}: TaskCardProps) {
  const { t } = useTranslation()
  const colors = getTaskColors(todo.category)
  const priority = priorityMeta[todo.priority]
  const isOverdue = !todo.isCompleted && isPast(todo.dueDate)
  const translatedCategory = t(`categories.${todo.category}`)
  const translatedPriority = t(`app.${todo.priority}`)

  const cardStyle = {
    '--task-accent': colors.accent,
    '--task-soft': colors.soft,
    '--task-border': colors.border,
  } as CSSProperties

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -18, scale: 0.98 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={cardStyle}
      className="group relative overflow-hidden rounded-[24px] border-2 border-foreground bg-card p-4 text-card-foreground shadow-[4px_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 sm:p-5"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-2 rounded-l-[24px]"
        style={{ backgroundColor: colors.accent }}
      />

      <div className="flex gap-4 pl-1">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggle(todo.id)
          }}
          className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground transition-all duration-200 shadow-[2px_2px_0_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none"
          style={{
            backgroundColor: todo.isCompleted ? colors.accent : 'transparent',
            color: todo.isCompleted ? '#ffffff' : colors.accent,
          }}
        >
          {todo.isCompleted && <Check size={14} strokeWidth={3} />}
        </button>

        <button
          type="button"
          onClick={() => onOpen(todo)}
          className="min-w-0 flex-1 text-left focus-visible:outline-none"
        >
          <div className="flex items-start gap-2">
            <h3 className={`min-w-0 flex-1 text-base font-black leading-tight tracking-tighter text-foreground sm:text-lg ${todo.isCompleted ? 'line-through opacity-40 decoration-2' : ''}`}>
              {todo.title}
            </h3>
            <ChevronRight size={18} className="mt-0.5 shrink-0 text-foreground opacity-20 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
          </div>

          {todo.description && (
            <p className="mt-2 line-clamp-2 max-w-xl text-xs font-bold leading-relaxed text-muted-foreground">
              {todo.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border-2 border-foreground px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${priority.className}`}>
              {translatedPriority}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground px-2.5 py-1 text-[9px] font-black uppercase tracking-wider"
              style={{ color: colors.accent, backgroundColor: colors.soft }}
            >
              <span aria-hidden="true" className="size-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
              {translatedCategory}
            </span>
            <div className="flex items-center gap-3 ml-auto">
               <span className={`inline-flex items-center gap-1 text-[10px] font-black text-muted-foreground ${isOverdue ? 'text-destructive' : ''}`}>
                <CalendarDays size={12} strokeWidth={3} />
                {formatDueLabel(todo.dueDate)}
              </span>
              {todo.time && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-muted-foreground">
                  <Clock3 size={12} strokeWidth={3} />
                  {todo.time}
                </span>
              )}
            </div>
          </div>
        </button>
      </div>
    </motion.article>
  )
}