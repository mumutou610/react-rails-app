import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchMeal, createMeal, updateMeal } from '../api/meals'
import type { MealFormData } from '../types/meal'

const today = (): string => new Date().toISOString().split('T')[0]

function MealForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<MealFormData>({
    description: '',
    eaten_at: today(),
    memo: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchMeal(id)
      .then(meal => {
        setForm({
          description: meal.description,
          eaten_at: meal.eaten_at,
          memo: meal.memo ?? '',
        })
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors([])
    try {
      const res = id
        ? await updateMeal(id, form)
        : await createMeal(form)

      if ('errors' in res) {
        setErrors(res.errors)
      } else {
        navigate('/meals')
      }
    } catch {
      setErrors(['通信エラーが発生しました。再度お試しください。'])
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="text-gray-400 animate-pulse">読み込み中...</span>
      </div>
    )
  }

  return (
    <main className="px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="戻る"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-gray-700">
          {isEdit ? '食事を編集' : '食事を追加'}
        </h2>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 mb-5">
          {errors.map((err) => (
            <p key={err}>・{err}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            食べたもの <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="例：鶏むね肉のサラダ"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="eaten_at"
            value={form.eaten_at}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メモ
          </label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="例：ダイエット中なので低カロリーを意識した"
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2 pb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-300 text-gray-600 font-bold py-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 rounded-full shadow transition-colors"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default MealForm
