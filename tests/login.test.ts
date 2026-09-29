import { describe, expect, test } from 'bun:test'
import {
  createCountdown,
  isEmail,
  isLoginReady,
  isPhone,
  isTelOrMail,
} from '../src/packages/login/utils'

describe('login validation', () => {
  test('isPhone', () => {
    expect(isPhone('13800138000')).toBe(true)
    expect(isPhone(' 13800138000 ')).toBe(true)
    expect(isPhone('12800138000')).toBe(false)
    expect(isPhone('1380013800')).toBe(false)
    expect(isPhone('138001380001')).toBe(false)
    expect(isPhone('')).toBe(false)
    expect(isPhone(undefined)).toBe(false)
  })

  test('isEmail', () => {
    expect(isEmail('a@b.com')).toBe(true)
    expect(isEmail('foo.bar@jd.com.cn')).toBe(true)
    expect(isEmail('a@b')).toBe(false)
    expect(isEmail('a b@c.com')).toBe(false)
    expect(isEmail(null)).toBe(false)
  })

  test('isTelOrMail', () => {
    expect(isTelOrMail('13800138000')).toBe(true)
    expect(isTelOrMail('a@b.com')).toBe(true)
    expect(isTelOrMail('abc')).toBe(false)
  })
})

describe('isLoginReady', () => {
  test('pwd mode needs account and password', () => {
    expect(isLoginReady({ loginType: 'pwd', account: 'a', password: 'p' })).toBe(true)
    expect(isLoginReady({ loginType: 'pwd', account: 'a', password: '' })).toBe(false)
    expect(isLoginReady({ loginType: 'pwd', account: '', password: 'p' })).toBe(false)
  })

  test('pwd mode without password input only needs account', () => {
    expect(isLoginReady({ loginType: 'pwd', account: 'a', isShowPwdInput: false })).toBe(true)
    expect(isLoginReady({ loginType: 'pwd', account: '', isShowPwdInput: false })).toBe(false)
  })

  test('verify mode needs telOrMail and verify', () => {
    expect(isLoginReady({ loginType: 'verify', telOrMail: 't', verify: '1' })).toBe(true)
    expect(isLoginReady({ loginType: 'verify', telOrMail: 't' })).toBe(false)
    // pwd fields are irrelevant in verify mode
    expect(isLoginReady({ loginType: 'verify', account: 'a', password: 'p' })).toBe(false)
  })

  test('protocol must be checked when present', () => {
    const base = { loginType: 'verify' as const, telOrMail: 't', verify: '1', needProtocol: true }
    expect(isLoginReady({ ...base, protocolChecked: false })).toBe(false)
    expect(isLoginReady({ ...base, protocolChecked: true })).toBe(true)
  })
})

/** 手动推进的假定时器 */
const fakeTimer = () => {
  let seq = 0
  const timers = new Map<number, () => void>()
  return {
    setInterval: (fn: () => void) => {
      seq += 1
      timers.set(seq, fn)
      return seq
    },
    clearInterval: (id: number) => {
      timers.delete(id)
    },
    tick: () => [...timers.values()].forEach((fn) => fn()),
    size: () => timers.size,
  }
}

describe('createCountdown', () => {
  test('ticks from duration down to 1 then ends', () => {
    const timer = fakeTimer()
    const ticks: number[] = []
    let ended = 0
    const cd = createCountdown({
      duration: 3,
      onTick: (n) => ticks.push(n),
      onEnd: () => (ended += 1),
      timer,
    })
    expect(cd.isRunning()).toBe(false)
    cd.start()
    expect(cd.isRunning()).toBe(true)
    expect(ticks).toEqual([3])
    timer.tick()
    timer.tick()
    expect(ticks).toEqual([3, 2, 1])
    expect(ended).toBe(0)
    timer.tick()
    expect(ended).toBe(1)
    expect(cd.isRunning()).toBe(false)
    expect(cd.getRemaining()).toBe(0)
    expect(timer.size()).toBe(0)
  })

  test('stop cancels without onEnd; restart does not stack timers', () => {
    const timer = fakeTimer()
    let ended = 0
    const cd = createCountdown({ duration: 5, onEnd: () => (ended += 1), timer })
    cd.start()
    cd.start()
    expect(timer.size()).toBe(1)
    cd.stop()
    expect(cd.isRunning()).toBe(false)
    expect(timer.size()).toBe(0)
    expect(ended).toBe(0)
  })

  test('non-positive duration ends immediately', () => {
    const timer = fakeTimer()
    let ended = 0
    const cd = createCountdown({ duration: 0, onEnd: () => (ended += 1), timer })
    cd.start()
    expect(ended).toBe(1)
    expect(cd.isRunning()).toBe(false)
  })
})
