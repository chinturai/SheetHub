import { create } from 'zustand'
import { fetchDefaultSheet, normalizeApiSheet } from '@/utils/normalizeApiSheet'

const STORAGE_KEY = 'question-sheet-data'

const useSheetStore = create((set, get) => ({
  // State
  topics: [],
  selectedTopicId: null,
  loading: false,
  error: null,
  searchQuery: '',
  difficultyFilter: 'all', // 'all', 'easy', 'medium', 'hard'

  // Fetch and initialize
  initializeSheet: async () => {
    set({ loading: true, error: null })

    try {
      // Check localStorage first
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        set({ topics: parsed.topics })
        if (parsed.topics.length > 0) {
          set({ selectedTopicId: parsed.topics[0].id })
        }
        set({ loading: false })
        return
      }

      // Fetch from API
      const apiData = await fetchDefaultSheet()
      const normalized = normalizeApiSheet(apiData)

      set({ topics: normalized.topics })
      if (normalized.topics.length > 0) {
        set({ selectedTopicId: normalized.topics[0].id })
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      set({ loading: false })
    } catch (err) {
      set({
        error: err.message || 'Failed to load sheet',
        loading: false,
      })
    }
  },

  setSelectedTopic: (topicId) => {
    set({ selectedTopicId: topicId })
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  setDifficultyFilter: (filter) => {
    set({ difficultyFilter: filter })
  },

  // Topic CRUD
  addTopic: (title) => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      title,
      subTopics: [],
    }

    set((state) => {
      const updated = { topics: [...state.topics, newTopic] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    return newTopic.id
  },

  editTopic: (topicId, newTitle) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId ? { ...t, title: newTitle } : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  deleteTopic: (topicId) => {
    set((state) => {
      const updated = {
        topics: state.topics.filter((t) => t.id !== topicId),
      }
      if (state.selectedTopicId === topicId) {
        updated.selectedTopicId = updated.topics.length > 0 ? updated.topics[0].id : null
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  // SubTopic CRUD
  addSubTopic: (topicId, title) => {
    const newSubTopic = {
      id: `subtopic-${Date.now()}`,
      title,
      questions: [],
    }

    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? { ...t, subTopics: [...t.subTopics, newSubTopic] }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    return newSubTopic.id
  },

  editSubTopic: (topicId, subTopicId, newTitle) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId ? { ...st, title: newTitle } : st
                ),
              }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  deleteSubTopic: (topicId, subTopicId) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.filter((st) => st.id !== subTopicId),
              }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  // Question CRUD
  addQuestion: (topicId, subTopicId, questionData) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      ...questionData,
      isSolved: false,
    }

    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId
                    ? { ...st, questions: [...st.questions, newQuestion] }
                    : st
                ),
              }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    return newQuestion.id
  },

  editQuestion: (topicId, subTopicId, questionId, updates) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId
                    ? {
                        ...st,
                        questions: st.questions.map((q) =>
                          q.id === questionId ? { ...q, ...updates } : q
                        ),
                      }
                    : st
                ),
              }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  deleteQuestion: (topicId, subTopicId, questionId) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId
                    ? {
                        ...st,
                        questions: st.questions.filter((q) => q.id !== questionId),
                      }
                    : st
                ),
              }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  toggleSolved: (topicId, subTopicId, questionId) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId
                    ? {
                        ...st,
                        questions: st.questions.map((q) =>
                          q.id === questionId
                            ? { ...q, isSolved: !q.isSolved }
                            : q
                        ),
                      }
                    : st
                ),
              }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  // Notes Methods
  saveTextNote: (topicId, subTopicId, questionId, textNote) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId
                    ? {
                        ...st,
                        questions: st.questions.map((q) =>
                          q.id === questionId ? { ...q, textNote } : q
                        ),
                      }
                    : st
                ),
              }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  saveDrawingNote: (topicId, subTopicId, questionId, drawingNote) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                subTopics: t.subTopics.map((st) =>
                  st.id === subTopicId
                    ? {
                        ...st,
                        questions: st.questions.map((q) =>
                          q.id === questionId ? { ...q, drawingNote } : q
                        ),
                      }
                    : st
                ),
              }
            : t
        ),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  // Drag and Drop - Reorder Topics
  reorderTopics: (items) => {
    set((state) => {
      const topicMap = new Map(state.topics.map((t) => [t.id, t]))
      const reordered = items.map((id) => topicMap.get(id)).filter(Boolean)

      const updated = { topics: reordered }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  // Drag and Drop - Reorder SubTopics
  reorderSubTopics: (topicId, items) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) => {
          if (t.id === topicId) {
            const subTopicMap = new Map(t.subTopics.map((st) => [st.id, st]))
            const reordered = items.map((id) => subTopicMap.get(id)).filter(Boolean)
            return { ...t, subTopics: reordered }
          }
          return t
        }),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  // Drag and Drop - Reorder Questions
  reorderQuestions: (topicId, subTopicId, items) => {
    set((state) => {
      const updated = {
        topics: state.topics.map((t) => {
          if (t.id === topicId) {
            return {
              ...t,
              subTopics: t.subTopics.map((st) => {
                if (st.id === subTopicId) {
                  const questionMap = new Map(st.questions.map((q) => [q.id, q]))
                  const reordered = items.map((id) => questionMap.get(id)).filter(Boolean)
                  return { ...st, questions: reordered }
                }
                return st
              }),
            }
          }
          return t
        }),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  },

  // Move question between subtopics
  moveQuestion: (fromTopicId, fromSubTopicId, toTopicId, toSubTopicId, questionId) => {
    set((state) => {
      let movedQuestion = null

      // Find and remove question from source
      const topics1 = state.topics.map((t) => {
        if (t.id === fromTopicId) {
          return {
            ...t,
            subTopics: t.subTopics.map((st) => {
              if (st.id === fromSubTopicId) {
                const filtered = st.questions.filter((q) => {
                  if (q.id === questionId) {
                    movedQuestion = q
                    return false
                  }
                  return true
                })
                return { ...st, questions: filtered }
              }
              return st
            }),
          }
        }
        return t
      })

      // Add question to destination
      if (movedQuestion) {
        const updated = {
          topics: topics1.map((t) => {
            if (t.id === toTopicId) {
              return {
                ...t,
                subTopics: t.subTopics.map((st) => {
                  if (st.id === toSubTopicId) {
                    return { ...st, questions: [...st.questions, movedQuestion] }
                  }
                  return st
                }),
              }
            }
            return t
          }),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      }

      return state
    })
  },

  // Export/Import
  exportJSON: () => {
    const state = get()
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      topics: state.topics,
    }
    return JSON.stringify(data, null, 2)
  },

  importJSON: (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.topics && Array.isArray(data.topics)) {
        set({ topics: data.topics })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return true
      }
      return false
    } catch (error) {
      console.error('Import failed:', error)
      return false
    }
  },

  // Reset to API default
  resetToDefault: async () => {
    set({ loading: true, error: null })

    try {
      localStorage.removeItem(STORAGE_KEY)
      const apiData = await fetchDefaultSheet()
      const normalized = normalizeApiSheet(apiData)

      set({ topics: normalized.topics })
      if (normalized.topics.length > 0) {
        set({ selectedTopicId: normalized.topics[0].id })
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      set({ loading: false })
    } catch (err) {
      set({
        error: err.message || 'Failed to reset sheet',
        loading: false,
      })
    }
  },

  // Utility: Get topic by ID
  getTopicById: (topicId) => {
    const state = get()
    return state.topics.find((t) => t.id === topicId)
  },

  // Utility: Get subtopic by ID
  getSubTopicById: (topicId, subTopicId) => {
    const topic = get().getTopicById(topicId)
    return topic?.subTopics.find((st) => st.id === subTopicId)
  },

  // Utility: Get question by ID
  getQuestionById: (topicId, subTopicId, questionId) => {
    const subTopic = get().getSubTopicById(topicId, subTopicId)
    return subTopic?.questions.find((q) => q.id === questionId)
  },

  // Utility: Get filtered questions
  getFilteredQuestions: () => {
    const state = get()
    const results = []

    state.topics.forEach((topic) => {
      topic.subTopics.forEach((subTopic) => {
        subTopic.questions.forEach((question) => {
          let matches = true

          // Search filter
          if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase()
            matches =
              matches &&
              (question.title.toLowerCase().includes(query) ||
                question.platform.toLowerCase().includes(query) ||
                topic.title.toLowerCase().includes(query) ||
                subTopic.title.toLowerCase().includes(query))
          }

          // Difficulty filter
          if (state.difficultyFilter !== 'all') {
            matches =
              matches &&
              question.difficulty.toLowerCase() === state.difficultyFilter.toLowerCase()
          }

          if (matches) {
            results.push({
              ...question,
              topic: topic.title,
              topicId: topic.id,
              subTopic: subTopic.title,
              subTopicId: subTopic.id,
            })
          }
        })
      })
    })

    return results
  },

  // Utility: Get topic stats
  getTopicStats: (topicId) => {
    const topic = get().getTopicById(topicId)
    if (!topic) return { total: 0, solved: 0 }

    let total = 0
    let solved = 0

    topic.subTopics.forEach((st) => {
      st.questions.forEach((q) => {
        total++
        if (q.isSolved) solved++
      })
    })

    return { total, solved }
  },
}))

export default useSheetStore
