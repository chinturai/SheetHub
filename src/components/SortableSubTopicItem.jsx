import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronUp, MoreVertical, GripVertical, Plus, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import DraggableQuestionList from './DraggableQuestionList'
import QuestionModal from './QuestionModal'

const SortableSubTopicItem = ({ topic, subTopic }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: subTopic.id })
  const [isOpen, setIsOpen] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const { deleteSubTopic } = useSheetStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const questionCount = subTopic.questions.length

  const handleDelete = () => {
    if (window.confirm(`Delete sub-topic "${subTopic.title}"?`)) {
      deleteSubTopic(topic.id, subTopic.id)
    }
    setShowMenu(false)
  }

  return (
    <>
      <div ref={setNodeRef} style={style} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3 flex-1">
            <button
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={16} className="text-gray-400" />
            </button>
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
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {/* Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px] z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    setQuestionModalOpen(true)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2 border-b border-gray-100"
                >
                  <Plus size={14} /> Add Question
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    // TODO: Open edit modal
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2 border-b border-gray-100"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 text-sm flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </button>

        {/* Content */}
        {isOpen && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            {questionCount === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No questions yet</p>
                <button
                  onClick={() => setQuestionModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  <Plus size={14} />
                  Add Question
                </button>
              </div>
            ) : (
              <>
                <DraggableQuestionList topic={topic} subTopic={subTopic} />
                <button
                  onClick={() => setQuestionModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  <Plus size={14} />
                  Add Question
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Question Modal */}
      <QuestionModal
        isOpen={questionModalOpen}
        mode="add"
        topicId={topic.id}
        subTopicId={subTopic.id}
        onClose={() => setQuestionModalOpen(false)}
      />
    </>
  )
}

export default SortableSubTopicItem
