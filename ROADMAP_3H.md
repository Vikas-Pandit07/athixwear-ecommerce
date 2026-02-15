# AthixWear 3-Hour/Day Roadmap (4 Weeks)

## Week 1: Core Stability
- [ ] Day 1: Audit remaining mock logic and generic exceptions
- [ ] Day 2: Replace generic exceptions with typed exceptions
- [ ] Day 3: Make remaining controllers thin
- [ ] Day 4: Standardize API response and error format
- [ ] Day 5: Validate auth/cart/order/admin critical flows manually
- [ ] Day 6: Fix regressions found during validation
- [ ] Day 7: Cleanup/refactor buffer day

## Week 2: Commerce Safety
- [ ] Day 8: Payment gateway test setup + create payment order API
- [ ] Day 9: Payment verify API + frontend checkout hookup
- [ ] Day 10: Webhook endpoint + signature verification
- [ ] Day 11: Idempotency for webhook and order updates
- [ ] Day 12: Transaction-safe stock deduction
- [ ] Day 13: Failure rollback handling for payment/order mismatch
- [ ] Day 14: End-to-end checkout testing

## Week 3: Productization
- [ ] Day 15: Order lifecycle workflow APIs
- [ ] Day 16: Admin order status update endpoints + validations
- [ ] Day 17: Frontend order tracking/status UI
- [ ] Day 18: Admin dashboard query polish + pagination
- [ ] Day 19: UX pass (loading/error/empty states)
- [ ] Day 20: Unit tests for auth/cart/order services
- [ ] Day 21: Integration tests for checkout/payment flows

## Week 4: Launch Readiness
- [ ] Day 22: Rate limiting + security hardening
- [ ] Day 23: Environment split (dev/staging/prod)
- [ ] Day 24: CI pipeline (build + tests)
- [ ] Day 25: Logging/monitoring + basic error tracking
- [ ] Day 26: Backup + restore drill
- [ ] Day 27: Full staging dry run (real user journey)
- [ ] Day 28: Production deploy + smoke tests + hotfix window

