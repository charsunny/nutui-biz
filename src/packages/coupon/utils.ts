/**
 * 优惠券金额展示: 最多保留两位小数, 且整体最多 5 个字符 (超出截断)。
 *   9.212 → '9.21'   100 → '100'   123456 → '12345'   '9.50' → '9.5'
 * 非数字原样返回 (截断到 5 个字符)。
 */
export function formatCouponPrice(price: number | string): string {
  const str = String(price ?? '')
  const num = Number(str)
  if (str.trim() === '' || Number.isNaN(num)) return str.substring(0, 5)
  const decimals = str.includes('.') ? str.split('.')[1].length : 0
  const text = decimals > 2 ? num.toFixed(2) : String(num)
  return text.substring(0, 5)
}
