import { create } from 'zustand'
import { STEP_DESCRIPTIONS } from '../stepDescriptions'

/** Sidebar / flow step identifiers (numeric only). */
export type FlowStepId = '1' | '2' | '3'

const ALL_STEP_IDS: FlowStepId[] = ['1', '2', '3']

function isFlowStepId(segment: string): segment is FlowStepId {
  return ALL_STEP_IDS.includes(segment as FlowStepId)
}

/** Map `#/…` hash segment → flow step id (default **1**). */
export function flowStepIdFromHash(hash: string): FlowStepId {
  const m = String(hash || '').match(/#\/([\w-]+)/)
  const segment = m ? m[1] : '1'
  return isFlowStepId(segment) ? segment : '1'
}

export const FLOW_STEP_HASH: Record<FlowStepId, string> = {
  '1': '#/1',
  '2': '#/2',
  '3': '#/3',
}

export const FLOW_STEPS: {
  id: FlowStepId
  title: string
  body: string
}[] = ALL_STEP_IDS.map((id, i) => ({
  id,
  title: id,
  body: STEP_DESCRIPTIONS[i] ?? '',
}))

function initialStepIndexFromLocation(): number {
  if (typeof window === 'undefined') return 0
  const id = flowStepIdFromHash(window.location.hash || '#/')
  const index = FLOW_STEPS.findIndex((s) => s.id === id)
  return index >= 0 ? index : 0
}

type FlowState = {
  stepIndex: number
  next: () => void
  back: () => void
  goToStep: (index: number) => void
  goToStepById: (id: FlowStepId) => void
  reset: () => void
}

export const useFlowStore = create<FlowState>((set, get) => ({
  stepIndex: initialStepIndexFromLocation(),
  next: () => {
    const i = get().stepIndex
    if (i < FLOW_STEPS.length - 1) set({ stepIndex: i + 1 })
  },
  back: () => {
    const i = get().stepIndex
    if (i > 0) set({ stepIndex: i - 1 })
  },
  goToStep: (index) => {
    if (index >= 0 && index < FLOW_STEPS.length) set({ stepIndex: index })
  },
  goToStepById: (id) => {
    const index = FLOW_STEPS.findIndex((s) => s.id === id)
    if (index >= 0) set({ stepIndex: index })
  },
  reset: () => set({ stepIndex: 0 }),
}))

export function useFlowStep() {
  const stepIndex = useFlowStore((s) => s.stepIndex)
  const step = FLOW_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === FLOW_STEPS.length - 1
  return { stepIndex, step, isFirst, isLast }
}
