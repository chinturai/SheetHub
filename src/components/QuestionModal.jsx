import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import useSheetStore from '@/store/useSheetStore'

const QuestionModal = ({ isOpen, mode, topicId, subTopicId, questionId, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Medium',
    platform: 'leetcode',
    problemUrl: '',
    resource: '',
  })

  const { addQuestion, editQuestion, getQuestionById } = useSheetStore()

  useEffect(() => {
    if (mode === 'edit' && topicId && subTopicId && questionId) {
      const question = getQuestionById(topicId, subTopicId, questionId)
      if (question) {
        setFormData({
          title: question.title,
          difficulty: question.difficulty,
          platform: question.platform,
          problemUrl: question.problemUrl || '',
          resource: question.resource || '',
        })
      }
    } else {
      setFormData({
        title: '',
        difficulty: 'Medium',
        platform: 'leetcode',
        problemUrl: '',
        resource: '',
      })
    }
  }, [mode, topicId, subTopicId, questionId, isOpen, getQuestionById])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    if (mode === 'add') {
      addQuestion(topicId, subTopicId, formData)
    } else if (mode === 'edit') {
      editQuestion(topicId, subTopicId, questionId, formData)
    }

    setFormData({
      title: '',
      difficulty: 'Medium',
      platform: 'leetcode',
      problemUrl: '',
      resource: '',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Question' : 'Edit Question'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Two Sum"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="leetcode">LeetCode</option>
              <option value="gfg">GeeksforGeeks</option>
              <option value="tuf">Striver TUF</option>
              <option value="interviewbit">InterviewBit</option>
            </select>
          </div>

          {/* Problem URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem URL
            </label>
            <input
              type="url"
              name="problemUrl"
              value={formData.problemUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Resource URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource URL (Video/Article)
            </label>
            <input
              type="url"
              name="resource"
              value={formData.resource}
              onChange={handleChange}
              placeholder="https://youtu.be/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'add' ? 'Add' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionModal
