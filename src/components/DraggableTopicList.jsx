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
import SortableTopicItem from './SortableTopicItem'

const DraggableTopicList = ({ topics }) => {
  const { reorderTopics } = useSheetStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = topics.findIndex((t) => t.id === active.id)
      const newIndex = topics.findIndex((t) => t.id === over.id)

      const newOrder = arrayMove(topics, oldIndex, newIndex)
      reorderTopics(newOrder.map((t) => t.id))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={topics.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {topics.map((topic) => (
          <SortableTopicItem key={topic.id} topic={topic} />
        ))}
      </SortableContext>
    </DndContext>
  )
}

export default DraggableTopicList
