import { useState, useRef, useEffect } from 'react'
import { formatPrice, categoryLabel } from '../data/seats'
import '../styles/Seat.css'

export default function Seat({ seat, assignment, isActiveSelected, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [justSelected, setJustSelected] = useState(false)
  const prevSelected = useRef(isActiveSelected)

  useEffect(() => {
    if (isActiveSelected && !prevSelected.current) {
      setJustSelected(true)
      const t = setTimeout(() => setJustSelected(false), 300)
      return () => clearTimeout(t)
    }
    prevSelected.current = isActiveSelected
  }, [isActiveSelected])

  let cls = 'seat'
  if (seat.occupied) cls += ' s-occupied'
  else if (isActiveSelected) cls += ' s-selected'
  else if (assignment) cls += ' s-other'
  else if (seat.category === 'legroom') cls += ' s-legroom'
  else if (seat.category === 'premium') cls += ' s-premium'
  else if (seat.price === 0) cls += ' s-free'
  else cls += ' s-standard'
  if (justSelected) cls += ' s-pulse'

  const label = isActiveSelected
    ? seat.id
    : assignment
      ? `P${assignment.paxNum}`
      : ''

  const tipBelow = seat.row <= 2

  return (
    <button
      className={cls}
      onClick={seat.occupied ? undefined : () => onClick(seat)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={seat.occupied}
      aria-label={`${seat.id}, ${categoryLabel(seat.category)}, ${formatPrice(seat.price)}${seat.occupied ? ', taken' : ''}`}
    >
      <span className="s-label">{label}</span>
      {hovered && !seat.occupied && (
        <div className={`s-tip ${tipBelow ? 's-tip-below' : ''}`}>
          <strong>{seat.id}</strong> {categoryLabel(seat.category)} - {formatPrice(seat.price)}
        </div>
      )}
    </button>
  )
}
