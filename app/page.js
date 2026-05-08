export const dynamic = 'force-dynamic'

import Navbar from './components/landing/navbar'
import Hero from './components/landing/hero'
import Layanan from './components/landing/layanan'
import Proses from './components/landing/proses'
import Edukasi from './components/landing/edukasi'
import Footer from './components/landing/footer'
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Layanan />
      <Proses />
      <Edukasi />
      <Footer />
    </main>
  )
}