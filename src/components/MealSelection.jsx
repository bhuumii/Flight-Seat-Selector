import { MEALS, formatPrice } from '../data/seats'
import '../styles/MealSelection.css'

export default function MealSelection({ passengers, onSelectMeal }) {
  return (
    <div className="meal-card">
      <div className="meal-head">Add a meal</div>
      <div className="meal-body">
        {passengers.map(pax => (
          <div key={pax.id} className="meal-pax">
            <div className="meal-pax-name">{pax.name}</div>
            <div className="meal-opts">
              {MEALS.map(meal => {
                const on = pax.mealId === meal.id
                return (
                  <button key={meal.id} className={`mopt ${on ? 'mopt-on' : ''}`} onClick={() => onSelectMeal(pax.id, meal.id)}>
                    <span className="mopt-radio"><span className="mopt-dot" /></span>
                    <span className="mopt-info">
                      <span className="mopt-name">{meal.name}</span>
                      {meal.desc && <span className="mopt-desc">{meal.desc}</span>}
                    </span>
                    <span className="mopt-price">{formatPrice(meal.price)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
