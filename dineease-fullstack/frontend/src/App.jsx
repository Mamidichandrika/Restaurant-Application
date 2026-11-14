
import { useEffect, useMemo, useState } from 'react'
import { api } from './api'
import {
  ArrowLeft, Search, Star, MapPin, Clock, Users, Plus, Minus,
  Utensils, CalendarDays, CheckCircle2, CreditCard, Smartphone, LogOut
} from 'lucide-react'

const money = (n) => `₹${Number(n || 0).toFixed(0)}`
const today = new Date().toISOString().slice(0, 10)

const fallbackRestaurants = [
  { id: 1, name: 'PARADISE', cuisine: 'Hyderabadi Biryani, Tandoori', distance: '0.7 miles away', rating: 4.9, reviewCount: 340, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=1000' },
  { id: 2, name: 'MUBARAK', cuisine: 'Biryani, Indian Cuisine', distance: '0.5 miles away', rating: 4.6, reviewCount: 180, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000' },
  { id: 3, name: 'SPICE GARDEN', cuisine: 'North Indian, Chinese', distance: '1.2 miles away', rating: 4.5, reviewCount: 125, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000' }
]

const fallbackMenu = [
  { id: 1, name: 'Biryani', description: 'Spicy rice with chicken', price: 250, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300' },
  { id: 2, name: 'Kaju Paneer Curry', description: 'Rich creamy curry with paneer and cashew paste', price: 300, imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300' },
  { id: 3, name: 'Grilled Chicken', description: 'Smoky and juicy grilled chicken', price: 280, imageUrl: 'https://images.unsplash.com/photo-1532634896-26909d0d4b8b?w=300' },
  { id: 4, name: 'Butter Naan', description: 'Soft and buttery naan made fresh in tandoor', price: 60, imageUrl: 'https://images.unsplash.com/photo-1600628422019-9a3e6c3a7f83?w=300' },
  { id: 5, name: 'Cold Coffee', description: 'Chilled coffee blended with milk and cream', price: 120, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300' }
]

const tableOptions = [
  { id: 'TWO_SEATER', title: '2-Seater', guests: 'Up to 2 guests', status: 'Available', seats: 2 },
  { id: 'COZY_BOOTH', title: 'Cozy Booth', guests: 'Up to 4 guests', status: 'Few Left', seats: 4 },
  { id: 'PATIO', title: 'Patio Table', guests: 'Up to 6 guests', status: 'Available', seats: 6 },
  { id: 'LARGE_PARTY', title: 'Large Party Table', guests: '8+ guests', status: 'Unavailable', seats: 8 }
]

export default function App() {

  // Restore logged-in user after refreshing the browser
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dineeaseUser')) || null
    } catch {
      return null
    }
  })

  // Show restaurants instead of login if a user is already saved
  const [page, setPage] = useState(() => {
    try {
      return localStorage.getItem('dineeaseUser') ? 'restaurants' : 'login'
    } catch {
      return 'login'
    }
  })

  const [restaurants, setRestaurants] = useState(fallbackRestaurants)
  const [restaurant, setRestaurant] = useState(fallbackRestaurants[0])
  const [menu, setMenu] = useState(fallbackMenu)
  const [search, setSearch] = useState('')
  const [username, setUsername] = useState('')
  const [mobile, setMobile] = useState('')
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('19:30')
  const [guests, setGuests] = useState(2)
  const [table, setTable] = useState('TWO_SEATER')
  const [quantities, setQuantities] = useState({})
  const [payment, setPayment] = useState('CARD_4242')
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.restaurants().then(setRestaurants).catch(() => {})
  }, [])

  const filtered = useMemo(
    () => restaurants.filter(r =>
      `${r.name} ${r.cuisine}`.toLowerCase().includes(search.toLowerCase())
    ),
    [restaurants, search]
  )

  const selectedItems = menu.filter(item => (quantities[item.id] || 0) > 0)
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * quantities[item.id], 0)
  const tax = Math.round(subtotal * 0.05)
  const serviceFee = subtotal > 0 ? 40 : 0
  const total = subtotal + tax + serviceFee

  // Login and save user information
  async function doLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.login({
        username,
        mobileNumber: mobile
      })

      setUser(result)
      localStorage.setItem('dineeaseUser', JSON.stringify(result))

      setPage('restaurants')
    } catch (err) {
      setError(err.message || 'Could not log in. Start the backend or check your details.')
    } finally {
      setLoading(false)
    }
  }

  async function openRestaurant(r) {
    setRestaurant(r)
    setQuantities({})
    setPage('reservation')

    try {
      const items = await api.menu(r.id)
      if (items?.length) setMenu(items)
    } catch {
      setMenu(fallbackMenu)
    }
  }

  function updateQty(id, delta) {
    setQuantities(old => ({
      ...old,
      [id]: Math.max(0, (old[id] || 0) + delta)
    }))
  }

  // Create booking
  async function confirmBooking() {
    setError('')
    setLoading(true)

    const payload = {
      userId: user?.id,
      restaurantId: restaurant.id,
      bookingDate: date,
      bookingTime: time,
      guests,
      tableType: table,
      items: selectedItems.map(item => ({
        menuItemId: item.id,
        quantity: quantities[item.id]
      })),
      paymentMethod: payment
    }

    try {
      const saved = await api.createBooking(payload)
      setBooking(saved)
      setPage('summary')
    } catch (err) {
      setError(err.message || 'Booking could not be saved. Check the backend connection.')
    } finally {
      setLoading(false)
    }
  }

  // Logout and clear saved user
  function logout() {
    localStorage.removeItem('dineeaseUser')
    setUser(null)
    setBooking(null)
    setPage('login')
  }

  return (
    <main className="app-shell">

      <header className="topbar">
        <div className="brand-mark"><Utensils size={19} /></div>
        <div>
          <div className="brand-name">DineEase</div>
          <div className="brand-tag">BOOK YOUR SPOT</div>
        </div>

        {user && (
          <button className="logout" onClick={logout}>
            <LogOut size={17} /> Logout
          </button>
        )}
      </header>

      {page === 'login' && (
        <section className="login-wrap">
          <div className="hero-logo">
            <Utensils size={42} />
            <span>DINE RESERVE</span>
            <small>BOOK YOUR SPOT</small>
          </div>

          <h1>Welcome to DineEase</h1>
          <p className="muted center">Login to your account</p>

          <form className="login-form" onSubmit={doLogin}>
            <label>
              Username
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                minLength="2"
              />
            </label>

            <label>
              Mobile Number
              <input
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                inputMode="numeric"
                pattern="[0-9]{10}"
                title="Enter a 10-digit mobile number"
                required
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button className="primary wide" disabled={loading}>
              {loading ? 'Please wait…' : 'Login'}
            </button>
          </form>

          <p className="hint">Demo login · No OTP verification in this starter version</p>
        </section>
      )}

      {page === 'restaurants' && (
        <section className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">FIND YOUR NEXT MEAL</p>
              <h1>Nearby Restaurants</h1>
              <p className="muted">Discover places worth gathering for.</p>
            </div>
          </div>

          <div className="searchbar">
            <Search size={20} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search restaurants…"
            />
          </div>

          <div className="restaurant-grid">
            {filtered.map(r => (
              <article className="restaurant-card" key={r.id} onClick={() => openRestaurant(r)}>
                <img src={r.imageUrl || fallbackRestaurants[0].imageUrl} alt={r.name} />
                <div className="card-body">
                  <div className="rating">
                    <Star size={15} fill="currentColor" /> {r.rating}
                    <span>· ({r.reviewCount} reviews)</span>
                  </div>
                  <h2>{r.name}</h2>
                  <p>{r.cuisine}</p>
                  <small><MapPin size={13} /> {r.distance || 'Nearby'}</small>
                </div>
              </article>
            ))}
          </div>

          {!filtered.length && <p className="empty">No restaurants match your search.</p>}
        </section>
      )}

      {page === 'reservation' && (
        <section className="content narrow">
          <button className="back" onClick={() => setPage('restaurants')}>
            <ArrowLeft size={18} /> Back to restaurants
          </button>

          <div className="page-heading">
            <div>
              <p className="eyebrow">MAKE IT A DATE</p>
              <h1>Reserve at {restaurant.name}</h1>
              <p className="muted">Choose your date, time and table preference.</p>
            </div>
          </div>

          <div className="panel">
            <label className="field-label">
              <CalendarDays size={18} /> Reservation date
              <input
                type="date"
                min={today}
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </label>

            <label className="field-label">
              <Clock size={18} /> Time
              <select value={time} onChange={e => setTime(e.target.value)}>
                {['11:00', '12:00', '13:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => (
                  <option key={t} value={t}>
                    {new Date(`2020-01-01T${t}`).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </option>
                ))}
              </select>
            </label>

            <div className="guest-row">
              <div><Users size={19} /><span>Guests</span></div>
              <div className="stepper">
                <button onClick={() => setGuests(g => Math.max(1, g - 1))}>
                  <Minus size={16} />
                </button>
                <b>{guests}</b>
                <button onClick={() => setGuests(g => Math.min(20, g + 1))}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <h2 className="section-title">Available Tables</h2>

          <div className="table-grid">
            {tableOptions.map(t => (
              <button
                key={t.id}
                disabled={t.status === 'Unavailable' || guests > t.seats}
                onClick={() => setTable(t.id)}
                className={`table-option ${table === t.id ? 'selected' : ''}`}
              >
                <span className="chair">▰</span>
                <b>{t.title}</b>
                <small>{t.guests}</small>
                <em className={t.status === 'Few Left' ? 'few' : t.status === 'Unavailable' ? 'unavailable' : ''}>
                  {guests > t.seats && t.status !== 'Unavailable' ? 'Not suitable' : t.status}
                </em>
              </button>
            ))}
          </div>

          <button className="primary wide" onClick={() => setPage('menu')}>
            Continue to Menu <span>→</span>
          </button>
        </section>
      )}

      {page === 'menu' && (
        <section className="content narrow">
          <button className="back" onClick={() => setPage('reservation')}>
            <ArrowLeft size={18} /> Back to reservation
          </button>

          <div className="page-heading">
            <div>
              <p className="eyebrow">{restaurant.name}</p>
              <h1>Explore the Menu</h1>
              <p className="muted">Add your favourites to the order.</p>
            </div>
            <div className="cart-count">
              {selectedItems.reduce((s, i) => s + quantities[i.id], 0)} items
            </div>
          </div>

          <div className="menu-list">
            {menu.map(item => (
              <article className="menu-item" key={item.id}>
                <img src={item.imageUrl || fallbackMenu[0].imageUrl} alt={item.name} />
                <div className="menu-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <b>{money(item.price)}</b>
                </div>
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, -1)} aria-label="Decrease">
                    <Minus size={15} />
                  </button>
                  <span>{quantities[item.id] || 0}</span>
                  <button onClick={() => updateQty(item.id, 1)} aria-label="Increase">
                    <Plus size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="sticky-total">
            <div>
              <small>Current order</small>
              <b>{money(subtotal)}</b>
            </div>
            <button className="primary" disabled={!selectedItems.length} onClick={() => setPage('summary')}>
              Review order →
            </button>
          </div>
        </section>
      )}

      {page === 'summary' && (
        <section className="content narrow">
          <button className="back" onClick={() => setPage('menu')}>
            <ArrowLeft size={18} /> Back to menu
          </button>

          <div className="page-heading">
            <div>
              <p className="eyebrow">ALMOST THERE</p>
              <h1>Booking Summary</h1>
              <p className="muted">Review your reservation and order.</p>
            </div>
          </div>

          <div className="panel restaurant-summary">
            <h2>{restaurant.name}</h2>
            <p><MapPin size={15} /> {restaurant.address || '123 Foodie Lane, Culinary City'}</p>
            <p><Clock size={15} /> {restaurant.phone || '(555) 123 – 4567'}</p>
          </div>

          <div className="panel">
            <h2 className="panel-title">Booking Details</h2>
            <div className="summary-line"><span>Date</span><b>{date}</b></div>
            <div className="summary-line"><span>Time</span><b>{new Date(`2020-01-01T${time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</b></div>
            <div className="summary-line"><span>Guests</span><b>{guests} people</b></div>
            <div className="summary-line"><span>Table</span><b>{tableOptions.find(t => t.id === table)?.title}</b></div>
          </div>

          <div className="panel">
            <h2 className="panel-title">Order Summary</h2>
            {selectedItems.length ? (
              selectedItems.map(item => (
                <div className="summary-line" key={item.id}>
                  <span>{quantities[item.id]}× {item.name}</span>
                  <b>{money(item.price * quantities[item.id])}</b>
                </div>
              ))
            ) : (
              <p className="muted">No food items selected. You can still reserve a table.</p>
            )}

            <hr />
            <div className="summary-line"><span>Subtotal</span><b>{money(subtotal)}</b></div>
            <div className="summary-line"><span>Taxes (5%)</span><b>{money(tax)}</b></div>
            <div className="summary-line"><span>Service Fee</span><b>{money(serviceFee)}</b></div>
            <hr />
            <div className="summary-line total"><span>Total</span><b>{money(total)}</b></div>
          </div>

          <div className="panel">
            <h2 className="panel-title">Payment Method</h2>
            {[
              ['CARD_4242', '•••• •••• •••• 4242', 'card'],
              ['CARD_8921', '•••• •••• •••• 8921', 'card'],
              ['UPI', 'UPI Payment', 'upi']
            ].map(([v, label, type]) => (
              <label className="payment-option" key={v}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === v}
                  onChange={() => setPayment(v)}
                />
                <span>{label}</span>
                {type === 'upi' ? <Smartphone size={19} /> : <CreditCard size={19} />}
              </label>
            ))}
          </div>

          {error && <p className="error">{error}</p>}

          {booking ? (
            <div className="success-box">
              <CheckCircle2 size={23} />
              <div>
                <b>Reservation confirmed!</b>
                <p>Booking reference: #{booking.id}</p>
              </div>
            </div>
          ) : (
            <button className="primary wide" onClick={confirmBooking} disabled={loading}>
              {loading ? 'Confirming…' : `Confirm Reservation · ${money(total)}`}
            </button>
          )}

          {booking && (
            <button
              className="secondary wide"
              onClick={() => {
                setBooking(null)
                setQuantities({})
                setPage('restaurants')
              }}
            >
              Back to restaurants
            </button>
          )}

          <p className="hint">Payment is not charged in this demo. Connect a payment provider before production use.</p>
        </section>
      )}

      <footer>
        © 2026 DineEase <span>Good food. Great company.</span>
      </footer>

    </main>
  )
}
