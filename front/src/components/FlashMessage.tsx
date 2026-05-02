type Props = {
  messages: string[]
  type: 'error' | 'success'
  onClose: () => void
}

function FlashMessage({ messages, type, onClose }: Props) {
  if (messages.length === 0) return null

  const styles =
    type === 'error'
      ? 'bg-red-50 border-red-300 text-red-700'
      : 'bg-green-50 border-green-300 text-green-700'

  return (
    <div className={`border-b px-4 py-3 ${styles}`}>
      <div className="max-w-md mx-auto flex items-start justify-between gap-3">
        <div className="text-sm">
          {messages.map((msg) => (
            <p key={msg}>・{msg}</p>
          ))}
        </div>
        <button
          onClick={onClose}
          className="text-lg leading-none opacity-60 hover:opacity-100 flex-shrink-0"
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default FlashMessage
