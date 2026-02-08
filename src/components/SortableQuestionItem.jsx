import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ExternalLink, CheckCircle2, Circle, MoreVertical, GripVertical, Edit2, Trash2, FileText, PenTool } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import QuestionModal from './QuestionModal'
import TextNotesModal from './TextNotesModal'
import DrawingCanvas from './DrawingCanvas'

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

const SortableQuestionItem = ({ question, topic, subTopic }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id })
  const [showMenu, setShowMenu] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [textNotesOpen, setTextNotesOpen] = useState(false)
  const [drawingOpen, setDrawingOpen] = useState(false)
  const { toggleSolved, deleteQuestion } = useSheetStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const difficultyClass = difficultyColors[question.difficulty] || difficultyColors.Medium
  const platformClass = platformColors[question.platform] || platformColors.unknown

  const handleDelete = () => {
    if (window.confirm(`Delete question "${question.title}"?`)) {
      deleteQuestion(topic.id, subTopic.id, question.id)
    }
    setShowMenu(false)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`p-2 sm:p-3 border rounded-xl transition-all duration-200 group relative ${
          question.isSolved 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm' 
            : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200'
        }`}
      >
        <div className="flex items-start gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Drag Handle */}
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded opacity-0 sm:group-hover:opacity-100 flex-shrink-0 mt-0.5 hidden sm:block"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={14} className="text-gray-400" />
          </button>

          {/* Checkbox */}
          <button
            onClick={() => toggleSolved(topic.id, subTopic.id, question.id)}
            className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
          >
            {question.isSolved ? (
              <CheckCircle2 size={18} className="text-green-600 sm:w-5 sm:h-5" />
            ) : (
              <Circle size={18} className="text-gray-400 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4
              className={`text-xs sm:text-sm font-medium ${
                question.isSolved ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
            >
              {question.title}
            </h4>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
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
                  <span className="hidden sm:inline">Problem</span>
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
                  <span className="hidden sm:inline">Resource</span>
                </a>
              )}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Text Notes Button */}
            <button
              onClick={() => setTextNotesOpen(true)}
              className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-all duration-200 hover:scale-110"
              title="Text notes"
            >
              <FileText size={16} />
            </button>

            {/* Drawing Notes Button */}
            <button
              onClick={() => setDrawingOpen(true)}
              className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-600 transition-all duration-200 hover:scale-110"
              title="Doodle notes"
            >
              <PenTool size={16} />
            </button>
          </div>

          {/* Menu Button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1 hover:bg-gray-200 rounded-lg opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
            >
              <MoreVertical size={14} className="text-gray-400" />
            </button>

            {/* Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[150px] z-10 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    setModalOpen(true)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm flex items-center gap-2 border-b border-gray-100 transition-colors duration-200"
                >
                  <Edit2 size={14} className="text-blue-600" /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 text-sm flex items-center gap-2 transition-colors duration-200"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Modal */}
      <QuestionModal
        isOpen={modalOpen}
        mode="edit"
        topicId={topic.id}
        subTopicId={subTopic.id}
        questionId={question.id}
        onClose={() => setModalOpen(false)}
      />

      {/* Text Notes Modal */}
      <TextNotesModal
        isOpen={textNotesOpen}
        onClose={() => setTextNotesOpen(false)}
        question={question}
        topicId={topic.id}
        subTopicId={subTopic.id}
      />

      {/* Drawing Canvas */}
      <DrawingCanvas
        isOpen={drawingOpen}
        onClose={() => setDrawingOpen(false)}
        question={question}
        topicId={topic.id}
        subTopicId={subTopic.id}
      />
    </>
  )
}

export default SortableQuestionItem
