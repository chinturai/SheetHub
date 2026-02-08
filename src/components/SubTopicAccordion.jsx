import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import QuestionCard from './QuestionCard'
import ContextMenu from './ContextMenu'

const SubTopicAccordion = ({ topic, subTopic }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [contextMenu, setContextMenu] = useState(null)

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'subtopic',
      topicId: topic.id,
      subTopicId: subTopic.id,
    })
  }

  const questionCount = subTopic.questions.length

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-4">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onContextMenu={handleContextMenu}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronUp size={18} className="text-gray-600" />
          ) : (
            <ChevronDown size={18} className="text-gray-600" />
          )}
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{subTopic.title}</h3>
            <p className="text-xs text-gray-500">{questionCount} questions</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleContextMenu(e)
          }}
          className="p-1 hover:bg-gray-200 rounded opacity-0 hover:opacity-100 group-hover:opacity-100"
        >
          <MoreVertical size={16} className="text-gray-400" />
        </button>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          {questionCount === 0 ? (
            <p className="text-center text-gray-500 py-8">No questions yet</p>
          ) : (
            <div className="space-y-3">
              {subTopic.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  topicId={topic.id}
                  subTopicId={subTopic.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          topicId={contextMenu.topicId}
          subTopicId={contextMenu.subTopicId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}

export default SubTopicAccordion
