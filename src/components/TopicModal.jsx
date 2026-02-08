import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import useSheetStore from '@/store/useSheetStore'

const TopicModal = ({ isOpen, mode, topicId, onClose }) => {
  const [title, setTitle] = useState('')
  const { addTopic, editTopic, getTopicById } = useSheetStore()

  useEffect(() => {
    if (mode === 'edit' && topicId) {
      const topic = getTopicById(topicId)
      if (topic) {
        setTitle(topic.title)
      }
    } else {
      setTitle('')
    }
  }, [mode, topicId, isOpen, getTopicById])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    if (mode === 'add') {
      addTopic(title)
    } else if (mode === 'edit') {
      editTopic(topicId, title)
    }

    setTitle('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 -m-6 mb-6 p-6 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {mode === 'add' ? 'Add Topic' : 'Edit Topic'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-blue-200 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Arrays, Strings, Trees"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              autoFocus
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {mode === 'add' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TopicModal
