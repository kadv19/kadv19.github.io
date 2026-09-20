import { useFullExperience } from '../../motion/useMediaQuery'
import { HulkStage } from './HulkStage'
import { HulkStatic } from './HulkStatic'

/** Chooses the experience. Both variants read from the same content. */
export function HulkScene() {
  return useFullExperience() ? <HulkStage /> : <HulkStatic />
}
