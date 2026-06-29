import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import HorizontalPageShell from './components/HorizontalPageShell'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import ParallaxDemo from './pages/ParallaxDemo'

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

  const handleLoaderComplete = () => {
    try {
      localStorage.setItem(LOADER_SEEN_KEY, '1')
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
    setLoading(false)
  }

  return (
    <>
      {loading && <Loader onComplete={handleLoaderComplete} />}
      
      {!loading && (
        <>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<HorizontalPageShell />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/parallax-demo" element={<ParallaxDemo />} />
          </Routes>
        </>
      )}
    </>
  )
}

export default App