# Specification

## Summary
**Goal:** Implement automatic live pricing for gold and silver with Kolkata INR rates that refresh every 5 minutes without manual intervention.

**Planned changes:**
- Configure backend to fetch live gold and silver prices specifically for Kolkata location in Indian Rupees (INR)
- Set automatic price refresh to exactly 5 minutes (300 seconds) with no manual refresh required
- Display gold price as ₹/10g with Indian number formatting (e.g., ₹1,59,000/10g)
- Display silver price as ₹/kg with Indian number formatting (e.g., ₹2,65,000/kg)
- Remove all manual refresh mechanisms - prices update automatically in background

**User-visible outcome:** Users see live gold and silver prices in Indian Rupees for Kolkata location that automatically update every 5 minutes without any manual action, with gold priced per 10 grams and silver per kilogram.
