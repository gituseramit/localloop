# LocalLoop — MVP Roadmap

## Phase 1 — MVP (Current)

**Goal**: Functional 3-sided marketplace, demo-ready

### ✅ Completed
- Customer registration, login (Email + Google)
- Service partner registration + approval flow
- Delivery agent registration
- Service category management
- Service catalog per partner
- Order placement (with file upload placeholder)
- Order lifecycle (11 statuses)
- Partner order accept/reject/update
- Delivery task assignment + OTP confirmation
- Admin dashboard with KPIs
- Admin partner approval/suspension
- Admin user management
- Admin service category CRUD
- Commission calculation (platform fee)
- Promo code validation
- Review + rating system
- Role-based access control (RBAC)
- Mobile-first responsive UI

---

## Phase 2 — Growth (Month 2–3)

- [ ] Real file uploads (UploadThing / AWS S3)
- [ ] Razorpay live payment integration
- [ ] Real-time order updates (SSE or Pusher)
- [ ] Google Maps integration (distance, ETA)
- [ ] In-app notifications (email + SMS via Twilio)
- [ ] Partner subscription plans (Starter / Pro)
- [ ] Coupon CRUD in admin panel
- [ ] Referral program
- [ ] Customer wallet system
- [ ] Earnings payout to partners (Razorpay Payouts)
- [ ] Partner analytics (charts)
- [ ] Revenue analytics for admin
- [ ] Mobile app (React Native / Flutter)

---

## Phase 3 — Scale (Month 4–6)

- [ ] Multi-city expansion (city-based service zones)
- [ ] Franchise partner support
- [ ] KYC integration (DigiLocker API)
- [ ] Automated delivery agent matching (nearest agent)
- [ ] Advanced search with Elasticsearch
- [ ] Partner performance scoring
- [ ] Dispute resolution workflow
- [ ] PDF receipt generation
- [ ] WhatsApp order notifications (Twilio / WATI)
- [ ] SEO-optimized public service pages
- [ ] Admin revenue reports (CSV export)
- [ ] Customer loyalty points

---

## Phase 4 — Enterprise (Month 7–12)

- [ ] B2B bulk orders (offices, colleges)
- [ ] SLA-based service tiers
- [ ] White-label offering for shop chains
- [ ] AI-powered document processing (Aadhaar, PAN)
- [ ] Government portal integration (DigiLocker / UMANG)
- [ ] Hyperlocal ad platform for partners
- [ ] Partner mobile app
- [ ] Open API for third-party integrations

---

## Tech Debt / Hardening

- [ ] End-to-end tests with Playwright
- [ ] Integration tests for all API routes
- [ ] Rate limiting on API routes
- [ ] Request logging + Sentry error tracking
- [ ] Database connection pooling (PgBouncer)
- [ ] CDN for assets (Cloudflare)
- [ ] GDPR-compliant document deletion
- [ ] Audit log for admin actions
