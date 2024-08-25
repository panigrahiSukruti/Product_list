import react from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Products from './views/pages/products'
import './App.css'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Products />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
