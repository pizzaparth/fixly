# Fixly - Developer Documentation

## 1. System Architecture Overview
Fixly operates on a classic MERN (MongoDB, Express, React, Node.js) stack architecture. The application is divided into a robust REST API backend and a highly interactive, animated React frontend. 

The architecture strictly separates concerns:
- Frontend Layer: Handles UI rendering, routing, map rendering, and local state management.
- API Layer: Express.js server that processes business logic, authentication, and database operations.
- Data Layer: MongoDB database utilizing Mongoose for schema validation and relational mapping between Users, Shops, and Repair Requests.

## 2. Database Schema Design

### User Model (server/models/User.js)
Handles both "consumer" and "technician" roles.
- Fields: name, email, password, role, phone, location (address, city, pincode, coordinates), specialties, rating, ratingCount.
- Logic: Technicians utilize the specialties array and rating fields to appear on the marketplace.

### Listing Model (server/models/Listing.js)
Represents a technician's shop profile on the marketplace.
- Fields: technician (ObjectId), category, productTypes, title, description, priceRange (min/max), servicePrices (Map of String to Number).
- Logic: The servicePrices map allows technicians to set custom base estimates for different electronic categories (e.g., Mobile: 600, Laptop: 1200).

### RepairRequest Model (server/models/RepairRequest.js)
Tracks the lifecycle of a repair job between a consumer and a technician.
- Fields: user (ObjectId), technician (ObjectId), productCategory, productName, issueDescription, status (pending, in_progress, completed, rejected), quote (exactPrice, submissionTimeSlot, returnTimeSlot), rating (score, feedback).
- Logic: The status field drives the logic for both the Customer Tracking Portal and the Technician Dashboard.

## 3. API Endpoints Reference

### Authentication Routes (/api/auth)
- POST /api/auth/register: Registers a new user or technician.
- POST /api/auth/login: Authenticates a user and returns session data.

### Listings Routes (/api/listings)
- GET /api/listings: Retrieves all active shop listings.
- POST /api/listings: Creates a new shop listing.
- PATCH /api/listings/technician/:id: Updates service prices for a specific technician.

### Repair Request Routes (/api/requests)
- GET /api/requests: Retrieves requests filtered by userId or technicianId.
- POST /api/requests: Submits a new repair request.
- PATCH /api/requests/:id/accept: Technician accepts a request and provides a final quote.
- PATCH /api/requests/:id/status: Updates the lifecycle status of the repair.
- POST /api/requests/:id/review: Consumer submits a rating upon completion.

## 4. Frontend State Management
State is centrally managed using a React Context API implementation located in `src/context/StoreContext.jsx`. 

Key responsibilities of StoreContext:
- Session Management: Persists the logged-in user in localStorage.
- Data Fetching: Automatically polls and syncs shops, listings, and user-specific orders.
- Action Dispatching: Exposes helper functions (createOrder, acceptOrder, rateOrder, etc.) to UI components, abstracting the underlying fetch requests.

## 5. Core Frontend Components

### Interactive Map (Home.jsx)
Utilizes `react-leaflet` to render a high-definition CartoDB Voyager map. Hardcoded location coordinates are synced with the backend data to render technician markers. Map controls have been fully custom-styled via CSS overrides to match the platform's UI rules.

### Modals (AuthModal.jsx, ShopModal.jsx)
All popups use a custom `Modal.jsx` wrapper that implements `framer-motion` for spring-based entrance and exit animations. Modals trap focus and manage their own internal form states before delegating submission to the StoreContext.

### Technician Triage (ShopDashboard.jsx)
Features a layout-animated tab interface (`framer-motion` layoutId) allowing technicians to seamlessly switch between Pending, Ongoing, and Completed requests. The interface conditionally renders action buttons (Accept/Reject/Complete) based on the current status of the `RepairRequest` document.

## 6. Design System Guidelines
All future development must adhere to the `stylerule.md` specifications:
1. Geometry: Strict adherence to square/rectangular borders. Use `rounded-sm`, `rounded-md`, or `rounded-2xl/3xl` for cards. `rounded-full` is used exclusively for buttons and floating action items.
2. Colors: Solid white backgrounds with solid high-contrast borders and text. Avoid soft gradients or muted backgrounds for primary interactive elements.
3. Typography: Geist sans-serif font family. Ensure heavy font weights (font-bold, font-black) are used for headers and primary data points.
