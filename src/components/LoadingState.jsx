const LoadingState = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Sheet</h2>
        <p className="text-gray-600">Fetching data from API...</p>
      </div>
    </div>
  )
}

export default LoadingState
