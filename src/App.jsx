import { lazy, Suspense, useCallback, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Loader from './components/Loader'

const HorizontalPageShell = lazy(() => import('./components/HorizontalPageShell'))
const Contact = lazy(() => import('./pages/Contact'))
const ParallaxDemo = lazy(() => import('./pages/ParallaxDemo'))

const LOADER_SEEN_KEY = 'sameer-portfolio-loader-seen'

function hasSeenLoader() {
  try {
    return localStorage.getItem(LOADER_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

const App = () => {
  const [loading, setLoading] = useState(() => !hasSeenLoader())

  const handleLoaderComplete = useCallback(() => {
    try {
      localStorage.setItem(LOADER_SEEN_KEY, '1')
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
    setLoading(false)
  }, [])

  return (
    <>
      {loading && <Loader onComplete={handleLoaderComplete} />}

      {!loading && (
        <>
          <Navbar />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HorizontalPageShell />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/parallax-demo" element={<ParallaxDemo />} />
            </Routes>
          </Suspense>
        </>
      )}
    </>
  )
}

export default App
