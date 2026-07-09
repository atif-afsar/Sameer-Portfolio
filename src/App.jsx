import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useIsMobile } from './hooks/useIsMobile'

const loadHorizontalShell = () => import('./components/HorizontalPageShell')
const loadMobileShell = () => import('./components/MobileVerticalShell')

const HorizontalPageShell = lazy(loadHorizontalShell)
const MobileVerticalShell = lazy(loadMobileShell)
const Contact = lazy(() => import('./pages/Contact'))
const ParallaxDemo = lazy(() => import('./pages/ParallaxDemo'))

// Preload the main shell chunk immediately, in parallel with the intro video
// loader. This way the shell is already downloaded the moment the loader ends,
// so Home renders instantly with no black gap/blank in between.
if (typeof window !== 'undefined') {
  loadHorizontalShell()
  loadMobileShell()
}

// Desktop keeps the horizontal panel experience; phones get a natively-scrolling
// vertical layout for far better mobile UX.
const RootExperience = () => {
  const isMobile = useIsMobile()
  return isMobile ? <MobileVerticalShell /> : <HorizontalPageShell />
}

function revealRootShell() {
  const root = document.getElementById('root')
  if (root) root.classList.add('app-ready')
  document.body.classList.remove('loader-active')
}

const App = () => {
  // The video loader lives in index.html (outside #root). We stay hidden until it
  // signals it is finished, then reveal Home instantly — no gap, no second video.
  const [loading, setLoading] = useState(
    () => !(typeof window !== 'undefined' && window.__appLoaderDone)
  )

  useEffect(() => {
    const markReady = () => {
      setLoading(false)
      revealRootShell()
    }

    if (window.__appLoaderDone) {
      markReady()
      return undefined
    }

    window.addEventListener('app-loader-done', markReady)
    return () => window.removeEventListener('app-loader-done', markReady)
  }, [])

  return (
    <div
      aria-hidden={loading}
      className={loading ? 'pointer-events-none invisible' : undefined}
    >
      <Navbar />
      <Suspense fallback={<div className="fixed inset-0 bg-[#f7f5ef]" />}>
        <Routes>
          <Route path="/" element={<RootExperience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/parallax-demo" element={<ParallaxDemo />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
