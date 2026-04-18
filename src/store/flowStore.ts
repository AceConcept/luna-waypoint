import { create } from 'zustand'
import { STEP_DESCRIPTIONS } from '../stepDescriptions'

/** Sidebar / shell step ids — one per step in `steps-project-slot` (upstream). */
export type FlowStepId = '1' | '2' | '3' | '4' | '5' | '6'

const IDS = ['1', '2', '3', '4', '5', '6'] as const satisfies readonly FlowStepId[]

export const FLOW_STEPS: {
  id: FlowStepId
  title: string
  body: string
}[] = IDS.map((id, i) => ({
  id,
  title: `Step ${id}`,
  body: STEP_DESCRIPTIONS[i] ?? '',
}))

type FlowState = {
  stepIndex: number
  next: () => void
  back: () => void
  goToStep: (index: number) => void
  goToStepById: (id: FlowStepId) => void
  reset: () => void
}

export const useFlowStore = create<FlowState>((set, get) => ({
  stepIndex: 0,
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
