# SkyBook - Flight Seat Selection

A flight seat selection interface built with React.js where users can select passengers, choose seats from two aircraft configurations, pick meals, and see a live total.

**Live demo:** [Deployed link]

---

## Features

- **Two seat layouts** - switch between 3-2 (regional jet) and 2-3-2 (wide-body) configurations
- **Passenger management** - add 1 to 6 passengers, switch between them freely
- **Seat assignment** - click a seat to assign it to the active passenger; previous selections are retained
- **Visual seat states** - available, free, premium, extra legroom, selected, occupied
- **Live pricing** - total updates instantly as seats and meals are selected or changed
- **Meal selection** (bonus) - free and paid meal options per passenger
- **Conflict prevention** - toast notification if a seat is already taken by another passenger
- **Responsive** - works on desktop, tablet, and mobile

---

## Setup and run locally

**Prerequisites:** Node.js 18+ and npm

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/flight-seat-selector.git
cd flight-seat-selector

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open http://localhost:3000 in your browser.

To build for production:

```bash
npm run build
npm run preview
```

---

## Project structure

```
src/
  components/
    Header.jsx          Flight info bar and layout toggle
    PassengerBar.jsx    Passenger count control and selection chips
    SeatMap.jsx         Seat grid with column headers, rows, and legend
    Seat.jsx            Individual seat button with tooltip and state styling
    BookingSummary.jsx  Per-passenger breakdown and running total
    MealSelection.jsx   Meal radio picker per passenger
    Toast.jsx           Notification popup and useToast hook
  data/
    seats.js            Seat generation, meal data, and price formatting
  hooks/
    useBooking.js       All booking state and actions in one hook
  styles/
    index.css           Global tokens and resets
    [Component].css     Co-located styles per component
  App.jsx               Wires components to the booking hook
  main.jsx              React entry point
```

---

## State management approach

All booking state lives in a single custom hook, `useBooking`, which returns the state and every action the UI needs. This keeps components stateless and focused on rendering.

**State shape:**

- `passengerCount` (number) - how many passengers are active
- `passengers` (array) - each passenger has an `id`, `name`, `seatId`, and `mealId`
- `activeId` (number) - which passenger is currently selected for seat picking
- `layoutType` (string) - `'3-2'` or `'2-3-2'`

**Derived state (via useMemo):**

- `seats` - generated from `layoutType` using a deterministic function
- `seatMap` - a lookup object (seatId to seat data) for O(1) access
- `seatAssignments` - a reverse map (seatId to passenger) so the SeatMap knows which seats are taken
- `totals` - seat + meal prices, recalculated on every change

**Seat assignment logic:**

1. User clicks a passenger chip to set them as active
2. User clicks an available seat on the map
3. `checkConflict()` verifies no other passenger owns that seat
4. If clear, `assignSeat()` updates the active passenger's `seatId`
5. Clicking the same seat again deselects it (toggle behavior)
6. Switching to a different passenger preserves all existing assignments

**Layout switching:**

Switching between 3-2 and 2-3-2 clears all seat assignments because the two layouts have different column structures (A-E vs A-G). A confirmation dialog warns the user before clearing.

---

## Tech decisions

- **Vite** for fast dev server and optimized builds
- **CSS custom properties** for the entire color system (single source of truth)
- **No external UI library** - all components are hand-built
- **No state management library** - `useState` and `useMemo` inside a custom hook are sufficient for this scope
- **Deterministic mock data** - seat availability and pricing are generated from row/column indices, making the data consistent across sessions without needing randomization
# Flight-Seat-Selector
