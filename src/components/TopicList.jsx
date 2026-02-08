import { Plus, Edit2, Trash2, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import DraggableTopicList from './DraggableTopicList'
import TopicModal from './TopicModal'

const TopicList = ({ isOpen, sidebarOpen, setSidebarOpen }) => {
  const { topics, deleteTopic } = useSheetStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)

  const handleEditTopic = (topicId) => {
    setEditingTopic(topicId)
    setModalOpen(true)
  }

  const handleDeleteTopic = (topicId, topicTitle) => {
    if (window.confirm(`Delete topic "${topicTitle}"?`)) {
      deleteTopic(topicId)
    }
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Topics</h2>
          <p className="text-xs text-gray-500 mt-1">{topics.length} topics</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setModalOpen(true)}
            className="p-1.5 hover:bg-blue-100 rounded text-blue-600"
            title="Add topic"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-200 rounded lg:block hidden"
            title="Collapse sidebar"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Topic List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {topics.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No topics yet</p>
          </div>
        ) : (
          <div>
            <DraggableTopicList topics={topics} />
          </div>
        )}
      </div>

      {/* Modals */}
      <TopicModal
        isOpen={modalOpen}
        mode={editingTopic ? 'edit' : 'add'}
        topicId={editingTopic}
        onClose={() => {
          setModalOpen(false)
          setEditingTopic(null)
        }}
      />
    </div>
  )
}

export default TopicList
