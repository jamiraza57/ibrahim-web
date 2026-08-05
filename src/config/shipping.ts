export const SHIPPING_FLAT_RATE = 15;
export const FREE_SHIPPING_THRESHOLD = 200;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}
