import { useNavigate } from 'react-router-dom'
import { deleteMeal } from '../api/meals'
import type { Meal } from '../types/meal'
import type { FlashType } from '../App'

type Props = {
  meal: Meal
  onDeleted: () => void
  showFlash: (messages: string[], type?: FlashType) => void
}

const formatDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
}

function MealCard({ meal, onDeleted, showFlash }: Props) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!window.confirm(`「${meal.description}」を削除しますか？`)) return
    try {
      await deleteMeal(meal.id)
      showFlash(['食事記録を削除しました'], 'success')
      onDeleted()
    } catch {
      showFlash(['削除に失敗しました。再度お試しください。'], 'error')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-green-600">
          📅 {formatDate(meal.eaten_at)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/meals/${meal.id}/edit`)}
            className="text-xs text-blue-500 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1 transition-colors"
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg px-3 py-1 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
      <p className="font-bold text-gray-800 text-base mb-1">{meal.description}</p>
      {meal.memo && (
        <p className="text-gray-500 text-sm leading-relaxed">{meal.memo}</p>
      )}
    </div>
  )
}

export default MealCard
