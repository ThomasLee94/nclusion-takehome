import { useState, useRef, useEffect, useCallback } from 'react'
import { isBounded } from './mathHelpers'
import './App.css'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRenderingProgressBar, setIsRenderingProgressBar] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 })
  const [viewBounds, setViewBounds] = useState({ 
    minReal: -2, maxReal: 2, minImag: -2, maxImag: 2 
  })
  const [maxIterations, setMaxIterations] = useState(100)
  const [tempMaxIterations, setTempMaxIterations] = useState(100)
  
  const gridSize = 500
  const chunkSize = 2000

  // Map grid coordinates to current view bounds
  const gridToCanvas = (x: number, y: number, size: number) => ({
    real: viewBounds.minReal + (x / size) * (viewBounds.maxReal - viewBounds.minReal),
    imaginary: viewBounds.minImag + (y / size) * (viewBounds.maxImag - viewBounds.minImag)
  })

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRenderingProgressBar) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setSelectionStart({ x, y })
    setSelectionEnd({ x, y })
    setIsSelecting(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setSelectionEnd({ x, y })
  }

  const handleMouseUp = () => {
    if (!isSelecting) return
    setIsSelecting(false)
    
    // Calculate new bounds from selection
    const canvas = canvasRef.current
    if (!canvas) return
    
    const scaleX = (viewBounds.maxReal - viewBounds.minReal) / canvas.width
    const scaleY = (viewBounds.maxImag - viewBounds.minImag) / canvas.height
    
    const newMinReal = viewBounds.minReal + selectionStart.x * scaleX
    const newMaxReal = viewBounds.minReal + selectionEnd.x * scaleX
    const newMinImag = viewBounds.minImag + selectionStart.y * scaleY
    const newMaxImag = viewBounds.minImag + selectionEnd.y * scaleY
    
    setViewBounds({
      minReal: Math.min(newMinReal, newMaxReal),
      maxReal: Math.max(newMinReal, newMaxReal),
      minImag: Math.min(newMinImag, newMaxImag),
      maxImag: Math.max(newMinImag, newMaxImag)
    })
  }

  const resetView = () => {
    setViewBounds({ minReal: -2, maxReal: 2, minImag: -2, maxImag: 2 })
  }

  const processChunk = useCallback((
    pixelIndex: number,
    chunkSize: number,
    totalPixels: number,
    data: Uint8ClampedArray,
    ctx: CanvasRenderingContext2D
  ) => {
    const endIndex = Math.min(pixelIndex + chunkSize, totalPixels)

    for (let i = pixelIndex; i < endIndex; i++) {
      const x = i % gridSize
      const y = Math.floor(i / gridSize)
      
      const { real, imaginary } = gridToCanvas(x, y, gridSize)
      const bounded = isBounded(real, imaginary, maxIterations)

      const dataIndex = i * 4
      if (bounded) {
        data[dataIndex] = 255
        data[dataIndex + 1] = 255
        data[dataIndex + 2] = 255
      } else {
        data[dataIndex] = 0
        data[dataIndex + 1] = 0
        data[dataIndex + 2] = 0
      }
      data[dataIndex + 3] = 255
    }

    const newPixelIndex = endIndex
    setProgress((newPixelIndex / totalPixels) * 100)

    if (newPixelIndex < totalPixels) {
      requestAnimationFrame(() => processChunk(newPixelIndex, chunkSize, totalPixels, data, ctx))
    } else {
      const imageData = ctx.createImageData(gridSize, gridSize)
      imageData.data.set(data)
      ctx.putImageData(imageData, 0, 0)
      setIsRenderingProgressBar(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize, maxIterations, viewBounds])

  const renderVisualization = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsRenderingProgressBar(true)
    setProgress(0)
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = gridSize
    canvas.height = gridSize

    const imageData = ctx.createImageData(gridSize, gridSize)
    const data = imageData.data

    const pixelIndex = 0
    const totalPixels = gridSize * gridSize

    processChunk(pixelIndex, chunkSize, totalPixels, data, ctx)
  }, [gridSize, chunkSize, processChunk])

  useEffect(() => {
    renderVisualization()
  }, [renderVisualization])

  return (
    <div className="app">
      <header className="header">
        <h1>Nclusion Takehome Project</h1>
        <p>Interactive visualizion of the equation: z<sub>n+1</sub> = z<sub>n</sub>² + c, zoom in with mouse!</p>
      </header>

      <main className="main">
        <div className="controls">
          <div className="control-group">
            <label>
              Max Iterations: {tempMaxIterations}
            </label>
              <>The higher the max iterations, the higher detail of fractals</>
            <input
              type="range"
              min="50"
              max="50000"
              value={tempMaxIterations}
              onChange={(e) => setTempMaxIterations(parseInt(e.target.value))}
              onMouseUp={() => setMaxIterations(tempMaxIterations)}
              onTouchEnd={() => setMaxIterations(tempMaxIterations)}
              disabled={isRenderingProgressBar}
            />
          </div>

          {isRenderingProgressBar && (
            <div className="progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress.toFixed(1)}% complete</span>
            </div>
          )}
        </div>

        <div className="visualization">
          <div style={{ position: 'relative' }}>
            <canvas
              ref={canvasRef}
              className="canvas"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ cursor: isSelecting ? 'crosshair' : 'pointer' }}
            />
            {isSelecting && (
              <div
                style={{
                  position: 'absolute',
                  left: Math.min(selectionStart.x, selectionEnd.x),
                  top: Math.min(selectionStart.y, selectionEnd.y),
                  width: Math.abs(selectionEnd.x - selectionStart.x),
                  height: Math.abs(selectionEnd.y - selectionStart.y),
                  border: '2px dashed #00d4ff',
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
          <button onClick={resetView} disabled={isRenderingProgressBar}>
            Reset View
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
