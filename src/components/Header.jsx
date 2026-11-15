import '../styles/Header.css'

export default function Header({ flight }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon">S</span>
          <span className="brand-name">SkyBook</span>
        </div>
        <nav className="header-nav">
          {flight && (
            <div className="header-route">
              <span className="route-city">{flight.from}</span>
              <span className="route-line" />
              <svg className="route-plane" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L11 12l-2 3H6l-1 1 3 2 2 3 1-1v-3l3-2 3.7 7.3c.3.4.7.5 1.1.3l.5-.3c.4-.2.6-.7.5-1.1z"/></svg>
              <span className="route-line" />
              <span className="route-city">{flight.to}</span>
              <span className="route-date">{flight.date}</span>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
