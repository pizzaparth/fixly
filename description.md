# Fixly (RepairFix) - Project Description

## 1. Executive Summary
**Fixly** (formerly RepairFix) is a community-driven repair services discovery and management platform designed to connect consumers with trusted local technicians. By streamlining the process of finding repair services, obtaining clear upfront estimates, and tracking the end-to-end repair lifecycle, Fixly makes repairing everyday products more accessible, cost-effective, and transparent—directly curbing electronic and material waste.

---

## 2. Problem Statement
Everyday household items and consumer electronics are routinely discarded and replaced prematurely due to three main friction points:
1. **Discovery Deficit:** Consumers don't know who can repair their specific product nearby.
2. **Cost Uncertainty:** Lack of transparent price estimates leads users to assume replacement is cheaper than repair.
3. **Trust & Reliability Gaps:** Absence of verified reviews, structured quotes, and clear turnaround timelines creates hesitation.

This cycle results in significant financial waste for households and accelerating environmental degradation through unnecessary landfill contributions.

---

## 3. Mission & Core Objectives
Fixly's mission is to promote a sustainable "repair-first" culture through technology:
* **Hyper-local Discovery:** Help users find relevant, nearby repair specialists for diverse item categories.
* **Transparent Quoting:** Enable technicians to provide exact cost quotes and realistic turnaround windows before users commit.
* **Streamlined Request Tracking:** Maintain full visibility over pending, in-progress, and completed repairs.
* **Decentralized Direct Transactions:** Empower local businesses by connecting them directly with clients without imposing platform payment fees or acting as a financial bottleneck.
* **Service History & Accountability:** Maintain item repair logs and peer ratings to build a trusted repair ecosystem.

---

## 4. User Personas & Workflows

### 4.1. Consumer / Item Owner Workflow
1. **Catalog & Search:**
   * Browse common repair categories and supported product types from the homepage.
   * Search for specific products, devices, or appliances needing repair.
2. **Technician Discovery & Comparison:**
   * View available local repair technicians with their service price ranges, location, turnaround estimates, and customer ratings.
3. **Frictionless Request Submission:**
   * Select a preferred technician and submit a repair request detailing the issue.
   * Seamless onboarding: Entering name, email, and password automatically authenticates the user or creates their account in one seamless step.
4. **Quote Review & Scheduling:**
   * Receive technician responses (acceptance with detailed quote, drop-off date/time slot, turnaround duration, and estimated pickup date; or rejection notice).
   * Review agreed terms directly on the user dashboard / email notifications.
5. **Item Drop-off & Handover:**
   * Drop off the product at the technician's location at the scheduled time.
6. **Pickup, Direct Settlement & Review:**
   * Collect the restored item on the deadline.
   * Settle payment directly with the technician (cash, UPI, card, etc.).
   * Submit ratings and feedback to help the community.

---

### 4.2. Technician / Repair Specialist Workflow
1. **Onboarding & Profile Setup:**
   * Quick technician registration with name, email, business location/address, and password (optimized for minimal friction).
2. **Service & Listing Management:**
   * Create and manage service listings specifying repairable product categories, base price ranges, and specializations.
3. **Request Management Hub:**
   * Filter and manage incoming jobs across **Pending**, **In-Progress**, and **Completed** statuses.
4. **Actionable Request Triage:**
   * **Reject:** Notify the customer promptly with reason/status update.
   * **Accept & Quote:** Fill an approval form specifying the exact repair cost quote, item submission window, estimated duration, and ready-for-collection date/time.
5. **Repair Execution & Delivery:**
   * Service the item upon drop-off.
   * Deliver the finished item to the customer, verify direct payment receipt, and mark the job as **Completed**.

---

## 5. Key System Features & Boundaries

| Feature Area | In Scope | Out of Scope / Explicit Boundaries |
| :--- | :--- | :--- |
| **Payments** | Direct peer-to-peer settlement between user and technician | Platform payment processing / escrow / gateway integration |
| **Authentication** | Streamlined frictionless auth (email + password auto-signup/login) | SMS OTP verifications (avoided for hackathon velocity) |
| **Quotes & Estimates** | Range estimates on listings + exact quote form on acceptance | Automated hardware diagnostic tools |
| **Notifications** | Status emails & in-app alerts for quote updates, accept/reject, completion | In-app live chat / VoIP calling |
| **Tracking** | End-to-end request state transitions (`Pending` $\rightarrow$ `Accepted/Rejected` $\rightarrow$ `In-Progress` $\rightarrow$ `Completed`) | Real-time GPS driver tracking |

---

## 6. Technical Stack & Foundation

* **Framework & Build:** React 19, Vite
* **Styling & Design System:** Tailwind CSS v4, Base UI, Geist Font Variable
* **Component Primitives:** shadcn UI (`Card`, `Dialog`, `Select`, `Table`, `Tabs`, `Button`, `Calendar`, `Sonner`, `Badge`, `Sheet`, `Alert Dialog`, etc.)
* **Icons:** Lucide React
* **Date Utilities:** `date-fns`
