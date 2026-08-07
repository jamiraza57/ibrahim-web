/** Human-readable, sortable-by-date order numbers: IB-20260803-482137 */
export function generateOrderNumber(): string {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `IB-${datePart}-${randomPart}`;
}
