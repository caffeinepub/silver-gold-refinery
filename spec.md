# Specification

## Summary
**Goal:** Update the hardcoded fallback prices for gold and silver in the frontend configuration file.

**Planned changes:**
- Update the fallback gold price to ₹1,70,000 per 10g (Gold 24K) in `frontend/src/config/fallback.ts`
- Update the fallback silver price to ₹3,09,000 per kg in `frontend/src/config/fallback.ts`

**User-visible outcome:** When the IBJA API is unavailable, the dashboard and ticker display ₹1,70,000/10g for Gold 24K and ₹3,09,000/kg for Silver as fallback prices.
