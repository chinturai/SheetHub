import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MoreVertical, GripVertical, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import TopicModal from './TopicModal'

const SortableTopicItem = ({ topic }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: topic.id })
  const [showMenu, setShowMenu] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { selectedTopicId, setSelectedTopic, getTopicStats, deleteTopic } = useSheetStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const stats = getTopicStats(topic.id)
  const isSelected = selectedTopicId === topic.id

  const handleDelete = () => {
    if (window.confirm(`Delete topic "${topic.title}"?`)) {
      deleteTopic(topic.id)
    }
    setShowMenu(false)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors group border-b border-gray-100 relative ${
          isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
        onClick={() => setSelectedTopic(topic.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <button
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={16} className="text-gray-400" />
            </button>
            <div className="flex-1">
              <h3 className="font-medium text-sm text-gray-900">{topic.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {stats.solved}/{stats.total} solved
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${stats.total > 0 ? (stats.solved / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[150px] z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    setModalOpen(true)
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
        </div>
      </div>

      {/* Edit Modal */}
      <TopicModal
        isOpen={modalOpen}
        mode="edit"
        topicId={topic.id}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}

export default SortableTopicItem
