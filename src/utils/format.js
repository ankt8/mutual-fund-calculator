/** Format a number as Indian currency (₹) with lakh/crore grouping */
export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '₹0';
  return '₹' + value.toLocaleString('en-IN');
}

/** Short-form currency: 1.2L, 3.5Cr, etc. */
export function formatShort(value) {
  if (value >= 1_00_00_000) {
    return '₹' + (value / 1_00_00_000).toFixed(2) + ' Cr';
  }
  if (value >= 1_00_000) {
    return '₹' + (value / 1_00_000).toFixed(2) + ' L';
  }
  if (value >= 1000) {
    return '₹' + (value / 1000).toFixed(1) + 'K';
  }
  return '₹' + value.toLocaleString('en-IN');
}
