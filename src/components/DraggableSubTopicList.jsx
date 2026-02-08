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
import SortableSubTopicItem from './SortableSubTopicItem'

const DraggableSubTopicList = ({ topic }) => {
  const { reorderSubTopics } = useSheetStore()

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
      const oldIndex = topic.subTopics.findIndex((st) => st.id === active.id)
      const newIndex = topic.subTopics.findIndex((st) => st.id === over.id)

      const newOrder = arrayMove(topic.subTopics, oldIndex, newIndex)
      reorderSubTopics(
        topic.id,
        newOrder.map((st) => st.id)
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
        items={topic.subTopics.map((st) => st.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {topic.subTopics.map((subTopic) => (
            <SortableSubTopicItem
              key={subTopic.id}
              topic={topic}
              subTopic={subTopic}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default DraggableSubTopicList
