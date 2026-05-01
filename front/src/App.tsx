import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './components/HomePage'
import MealList from './components/MealList'
import MealForm from './components/MealForm'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meals" element={<MealList />} />
          <Route path="/meals/new" element={<MealForm />} />
          <Route path="/meals/:id/edit" element={<MealForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
