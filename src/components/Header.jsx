import { Menu, X, Search, Download, Upload, RefreshCw, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import StatisticsModal from './StatisticsModal'

const Header = ({ sidebarOpen, setSidebarOpen, onSearchOpen, onExport, onImport, onReset }) => {
  const [statsOpen, setStatsOpen] = useState(false)
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4 flex-wrap">
        {/* Left - Logo & Menu */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-fit">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
            title="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
          </button>
          <button
            onClick={() => setStatsOpen(true)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
            title="View statistics"
          >
            <BarChart3 size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-blue-600 truncate">SheetHub</h1>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 min-w-fit sm:max-w-md order-last sm:order-none w-full sm:w-auto">
          <button
            onClick={onSearchOpen}
            className="w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-gray-600"
            title="Search questions (Ctrl + K)"
          >
            <Search size={16} className="sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm hidden sm:inline">Search questions...</span>
            <span className="text-xs sm:hidden">Search...</span>
          </button>
        </div>

        {/* Right - Filters & Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Export Button */}
          <button
            onClick={onExport}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
            title="Export as JSON"
          >
            <Download size={16} className="sm:w-5 sm:h-5" />
          </button>

          {/* Import Button */}
          <button
            onClick={onImport}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
            title="Import from JSON"
          >
            <Upload size={16} className="sm:w-5 sm:h-5" />
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
            title="Reset to default"
          >
            <RefreshCw size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Statistics Modal */}
      <StatisticsModal isOpen={statsOpen} onClose={() => setStatsOpen(false)} />
    </header>
  )
}

export default Header
