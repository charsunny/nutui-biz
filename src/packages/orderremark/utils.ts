/**
 * 订单备注的纯逻辑 (不依赖 Taro / React)。
 */

/** 标签之间的分隔符 */
export const TAG_SEPARATOR = '，'

/**
 * 点击推荐标签后把标签追加到备注末尾。
 * full: 未截断的拼接结果 (onClickTag 的第三个参数, 与旧版一致);
 * value: 按 maxLength 截断后的备注 (maxLength < 0 表示不限制)。
 */
export function appendTag(
  remark: string,
  tag: string,
  maxLength: number
): { full: string; value: string } {
  const full = remark.length > 0 ? `${remark}${TAG_SEPARATOR}${tag}` : tag
  const value = maxLength >= 0 && full.length > maxLength ? full.slice(0, maxLength) : full
  return { full, value }
}
