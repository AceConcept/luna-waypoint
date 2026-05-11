import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { LunaCanvasScaleContext } from 'waypoint-sidebar/src/luna-sidebar/index.js'
import {
  CANVAS_H,
  CANVAS_W,
  getCanvasContainScale,
  getOtfFooterDesignHeightPx,
  getSidebarShellDesignWidthPx,
  getViewportSize,
} from 'waypoint-sidebar/src/luna-sidebar/canvasScale.js'
import './lunaChrome.css'

/** Center slot footprint vs contain scale (~10% shorter; width scales same factor → same aspect ratio). */
const LUNA_CENTER_SLOT = 0.9

/** How many copies of the looping bg video to tile across `.luna-canvas-row`.
 *  Each tile's display size is `--luna-bg-tile-w × --luna-bg-tile-h × --luna-scale`,
 *  so this needs to be ≥ ceil(maxViewportWidth / (tileWidth × scale)). 5 tiles
 *  at the default 120rem (1920px) tile width covers up to ~9600px viewports.
 *  Bump this if you target wider monitors. */
const LUNA_BG_TILE_COUNT = 5

export type LunaChromeSidebarControls = {
  expanded: boolean
  onExpandedChange: (next: boolean) => void
}

type LunaChromeProps = {
  children?: ReactNode
  footerBackgroundUrl?: string
  sidebar: (controls: LunaChromeSidebarControls) => ReactNode
}

export function LunaChrome({
  children,
  footerBackgroundUrl,
  sidebar,
}: LunaChromeProps) {
  const layoutRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [expanded, setExpanded] = useState(false)

  useLayoutEffect(() => {
    const el = layoutRef.current
    if (!el) return
    const update = () => {
      const { width, height } = getViewportSize()
      if (width <= 0 || height <= 0) {
        setScale(1)
        return
      }
      setScale(getCanvasContainScale(width, height))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    const vv = window.visualViewport
    if (vv) vv.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      if (vv) vv.removeEventListener('resize', update)
    }
  }, [])

  useLayoutEffect(() => {
    const layout = layoutRef.current
    if (!layout) return
    const scaledFooterH = getOtfFooterDesignHeightPx() * scale
    const shellW = getSidebarShellDesignWidthPx(expanded)
    const slotScale = scale * LUNA_CENTER_SLOT
    const centerW = CANVAS_W * slotScale
    const centerH = CANVAS_H * slotScale
    const rowMinH = CANVAS_H * scale
    layout.style.setProperty('--luna-scale', String(scale))
    layout.style.setProperty('--luna-design-surface-scale', String(slotScale))
    layout.style.setProperty('--luna-scaled-footer-h', `${scaledFooterH}px`)
    layout.style.setProperty('--luna-shell-design-w', `${shellW}px`)
    layout.style.setProperty('--luna-center-column-width', `${centerW}px`)
    layout.style.setProperty('--luna-center-column-height', `${centerH}px`)
    layout.style.setProperty('--luna-canvas-row-min-h', `${rowMinH}px`)
  }, [scale, expanded])

  const footerSlotStyle =
    footerBackgroundUrl != null && footerBackgroundUrl !== ''
      ? { backgroundImage: `url(${footerBackgroundUrl})` }
      : undefined

  const scaledFooterH = getOtfFooterDesignHeightPx() * scale

  return (
    <div ref={layoutRef} className="luna-root">
      <div className="luna-scale-stage">
        <div className="luna-chrome">
          <div className="luna-shell">
            <div
              className={`luna-canvas-row${expanded ? ' luna-canvas-row--drawer-open' : ''}`}
            >
              <div className="luna-canvas-bg" aria-hidden="true">
                {Array.from({ length: LUNA_BG_TILE_COUNT }, (_, i) => (
                  <video
                    key={i}
                    className="luna-canvas-bg-video"
                    src="/bg-img/hex-bg-loop-light.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                ))}
              </div>
              {expanded ? (
                <button
                  type="button"
                  className="luna-canvas-row-scrim"
                  aria-label="Close panel"
                  onClick={() => setExpanded(false)}
                />
              ) : null}
              <div className="luna-space-left" aria-hidden="true" />
              <div className="luna-center-column">
                <div
                  className={`luna-design-surface${expanded ? ' luna-design-surface--drawer-open' : ''}`}
                >
                  {children}
                </div>
              </div>
              <div className="luna-space-right" aria-hidden="true" />
              <LunaCanvasScaleContext.Provider value={scale}>
                {sidebar({ expanded, onExpandedChange: setExpanded })}
              </LunaCanvasScaleContext.Provider>
            </div>
          </div>
        </div>
      </div>
      <div
        className="luna-footer-slot"
        style={{ height: scaledFooterH, ...footerSlotStyle }}
      >
        <div
          className="luna-footer-artboard"
          aria-hidden="true"
          style={{
            width: CANVAS_W,
            height: getOtfFooterDesignHeightPx(),
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        />
      </div>
    </div>
  )
}
