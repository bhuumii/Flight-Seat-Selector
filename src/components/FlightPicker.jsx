import { FLIGHTS } from '../data/seats'
import '../styles/FlightPicker.css'

export default function FlightPicker({ selectedFlight, onSelect }) {
  return (
    <section className="flights-section">
      <div className="section-label">Choose your flight</div>
      <div className="flights-row">
        {FLIGHTS.map(f => {
          const active = selectedFlight?.id === f.id
          return (
            <button
              key={f.id}
              className={`flight-card ${active ? 'flight-card-active' : ''}`}
              onClick={() => onSelect(f)}
            >
              <div className="fc-top">
                <span className="fc-id">{f.id}</span>
                <span className="fc-layout">{f.layout}</span>
              </div>
              <div className="fc-times">
                <div className="fc-time-block">
                  <span className="fc-time">{f.depart}</span>
                  <span className="fc-code">{f.from}</span>
                </div>
                <div className="fc-dur">
                  <span className="fc-dur-line" />
                  <span className="fc-dur-text">{f.duration}</span>
                  <span className="fc-dur-line" />
                </div>
                <div className="fc-time-block">
                  <span className="fc-time">{f.arrive}</span>
                  <span className="fc-code">{f.to}</span>
                </div>
              </div>
              <div className="fc-bottom">
                <span className="fc-date">{f.date}</span>
                <span className="fc-nonstop">Non-stop</span>
              </div>
              {active && <div className="fc-check">&#10003;</div>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
