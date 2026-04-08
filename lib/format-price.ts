export function formatPrice(price: string | number | undefined | null): string {
  if (price === undefined || price === null || price === '') return '0'
  const numericPrice = Number(price)
  if (isNaN(numericPrice)) return '0'
  return numericPrice.toLocaleString('en-IN')
}
