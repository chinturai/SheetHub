import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import useSheetStore from '@/store/useSheetStore'
import SortableQuestionItem from './SortableQuestionItem'

const DraggableQuestionList = ({ topic, subTopic }) => {
  const { reorderQuestions, difficultyFilter } = useSheetStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter questions by difficulty
  const filteredQuestions = subTopic.questions.filter((q) => {
    if (difficultyFilter === 'all') return true
    return q.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
  })

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = subTopic.questions.findIndex((q) => q.id === active.id)
      const newIndex = subTopic.questions.findIndex((q) => q.id === over.id)

      const newOrder = arrayMove(subTopic.questions, oldIndex, newIndex)
      reorderQuestions(
        topic.id,
        subTopic.id,
        newOrder.map((q) => q.id)
      )
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredQuestions.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {filteredQuestions.map((question) => (
            <SortableQuestionItem
              key={question.id}
              question={question}
              topic={topic}
              subTopic={subTopic}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default DraggableQuestionList
