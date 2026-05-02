const BASE_URL = import.meta.env.VITE_API_URL

export type AuthUser = { id: number; email: string }
export type AuthState = { logged_in: boolean; user?: AuthUser; csrf_token: string }
export type AuthError = { errors: string[] }
export type AuthResult = AuthState | AuthError

let csrfToken = ''
export const getCsrfToken = () => csrfToken

const storeToken = (data: AuthState): AuthState => {
  csrfToken = data.csrf_token ?? ''
  return data
}

export const fetchMe = (): Promise<AuthState> =>
  fetch(`${BASE_URL}/api/me`, { credentials: 'include' })
    .then(res => res.json())
    .then(storeToken)

export const login = (email: string, password: string): Promise<AuthResult> =>
  fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { email, password } }),
  })
    .then(res => res.json())
    .then((data: AuthResult) => {
      if ('csrf_token' in data) storeToken(data)
      return data
    })

export const signup = (email: string, password: string, passwordConfirmation: string): Promise<AuthResult> =>
  fetch(`${BASE_URL}/api/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { email, password, password_confirmation: passwordConfirmation } }),
  })
    .then(res => res.json())
    .then((data: AuthResult) => {
      if ('csrf_token' in data) storeToken(data)
      return data
    })

export const logout = (): Promise<AuthState> =>
  fetch(`${BASE_URL}/api/logout`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'X-CSRF-Token': csrfToken },
  })
    .then(res => res.json())
    .then(storeToken)
