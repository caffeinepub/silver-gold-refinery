# Specification

## Summary
**Goal:** Add auto-refresh for live IBJA gold and silver prices in the Gururaj Bullion app, with the backend periodically fetching prices and the frontend displaying them with live indicators.

**Planned changes:**
- Update `backend/main.mo` to fetch live gold and silver prices from the IBJA rates endpoint every 10 seconds via HTTP outcalls, with a query method returning the latest prices and fallback values (Gold 24K ₹1,70,000/10g, Silver ₹3,09,000/kg) when the API is unavailable
- Update `frontend/src/hooks/useQueries.ts` to poll the backend canister every 10 seconds using React Query, falling back to hardcoded values from `frontend/src/config/fallback.ts` on errors
- Create `frontend/src/config/refresh.ts` with the 10-second refetch interval constant and `frontend/src/config/fallback.ts` with fallback price values
- Update `LiveRatesDashboard.tsx` and `MetalTicker.tsx` to show a pulsing "Live" indicator when auto-refresh is active and display a last-updated timestamp after each successful fetch

**User-visible outcome:** Gold and silver prices on the site update automatically every 10 seconds from the IBJA API, with a live indicator and last-updated timestamp visible to users. Fallback prices are shown when the API is unavailable.
