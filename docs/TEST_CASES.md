# LocalLoop — Test Cases

## Critical Flow Test Cases

---

### TC-01: Customer Registration

**Steps:**
1. Navigate to `/signup`
2. Select "Customer" role → click Continue
3. Fill name, email, phone, password
4. Click "Create Account"

**Expected:**
- Account created, auto-signed in
- Redirected to `/`
- Customer profile created in DB

---

### TC-02: Partner Registration + Admin Approval

**Steps:**
1. Register as "Service Partner"
2. Fill shop name, email, password
3. Sign in as admin → `/admin/partners`
4. Click "Approve" on the new partner

**Expected:**
- Partner sees approval pending message before approval
- After approval, partner sees full dashboard
- `isApproved = true` in DB

---

### TC-03: Service Discovery + Browse

**Steps:**
1. Go to `/services`
2. Click on a category pill (e.g. "Printouts")
3. Click on a partner card

**Expected:**
- Partner detail page loaded
- Service listings grouped by category
- Operating hours displayed

---

### TC-04: Place an Order

**Steps:**
1. Sign in as Customer
2. Navigate to `/services` → pick partner
3. Add 1 service to cart
4. Select SELF_COLLECT delivery
5. Click "Place Order"

**Expected:**
- Order created with status `PENDING`
- Customer redirected to `/orders/[id]`
- Order visible in partner dashboard

---

### TC-05: Partner Accept / Reject Order

**Steps:**
1. Sign in as Partner
2. Go to `/partner/orders`
3. Click "Accept" on a PENDING order

**Expected:**
- Order status changes to `ACCEPTED`
- Reject: status becomes `REJECTED`, reason stored

---

### TC-06: Order Status Lifecycle

**Steps:**
1. Partner accepts order → IN_PROGRESS → COMPLETED
2. If delivery: → OUT_FOR_DELIVERY → DELIVERED

**Expected:**
- Status updates in real-time (after page refresh)
- Customer timeline view reflects each step

---

### TC-07: Delivery Task Flow

**Steps:**
1. Place order with `DELIVERY` type
2. Partner accepts → delivery task created automatically
3. Agent signs in → sees task on dashboard
4. Agent marks as COMPLETED

**Expected:**
- Delivery task with OTP appears on agent dashboard
- OTP is visible to customer on order detail page

---

### TC-08: Coupon Validation

**Steps:**
1. At checkout, enter code `WELCOME50`
2. Apply (order total ≥ ₹100)

**Expected:**
- ₹50 discount applied
- Total reduced
- `usageCount` incremented in DB

**Edge cases:**
- Invalid code → error message
- Expired coupon → error message
- Order below minimum → error message

---

### TC-09: Availability Toggle (Delivery Agent)

**Steps:**
1. Sign in as Delivery Agent
2. Click "Go Online" toggle

**Expected:**
- Agent status changes to Available
- `isAvailable = true` in DB
- Badge shows green "Available"

---

### TC-10: Cancel Order (Customer)

**Steps:**
1. Place order (status PENDING)
2. Go to `/orders/[id]`
3. Click "Cancel Order"

**Expected:**
- Order status → CANCELLED
- Cancel button disappears
- No refund processed (MVP: manual)

---

### TC-11: Review Submission

**API test:**
```
POST /api/reviews
{
  "orderId": "...",
  "targetId": "...", (partner profile ID)
  "targetType": "PARTNER",
  "rating": 5,
  "comment": "Great service!"
}
```

**Expected:**
- Review created
- Partner rating recomputed

---

### TC-12: Admin KPIs

**Steps:**
1. Sign in as Admin
2. Navigate to `/admin`

**Expected:**
- Total customers, partners, orders, platform revenue shown
- Pending partner alerts if any unapproved partners

---

### TC-13: RBAC Enforcement

**Steps:**
1. Sign in as Customer
2. Try to navigate to `/admin`

**Expected:**
- Redirected to `/unauthorized`
- NOT to `/login`

---

### TC-14: Partner Earnings Calculation

**Given:**
- Order total: ₹200
- Commission rate: 15%

**Expected:**
- Platform fee: ₹30
- Partner earning: ₹170
- If delivery: +₹30 delivery fee to customer, partner keeps ₹170

---

## API Endpoint Smoke Tests

| Endpoint | Method | Auth | Expected |
|---|---|---|---|
| `/api/auth/register` | POST | None | 201 on success, 409 if duplicate |
| `/api/orders` | GET | Customer | Returns user's orders |
| `/api/orders` | POST | Customer | Creates order with items |
| `/api/orders/[id]` | PATCH | Partner | Updates status |
| `/api/coupons/validate` | POST | None | Returns discount or error |
| `/api/admin/stats` | GET | Admin only | Returns platform KPIs |
| `/api/admin/partners/[id]` | PATCH | Admin only | Approve/suspend partner |
| `/api/delivery/availability` | PATCH | Agent only | Toggle availability |
| `/api/reviews` | POST | Customer | Creates review, updates rating |
