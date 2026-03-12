'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  label?: string
}

export default function StarRating({ value, onChange, label }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div>
      {label && (
        <p className="font-dm text-sm font-medium mb-3" style={{ color: 'rgba(253,251,247,0.7)' }}>
          {label}
        </p>
      )}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-colors duration-200"
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill={star <= (hover || value) ? '#C84B31' : 'none'} stroke={star <= (hover || value) ? '#C84B31' : 'rgba(253,251,247,0.25)'} strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
