/**
 * 取消原因选择的纯逻辑 (不依赖 Taro / React)。
 */

export interface IreasonsObject {
  key: string
  value: string
  [x: string]: any
}

/** 选中后展示 "其它原因" 输入框的原因 key */
export const OTHER_REASON_KEY = 'other'

export interface ReasonState {
  /** 当前选中的原因 key, '' 表示未选 */
  activeKey: string
  /** 是否展示 "其它原因" 输入框 */
  showOtherText: boolean
}

export const INITIAL_REASON_STATE: ReasonState = { activeKey: '', showOtherText: false }

/**
 * 点击某个原因后的状态:
 * - 点击未选中的原因: 选中它
 * - 再次点击已选中的原因: canCancelReason 时取消选中, 否则保持
 * - 选中 key 为 other 的原因时展示输入框
 */
export function toggleReason(
  state: ReasonState,
  key: string,
  canCancelReason = false
): ReasonState {
  if (key === state.activeKey) {
    if (canCancelReason) return { activeKey: '', showOtherText: false }
    return { activeKey: key, showOtherText: key === OTHER_REASON_KEY }
  }
  return { activeKey: key, showOtherText: key === OTHER_REASON_KEY }
}

/** 提交时的回调数据: 选中的原因对象, 以及仅在选中 other 时保留的输入内容 */
export function buildSubmitPayload(
  reasons: IreasonsObject[] | undefined,
  activeKey: string,
  textAreaValue: string
): { reason: IreasonsObject | undefined; text: string } {
  const reason = (reasons ?? []).find((item) => item.key === activeKey)
  return { reason, text: activeKey === OTHER_REASON_KEY ? textAreaValue : '' }
}
