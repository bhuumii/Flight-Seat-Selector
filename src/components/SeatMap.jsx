import { useMemo } from 'react'
import { LAYOUT_CONFIGS } from '../data/seats'
import Seat from './Seat'
import '../styles/SeatMap.css'

export default function SeatMap({ layoutType, seats, seatAssignments, activePassengerId, onSeatClick }) {
  const cfg = LAYOUT_CONFIGS[layoutType]

  const seatsByRow = useMemo(() => {
    const map = {}
    seats.forEach(s => { if (!map[s.row]) map[s.row] = []; map[s.row].push(s) })
    return map
  }, [seats])

  const rows = Object.keys(seatsByRow).map(Number).sort((a,b) => a - b)

  const headerCells = [<div key="rn" className="sm-row-spacer" />]
  cfg.cols.forEach((col, i) => {
    if (cfg.aisles.has(i)) headerCells.push(<div key={`a${i}`} className="sm-col-head sm-aisle" />)
    headerCells.push(<div key={col} className="sm-col-head">{col}</div>)
  })

  return (
    <div className="sm-card">
      <div className="sm-nose">
        <div className="sm-nose-shape" />
        <span className="sm-nose-text">Front of aircraft</span>
      </div>

      {/* Legend strip - always visible, sticky */}
      <div className="sm-legend-strip">
        <Sw cls="lsw-free" label="Free" /><Sw cls="lsw-standard" label="Standard" />
        <Sw cls="lsw-premium" label="Premium" /><Sw cls="lsw-legroom" label="Extra legroom" />
        <Sw cls="lsw-selected" label="Your pick" /><Sw cls="lsw-occupied" label="Taken" />
      </div>

      <div className="sm-body">
        <div className="sm-scroll">
          <div className="sm-row sm-row-header">{headerCells}</div>
          {rows.map(rn => {
            const rowSeats = seatsByRow[rn]
            const cells = [<div key="rn" className="sm-row-num">{rn}</div>]
            rowSeats.forEach((seat, i) => {
              if (cfg.aisles.has(i)) cells.push(<div key={`a${i}`} className="sm-aisle" />)
              const a = seatAssignments[seat.id] || null
              cells.push(<Seat key={seat.id} seat={seat} assignment={a} isActiveSelected={a?.paxId === activePassengerId} onClick={onSeatClick} />)
            })
            return <div key={rn} className="sm-row">{cells}</div>
          })}
        </div>
      </div>
    </div>
  )
}

function Sw({ cls, label }) {
  return <div className="lg-item"><div className={`lg-sw ${cls}`} /><span>{label}</span></div>
}
