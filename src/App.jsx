import { useEffect, useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import Header from '@/components/Header'
import TopicList from '@/components/TopicList'
import MainContent from '@/components/MainContent'
import FloatingActionMenu from '@/components/FloatingActionMenu'
import SearchModal from '@/components/SearchModal'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'

function App() {
  const { initializeSheet, loading, error, selectedTopicId } = useSheetStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)

  // Initialize on mount
  useEffect(() => {
    initializeSheet()
  }, [])

  // Keyboard shortcut: Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleExport = () => {
    const json = useSheetStore.getState().exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sheet-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result
          if (typeof content === 'string') {
            const success = useSheetStore.getState().importJSON(content)
            if (success) {
              alert('Sheet imported successfully!')
            } else {
              alert('Failed to import sheet. Invalid format.')
            }
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleReset = () => {
    if (
      window.confirm(
        'This will reset the sheet to the original Striver SDE sheet. Are you sure?'
      )
    ) {
      useSheetStore.getState().resetToDefault()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSearchOpen={() => setSearchOpen(true)}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } hidden lg:flex flex-col border-r border-gray-200 bg-white transition-all duration-300 overflow-hidden`}
        >
          <TopicList isOpen={true} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden absolute left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 z-20">
            <TopicList isOpen={true} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {loading && <LoadingState />}
          {error && <ErrorState />}
          {!loading && !error && selectedTopicId && (
            <MainContent topicId={selectedTopicId} />
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

export default App
