import type { FlowStepId } from './store/flowStore'

/**
 * Paths on the local / file-linked Next app (`luna-base` in `vendor/luna-code-editor`).
 * Origin comes from `VITE_LUNA_CODE_EDITOR_URL` (e.g. http://localhost:3000 in `.env.development`).
 */
const CODE_EDITOR_STEP_PATHS: Record<FlowStepId, string> = {
  /** Step **1** → home */
  '1': '/',
  /** Step **2** → extensions + Python row/detail (`openDetail=` handled in vendor editor). */
  '2': '/extensions?openDetail=python-environments',
  /** Step **3** → Python panel; includes both params for hosted/build compatibility. */
  '3': '/extensions?openDetail=python-environments&extDetail=python-environments',
}

function joinOriginPath(origin: string, pathname: string): string {
  const base = origin.trim().replace(/\/$/, '')
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${base}${path}`
}

export function buildCodeEditorEmbedUrlForStep(origin: string, stepId: FlowStepId): string {
  const o = origin.trim()
  if (!o) return ''
  const path = CODE_EDITOR_STEP_PATHS[stepId]
  return joinOriginPath(o, path)
}
