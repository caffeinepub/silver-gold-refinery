// IBJA rates data structure for backend API response
export interface IbjaRatesData {
  gold999Per1g: number;
  gold999Per10g: number;
  silver999: number;
  lastScraped: number;
}

export interface MetalPrice {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  withGST?: number;
  cgst?: number;
  sgst?: number;
  marketClosed?: boolean;
}

export interface MetalPricesData {
  gold: MetalPrice;
  silver: MetalPrice;
  platinum: MetalPrice;
  lastUpdate?: number;
  marketClosed?: boolean;
}
