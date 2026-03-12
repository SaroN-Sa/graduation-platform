"use client"

import { useEffect, useState } from "react"

interface SparkleProps {
  count?: number
}

interface SparkleData {
  id: number
  left: string
  top: string
  size: string
  delay: string
  duration: string
}

const SparkleEffect = ({ count = 20 }: SparkleProps) => {
  const [sparkles, setSparkles] = useState<SparkleData[]>([])

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      delay: `${Math.random() * 4}s`,
      duration: `${Math.random() * 2 + 2}s`,
    }))
    setSparkles(generated)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-yellow-400 opacity-0 animate-sparkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  )
}

export default SparkleEffect