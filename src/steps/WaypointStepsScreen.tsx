import { useEffect, useMemo, useRef } from 'react'
import { buildCodeEditorEmbedUrlForStep } from '../codeEditorEmbedUrls'
import { flowStepIdFromHash, useFlowStore, type FlowStepId } from '../store/flowStore'

const ARTBOARD_WIDTH = 2560
const ARTBOARD_HEIGHT = 1440

/** Next.js app origin (luna-code-editor); paths per step come from `codeEditorEmbedUrls`. */
const CODE_EDITOR_ORIGIN = (import.meta.env.VITE_LUNA_CODE_EDITOR_URL ?? '').trim()

type WaypointStepsScreenProps = {
  polarHash: string
  stepId: FlowStepId
}

export default function WaypointStepsScreen({ polarHash, stepId }: WaypointStepsScreenProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const embedUrl = useMemo(
    () => buildCodeEditorEmbedUrlForStep(CODE_EDITOR_ORIGIN, stepId),
    [stepId],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== polarHash) {
      window.location.hash = polarHash
    }
  }, [polarHash])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let rafId = 0
    const scheduleScale = () => {
      if (rafId !== 0) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const frame = host.querySelector<HTMLElement>('#scale-frame')
        const board = host.querySelector<HTMLElement>('#artboard')
        if (!frame || !board) return

        const width = host.clientWidth
        const height = host.clientHeight
        if (width <= 0 || height <= 0) return

        const scale = Math.min(width / ARTBOARD_WIDTH, height / ARTBOARD_HEIGHT)
        board.style.transform = `scale(${scale})`
        frame.style.width = `${Math.ceil(ARTBOARD_WIDTH * scale)}px`
        frame.style.height = `${Math.ceil(ARTBOARD_HEIGHT * scale)}px`
      })
    }

    scheduleScale()

    const ro = new ResizeObserver(scheduleScale)
    ro.observe(host)
    window.addEventListener('resize', scheduleScale)
    window.addEventListener('hashchange', scheduleScale)

    const frame = host.querySelector<HTMLElement>('#scale-frame')
    const board = host.querySelector<HTMLElement>('#artboard')
    const mo =
      frame && board
        ? new MutationObserver(scheduleScale)
        : null
    if (frame && mo) mo.observe(frame, { attributes: true, attributeFilter: ['style'] })
    if (board && mo) mo.observe(board, { attributes: true, attributeFilter: ['style'] })

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId)
      ro.disconnect()
      mo?.disconnect()
      window.removeEventListener('resize', scheduleScale)
      window.removeEventListener('hashchange', scheduleScale)
    }
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      useFlowStore.getState().goToStepById(flowStepIdFromHash(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div ref={hostRef} className="viewport">
      <div id="scale-frame" className="scale-frame">
        <div
          id="artboard"
          className="artboard"
          style={{
            width: ARTBOARD_WIDTH,
            height: ARTBOARD_HEIGHT,
            transformOrigin: 'top left',
          }}
        >
          {embedUrl ? (
            <iframe
              key={stepId}
              title="Luna code editor"
              className="stepscreen-embed"
              src={embedUrl}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="stepscreen-placeholder" role="status">
              Set <code className="stepscreen-placeholder__code">VITE_LUNA_CODE_EDITOR_URL</code> and run the{' '}
              <span className="stepscreen-placeholder__mono">luna-code-editor</span> app (Next.js) on that origin to
              embed it.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
