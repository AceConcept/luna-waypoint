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

/** `public/step_imgs/Step 1.png` … `Step 6.png` — spaces encoded for URLs */
function stepImageUrl(id: FlowStepId): string {
  return `/step_imgs/${encodeURIComponent(`Step ${id}.png`)}`
}

export const FLOW_SIDEBAR_ITEMS: FlowSidebarItem[] = [
  {
    id: '1',
    label: 'Step 1',
    step: 'Step 1',
    title: 'Step 1',
    description: STEP_DESCRIPTIONS[0],
    swatch: '#e8e4f0',
    thumbUrl: stepImageUrl('1'),
    heroImageUrl: stepImageUrl('1'),
  },
  {
    id: '2',
    label: 'Step 2',
    step: 'Step 2',
    title: 'Step 2',
    description: STEP_DESCRIPTIONS[1],
    swatch: '#e2dcf0',
    thumbUrl: stepImageUrl('2'),
    heroImageUrl: stepImageUrl('2'),
  },
  {
    id: '3',
    label: 'Step 3',
    step: 'Step 3',
    title: 'Step 3',
    description: STEP_DESCRIPTIONS[2],
    swatch: '#dcd4ec',
    thumbUrl: stepImageUrl('3'),
    heroImageUrl: stepImageUrl('3'),
  },
  {
    id: '4',
    label: 'Step 4',
    step: 'Step 4',
    title: 'Step 4',
    description: STEP_DESCRIPTIONS[3],
    swatch: '#d6cae8',
    thumbUrl: stepImageUrl('4'),
    heroImageUrl: stepImageUrl('4'),
  },
  {
    id: '5',
    label: 'Step 5',
    step: 'Step 5',
    title: 'Step 5',
    description: STEP_DESCRIPTIONS[4],
    swatch: '#d0c0e4',
    thumbUrl: stepImageUrl('5'),
    heroImageUrl: stepImageUrl('5'),
  },
  {
    id: '6',
    label: 'Step 6',
    step: 'Step 6',
    title: 'Step 6',
    description: STEP_DESCRIPTIONS[5],
    swatch: '#cab6e0',
    thumbUrl: stepImageUrl('6'),
    heroImageUrl: stepImageUrl('6'),
  },
]
