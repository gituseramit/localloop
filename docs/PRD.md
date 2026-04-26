# LocalLoop — Product Requirements Document (PRD)

**Version:** 1.0 — MVP  
**Status:** In Development  
**Date:** April 2026

---

## 1. Executive Summary

LocalLoop is a hyperlocal multi-vendor marketplace for document, digital, and convenience services across Indian cities. It connects customers who need everyday services (printouts, scanning, resumé help, form filling) with nearby verified service partners (print shops, cyber cafes, digital centers, freelancers), with optional pickup and doorstep delivery via Delivery Agents.

**Business Model:** Commission-based (default 15%) on every completed order, plus delivery fee, with optional partner subscription tiers in roadmap.

---

## 2. Problem Statement

India has tens of millions of small service providers — cyber cafes, print shops, documentation centers — operating as walk-in-only businesses with zero digital presence. Customers, especially students and semi-urban users, regularly need document help (exam forms, passport photos, Aadhaar copies) but face:

- Long distances to physical shops
- No way to send files remotely
- No price transparency
- No trust/verification signal
- No pickup or delivery option

LocalLoop solves this with Swiggy-style ordering + Urban Company-style service partner management.

---

## 3. Target Users

| User | Description |
|---|---|
| **Customer** | 18–45, students, professionals, semi-urban digital users |
| **Service Partner** | Print shop, cyber cafe, digital service center, freelance typist |
| **Delivery Agent** | Bike delivery freelancer in the locality |
| **Admin** | Platform operations team |

---

## 4. Core User Journeys

### Customer Flow
1. Download/open app → Set location
2. Browse service categories or search
3. Select partner (sorted by distance / rating)
4. Add services to cart + upload documents
5. Choose delivery option (self-collect / delivery)
6. Confirm order + pay
7. Receive live status updates
8. Rate partner after delivery

### Partner Flow
1. Register + upload documents
2. Wait for admin approval
3. Set up service catalog with prices
4. Set operating hours
5. Accept/reject incoming orders
6. Update status (in progress, completed)
7. View earnings dashboard

### Delivery Agent Flow
1. Register + KYC (basic)
2. Toggle availability
3. Receive pickup task
4. Confirm pickup via OTP
5. Deliver to customer
6. Confirm delivery via OTP
7. Earn per delivery

### Admin Flow
1. Approve/reject partner registrations
2. Monitor all orders
3. Manage users and partners
4. Set commission rates
5. Manage coupons
6. Handle support tickets
7. View analytics and GMV

---

## 5. Service Catalog (MVP)

| Category | Services |
|---|---|
| Printouts | B&W, Colour, A3, A4, Double-sided |
| Photocopy | Xerox / photocopy per page |
| Scanning | Scan to PDF/JPG, multi-page |
| Lamination | Hot lamination A4/A3/custom |
| Binding | Spiral, comb, hard cover |
| Passport Photo | 35×45 mm, 6 or 12 pieces |
| ID Card Print | PVC / paper ID card |
| Document Typing | English / Hindi per page |
| Resume Making | Standard, Premium, ATS-ready |
| PDF Conversion | Word to PDF, JPG to PDF |
| Form Filling | Exam registration, scholarship, govt |
| Govt Forms | Ration card, caste cert, income cert |

---

## 6. Order Status Lifecycle

```
PENDING → ACCEPTED / REJECTED
ACCEPTED → IN_PROGRESS / AWAITING_PICKUP
IN_PROGRESS → COMPLETED
COMPLETED → OUT_FOR_DELIVERY / (SELF_COLLECT done)
OUT_FOR_DELIVERY → DELIVERED
Any → CANCELLED (customer)
Any → REFUNDED (admin)
```

---

## 7. Revenue Model

| Stream | Rate |
|---|---|
| Platform commission | 15% of order amount (configurable) |
| Delivery fee (customer-paid) | ₹30/order default |
| Partner subscription | ₹299/month (roadmap) |
| Featured placement | Roadmap |

---

## 8. Non-Functional Requirements

- **Mobile-first**: Full UI works on 375px screens
- **Load time**: First page < 2s on 4G
- **Security**: JWT auth, RBAC, bcrypt passwords, no plain-text file URLs
- **Privacy**: Document files are ephemeral (not stored permanently in MVP)
- **Scalability**: PostgreSQL + Prisma ready for connection pooling and read replicas
- **Audit**: All order status changes are timestamped

---

## 9. Out of Scope (MVP)

- Real-time GPS tracking
- Live chat between customer and partner
- Payment disbursement automation
- KYC via DigiLocker
- Native mobile apps
- Multi-language UI (Hindi, Telugu, etc.)
