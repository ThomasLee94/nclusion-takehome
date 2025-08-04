interface ControlsProps {
  resolution: number
  setResolution: (value: number) => void
  maxIterations: number
  setMaxIterations: (value: number) => void
  zoom: number
  centerX: number
  centerY: number
  isRendering: boolean
  onResetView: () => void
}

export default function Controls({
  resolution,
  setResolution,
  maxIterations,
  setMaxIterations,
  zoom,
  centerX,
  centerY,
  isRendering,
  onResetView
}: ControlsProps) {
  return (
    <div style={{ flex: '1', maxWidth: '400px' }}>
      <div style={{ 
        background: '#2a2a2a', 
        padding: '24px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px' }}>
          Controls
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '8px' 
          }}>
            Resolution: {resolution}x{resolution}
          </label>
          <input
            type="range"
            min="200"
            max="800"
            value={resolution}
            onChange={(e) => setResolution(parseInt(e.target.value))}
            style={{ width: '100%' }}
            disabled={isRendering}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '8px' 
          }}>
            Max Iterations: {maxIterations}
          </label>
          <input
            type="range"
            min="50"
            max="500"
            value={maxIterations}
            onChange={(e) => setMaxIterations(parseInt(e.target.value))}
            style={{ width: '100%' }}
            disabled={isRendering}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '8px' 
          }}>
            Zoom: {zoom.toFixed(1)}x
          </label>
          <div style={{ fontSize: '0.875rem', color: '#ccc' }}>
            Center: ({centerX.toFixed(3)}, {centerY.toFixed(3)}i)
          </div>
        </div>

        <button
          onClick={onResetView}
          disabled={isRendering}
          style={{
            width: '100%',
            background: isRendering ? '#666' : '#3b82f6',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: isRendering ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Reset View
        </button>
      </div>
    </div>
  )
}