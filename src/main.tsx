import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { installScrollDiagnostics } from './motion/scrollDiagnostics'

// Dev, or any build with ?scrolldiag in the URL. Must run before the app renders so
// `?markers` applies to the ScrollTriggers the scenes create.
if (import.meta.env.DEV || new URLSearchParams(window.location.search).has('scrolldiag')) {
  installScrollDiagnostics()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
