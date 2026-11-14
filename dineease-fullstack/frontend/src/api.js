const BASE = '/api'
async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  login: (payload) => request('/users/login', { method: 'POST', body: JSON.stringify(payload) }),
  restaurants: () => request('/restaurants'),
  restaurant: (id) => request(`/restaurants/${id}`),
  menu: (id) => request(`/restaurants/${id}/menu`),
  createBooking: (payload) => request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  booking: (id) => request(`/bookings/${id}`)
}
