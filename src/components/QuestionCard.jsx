import { ExternalLink, CheckCircle2, Circle, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import ContextMenu from './ContextMenu'

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-blue-100 text-blue-800',
  Hard: 'bg-red-100 text-red-800',
}

const platformColors = {
  leetcode: 'bg-yellow-100 text-yellow-800',
  gfg: 'bg-green-100 text-green-800',
  tuf: 'bg-purple-100 text-purple-800',
  interviewbit: 'bg-pink-100 text-pink-800',
  unknown: 'bg-gray-100 text-gray-800',
}

const QuestionCard = ({ question, topicId, subTopicId }) => {
  const { toggleSolved } = useSheetStore()
  const [contextMenu, setContextMenu] = useState(null)

  const difficultyClass = difficultyColors[question.difficulty] || difficultyColors.Medium
  const platformClass = platformColors[question.platform] || platformColors.unknown

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'question',
      topicId,
      subTopicId,
      questionId: question.id,
    })
  }

  return (
    <>
      <div
        className={`p-3 border rounded-lg hover:shadow-md transition-all ${
          question.isSolved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
        }`}
        onContextMenu={handleContextMenu}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => toggleSolved(topicId, subTopicId, question.id)}
            className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
          >
            {question.isSolved ? (
              <CheckCircle2 size={20} className="text-green-600" />
            ) : (
              <Circle size={20} className="text-gray-400" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-medium ${
                question.isSolved ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
            >
              {question.title}
            </h4>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyClass}`}>
                {question.difficulty}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${platformClass}`}>
                {question.platform}
              </span>
            </div>

            {/* Links */}
            <div className="flex gap-2 mt-2">
              {question.problemUrl && (
                <a
                  href={question.problemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                >
                  <ExternalLink size={12} />
                  Problem
                </a>
              )}
              {question.resource && (
                <a
                  href={question.resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline"
                >
                  <ExternalLink size={12} />
                  Resource
                </a>
              )}
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleContextMenu(e)
            }}
            className="p-1 hover:bg-gray-200 rounded opacity-0 hover:opacity-100"
          >
            <MoreVertical size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          topicId={contextMenu.topicId}
          subTopicId={contextMenu.subTopicId}
          questionId={contextMenu.questionId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  )
}

export default QuestionCard
