import { Plus } from 'lucide-react'
import { useState } from 'react'
import TopicModal from './TopicModal'

const FloatingActionMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
          title="Add new topic"
        >
          <Plus size={24} />
        </button>
      </div>

      <TopicModal isOpen={isModalOpen} mode="add" onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default FloatingActionMenu
