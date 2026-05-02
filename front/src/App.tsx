import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import FlashMessage from './components/FlashMessage'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import MealList from './components/MealList'
import MealForm from './components/MealForm'
import { fetchMe, type AuthState } from './api/auth'

export type FlashType = 'error' | 'success'
export type Flash = { messages: string[]; type: FlashType }

type RouteProps = { children: React.ReactNode; auth: AuthState | null }

function PrivateRoute({ children, auth }: RouteProps) {
  if (auth === null) return null
  if (!auth.logged_in) return <Navigate to="/login" replace />
  return <>{children}</>
}

function GuestRoute({ children, auth }: RouteProps) {
  if (auth === null) return null
  if (auth.logged_in) return <Navigate to="/meals" replace />
  return <>{children}</>
}

function App() {
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [flash, setFlash] = useState<Flash>({ messages: [], type: 'error' })

  useEffect(() => {
    fetchMe()
      .then(setAuth)
      .catch(() => setAuth({ logged_in: false, csrf_token: '' }))
  }, [])

  const showFlash = useCallback((messages: string[], type: FlashType = 'error') => {
    setFlash({ messages, type })
  }, [])

  const clearFlash = useCallback(() => {
    setFlash({ messages: [], type: 'error' })
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header auth={auth} setAuth={setAuth} showFlash={showFlash} />
        <FlashMessage messages={flash.messages} type={flash.type} onClose={clearFlash} />
        <Routes>
          <Route path="/" element={<HomePage auth={auth} />} />
          <Route
            path="/login"
            element={
              <GuestRoute auth={auth}>
                <LoginPage setAuth={setAuth} showFlash={showFlash} />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute auth={auth}>
                <SignupPage setAuth={setAuth} showFlash={showFlash} />
              </GuestRoute>
            }
          />
          <Route
            path="/meals"
            element={
              <PrivateRoute auth={auth}>
                <MealList showFlash={showFlash} />
              </PrivateRoute>
            }
          />
          <Route
            path="/meals/new"
            element={
              <PrivateRoute auth={auth}>
                <MealForm showFlash={showFlash} />
              </PrivateRoute>
            }
          />
          <Route
            path="/meals/:id/edit"
            element={
              <PrivateRoute auth={auth}>
                <MealForm showFlash={showFlash} />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
