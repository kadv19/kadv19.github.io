import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * The full pinned, animated story runs only where it works well: a real desktop
 * viewport and no request for reduced motion. Everything else gets the static,
 * fully readable version of the same content.
 */
export function useFullExperience(): boolean {
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 600px)')
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  return wide && !reduce
}
