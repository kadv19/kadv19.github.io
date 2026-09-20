import { useFullExperience } from '../../motion/useMediaQuery'
import { SpideyStage } from './SpideyStage'
import { SpideyStatic } from './SpideyStatic'

/** Chooses the experience. Both variants read from the same content. */
export function SpideyScene() {
  return useFullExperience() ? <SpideyStage /> : <SpideyStatic />
}
