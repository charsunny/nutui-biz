// Ecard 的纯逻辑, 不依赖 Taro, 便于单测
import mathMethods from '../../utils/math'

const { accurateMultiply } = mathMethods

/**
 * 规范化「其它面值」输入: 去掉非数字字符, 空串保持为空 (允许用户清空),
 * 否则限制在 [min, max]。
 */
export function normalizeEcardCustomValue(
  raw: string | number | null | undefined,
  min: number,
  max: number
): number | '' {
  const digits = String(raw ?? '').replace(/[^\d]/g, '')
  if (!digits) return ''
  const value = Number(digits)
  if (value > max) return max
  if (value < min) return min
  return value
}

/** 面值 × 数量, 避免浮点误差; 任一为空 / 0 时返回 0 */
export function calcEcardMoney(
  price: number | string | '' | undefined,
  amount: number | string | undefined
): number {
  if (!price || !amount) return 0
  return accurateMultiply(price, amount)
}

/**
 * 当前选中的面值: currentIndex >= 0 取 dataList 里的固定面值,
 * -1 表示「其它面值」, 取自定义值。
 */
export function getEcardPrice(
  dataList: Array<{ price: number }>,
  currentIndex: number,
  customValue: number | ''
): number {
  if (currentIndex === -1) return customValue === '' ? 0 : customValue
  return dataList[currentIndex]?.price ?? 0
}

/** 每行 rowNum 个时单个面值卡的宽度百分比 (留 4% 间隙) */
export function getEcardItemWidth(rowNum?: number): number {
  return rowNum && rowNum > 0 ? Number((96 / rowNum).toFixed(0)) : 48
}
