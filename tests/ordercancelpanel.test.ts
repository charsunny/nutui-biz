import { describe, expect, test } from 'bun:test'
import {
  buildSubmitPayload,
  INITIAL_REASON_STATE,
  toggleReason,
} from '../src/packages/ordercancelpanel/utils'

const reasons = [
  { key: 'r1', value: 'R1' },
  { key: 'r2', value: 'R2' },
  { key: 'other', value: 'Other' },
]

describe('toggleReason', () => {
  test('selects a new reason', () => {
    expect(toggleReason(INITIAL_REASON_STATE, 'r1')).toEqual({ activeKey: 'r1', showOtherText: false })
    expect(toggleReason({ activeKey: 'r1', showOtherText: false }, 'r2').activeKey).toBe('r2')
  })

  test('re-click keeps selection unless canCancelReason', () => {
    const s = toggleReason(INITIAL_REASON_STATE, 'r1')
    expect(toggleReason(s, 'r1')).toEqual({ activeKey: 'r1', showOtherText: false })
    const cancelled = toggleReason(s, 'r1', true)
    expect(cancelled).toEqual({ activeKey: '', showOtherText: false })
    expect(toggleReason(cancelled, 'r1', true).activeKey).toBe('r1')
  })

  test('other shows the text area, switching away hides it', () => {
    const s = toggleReason(INITIAL_REASON_STATE, 'other')
    expect(s.showOtherText).toBe(true)
    expect(toggleReason(s, 'other').showOtherText).toBe(true)
    expect(toggleReason(s, 'other', true).showOtherText).toBe(false)
    expect(toggleReason(s, 'r2').showOtherText).toBe(false)
  })
})

describe('buildSubmitPayload', () => {
  test('returns the selected reason', () => {
    expect(buildSubmitPayload(reasons, 'r2', 'ignored')).toEqual({ reason: reasons[1], text: '' })
  })
  test('keeps text only for other', () => {
    expect(buildSubmitPayload(reasons, 'other', 'hello')).toEqual({ reason: reasons[2], text: 'hello' })
  })
  test('nothing selected', () => {
    expect(buildSubmitPayload(reasons, '', 'x')).toEqual({ reason: undefined, text: '' })
    expect(buildSubmitPayload(undefined, 'r1', '')).toEqual({ reason: undefined, text: '' })
  })
})
