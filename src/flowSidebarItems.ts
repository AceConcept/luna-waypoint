import type { FlowStepId } from './store/flowStore'
import { STEP_DESCRIPTIONS } from './stepDescriptions'

/**
 * Luna drawer + preview rail — titles, descriptions, optional **thumbUrl** / **heroImageUrl** (`public/` paths).
 */
export type FlowSidebarItem = {
  id: FlowStepId
  label: string
  step: string
  title: string
  description: string
  swatch: string
  thumbUrl?: string
  heroImageUrl?: string
}

function stepImagePath(n: 1 | 2 | 3): string {
  const base =
    n === 1
      ? '/step_imgs/コードエディター.jpg'
      : n === 2
        ? '/step_imgs/エクステンション.jpg'
        : '/step_imgs/エクステンション-1.jpg'
  const v = typeof __STEP_IMG_VER__ !== 'undefined' && __STEP_IMG_VER__
    ? __STEP_IMG_VER__
    : ''
  return v ? `${base}?v=${encodeURIComponent(v)}` : base
}

export const FLOW_SIDEBAR_ITEMS: FlowSidebarItem[] = [
  {
    id: '1',
    label: 'CODE EDITOR',
    step: 'Step 1',
    title: 'Code Editor Origin',
    description: STEP_DESCRIPTIONS[0],
    swatch: '#e8e4f0',
    thumbUrl: stepImagePath(1),
    heroImageUrl: stepImagePath(1),
  },
  {
    id: '2',
    label: 'EXTENSIONS',
    step: 'Step 2',
    title: 'Extensions Page',
    description: STEP_DESCRIPTIONS[1],
    swatch: '#cab6e0',
    thumbUrl: stepImagePath(2),
    heroImageUrl: stepImagePath(2),
  },
  {
    id: '3',
    label: 'PYTHON ENVIRONS',
    step: 'Step 3',
    title: 'Python Environs',
    description: STEP_DESCRIPTIONS[2],
    swatch: '#dcd4ec',
    thumbUrl: stepImagePath(3),
    heroImageUrl: stepImagePath(3),
  },
]
