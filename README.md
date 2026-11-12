# Codexly Backend

Backend API for the Codexly coding analytics platform — user accounts, coding submissions, practice tracking and AI-assisted features.

## Tech stack

- Node.js + Express
- MongoDB with Mongoose
- Google OAuth 2.0 (Passport) + JWT sessions
- Google Gemini API for AI features
- Helmet + express-rate-limit for basic API protection

## Getting started

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the server:

```bash
npm start        # production
npm run dev      # development (nodemon)
```

## Project structure

- `config/` — database connection and Passport setup
- `routes/` — auth, user, submission, practice, AI and early-access routes
- `controllers/` — request handlers
- `models/` — Mongoose schemas
- `middleware/` — auth guards and error handling
- `services/` — shared business logic
