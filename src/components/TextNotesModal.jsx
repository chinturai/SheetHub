import { X, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import useSheetStore from '@/store/useSheetStore'

const TextNotesModal = ({ isOpen, onClose, question, topicId, subTopicId }) => {
  const [notes, setNotes] = useState('')
  const { saveTextNote } = useSheetStore()

  useEffect(() => {
    if (question?.textNote) {
      setNotes(question.textNote)
    } else {
      setNotes('')
    }
  }, [question, isOpen])

  const handleSave = () => {
    saveTextNote(topicId, subTopicId, question.id, notes)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-[95vw] sm:w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Text Notes</h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{question?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your notes here..."
          className="flex-1 p-3 sm:p-4 resize-none outline-none border-none focus:ring-0 text-sm sm:text-base"
        />

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-3 sm:p-4 border-t border-gray-200 flex-wrap">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save Notes</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TextNotesModal
