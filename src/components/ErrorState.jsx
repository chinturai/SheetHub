import { AlertCircle, RefreshCw } from 'lucide-react'
import useSheetStore from '@/store/useSheetStore'

const ErrorState = () => {
  const { error, initializeSheet } = useSheetStore()

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Sheet</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => initializeSheet()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  )
}

export default ErrorState
