import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CatGallery from './components/CatGallery'
import CatDetails from './components/CatDetails'
import EditCatProfile from './components/EditCatProfile'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<CatGallery />} />
            <Route path="/cats/:id" element={<CatDetails />} />
            <Route path="/cats/:id/edit" element={<EditCatProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
