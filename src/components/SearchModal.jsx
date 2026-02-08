import { X, Search } from 'lucide-react'
import { useEffect, useRef } from 'react'
import useSheetStore from '@/store/useSheetStore'

const SearchModal = ({ isOpen, onClose }) => {
  const { searchQuery, setSearchQuery, getFilteredQuestions } = useSheetStore()
  const inputRef = useRef(null)
  const results = getFilteredQuestions()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed top-0 left-0 right-0 bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="flex-1 text-lg outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? 'No questions found' : 'Start typing to search'}
            </div>
          ) : (
            <ul>
              {results.map((q) => (
                <li
                  key={q.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSearchQuery('')
                    onClose()
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{q.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {q.topic} › {q.subTopic}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {q.difficulty}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
