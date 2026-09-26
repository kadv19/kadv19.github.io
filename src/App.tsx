import { useEffect, useState } from 'react'
import { CharacterOverlay } from './motion/CharacterOverlay'
import { SiteHeader } from './components/SiteHeader'
import { IntroScene } from './scenes/intro/IntroScene'
import { SpideyScene } from './scenes/spidey/SpideyScene'
import { HulkScene } from './scenes/hulk/HulkScene'
import { WorkbenchScene } from './scenes/workbench/WorkbenchScene'
import { ProjectsPreview } from './scenes/ProjectsPreview'
import { ContactPreview } from './scenes/ContactPreview'
import { Lab } from './lab/Lab'

/** Tiny hash router: `/#lab` opens the design-system & character lab. */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  if (hash === '#lab') return <Lab />
  return (
    <CharacterOverlay>
      <a href="#projects" className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-md bg-surface px-3 py-2 text-ink">
        Skip to projects
      </a>
      <SiteHeader />
      <main>
        <IntroScene />
        <SpideyScene />
        <HulkScene />
        <WorkbenchScene />
        <ProjectsPreview />
        <ContactPreview />
      </main>
    </CharacterOverlay>
  )
}
