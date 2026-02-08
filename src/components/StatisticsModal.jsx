import { X, BarChart3 } from 'lucide-react'
import useSheetStore from '@/store/useSheetStore'

const StatisticsModal = ({ isOpen, onClose }) => {
  const { topics } = useSheetStore()

  // Calculate statistics
  const calculateStats = () => {
    let totalQuestions = 0
    let totalSolved = 0
    const difficultyStats = {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 },
    }

    topics.forEach((topic) => {
      topic.subTopics.forEach((subTopic) => {
        subTopic.questions.forEach((question) => {
          const difficulty = question.difficulty.toLowerCase()
          totalQuestions++

          if (question.isSolved) {
            totalSolved++
          }

          if (difficultyStats[difficulty]) {
            difficultyStats[difficulty].total++
            if (question.isSolved) {
              difficultyStats[difficulty].solved++
            }
          }
        })
      })
    })

    return { totalQuestions, totalSolved, difficultyStats }
  }

  const stats = calculateStats()
  const solvePercentage =
    stats.totalQuestions > 0
      ? Math.round((stats.totalSolved / stats.totalQuestions) * 100)
      : 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Main Circular Progress */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mb-8">
            {/* Circular Progress Indicator */}
            <div className="relative flex-shrink-0">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="transform -rotate-90"
              >
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />

                {/* Hard (red) - last segment */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray={`${(stats.difficultyStats.hard.solved / stats.totalSolved || 0) * 565} 565`}
                  strokeLinecap="round"
                  style={{
                    strokeDashoffset:
                      -((stats.difficultyStats.easy.solved + stats.difficultyStats.medium.solved) /
                        stats.totalSolved || 0) * 565,
                  }}
                />

                {/* Medium (yellow) - middle segment */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="8"
                  strokeDasharray={`${(stats.difficultyStats.medium.solved / stats.totalSolved || 0) * 565} 565`}
                  strokeLinecap="round"
                  style={{
                    strokeDashoffset:
                      -((stats.difficultyStats.easy.solved / stats.totalSolved) * 565 || 0),
                  }}
                />

                {/* Easy (green) - first segment */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${(stats.difficultyStats.easy.solved / stats.totalSolved || 0) * 565} 565`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{stats.totalSolved}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stats.totalQuestions}</div>
                <div className="text-xs text-gray-500 mt-1">{solvePercentage}%</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-1 gap-4">
              {/* Total */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Total Questions</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                      {stats.totalSolved}/{stats.totalQuestions}
                    </p>
                  </div>
                  <div className="text-4xl font-bold text-blue-300">{solvePercentage}%</div>
                </div>
              </div>

              {/* Easy */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-md"></div>
                    <div>
                      <p className="text-xs text-green-600 font-medium">Easy</p>
                      <p className="text-xl font-bold text-green-900">
                        {stats.difficultyStats.easy.solved}/{stats.difficultyStats.easy.total}
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-300">
                    {stats.difficultyStats.easy.total > 0
                      ? Math.round(
                          (stats.difficultyStats.easy.solved / stats.difficultyStats.easy.total) * 100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>

              {/* Medium */}
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-md"></div>
                    <div>
                      <p className="text-xs text-yellow-600 font-medium">Medium</p>
                      <p className="text-xl font-bold text-yellow-900">
                        {stats.difficultyStats.medium.solved}/{stats.difficultyStats.medium.total}
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-300">
                    {stats.difficultyStats.medium.total > 0
                      ? Math.round(
                          (stats.difficultyStats.medium.solved / stats.difficultyStats.medium.total) * 100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>

              {/* Hard */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-md"></div>
                    <div>
                      <p className="text-xs text-red-600 font-medium">Hard</p>
                      <p className="text-xl font-bold text-red-900">
                        {stats.difficultyStats.hard.solved}/{stats.difficultyStats.hard.total}
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-300">
                    {stats.difficultyStats.hard.total > 0
                      ? Math.round(
                          (stats.difficultyStats.hard.solved / stats.difficultyStats.hard.total) * 100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-600 font-medium mb-2">Overall Progress</p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${solvePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatisticsModal
