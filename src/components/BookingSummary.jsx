import { useState, useRef, useEffect } from 'react'
import { MEALS, formatPrice, PROMO_CODE, PROMO_MIN, PROMO_DISCOUNT } from '../data/seats'
import '../styles/BookingSummary.css'

export default function BookingSummary({ passengers, seatMap, totals, onRemoveSeat }) {
  const hasMeals = passengers.some(p => p.mealId !== 'none')
  const allSeated = passengers.every(p => p.seatId)

  // Promo state
  const [promoInput, setPromoInput] = useState('')
  const [promoStatus, setPromoStatus] = useState('idle') // idle | applied | invalid | below
  const [showDrop, setShowDrop] = useState(false)
  const dropRef = useRef(null)

  const subtotal = totals.subtotal
  const discount = promoStatus === 'applied' ? Math.round(subtotal * PROMO_DISCOUNT) : 0
  const grandTotal = subtotal - discount
  const gap = PROMO_MIN - subtotal

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Re-evaluate promo when subtotal changes
  useEffect(() => {
    if (promoStatus === 'applied' && subtotal < PROMO_MIN) setPromoStatus('below')
    if (promoStatus === 'below' && subtotal >= PROMO_MIN && promoInput.toUpperCase() === PROMO_CODE) setPromoStatus('applied')
  }, [subtotal, promoStatus, promoInput])

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (code !== PROMO_CODE) { setPromoStatus('invalid'); return }
    if (subtotal < PROMO_MIN) { setPromoStatus('below'); return }
    setPromoStatus('applied')
  }

  const selectPromo = (code) => {
    setPromoInput(code)
    setShowDrop(false)
    setPromoStatus('idle')
  }

  const clearPromo = () => {
    setPromoInput('')
    setPromoStatus('idle')
  }

  return (
    <div className="sum-card">
      <div className="sum-head">Booking summary</div>
      <div className="sum-body">
        {/* Seats */}
        <div className="sum-group">
          <div className="sum-group-title">Seats</div>
          {passengers.map(p => {
            const s = p.seatId ? seatMap[p.seatId] : null
            return (
              <div key={p.id} className="sum-row">
                <span className="sum-label">{p.name}</span>
                <span className="sum-val-group">
                  {s ? (<>
                    <span className="sum-tag">{p.seatId}</span>
                    <span className="sum-val">{formatPrice(s.price)}</span>
                    <button className="sum-rm" onClick={() => onRemoveSeat(p.id)}>x</button>
                  </>) : <span className="sum-empty">--</span>}
                </span>
              </div>
            )
          })}
        </div>

        {/* Meals */}
        {hasMeals && (
          <div className="sum-group">
            <div className="sum-group-title">Meals</div>
            {passengers.filter(p => p.mealId !== 'none').map(p => {
              const meal = MEALS.find(m => m.id === p.mealId)
              return (
                <div key={p.id} className="sum-row">
                  <span className="sum-label">{p.name}</span>
                  <span className="sum-val-group">
                    <span className="sum-meal">{meal.name}</span>
                    <span className="sum-val">{formatPrice(meal.price)}</span>
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Promo code */}
        <div className="sum-group promo-group">
          <div className="sum-group-title">Promo code</div>
          <div className="promo-row" ref={dropRef}>
            <div className="promo-input-wrap">
              <input
                className="promo-input"
                type="text"
                placeholder="Enter code"
                value={promoInput}
                onChange={e => { setPromoInput(e.target.value); setPromoStatus('idle') }}
              />
              <button className="promo-drop-btn" onClick={() => setShowDrop(!showDrop)} aria-label="Show promos">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
              </button>
              {showDrop && (
                <div className="promo-dropdown">
                 <button className="promo-option" onClick={() => selectPromo(PROMO_CODE)}>
                   <span className="promo-opt-code">{PROMO_CODE}</span>
                   <span className="promo-opt-desc">10% off on orders above {'\u20B9'}999</span>
                   <span className="promo-opt-tc">T&C: Valid on orders above {'\u20B9'}999. 10% off on total seat and meal charges. Cannot be combined with other offers.</span>
                </button>
                </div>
              )}
            </div>
            {promoStatus !== 'applied' ? (
              <button className="promo-apply" onClick={applyPromo} disabled={!promoInput.trim()}>Apply</button>
            ) : (
              <button className="promo-clear" onClick={clearPromo}>Remove</button>
            )}
          </div>
          {/* Status messages */}
          {promoStatus === 'applied' && (
            <div className="promo-msg promo-success">10% discount applied! You save {formatPrice(discount)}</div>
          )}
          {promoStatus === 'invalid' && (
            <div className="promo-msg promo-error">This promo code is not applicable</div>
          )}
          {promoStatus === 'below' && (
            <div className="promo-msg promo-warn">Cart value is below {'\u20B9'}999. Add {formatPrice(Math.max(0, gap))} more to apply this coupon</div>
          )}
        </div>

        {/* Totals */}
        {subtotal > 0 && (
          <div className="sum-subtotal-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="sum-discount-row">
            <span>Discount (10%)</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="sum-total-row">
          <span>Total</span>
          <span className="sum-total-val">{grandTotal === 0 ? 'Free' : formatPrice(grandTotal)}</span>
        </div>

        <button className={`sum-cta ${allSeated ? '' : 'sum-cta-disabled'}`} disabled={!allSeated}>
          {allSeated ? 'Continue to payment' : `Assign seats for all ${passengers.length} passengers`}
        </button>
      </div>
    </div>
  )
}
