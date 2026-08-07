/** Store operates in Pakistan Rupees only — every price in the app renders through this. */
export function formatPrice(amount: number): string {
  return `Rs ${Math.round(amount).toLocaleString("en-PK")}`;
}
