// Fallback prices (in INR) - Gold (999) per 10g, Silver (999) per kg
// Based on Kolkata rates
export const FALLBACK_PRICES = {
  GOLD_PER_10G: 159000, // Gold (999) per 10 grams - Kolkata rate
  SILVER_PER_KG: 265000, // Silver (999) per kilogram - Kolkata rate
};

// Price variation for realistic simulation when scraping fails
export const PRICE_VARIATION = {
  GOLD: 2000,
  SILVER: 3000,
};
