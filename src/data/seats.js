export const FLIGHTS = [
  { id: 'SB 442', from: 'DEL', fromCity: 'New Delhi', to: 'BLR', toCity: 'Bengaluru', depart: '06:15', arrive: '08:45', duration: '2h 30m', layout: '3-2', date: 'Sat, 22 Nov' },
  { id: 'SB 518', from: 'DEL', fromCity: 'New Delhi', to: 'BLR', toCity: 'Bengaluru', depart: '10:30', arrive: '13:00', duration: '2h 30m', layout: '2-3-2', date: 'Sat, 22 Nov' },
  { id: 'SB 776', from: 'DEL', fromCity: 'New Delhi', to: 'BLR', toCity: 'Bengaluru', depart: '16:45', arrive: '19:15', duration: '2h 30m', layout: '3-2', date: 'Sat, 22 Nov' },
]

export const LAYOUT_CONFIGS = {
  '3-2': { cols: ['A','B','C','D','E'], aisles: new Set([3]), rows: 20, label: '3 - 2' },
  '2-3-2': { cols: ['A','B','C','D','E','F','G'], aisles: new Set([2,5]), rows: 25, label: '2 - 3 - 2' },
}

export function generateSeats(layoutType) {
  const cfg = LAYOUT_CONFIGS[layoutType]
  const seats = []
  for (let r = 1; r <= cfg.rows; r++) {
    cfg.cols.forEach((col, ci) => {
      let category, price
      if (r <= 2) { category = 'legroom'; price = 350 }
      else if (r <= 5) { category = 'premium'; price = 250 }
      else {
        category = 'standard'
        const h = (r * 3 + ci * 7) % 5
        price = h === 0 ? 0 : (r + ci) % 3 === 0 ? 150 : 0
      }
      const occupied = ((r * 7 + ci * 13 + 3) % 17) < 3 && r > 3
      seats.push({ id: `${r}${col}`, row: r, col, colIndex: ci, category, price, occupied })
    })
  }
  return seats
}

export const MEALS = [
  { id: 'none', name: 'No meal', desc: '', price: 0 },
  { id: 'veg', name: 'Veg thali', desc: 'Rice, dal, paneer, roti, salad', price: 0 },
  { id: 'nonveg', name: 'Chicken biryani', desc: 'Hyderabadi biryani with raita', price: 200 },
  { id: 'gourmet', name: 'Gourmet platter', desc: 'Grilled chicken, pasta, chocolate mousse', price: 400 },
  { id: 'snack', name: 'Snack box', desc: 'Sandwich, chips, cookie, juice', price: 150 },
]

export const PROMO_CODE = '10OFFOVER999'
export const PROMO_MIN = 999
export const PROMO_DISCOUNT = 0.10

export function formatPrice(p) {
  if (p === 0) return 'Free'
  return `\u20B9${p.toLocaleString('en-IN')}`
}

export function categoryLabel(cat) {
  if (cat === 'legroom') return 'Extra legroom'
  if (cat === 'premium') return 'Premium'
  return 'Standard'
}
