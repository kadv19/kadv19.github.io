import { useFullExperience } from '../../motion/useMediaQuery'
import { ProjectDetails } from '../../components/ProjectDetails'
import { WorkbenchStage } from './WorkbenchStage'

/**
 * Chooses the experience. There is no animated fallback: ProjectsPreview below
 * already carries the same projects as real HTML for mobile / reduced-motion.
 * The full briefs follow the pinned stage in normal flow (and inside
 * ProjectsPreview on mobile), so exactly one copy exists on each path.
 */
export function WorkbenchScene() {
  const full = useFullExperience()
  if (!full) return null
  return (
    <>
      <WorkbenchStage />
      <ProjectDetails />
    </>
  )
}
