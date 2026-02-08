import axios from 'axios'

const API_URL = 'https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet'

/**
 * Fetch the default Striver SDE sheet from API
 */
export const fetchDefaultSheet = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching sheet:', error)
    throw error
  }
}

/**
 * Normalize flat API response into nested structure
 * {
 *   topics: [
 *     {
 *       id: "topic-name",
 *       title: "Arrays",
 *       subTopics: [
 *         {
 *           id: "generated-id",
 *           title: "Two Pointers",
 *           questions: [...]
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export const normalizeApiSheet = (apiData) => {
  try {
    const { data } = apiData
    const { sheet, questions } = data

    if (!sheet || !questions) {
      throw new Error('Invalid API response structure')
    }

    const { topicOrder, questionOrder } = sheet.config || {}

    // Create a map of questions by ID for quick lookup
    const questionMap = {}
    questions.forEach((q) => {
      questionMap[q._id] = {
        id: q._id,
        title: q.title,
        difficulty: q.questionId?.difficulty || 'Unknown',
        platform: q.questionId?.platform || 'unknown',
        problemUrl: q.questionId?.problemUrl || '',
        resource: q.resource || '',
        isSolved: false,
      }
    })

    // Group questions by (topic, subTopic)
    const topicMap = {}
    questions.forEach((q) => {
      const topic = q.topic || 'Uncategorized'
      const subTopic = q.subTopic || 'General'

      if (!topicMap[topic]) {
        topicMap[topic] = {}
      }

      if (!topicMap[topic][subTopic]) {
        topicMap[topic][subTopic] = []
      }

      topicMap[topic][subTopic].push(q._id)
    })

    // Build normalized structure
    const topics = []
    const orderedTopics = topicOrder || Object.keys(topicMap)

    orderedTopics.forEach((topicName) => {
      if (!topicMap[topicName]) return

      const subTopicsMap = topicMap[topicName]
      const subTopics = []

      Object.keys(subTopicsMap).forEach((subTopicName) => {
        const questionIds = subTopicsMap[subTopicName]
        const orderedQuestionIds =
          questionOrder && questionOrder[topicName] && questionOrder[topicName][subTopicName]
            ? questionOrder[topicName][subTopicName]
            : questionIds

        const subTopicQuestions = orderedQuestionIds
          .map((id) => questionMap[id])
          .filter(Boolean)

        if (subTopicQuestions.length > 0) {
          subTopics.push({
            id: `${topicName}-${subTopicName}-${Math.random().toString(36).substr(2, 9)}`,
            title: subTopicName,
            questions: subTopicQuestions,
          })
        }
      })

      if (subTopics.length > 0) {
        topics.push({
          id: topicName.replace(/\s+/g, '-').toLowerCase(),
          title: topicName,
          subTopics,
        })
      }
    })

    return { topics }
  } catch (error) {
    console.error('Error normalizing sheet:', error)
    throw error
  }
}
