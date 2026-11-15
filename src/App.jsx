import { useRef } from 'react'
import useBooking from './hooks/useBooking'
import Header from './components/Header'
import FlightPicker from './components/FlightPicker'
import PassengerBar from './components/PassengerBar'
import SeatMap from './components/SeatMap'
import BookingSummary from './components/BookingSummary'
import MealSelection from './components/MealSelection'
import Toast, { useToast } from './components/Toast'
import './App.css'

export default function App() {
  const b = useBooking()
  const toast = useToast()
  const seatRef = useRef(null)

  const handleSeatClick = (seat) => {
    const conflict = b.checkConflict(seat)
    if (conflict) { toast.show(`Seat ${seat.id} is already assigned to ${conflict.name}`); return }
    b.assignSeat(seat)
  }

  const handleFlightSelect = (flight) => {
    if (flight.id === b.selectedFlight?.id) return
    const hasSeats = b.passengers.some(p => p.seatId)
    if (hasSeats && !window.confirm('Switching flights will clear your seat selections. Continue?')) return
    b.selectFlight(flight)
  }

  const handleLayoutChange = (lt) => {
    if (lt === b.layoutType) return
    const hasSeats = b.passengers.some(p => p.seatId)
    if (hasSeats && !window.confirm('Switching cabin layout will clear your seat selections. Continue?')) return
    b.switchLayout(lt)
  }

  return (
    <div className="app">
      <Header flight={b.selectedFlight} />
      <div className="page">
        <FlightPicker selectedFlight={b.selectedFlight} onSelect={handleFlightSelect} />

        <div className="seat-section" ref={seatRef}>
          <div className="seat-grid">
            <div className="seat-main">
              <PassengerBar
                passengers={b.passengers} activeId={b.activeId}
                passengerCount={b.passengerCount} seatMap={b.seatMap}
                layoutType={b.layoutType}
                onSelect={b.setActiveId} onCountChange={b.updateCount}
                onLayoutChange={handleLayoutChange}
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
              <MealSelection passengers={b.passengers} onSelectMeal={b.setMeal} />
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
