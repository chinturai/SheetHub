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
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 -m-6 mb-6 p-6 border-b border-blue-200 sticky -top-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {mode === 'add' ? 'Add Question' : 'Edit Question'}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Two Sum"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              autoFocus
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="leetcode">LeetCode</option>
              <option value="gfg">GeeksforGeeks</option>
              <option value="tuf">Striver TUF</option>
              <option value="interviewbit">InterviewBit</option>
            </select>
          </div>

          {/* Problem URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem URL
            </label>
            <input
              type="url"
              name="problemUrl"
              value={formData.problemUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>

          {/* Resource URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource URL (Video/Article)
            </label>
            <input
              type="url"
              name="resource"
              value={formData.resource}
              onChange={handleChange}
              placeholder="https://youtu.be/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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
