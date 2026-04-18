import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Home from './pages/Home'
import About from './pages/About'
import Digital from './pages/Digital'
import Gallery from './pages/Gallery'
import Anime from './pages/Anime'
import BrandCollaborations from './pages/BrandCollaborations'
import Stats from './pages/Stats'
import Services from './pages/Services'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import ParallaxDemo from './pages/ParallaxDemo'
import StackingLayout from './components/StackingLayout'

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
              element={
                <>
                  <StackingLayout>
                    <Home />
                    <About />
                    <Digital />
                  </StackingLayout>
                  <div className="relative z-10">
                    <Gallery />
                    <Anime />
                    <BrandCollaborations />
                    <Stats />
                    <Services />
                    <Testimonials />
                    <Contact />
                    <Footer />
                  </div>
                </>
              }
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