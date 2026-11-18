import { useState, useCallback, useMemo } from 'react'
import { generateSeats, MEALS, FLIGHTS } from '../data/seats'

function createPassenger(id) {
  return { id, name: `Passenger ${id}`, age: '', seatId: null, mealId: 'none' }
}

export default function useBooking() {
  const [selectedFlight, setSelectedFlight] = useState(FLIGHTS[0])
  const [layoutType, setLayoutType] = useState(FLIGHTS[0].layout)
  const [passengerCount, setPassengerCount] = useState(1)
  const [passengers, setPassengers] = useState([createPassenger(1)])
  const [activeId, setActiveId] = useState(1)

  const seats = useMemo(() => generateSeats(layoutType), [layoutType])
  const seatMap = useMemo(() => { const m = {}; seats.forEach(s => { m[s.id] = s }); return m }, [seats])
  const maxPassengers = useMemo(() => seats.filter(s => !s.occupied).length, [seats])

  const seatAssignments = useMemo(() => {
    const map = {}
    passengers.forEach((p, i) => {
      if (p.seatId) map[p.seatId] = { paxId: p.id, paxNum: i + 1 }
    })
    return map
  }, [passengers])

  const selectFlight = useCallback((flight) => {
    setSelectedFlight(flight)
    setLayoutType(flight.layout)
    setPassengers(prev => prev.map(p => ({ ...p, seatId: null })))
  }, [])

  const switchLayout = useCallback((lt) => {
    if (lt === layoutType) return
    setLayoutType(lt)
    setPassengers(prev => prev.map(p => ({ ...p, seatId: null })))
  }, [layoutType])

  const updateCount = useCallback((delta) => {
    setPassengerCount(prev => {
      const next = Math.max(1, Math.min(maxPassengers, prev + delta))
      setPassengers(prevPax => {
        if (next > prevPax.length) {
          const added = []
          for (let i = prevPax.length + 1; i <= next; i++) added.push(createPassenger(i))
          return [...prevPax, ...added]
        }
        return prevPax.slice(0, next)
      })
      setActiveId(aid => aid > next ? next : aid)
      return next
    })
  }, [maxPassengers])

  const assignSeat = useCallback((seat) => {
    setPassengers(prev => prev.map(p => {
      if (p.id !== activeId) return p
      if (p.seatId === seat.id) return { ...p, seatId: null }
      return { ...p, seatId: seat.id }
    }))
  }, [activeId])

  const checkConflict = useCallback((seat) => {
    return passengers.find(p => p.seatId === seat.id && p.id !== activeId) || null
  }, [passengers, activeId])

  const removeSeat = useCallback((paxId) => {
    setPassengers(prev => prev.map(p => p.id === paxId ? { ...p, seatId: null } : p))
  }, [])

  const setMeal = useCallback((paxId, mealId) => {
    setPassengers(prev => prev.map(p => p.id === paxId ? { ...p, mealId } : p))
  }, [])

  const updatePassenger = useCallback((paxId, data) => {
    setPassengers(prev => prev.map(p => p.id === paxId ? { ...p, ...data } : p))
  }, [])

  const deletePassenger = useCallback((paxId) => {
   setPassengers(prev => {
    if (prev.length <= 1) return prev
    const filtered = prev.filter(p => p.id !== paxId)
    return filtered.map((p, i) => {
      if (/^Passenger \d+$/.test(p.name)) {
        return { ...p, name: `Passenger ${i + 1}` }
      }
      return p
    })
   })
   setPassengerCount(prev => Math.max(1, prev - 1))
   setActiveId(aid => aid === paxId ? null : aid)
  }, [])
   

  const totals = useMemo(() => {
    let seatTotal = 0, mealTotal = 0
    passengers.forEach(p => {
      if (p.seatId && seatMap[p.seatId]) seatTotal += seatMap[p.seatId].price
      const meal = MEALS.find(m => m.id === p.mealId)
      if (meal) mealTotal += meal.price
    })
    return { seatTotal, mealTotal, subtotal: seatTotal + mealTotal }
  }, [passengers, seatMap])

  return {
    selectedFlight, selectFlight,
    layoutType, switchLayout,
    passengerCount, maxPassengers, passengers, activeId,
    seats, seatMap, seatAssignments, totals,
    setActiveId, updateCount, assignSeat, checkConflict, removeSeat, setMeal, updatePassenger, deletePassenger,
  }
}
