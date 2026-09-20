import { useFullExperience } from '../../motion/useMediaQuery'
import { WorkbenchStage } from './WorkbenchStage'

/**
 * Chooses the experience. There is no animated fallback: ProjectsPreview below
 * already carries the same projects as real HTML for mobile / reduced-motion.
 */
export function WorkbenchScene() {
  const full = useFullExperience()
  return full ? <WorkbenchStage /> : null
}
