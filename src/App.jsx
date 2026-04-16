import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <About />
              <Digital />
              <Gallery />
              <Anime />
              <BrandCollaborations />
              <Stats />
              <Services />
              <Testimonials />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}

export default App