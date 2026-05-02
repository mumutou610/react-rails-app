import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MealCard from './MealCard'
import { fetchMeals } from '../api/meals'
import type { Meal } from '../types/meal'
import type { FlashType } from '../App'

type Props = {
  showFlash: (messages: string[], type?: FlashType) => void
}

function MealList({ showFlash }: Props) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadMeals = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchMeals()
      setMeals(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadMeals() }, [loadMeals])

  return (
    <main className="px-4 py-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          食事の記録
          {!loading && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              {meals.length}件
            </span>
          )}
        </h2>
        <button
          onClick={() => navigate('/meals/new')}
          className="bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-full shadow transition-all"
        >
          ＋ 追加
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="text-gray-400 animate-pulse">読み込み中...</span>
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="font-medium">まだ記録がありません</p>
          <p className="text-sm mt-1">「追加」から食事を記録してみましょう</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {meals.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              onDeleted={loadMeals}
              showFlash={showFlash}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default MealList
