import { motion, useMotionValue, useTransform } from "motion/react"
import { animate } from "motion"
import { useRef, useState } from "react"

type TrackPoint = {
  lat: number
  lon: number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function pointAtProgress(track: TrackPoint[], progress: number) {
  const p = Math.max(0, Math.min(1, progress))
  const scaled = p * (track.length - 1)

  const i = Math.floor(scaled)
  const j = Math.min(i + 1, track.length - 1)
  const t = scaled - i

  return {
    lat: lerp(track[i].lat, track[j].lat, t),
    lon: lerp(track[i].lon, track[j].lon, t),
  }
}

export function AnimatedMapPoint({
  track,
  project,
  durationSeconds,
}: {
  track: TrackPoint[]
  project: (lngLat: [number, number]) => [number, number] | null
  durationSeconds: number
}) {
  const progress = useMotionValue(0)
  const animationRef = useRef<ReturnType<typeof animate> | null>(null)

  const [sliderValue, setSliderValue] = useState(0)

  const cx = useTransform(progress, (p) => {
    const point = pointAtProgress(track, p)
    return project([point.lon, point.lat])?.[0] ?? 0
  })

  const cy = useTransform(progress, (p) => {
    const point = pointAtProgress(track, p)
    return project([point.lon, point.lat])?.[1] ?? 0
  })

  function play() {
    animationRef.current?.stop()

    const current = progress.get()
    const remaining = 1 - current

    animationRef.current = animate(progress, 1, {
      duration: durationSeconds * remaining,
      ease: "linear",
      onUpdate: setSliderValue,
    })
  }

  function pause() {
    animationRef.current?.pause()
  }

  function scrub(next: number) {
    animationRef.current?.pause()
    progress.set(next)
    setSliderValue(next)
  }

  return (
    <>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={sliderValue}
        onChange={(e) => scrub(Number(e.target.value))}
      />

      <svg width={800} height={500}>
        {/* Your visx-rendered map paths go here */}

        <motion.circle
          r={5}
          cx={cx}
          cy={cy}
          fill="red"
        />
      </svg>
    </>
  )
}
