import { lazy, Suspense, useCallback, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Loader from './components/Loader'

const HorizontalPageShell = lazy(() => import('./components/HorizontalPageShell'))
const Contact = lazy(() => import('./pages/Contact'))
const ParallaxDemo = lazy(() => import('./pages/ParallaxDemo'))

const App = () => {
  const [loading, setLoading] = useState(true)

  const handleLoaderComplete = useCallback(() => {
    setLoading(false)
  }, [])

  return (
    <>
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

      {loading && <Loader onComplete={handleLoaderComplete} />}
    </>
  )
}

export default App
