export type Meal = {
  id: number
  description: string
  eaten_at: string
  memo: string | null
  ai_feedback: string | null
  created_at: string
  updated_at: string
}

export type MealFormData = {
  description: string
  eaten_at: string
  memo: string
}

export type MealApiResponse = Meal | { errors: string[] }
