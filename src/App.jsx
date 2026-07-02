import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

const HorizontalPageShell = lazy(() => import('./components/HorizontalPageShell'))
const Contact = lazy(() => import('./pages/Contact'))
const ParallaxDemo = lazy(() => import('./pages/ParallaxDemo'))

const App = () => {
  // The video loader lives in index.html (outside #root). We stay hidden until it
  // signals it is finished, then reveal Home instantly — no gap, no second video.
  const [loading, setLoading] = useState(
    () => !(typeof window !== 'undefined' && window.__appLoaderDone)
  )

  useEffect(() => {
    if (window.__appLoaderDone) {
      setLoading(false)
      return undefined
    }

    const handleDone = () => setLoading(false)
    window.addEventListener('app-loader-done', handleDone)
    return () => window.removeEventListener('app-loader-done', handleDone)
  }, [])

  return (
    <div
      aria-hidden={loading}
      className={loading ? 'pointer-events-none invisible' : undefined}
    >
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HorizontalPageShell />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/parallax-demo" element={<ParallaxDemo />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
