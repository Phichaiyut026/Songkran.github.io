"use client"

import { useEffect, useRef } from "react"

export default function WaterWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    const draw = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw water waves
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "rgba(100, 181, 246, 0.4)")
      gradient.addColorStop(0.5, "rgba(77, 208, 225, 0.4)")
      gradient.addColorStop(1, "rgba(100, 181, 246, 0.4)")
      ctx.fillStyle = gradient

      ctx.beginPath()

      // Draw multiple wave layers
      for (let i = 0; i < canvas.width; i += 5) {
        // First wave
        const y1 = Math.sin(i * 0.02 + time * 0.7) * 5 + canvas.height * 0.5
        // Second wave
        const y2 = Math.sin(i * 0.04 + time * 0.5) * 3 + canvas.height * 0.5
        // Combined wave
        const y = (y1 + y2) / 2

        if (i === 0) {
          ctx.moveTo(i, y)
        } else {
          ctx.lineTo(i, y)
        }
      }

      // Complete the wave shape
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()
      ctx.fill()

      // Add some sparkles
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.4
        const size = Math.random() * 2 + 1
        const opacity = Math.random() * 0.5 + 0.2

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      time += 0.05
      animationFrameId = requestAnimationFrame(draw)
    }

    window.addEventListener("resize", resize)
    resize()
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

