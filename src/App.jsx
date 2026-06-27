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

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
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