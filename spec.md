# Specification

## Summary
**Goal:** Remove error UI from the metal ticker and live rates dashboard, use IBJA fallback prices silently when live fetch fails, and show a subtle "Market Closed" indicator when prices have not moved for 1 hour or more.

**Planned changes:**
- Remove all error messages, error banners, and error state styling from `MetalTicker` and `LiveRatesDashboard` components
- When the live IBJA price fetch fails or returns no data, silently fall back to the last known prices defined in `frontend/src/config/fallback.ts` (Gold ₹159,000/10g, Silver ₹265,000/kg)
- In `useQueries.ts`, track the timestamp of the last price change and expose a `marketClosed` boolean that becomes `true` when prices have not changed for 60 minutes or more
- Pass the `marketClosed` flag to `MetalTicker` and `LiveRatesDashboard`
- Display a subtle, muted "Market Closed" badge/label in both `MetalTicker` and `LiveRatesDashboard` when `marketClosed` is `true`, without obscuring price values or using error-style colors

**User-visible outcome:** The ticker and dashboard always show price values without any error messages. If live prices are unavailable, fallback prices are shown silently. If the market has been inactive for over an hour, a small, understated "Market Closed" indicator appears alongside the prices.
