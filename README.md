# Persona AI

Persona AI is a full-stack chat application that lets users interact with AI personas such as Developer, Mentor, and Friend. The app combines a React frontend, an Express backend, Clerk authentication, MongoDB persistence, and Gemini or OpenAI model responses.

## Features

- Chat with multiple AI personas
- Real-time streaming chat responses
- Clerk-based authentication and user sync
- MongoDB-backed user storage
- Responsive React UI with Vite

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Authentication: Clerk
- Database: MongoDB + Mongoose
- AI: Google Gemini API or OpenAI API

## Project Structure

- client/ - React frontend
- src/ - Express backend and app logic
- src/controllers/ - Request handlers
- src/routes/ - API routes
- src/models/ - Mongoose models
- src/services/ - Utility services

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB instance or MongoDB Atlas connection string

## Environment Variables

Create a .env file in the project root with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Create a .env file inside the client folder for the frontend Clerk key:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Installation

Install dependencies for both the backend and frontend:

```bash
npm install
cd client
npm install
cd ..
```

## Running the Application

Start the backend server:

```bash
npm run dev
```

Start the frontend development server:

```bash
cd client
npm run dev
```

The frontend will usually run on http://localhost:5173 and the backend on http://localhost:4000.

## Usage

1. Open the frontend in your browser.
2. Sign in with Clerk authentication.
3. Choose a persona and start chatting.

## Notes

- Gemini models use Google’s native Gemini API; other models use the OpenAI SDK.
- Ensure your MongoDB URI is valid before starting the backend.
- If you want to change the backend port, update the PORT value in the server .env file.

## Deployment

### Frontend on Vercel

1. Import the repository into Vercel.
2. Use the repository root as the project root; the included `vercel.json` builds the `client` folder automatically.
3. Add these environment variables in Vercel:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_BASE_URL=https://your-backend.onrender.com`
4. Deploy. Add the final Vercel domain to Clerk’s allowed origins/redirect settings when required.

### Backend on Render

1. Import the repository into Render and use **Blueprint** with the included `render.yaml`, or create a Web Service manually with `server` as the root directory.
2. Use `npm ci` as the build command and `npm start` as the start command.
3. Configure `MONGODB_URI`, `GEMINI_API_KEY`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, and `CLIENT_URL` in Render.
4. Set `CLIENT_URL` to your Vercel frontend URL and deploy.
5. Verify the deployment at `/health`, for example `https://your-backend.onrender.com/health`.
