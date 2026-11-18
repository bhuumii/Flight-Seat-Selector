# SkyBook - Flight Seat Selection

A flight seat selection interface built with React.js. Users choose a flight, set the number of passengers, assign seats from two aircraft configurations, edit passenger details with meal preferences, apply promo codes, and see a live total.

**Live demo:** https://flight-seat-selector-seven.vercel.app/

---

## Features

- **Flight selection** - choose from multiple flights, each showing departure, arrival, and duration
- **Two seat layouts** - switch between 3-2 (regional jet) and 2-3-2 (wide-body) configurations using a toggle
- **Dynamic passenger count** - add passengers up to the number of available (non-occupied) seats
- **Seat assignment** - click a seat to assign it to the active passenger; click again to deselect
- **Passenger editing** - click the pencil icon on any passenger to edit their name, age, and meal preference in a popup, or remove them from the booking
- **Visual seat states** - six distinct styles: free, standard, premium, extra legroom, selected, and occupied
- **Live pricing** - total updates instantly as seats and meals change
- **Promo code** - dropdown with available codes, validates minimum cart value, shows discount in summary
- **Conflict prevention** - toast notification when a seat is already taken by another passenger
- **Responsive** - adapts to desktop, tablet, and mobile screens

---

## Setup and run locally

**Prerequisites:** Node.js 18+ and npm

```bash
git clone https://github.com/bhuumii/Flight-Seat-Selector.git
cd Flight-Seat-Selector
npm install
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
    Header.jsx          Flight info bar with branding and route display
    FlightPicker.jsx    Flight selection cards
    PassengerBar.jsx    Passenger grid, count control, layout toggle, edit modal
    SeatMap.jsx         Seat grid with column headers, rows, and legend strip
    Seat.jsx            Individual seat with tooltip and state styling
    BookingSummary.jsx  Per-passenger breakdown, promo code, and total
    Toast.jsx           Notification popup and useToast hook
  data/
    seats.js            Flight data, seat generation, meal data, promo constants
  hooks/
    useBooking.js       All booking state and actions in one custom hook
  styles/
    index.css           Global tokens, resets, and keyframe animations
    [Component].css     Co-located styles for each component
  App.jsx               Wires components to the booking hook
  main.jsx              React entry point
```

---

## State management approach

All booking state lives in a single custom hook (`useBooking`) which returns state values and action functions. Components are stateless and focused on rendering.

**State shape:**

- `selectedFlight` (object) - the currently selected flight
- `layoutType` (string) - `'3-2'` or `'2-3-2'`, initially from the selected flight but switchable via toggle
- `passengerCount` (number) - how many passengers are active
- `passengers` (array) - each has `id`, `name`, `age`, `seatId`, and `mealId`
- `activeId` (number) - which passenger is selected for seat picking

**Derived state (useMemo):**

- `seats` - generated deterministically from `layoutType`
- `seatMap` - O(1) lookup object from seat ID to seat data
- `maxPassengers` - count of non-occupied seats, used as the upper limit for passenger count
- `seatAssignments` - reverse map from seat ID to passenger, so the seat grid knows which seats are taken
- `totals` - seat and meal price sums, recalculated on every change

**Seat assignment flow:**

1. User clicks a passenger chip to set them as active
2. User clicks an available seat
3. `checkConflict()` checks if another passenger already has that seat
4. If conflict, a toast shows the error; otherwise `assignSeat()` updates the active passenger's `seatId`
5. Clicking the same seat again deselects it (toggle)
6. Switching active passenger preserves all existing assignments

**Layout switching:**

Both 3-2 and 2-3-2 layouts are available via a toggle regardless of the selected flight. Switching clears all seat assignments because the two layouts have different column structures (A through E vs A through G). A confirmation dialog warns the user before clearing.

**Passenger editing:**

Each passenger chip has a pencil icon that opens a modal with name, age, and meal fields. On save, `updatePassenger()` merges the edited fields into the passenger object. Meal selection is part of this modal rather than a separate section, keeping the sidebar focused on the booking summary.

---

## Tech decisions

- **Vite** for fast dev server and optimized production builds
- **CSS custom properties** for the entire color system, single source of truth for theming
- **No external UI library** - all components built from scratch
- **No state management library** - React's `useState` and `useMemo` inside a custom hook handle the full scope
- **Deterministic mock data** - seat layout and pricing generated from row and column indices, consistent across sessions
- **Plus Jakarta Sans** via Google Fonts for typography
