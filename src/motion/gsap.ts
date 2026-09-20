import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Web fonts change text heights in the normal-flow sections, which shifts where later
// pinned scenes start. One global refresh when fonts settle is the right place for this —
// not a refresh inside every component.
if (typeof document !== 'undefined' && 'fonts' in document) {
  void document.fonts.ready.then(() => ScrollTrigger.refresh())
}

export { gsap, ScrollTrigger }
