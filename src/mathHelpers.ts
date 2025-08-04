  // Complex number operations
  const complexSquare = (real: number, imaginary: number) => ({
    real: real * real - imaginary * imaginary,
    imaginary: 2 * real * imaginary
  })

  const complexMagnitude = (real: number, imaginary: number) => 
    Math.sqrt(real * real + imaginary * imaginary)

  // Check if sequence remains bounded (Mandelbrot iteration)
  export const isBounded = (cReal: number, cImag: number, maxIter: number): boolean => {
    let zReal = 0
    let zImaginary = 0
    
    for (let i = 0; i < maxIter; i++) {
      if (complexMagnitude(zReal, zImaginary) > 2) {
        return false // Unbounded - grows to infinity
      }
      
      const { real, imaginary } = complexSquare(zReal, zImaginary)
      zReal = real + cReal
      zImaginary = imaginary + cImag
    }
    
    return true // Bounded - remains finite
  }