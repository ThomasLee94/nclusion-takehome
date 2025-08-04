import { forwardRef } from 'react'

interface MandelbrotCanvasProps {
  isRendering: boolean
  onCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
}

const MandelbrotCanvas = forwardRef<HTMLCanvasElement, MandelbrotCanvasProps>(
  ({ isRendering, onCanvasClick }, ref) => {
    return (
      <div style={{ flex: '2' }}>
        <div style={{ 
          background: '#2a2a2a', 
          padding: '16px', 
          borderRadius: '8px' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
              Mandelbrot Set Visualization
            </h3>
            {isRendering && (
              <div style={{ 
                color: '#fbbf24', 
                animation: 'pulse 2s infinite' 
              }}>
                Rendering...
              </div>
            )}
          </div>
          
          <div style={{ position: 'relative' }}>
            <canvas
              ref={ref}
              onClick={onCanvasClick}
              style={{ 
                border: '1px solid #666', 
                cursor: 'crosshair', 
                maxWidth: '100%', 
                height: 'auto',
                background: 'black',
                imageRendering: 'pixelated'
              }}
            />
            {isRendering && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                Calculating...
              </div>
            )}
          </div>
          
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#ccc', 
            marginTop: '8px' 
          }}>
            Click anywhere on the visualization to zoom in on that point
          </p>
        </div>
      </div>
    )
  }
)

export default MandelbrotCanvas