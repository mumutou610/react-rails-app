import { useNavigate } from 'react-router-dom'
import { logout, type AuthState } from '../api/auth'
import type { FlashType } from '../App'

type Props = {
  auth: AuthState | null
  setAuth: (auth: AuthState) => void
  showFlash: (messages: string[], type?: FlashType) => void
}

function Header({ auth, setAuth, showFlash }: Props) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await logout()
      setAuth(res)
      showFlash(['ログアウトしました'], 'success')
      navigate('/')
    } catch {
      showFlash(['ログアウトに失敗しました'], 'error')
    }
  }

  return (
    <header className="bg-green-600 text-white px-6 py-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
      <h1 className="text-xl font-bold tracking-wide">🥗 AI食事記録</h1>
      {auth?.logged_in ? (
        <div className="flex items-center gap-3">
          <span className="text-green-100 text-sm">{auth.user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs bg-green-500 hover:bg-green-700 border border-green-400 px-3 py-1 rounded-full transition-colors"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="text-xs text-green-100 hover:text-white px-3 py-1 rounded-full transition-colors"
          >
            ログイン
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="text-xs bg-white text-green-600 hover:bg-green-50 font-semibold px-3 py-1 rounded-full transition-colors"
          >
            新規登録
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
