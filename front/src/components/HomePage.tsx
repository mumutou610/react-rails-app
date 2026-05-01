import { useNavigate } from 'react-router-dom'

type Feature = {
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: '🍽️',
    title: '食事を記録する',
    description: '写真を撮るか、食べたものを入力するだけで手軽に記録できます。',
  },
  {
    icon: '🤖',
    title: 'AIが栄養を分析',
    description: 'AIが食事内容を自動で解析し、栄養バランスをスコアで表示します。',
  },
  {
    icon: '📊',
    title: '週次レポートで振り返り',
    description: '1週間の食事傾向をレポートにまとめ、改善ポイントを提案します。',
  },
]

function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      {/* メインビジュアル */}
      <section className="bg-gradient-to-b from-green-600 to-green-400 text-white text-center px-6 py-20">
        <p className="inline-block bg-green-500 text-green-100 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-widest">
          AI POWERED
        </p>
        <h2 className="text-3xl font-extrabold leading-tight mb-5">
          毎日の食事を<br />AIが分析
        </h2>
        <p className="text-green-100 text-sm leading-relaxed">
          食べたものを記録するだけで<br />
          栄養バランスをフィードバック
        </p>
      </section>

      {/* 機能紹介 */}
      <section className="px-4 py-10 max-w-md mx-auto">
        <h3 className="text-center text-green-700 font-semibold text-lg mb-6">
          できること
        </h3>
        <div className="flex flex-col gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 flex items-start gap-4"
            >
              <span className="text-3xl leading-none mt-0.5">{feature.icon}</span>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTAボタン */}
      <div className="px-6 pb-16 flex flex-col items-center gap-3">
        <button
          onClick={() => navigate('/meals')}
          className="w-full max-w-xs bg-green-500 hover:bg-green-600 active:scale-95 text-white text-lg font-bold py-4 rounded-full shadow-lg transition-all duration-200"
        >
          はじめる →
        </button>
        <p className="text-gray-400 text-xs">無料でお使いいただけます</p>
      </div>
    </>
  )
}

export default HomePage
