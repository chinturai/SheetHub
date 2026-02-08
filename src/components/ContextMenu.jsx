import { Edit2, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'

const ContextMenu = ({ x, y, type, topicId, subTopicId, questionId, onClose }) => {
  const {
    editTopic,
    deleteTopic,
    addSubTopic,
    editSubTopic,
    deleteSubTopic,
    addQuestion,
    editQuestion,
    deleteQuestion,
  } = useSheetStore()
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleEdit = () => {
    setShowInput(true)
    onClose()
  }

  const handleAddChild = () => {
    setShowInput(true)
    setInputValue('')
  }

  const handleConfirmEdit = () => {
    if (!inputValue.trim()) return

    if (type === 'topic') {
      editTopic(topicId, inputValue)
    } else if (type === 'subtopic') {
      editSubTopic(topicId, subTopicId, inputValue)
    } else if (type === 'question') {
      editQuestion(topicId, subTopicId, questionId, { title: inputValue })
    }

    setShowInput(false)
    setInputValue('')
  }

  const handleConfirmAdd = () => {
    if (!inputValue.trim()) return

    if (type === 'topic') {
      addSubTopic(topicId, inputValue)
    } else if (type === 'subtopic') {
      addQuestion(topicId, subTopicId, {
        title: inputValue,
        difficulty: 'Medium',
        platform: 'leetcode',
        problemUrl: '',
        resource: '',
      })
    }

    setShowInput(false)
    setInputValue('')
  }

  const handleDelete = () => {
    if (type === 'topic') {
      if (window.confirm(`Delete topic "${useSheetStore.getState().getTopicById(topicId)?.title}"?`)) {
        deleteTopic(topicId)
      }
    } else if (type === 'subtopic') {
      if (
        window.confirm(
          `Delete subtopic "${useSheetStore.getState().getSubTopicById(topicId, subTopicId)?.title}"?`
        )
      ) {
        deleteSubTopic(topicId, subTopicId)
      }
    } else if (type === 'question') {
      if (
        window.confirm(
          `Delete question "${useSheetStore.getState().getQuestionById(topicId, subTopicId, questionId)?.title}"?`
        )
      ) {
        deleteQuestion(topicId, subTopicId, questionId)
      }
    }
    onClose()
  }

  if (showInput) {
    return (
      <div
        className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50"
        style={{ left: `${x}px`, top: `${y}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              type === 'topic' ? handleConfirmEdit() : handleConfirmAdd()
            } else if (e.key === 'Escape') {
              setShowInput(false)
              onClose()
            }
          }}
          placeholder={type === 'topic' ? 'Topic name' : 'Name'}
          className="w-48 px-2 py-1 border border-gray-300 rounded text-sm"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() =>
              type === 'topic' ? handleConfirmEdit() : handleConfirmAdd()
            }
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => {
              setShowInput(false)
              onClose()
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[160px]"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleEdit}
        className="w-full px-4 py-2 hover:bg-gray-100 text-left text-sm flex items-center gap-2 border-b border-gray-100"
      >
        <Edit2 size={14} /> Edit
      </button>

      {(type === 'topic' || type === 'subtopic') && (
        <button
          onClick={handleAddChild}
          className="w-full px-4 py-2 hover:bg-gray-100 text-left text-sm flex items-center gap-2 border-b border-gray-100"
        >
          <Plus size={14} />
          {type === 'topic' ? 'Add Sub-topic' : 'Add Question'}
        </button>
      )}

      <button
        onClick={handleDelete}
        className="w-full px-4 py-2 hover:bg-red-50 text-left text-sm flex items-center gap-2 text-red-600"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  )
}

export default ContextMenu
