// Refresh configuration for automatic price updates
export const REFRESH_CONFIG = {
  // Refetch interval: 5 minutes (300 seconds) for automatic updates
  REFETCH_INTERVAL: 300000,
  
  // Stale time: Consider data stale after 4 minutes
  STALE_TIME: 240000,
  
  // Background refetch when window regains focus
  REFETCH_ON_WINDOW_FOCUS: true,
  
  // Refetch on reconnect
  REFETCH_ON_RECONNECT: true,
  
  // Continue refetching in background even when tab is not focused
  REFETCH_INTERVAL_IN_BACKGROUND: true,
  
  // Retry configuration
  RETRY: 3,
  RETRY_DELAY: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};
