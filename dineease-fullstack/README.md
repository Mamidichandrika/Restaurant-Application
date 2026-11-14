# DineEase – Restaurant Reservation & Food Ordering

A starter full-stack application based on the supplied mobile screenshots.

## Stack
- Frontend: React 18, Vite, plain CSS
- Backend: Java 21, Spring Boot 3.5, Spring Data JPA, Spring Web
- Database: PostgreSQL

## Project structure
- `frontend/` – React UI and API client
- `backend/` – Spring Boot REST API

## 1. PostgreSQL setup
Create a database:
```sql
CREATE DATABASE dineease;
```
Set credentials using environment variables if needed:
- `DB_URL` (default `jdbc:postgresql://localhost:5432/dineease`)
- `DB_USERNAME` (default `postgres`)
- `DB_PASSWORD` (default `postgres`)

The backend uses `spring.jpa.hibernate.ddl-auto=update` for local development.

## 2. Run the backend
Install JDK 21 and Maven, then:
```bash
cd backend
mvn spring-boot:run
```
API runs at `http://localhost:8080`.
On first startup, sample restaurants and menu items are inserted.

## 3. Run the frontend
Install Node.js 18+:
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

## Demo login
The UI accepts a username and mobile number and creates/loads a user through the API.
This is a demonstration login only: it does not verify ownership of the mobile number.
Before production, add OTP verification, authentication, authorization, input validation,
rate limiting, secure payment-provider integration, and proper secrets management.

## Main API routes
- `POST /api/users/login`
- `GET /api/restaurants`
- `GET /api/restaurants/{id}`
- `GET /api/restaurants/{id}/menu`
- `POST /api/bookings`
- `GET /api/bookings/{id}`

The demo payment selection is only a UI choice; no real payment is processed.
