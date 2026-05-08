import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildCodeEditorEmbedUrlForStep } from '../codeEditorEmbedUrls'
import { flowStepIdFromHash, useFlowStore, type FlowStepId } from '../store/flowStore'

const ARTBOARD_WIDTH = 2560
const ARTBOARD_HEIGHT = 1440

/** Hosted luna-code-editor origin (Cloudflare Workers); paths per step come from `codeEditorEmbedUrls`. */
const DEFAULT_CODE_EDITOR_ORIGIN = 'https://luna-code-editor.guildconcept.workers.dev'
const CODE_EDITOR_ORIGIN = (import.meta.env.VITE_LUNA_CODE_EDITOR_URL ?? DEFAULT_CODE_EDITOR_ORIGIN).trim()

type WaypointStepsScreenProps = {
  polarHash: string
  stepId: FlowStepId
}

export default function WaypointStepsScreen({ polarHash, stepId }: WaypointStepsScreenProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [embedStatus, setEmbedStatus] = useState<'idle' | 'loaded' | 'failed'>('idle')
  const [reloadKey, setReloadKey] = useState(0)
  const embedUrl = useMemo(
    () => buildCodeEditorEmbedUrlForStep(CODE_EDITOR_ORIGIN, stepId),
    [stepId],
  )
  const timedOutRef = useRef(false)
  const loadTimeoutRef = useRef<number | null>(null)

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
    let lastAppliedScale = -1
    const scheduleScale = () => {
      if (rafId !== 0) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        rafId = 0
        const frame = host.querySelector<HTMLElement>('#scale-frame')
        const board = host.querySelector<HTMLElement>('#artboard')
        if (!frame || !board) return

        const width = host.clientWidth
        const height = host.clientHeight
        if (width <= 0 || height <= 0) return

        const scale = Math.min(width / ARTBOARD_WIDTH, height / ARTBOARD_HEIGHT)
        if (Math.abs(scale - lastAppliedScale) < 1e-6) return
        lastAppliedScale = scale
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

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('resize', scheduleScale)
      window.removeEventListener('hashchange', scheduleScale)
    }
  }, [])

  useEffect(() => {
    setEmbedStatus('idle')
    timedOutRef.current = false
    if (!embedUrl) return
    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
    loadTimeoutRef.current = window.setTimeout(() => {
      if (timedOutRef.current) return
      timedOutRef.current = true
      setEmbedStatus('failed')
    }, 10000)
    return () => {
      if (loadTimeoutRef.current !== null) {
        window.clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    }
  }, [embedUrl, reloadKey])

  const retryEmbed = useCallback(() => {
    timedOutRef.current = false
    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
    setEmbedStatus('idle')
    /** Reload in-place: keep the same iframe element so the browser reuses its
     * connection/JA4 fingerprint state instead of opening a fresh handshake
     * (which is what some Vercel firewall heuristics 403 intermittently). */
    const el = iframeRef.current
    if (el && embedUrl) {
      el.src = embedUrl
    }
    setReloadKey((v) => v + 1)
  }, [embedUrl])

  const handleEmbedLoad = useCallback(() => {
    timedOutRef.current = true
    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
    setEmbedStatus('loaded')
  }, [])

  const handleEmbedError = useCallback(() => {
    timedOutRef.current = true
    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
    setEmbedStatus('failed')
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
            <>
              <iframe
                ref={iframeRef}
                title="Luna code editor"
                className="stepscreen-embed"
                src={embedUrl}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={handleEmbedLoad}
                onError={handleEmbedError}
              />
              {embedStatus === 'failed' ? (
                <div className="stepscreen-placeholder" role="status">
                  The embedded editor is unavailable right now.{' '}
                  <button type="button" className="stepscreen-placeholder__action" onClick={retryEmbed}>
                    Retry
                  </button>{' '}
                  or{' '}
                  <a
                    className="stepscreen-placeholder__action"
                    href={embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    open directly
                  </a>
                  .
                </div>
              ) : null}
            </>
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
