import { useFullExperience } from '../../motion/useMediaQuery'
import { IntroStage } from './IntroStage'
import { IntroStatic } from './IntroStatic'

/** Chooses the experience. Both variants read from the same content and blocks. */
export function IntroScene() {
  return useFullExperience() ? <IntroStage /> : <IntroStatic />
}
