import { LunaSidebar } from 'waypoint-sidebar/src/luna-sidebar/index.js'
import { LunaChrome } from './luna/LunaChrome'
import WaypointStepsScreen from './steps/WaypointStepsScreen'
import { FLOW_SIDEBAR_ITEMS } from './flowSidebarItems'
import { FLOW_STEP_HASH, useFlowStep, useFlowStore } from './store/flowStore'
import './App.css'

const RAIL_LABEL = 'Waypoint guide'

function App() {
  const { step, stepIndex } = useFlowStep()
  const goToStepById = useFlowStore((s) => s.goToStepById)

  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('atencium-step', String(stepIndex + 1))
    } catch {
      /* ignore */
    }
  }

  return (
    <LunaChrome
      footerBackgroundUrl="/news_bg.jpg"
      sidebar={({ expanded, onExpandedChange }) => (
        <>
          <LunaSidebar
            items={FLOW_SIDEBAR_ITEMS}
            expanded={expanded}
            onExpandedChange={onExpandedChange}
            initialActiveId={step.id}
            onActiveItemChange={(id: string) => {
              const hit = FLOW_SIDEBAR_ITEMS.find((item) => item.id === id)
              if (hit) goToStepById(hit.id)
            }}
            railLabel={RAIL_LABEL}
          />
          {/* Sibling of `.sidebar-shell`: rail visuals live outside the animating
             width / scale ancestors so they don't subpixel-jitter on
             expand/collapse. Click target is still the underlying
             <button class="sidebar-rail">; pointer-events: none lets clicks
             fall through. */}
          <div className="luna-rail-overlay" aria-hidden="true">
            <span className="luna-rail-overlay__dot" />
            <span className="luna-rail-overlay__text">{RAIL_LABEL}</span>
            <span className="luna-rail-overlay__dot" />
          </div>
        </>
      )}
    >
      <div className="luna-stage luna-stage--fill">
        <WaypointStepsScreen polarHash={FLOW_STEP_HASH[step.id]} stepId={step.id} />
      </div>
    </LunaChrome>
  )
}

export default App
