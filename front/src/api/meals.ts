import type { Meal, MealFormData, MealApiResponse } from '../types/meal'

const BASE_URL = import.meta.env.VITE_API_URL

export const fetchMeals = (): Promise<Meal[]> =>
  fetch(`${BASE_URL}/api/meals`).then(res => res.json())

export const fetchMeal = (id: string): Promise<Meal> =>
  fetch(`${BASE_URL}/api/meals/${id}`).then(res => res.json())

export const createMeal = (data: MealFormData): Promise<MealApiResponse> =>
  fetch(`${BASE_URL}/api/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meal: data }),
  }).then(res => res.json())

export const updateMeal = (id: string, data: MealFormData): Promise<MealApiResponse> =>
  fetch(`${BASE_URL}/api/meals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meal: data }),
  }).then(res => res.json())

export const deleteMeal = (id: number): Promise<Response> =>
  fetch(`${BASE_URL}/api/meals/${id}`, { method: 'DELETE' })
