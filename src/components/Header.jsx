import { Menu, X, Search, Download, Upload, RefreshCw, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import useSheetStore from '@/store/useSheetStore'
import StatisticsModal from './StatisticsModal'

const Header = ({ sidebarOpen, setSidebarOpen, onSearchOpen, onExport, onImport, onReset }) => {
  const [statsOpen, setStatsOpen] = useState(false)
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4 flex-wrap">
        {/* Left - Logo & Menu */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-fit">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900"
            title="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
          </button>
          <button
            onClick={() => setStatsOpen(true)}
            className="p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600"
            title="View statistics"
          >
            <BarChart3 size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-lg sm:text-2xl font-black tracking-tight hidden sm:block">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent italic">Sheet</span><span className="text-white bg-gradient-to-r from-orange-500 to-orange-600 px-2 py-1 rounded-full ml-1 inline-block">Hub</span>
          </h1>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight sm:hidden">
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent italic">S</span><span className="text-white bg-gradient-to-r from-orange-500 to-orange-600 px-1.5 py-0.5 rounded-lg ml-0.5 inline-block text-sm">H</span>
          </h1>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 min-w-fit sm:max-w-md order-last sm:order-none w-full sm:w-auto">
          <button
            onClick={onSearchOpen}
            className="w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 hover:shadow-sm flex items-center gap-2 text-gray-600 transition-all duration-200 border border-gray-200"
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
            className="p-1.5 sm:p-2 hover:bg-green-50 rounded-lg text-gray-600 hover:text-green-600 transition-all duration-200"
            title="Export as JSON"
          >
            <Download size={16} className="sm:w-5 sm:h-5" />
          </button>

          {/* Import Button */}
          <button
            onClick={onImport}
            className="p-1.5 sm:p-2 hover:bg-purple-50 rounded-lg text-gray-600 hover:text-purple-600 transition-all duration-200"
            title="Import from JSON"
          >
            <Upload size={16} className="sm:w-5 sm:h-5" />
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-1.5 sm:p-2 hover:bg-orange-50 rounded-lg text-gray-600 hover:text-orange-600 transition-all duration-200"
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
