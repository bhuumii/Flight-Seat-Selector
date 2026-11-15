import { LAYOUT_CONFIGS } from '../data/seats'
import { formatPrice } from '../data/seats'
import '../styles/PassengerBar.css'

export default function PassengerBar({ passengers, activeId, passengerCount, seatMap, layoutType, onSelect, onCountChange, onLayoutChange }) {
  return (
    <div className="pbar">
      <div className="pbar-head">
        <span className="section-label">Select seats</span>
        <div className="pbar-controls">
          <div className="layout-toggle">
            {Object.entries(LAYOUT_CONFIGS).map(([key, cfg]) => (
              <button
                key={key}
                className={`lt-btn ${layoutType === key ? 'lt-btn-on' : ''}`}
                onClick={() => onLayoutChange(key)}
              >
                {cfg.label}
              </button>
            ))}
          </div>
          <div className="pbar-counter">
            <span className="pbar-counter-label">Passengers</span>
            <button className="cnt-btn" onClick={() => onCountChange(-1)} disabled={passengerCount <= 1}>-</button>
            <span className="cnt-val">{passengerCount}</span>
            <button className="cnt-btn" onClick={() => onCountChange(1)} disabled={passengerCount >= 6}>+</button>
          </div>
        </div>
      </div>
      <div className="pbar-chips">
        {passengers.map(p => {
          const seat = p.seatId ? seatMap[p.seatId] : null
          const active = p.id === activeId
          return (
            <button key={p.id} className={`pchip ${active ? 'pchip-active' : ''}`} onClick={() => onSelect(p.id)}>
              <span className="pchip-dot" />
              <div className="pchip-info">
                <span className="pchip-name">{p.name}</span>
                <span className={`pchip-seat ${seat ? 'pchip-has-seat' : ''}`}>
                  {seat ? `Seat ${p.seatId}  -  ${formatPrice(seat.price)}` : 'Tap a seat below'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
