import type { Meal, MealFormData, MealApiResponse } from '../types/meal'
import { getCsrfToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL

const OPTS: RequestInit = { credentials: 'include' }

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  'X-CSRF-Token': getCsrfToken(),
})

export const fetchMeals = (): Promise<Meal[]> =>
  fetch(`${BASE_URL}/api/meals`, OPTS).then(res => res.json())

export const fetchMeal = (id: string): Promise<Meal> =>
  fetch(`${BASE_URL}/api/meals/${id}`, OPTS).then(res => res.json())

export const createMeal = (data: MealFormData): Promise<MealApiResponse> =>
  fetch(`${BASE_URL}/api/meals`, {
    ...OPTS,
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ meal: data }),
  }).then(res => res.json())

export const updateMeal = (id: string, data: MealFormData): Promise<MealApiResponse> =>
  fetch(`${BASE_URL}/api/meals/${id}`, {
    ...OPTS,
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify({ meal: data }),
  }).then(res => res.json())

export const deleteMeal = (id: number): Promise<Response> =>
  fetch(`${BASE_URL}/api/meals/${id}`, {
    ...OPTS,
    method: 'DELETE',
    headers: { 'X-CSRF-Token': getCsrfToken() },
  })
