import { useState } from 'react'
import { LAYOUT_CONFIGS, MEALS, formatPrice } from '../data/seats'
import '../styles/PassengerBar.css'

export default function PassengerBar({
  passengers, activeId, passengerCount, maxPassengers, seatMap, layoutType,
  onSelect, onCountChange, onLayoutChange, onUpdatePassenger
}) {
  const [editPax, setEditPax] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAge, setEditAge] = useState('')
  const [editMeal, setEditMeal] = useState('none')

  const openEdit = (p, e) => {
    e.stopPropagation()
    setEditName(p.name)
    setEditAge(p.age || '')
    setEditMeal(p.mealId)
    setEditPax(p)
  }

  const saveEdit = () => {
    onUpdatePassenger(editPax.id, {
      name: editName.trim() || `Passenger ${editPax.id}`,
      age: editAge,
      mealId: editMeal,
    })
    setEditPax(null)
  }

  return (
    <div className="pbar">
      <div className="pbar-head">
        <span className="section-label">Select seats</span>
        <div className="pbar-controls">
          <div className="layout-toggle">
            {Object.entries(LAYOUT_CONFIGS).map(([key, cfg]) => (
              <button key={key} className={`lt-btn ${layoutType === key ? 'lt-btn-on' : ''}`} onClick={() => onLayoutChange(key)}>
                {cfg.label}
              </button>
            ))}
          </div>
          <div className="pbar-counter">
            <span className="pbar-counter-label">Passengers</span>
            <button className="cnt-btn" onClick={() => onCountChange(-1)} disabled={passengerCount <= 1}>-</button>
            <span className="cnt-val">{passengerCount}</span>
            <button className="cnt-btn" onClick={() => onCountChange(1)} disabled={passengerCount >= maxPassengers}>+</button>
          </div>
        </div>
      </div>

      <div className="pbar-grid">
        {passengers.map(p => {
          const seat = p.seatId ? seatMap[p.seatId] : null
          const active = p.id === activeId
          const meal = MEALS.find(m => m.id === p.mealId)
          return (
            <button key={p.id} className={`pchip ${active ? 'pchip-active' : ''}`} onClick={() => onSelect(p.id)}>
              <span className="pchip-dot" />
              <div className="pchip-info">
                <span className="pchip-name">
                  {p.name}
                  {p.age ? <span className="pchip-age">, {p.age}</span> : null}
                </span>
                <span className={`pchip-seat ${seat ? 'pchip-has-seat' : ''}`}>
                  {seat ? `Seat ${p.seatId} - ${formatPrice(seat.price)}` : 'Tap a seat below'}
                </span>
                {meal && meal.id !== 'none' && (
                  <span className="pchip-meal">{meal.name}</span>
                )}
              </div>
              <button className="pchip-edit" onClick={(e) => openEdit(p, e)} aria-label="Edit passenger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
            </button>
          )
        })}
      </div>

      {/* Edit modal */}
      {editPax && (
        <div className="pmodal-overlay" onClick={() => setEditPax(null)}>
          <div className="pmodal" onClick={e => e.stopPropagation()}>
            <div className="pmodal-header">
              <span className="pmodal-title">Edit passenger details</span>
              <button className="pmodal-close" onClick={() => setEditPax(null)}>x</button>
            </div>
            <div className="pmodal-body">
              <div className="pmodal-field">
                <label className="pmodal-label">Name</label>
                <input className="pmodal-input" type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder={`Passenger ${editPax.id}`} />
              </div>
              <div className="pmodal-field">
                <label className="pmodal-label">Age</label>
                <input className="pmodal-input" type="text" value={editAge} onChange={e => setEditAge(e.target.value)} placeholder="e.g. 28" />
              </div>
              <div className="pmodal-field">
                <label className="pmodal-label">Meal preference</label>
                <div className="pmodal-meals">
                  {MEALS.map(meal => (
                    <button key={meal.id} className={`pm-meal ${editMeal === meal.id ? 'pm-meal-on' : ''}`} onClick={() => setEditMeal(meal.id)}>
                      <span className="pm-radio"><span className="pm-dot" /></span>
                      <span className="pm-meal-info">
                        <span className="pm-meal-name">{meal.name}</span>
                        {meal.desc && <span className="pm-meal-desc">{meal.desc}</span>}
                      </span>
                      <span className="pm-meal-price">{formatPrice(meal.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="pmodal-footer">
              <button className="pmodal-save" onClick={saveEdit}>Save details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
