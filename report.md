# Project Report: Fixly

**Hackathon:** SwiftShft Hackathon

**Team Members:**
- Parth Pancholi (25BCE10443)
- Abhinav Kumar (25BAI10858)

---

## 1. Introduction
The electronics repair industry is highly fragmented. Consumers face a severe lack of transparency regarding pricing and turnaround times, while skilled local technicians struggle to market their services effectively. Fixly was developed during the SwiftShft Hackathon to solve these exact problems. It is a hyper-local, dual-sided marketplace designed to bridge the gap between consumers and neighborhood repair experts.

## 2. Objectives
- To create a transparent platform where consumers can discover local repair shops via an interactive map.
- To provide upfront estimated base costs for various electronic categories.
- To empower technicians with a dedicated dashboard for managing repair requests, issuing exact quotes, and tracking earnings.
- To implement a robust, real-time status tracking system for the repair lifecycle.

## 3. System Architecture
Fixly operates on a classic MERN (MongoDB, Express, React, Node.js) stack architecture. 

### 3.1 Frontend Layer
The frontend is built using React 19 and Vite for optimal performance. Tailwind CSS v4 is used for styling, adhering to a strict design system (solid colors, rectangular geometry). Framer Motion handles complex physics-based animations and layout transitions. Map integration is handled by React-Leaflet. State management is centralized using the React Context API.

### 3.2 Backend API Layer
The server runs on Node.js and Express.js, providing a robust RESTful API. It handles authentication, shop listings retrieval, and repair request lifecycle updates.

### 3.3 Database Layer
MongoDB is used as the primary database, with Mongoose providing schema validation. The database is structured around three core models:
- **User:** Manages consumer and technician profiles.
- **Listing:** Manages shop details, active categories, and custom service pricing.
- **RepairRequest:** Tracks the lifecycle of a job from creation to completion, including quotes and ratings.

## 4. Key Features & Implementation

### 4.1 Consumer Experience
- **Geospatial Discovery:** Users can view shops on an interactive map, complete with custom markers and styled zoom controls.
- **Seamless Booking:** The booking modal dynamically fetches the estimated base cost for the selected category.
- **Request Tracking:** A dedicated customer portal allows users to track their device's status and view exact quotes provided by the technician.
- **Rating System:** Upon completion, users can rate the technician, maintaining a high standard of trust within the marketplace.

### 4.2 Technician Experience
- **Triage Dashboard:** Technicians receive incoming requests in a Kanban-style triage system.
- **Quoting Engine:** Technicians can review a customer's issue description and provide a binding quote and drop-off timeline.
- **Service Management:** Shop owners can dynamically update their supported categories and base pricing directly from the dashboard.

## 5. Challenges and Solutions
- **Map Rendering Optimization:** Integrating Leaflet mapping with React required careful component structuring to ensure tiles loaded crisply on high-DPI displays.
- **State Synchronization:** Ensuring that the technician's actions (like accepting a quote) instantly reflected on the consumer's dashboard required robust data fetching patterns in the StoreContext.
- **Strict UI Requirements:** Adhering strictly to a customized design system without standard pill shapes or gradients required deep Tailwind CSS customization.

## 6. Conclusion
Fixly successfully demonstrates a highly functional, production-ready solution to the fragmented electronics repair market. By focusing on hyper-local discovery, transparent quoting, and a seamless UI/UX, Fixly empowers both consumers and local businesses. 

---
*End of Report*
