import { X, Save, RotateCcw } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import useSheetStore from '@/store/useSheetStore'

const DrawingCanvas = ({ isOpen, onClose, question, topicId, subTopicId }) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState(null)
  const [lineWidth, setLineWidth] = useState(2)
  const [color, setColor] = useState('#000000')
  const { saveDrawingNote } = useSheetStore()

  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00AA00', // Green
    '#0000FF', // Blue
    '#FFAA00', // Orange
    '#AA00FF', // Purple
    '#00AAAA', // Cyan
    '#FFFFFF', // White
  ]

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      setContext(ctx)

      // Set canvas size
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      // Load existing drawing if available
      if (question?.drawingNote) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
        }
        img.src = question.drawingNote
      } else {
        // Clear canvas
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [isOpen, question])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    context.beginPath()
    context.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    context.lineWidth = lineWidth
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = color
    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    context.closePath()
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleEraser = () => {
    setColor('#FFFFFF')
    setLineWidth(15)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    const imageData = canvas.toDataURL('image/png')
    saveDrawingNote(topicId, subTopicId, question.id, imageData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-1 sm:p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-[98vw] sm:w-[85vw] h-[97vh] sm:h-[90vh] md:w-[75vw] md:h-[75vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between p-3 sm:p-4 border-b border-blue-200 gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Doodle Notes</h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{question?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-blue-200 rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-blue-100 flex-wrap text-xs sm:text-sm">
          {/* Color Picker */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 bg-white rounded-lg border border-gray-200">
            <label className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">Color:</label>
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c)
                    setLineWidth(2)
                  }}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 transition-transform duration-200 hover:scale-110 ${
                    color === c ? 'border-gray-900 shadow-md' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Line Width */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 bg-white rounded-lg border border-gray-200">
            <label className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(e.target.value)}
              className="w-16 sm:w-24"
            />
            <span className="text-xs text-gray-600 hidden sm:inline font-medium">{lineWidth}px</span>
          </div>

          {/* Eraser Button */}
          <button
            onClick={handleEraser}
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:shadow-md transition-all duration-200"
          >
            Eraser
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:shadow-md transition-all duration-200 flex items-center gap-1"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="bg-white cursor-crosshair shadow-md"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-white flex items-center justify-end gap-2 p-3 sm:p-4 border-t border-gray-100 flex-wrap">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save Drawing</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DrawingCanvas
