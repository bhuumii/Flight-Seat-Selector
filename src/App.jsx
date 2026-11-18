import { useState, useRef, useCallback } from 'react'
import useBooking from './hooks/useBooking'
import Header from './components/Header'
import FlightPicker from './components/FlightPicker'
import PassengerBar from './components/PassengerBar'
import SeatMap from './components/SeatMap'
import BookingSummary from './components/BookingSummary'
import Toast, { useToast } from './components/Toast'
import './App.css'

export default function App() {
  const b = useBooking()
  const toast = useToast()
  const seatRef = useRef(null)
  const [confirmData, setConfirmData] = useState(null)

  const askConfirm = useCallback((message, onYes) => {
    setConfirmData({ message, onYes })
  }, [])

  const handleSeatClick = (seat) => {
    if (!b.activeId) { toast.show('Select a passenger first'); return }
    const conflict = b.checkConflict(seat)
    if (conflict) { toast.show(`Seat ${seat.id} is already assigned to ${conflict.name}`); return }
    b.assignSeat(seat)
  }

  const handleFlightSelect = (flight) => {
    if (flight.id === b.selectedFlight?.id) return
    const hasSeats = b.passengers.some(p => p.seatId)
    if (hasSeats) {
      askConfirm('Switching flights will clear your seat selections. Continue?', () => b.selectFlight(flight))
    } else {
      b.selectFlight(flight)
    }
  }

  const handleLayoutChange = (lt) => {
    if (lt === b.layoutType) return
    const hasSeats = b.passengers.some(p => p.seatId)
    if (hasSeats) {
      askConfirm('Switching cabin layout will clear your seat selections. Continue?', () => b.switchLayout(lt))
    } else {
      b.switchLayout(lt)
    }
  }


  const handleAppClick = (e) => {
    if (e.target.closest('button, input, a, .pchip, .flight-card, .pmodal, .cdlg, .promo-input-wrap')) return
    b.setActiveId(null)
  }

  return (
    <div className="app" onClick={handleAppClick}>
      <Header flight={b.selectedFlight} />
      <div className="page">
        <FlightPicker selectedFlight={b.selectedFlight} onSelect={handleFlightSelect} />
        <div className="seat-section" ref={seatRef}>
          <div className="seat-grid">
            <div className="seat-main">
              <PassengerBar
                passengers={b.passengers} activeId={b.activeId}
                passengerCount={b.passengerCount} maxPassengers={b.maxPassengers}
                seatMap={b.seatMap} layoutType={b.layoutType}
                onSelect={b.setActiveId} onCountChange={b.updateCount}
                onLayoutChange={handleLayoutChange} onUpdatePassenger={b.updatePassenger}
                onDeletePassenger={(paxId) => {
                  const pax = b.passengers.find(p => p.id === paxId)
                  askConfirm(`Are you sure you want to remove ${pax?.name || 'this passenger'}?`, () => b.deletePassenger(paxId))
                }}
              />
              <SeatMap
                layoutType={b.layoutType} seats={b.seats}
                seatAssignments={b.seatAssignments}
                activePassengerId={b.activeId} onSeatClick={handleSeatClick}
              />
            </div>
            <div className="seat-sidebar">
              <BookingSummary
                passengers={b.passengers} seatMap={b.seatMap}
                totals={b.totals} onRemoveSeat={b.removeSeat}
              />
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast.message} visible={toast.visible} />

      {confirmData && (
        <div className="cdlg-overlay" onClick={() => setConfirmData(null)}>
          <div className="cdlg" onClick={e => e.stopPropagation()}>
            <p className="cdlg-msg">{confirmData.message}</p>
            <div className="cdlg-actions">
              <button className="cdlg-cancel" onClick={() => setConfirmData(null)}>Cancel</button>
              <button className="cdlg-ok" onClick={() => { confirmData.onYes(); setConfirmData(null) }}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
