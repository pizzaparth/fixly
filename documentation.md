# Fixly - Developer Documentation

## Overview
Fixly is a hyper-local electronics repair marketplace connecting consumers with trusted neighborhood repair technicians.

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS v4, framer-motion, react-leaflet
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose

## Setup Instructions
1. Install dependencies: npm install
2. Start MongoDB locally (port 27017).
3. Run the development server: npm run dev

## Architecture
- Client Side: Uses StoreContext to interface with REST APIs and manage global state. UI components are built using shadcn and customized tailwind primitives.
- Server Side: Express server handles routing in server/routes/api.js, with Mongoose schemas mapping to MongoDB.
