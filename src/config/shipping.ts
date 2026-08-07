export const SHIPPING_FLAT_RATE = 300;
export const FREE_SHIPPING_THRESHOLD = 50000;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}
