import type { CategoryId, Priority } from '../types/todo.types'

export interface CategoryMeta {
  id: CategoryId
  label: string
  color: string
  softColor: string
  dotColor: string
}

export const categories: CategoryMeta[] = [
  {
    id: 'personal',
    label: 'Personal',
    color: 'bg-[#ffd8e8]',
    softColor: 'bg-[#fff0f6]',
    dotColor: 'bg-[#fb83ae]',
  },
  {
    id: 'work',
    label: 'Work',
    color: 'bg-[#d9d4ff]',
    softColor: 'bg-[#f0efff]',
    dotColor: 'bg-[#7767ee]',
  },
  {
    id: 'study',
    label: 'Study',
    color: 'bg-[#c9eee7]',
    softColor: 'bg-[#ebfaf6]',
    dotColor: 'bg-[#39a997]',
  },
  {
    id: 'health',
    label: 'Health',
    color: 'bg-[#ffe7a9]',
    softColor: 'bg-[#fff8df]',
    dotColor: 'bg-[#e1a117]',
  },
  {
    id: 'other',
    label: 'Other',
    color: 'bg-[#e7e4df]',
    softColor: 'bg-[#f6f4f1]',
    dotColor: 'bg-[#85807b]',
  },
]

export const priorityMeta: Record<
  Priority,
  { label: string; className: string }
> = {
  high: {
    label: 'High',
    className: 'bg-[#f06c7d] text-white',
  },
  medium: {
    label: 'Medium',
    className: 'bg-[#f5bd58] text-[#5d4314]',
  },
  low: {
    label: 'Low',
    className: 'bg-[#82cdbd] text-[#17473e]',
  },
}

export function getCategoryMeta(
  categoryId: CategoryId,
): CategoryMeta {
  return (
    categories.find((category) => category.id === categoryId) ??
    categories[4]
  )
}