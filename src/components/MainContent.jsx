import { Plus } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import DraggableSubTopicList from './DraggableSubTopicList'
import SubTopicModal from './SubTopicModal'

const MainContent = ({ topicId }) => {
  const { getTopicById, difficultyFilter, setDifficultyFilter } = useSheetStore()
  const [modalOpen, setModalOpen] = useState(false)
  const topic = getTopicById(topicId)

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Select a topic to get started</p>
        </div>
      </div>
    )
  }

  const totalQuestions = topic.subTopics.reduce((sum, st) => sum + st.questions.length, 0)
  const solvedQuestions = topic.subTopics.reduce(
    (sum, st) => sum + st.questions.filter((q) => q.isSolved).length,
    0
  )

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Topic Header */}
        <div className="mb-6 sm:mb-8 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent break-words flex-1">{topic.title}</h1>
            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg text-xs sm:text-sm font-medium outline-none hover:border-blue-300 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
              title="Filter by difficulty"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <p className="text-sm sm:text-base text-gray-600 whitespace-nowrap">
              {solvedQuestions} / {totalQuestions} questions solved
            </p>
            <div className="flex-1 max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{
                  width: `${totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Add Sub-topic Button */}
        <div className="mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={16} />
            Add Sub-topic
          </button>
        </div>

        {/* SubTopics */}
        {topic.subTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No sub-topics yet. Add one to get started!</p>
          </div>
        ) : (
          <DraggableSubTopicList topic={topic} />
        )}

        {/* Modal */}
        <SubTopicModal
          isOpen={modalOpen}
          mode="add"
          topicId={topic.id}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  )
}

export default MainContent
