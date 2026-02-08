import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import useSheetStore from '@/store/useSheetStore'

const SubTopicModal = ({ isOpen, mode, topicId, subTopicId, onClose }) => {
  const [title, setTitle] = useState('')
  const { addSubTopic, editSubTopic, getSubTopicById } = useSheetStore()

  useEffect(() => {
    if (mode === 'edit' && topicId && subTopicId) {
      const subTopic = getSubTopicById(topicId, subTopicId)
      if (subTopic) {
        setTitle(subTopic.title)
      }
    } else {
      setTitle('')
    }
  }, [mode, topicId, subTopicId, isOpen, getSubTopicById])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    if (mode === 'add') {
      addSubTopic(topicId, title)
    } else if (mode === 'edit') {
      editSubTopic(topicId, subTopicId, title)
    }

    setTitle('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Sub-Topic' : 'Edit Sub-Topic'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Topic Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Two Pointers, Sliding Window"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'add' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubTopicModal
