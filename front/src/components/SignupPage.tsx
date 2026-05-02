import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup, type AuthState } from '../api/auth'
import PasswordInput from './PasswordInput'
import type { FlashType } from '../App'

type Props = {
  setAuth: (auth: AuthState) => void
  showFlash: (messages: string[], type?: FlashType) => void
}

function SignupPage({ setAuth, showFlash }: Props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    try {
      const res = await signup(email, password, passwordConfirmation)
      if ('errors' in res) {
        setErrors(res.errors)
      } else {
        setAuth(res)
        showFlash(['アカウントを登録しました。ようこそ！'], 'success')
        navigate('/meals')
      }
    } catch {
      setErrors(['通信エラーが発生しました。再度お試しください。'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl shadow-md mb-4">
            <span className="text-3xl">🥗</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">AI食事記録</h1>
          <p className="text-gray-400 text-sm mt-1">まずは無料でアカウント登録</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl px-8 py-8">
          <h2 className="text-lg font-bold text-gray-700 mb-6 text-center">新規登録</h2>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-5">
              {errors.map(err => <p key={err}>・{err}</p>)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                パスワード
              </label>
              <PasswordInput
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="6文字以上"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                パスワード（確認）
              </label>
              <PasswordInput
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:bg-green-300 text-white font-bold py-3.5 rounded-xl shadow-md shadow-green-200 transition-all duration-200 mt-2"
            >
              {loading ? '登録中...' : 'アカウントを作成'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              すでにアカウントをお持ちの方は
            </p>
            <Link
              to="/login"
              className="inline-block mt-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
            >
              ログインはこちら →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
