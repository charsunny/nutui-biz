// Login 的纯逻辑: 手机号 / 邮箱校验、登录按钮可用判断、验证码倒计时。不依赖 Taro / React。

/** 中国大陆 11 位手机号 */
export const PHONE_REGEXP = /^1[3-9]\d{9}$/
export const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isPhone = (value?: string | null): boolean =>
  PHONE_REGEXP.test(String(value ?? '').trim())

export const isEmail = (value?: string | null): boolean =>
  EMAIL_REGEXP.test(String(value ?? '').trim())

/** 获取验证码前的默认校验: 手机号或邮箱 */
export const isTelOrMail = (value?: string | null): boolean =>
  isPhone(value) || isEmail(value)

const filled = (value?: string | null) => String(value ?? '').length > 0

export interface LoginReadyState {
  loginType: 'verify' | 'pwd'
  account?: string
  password?: string
  telOrMail?: string
  verify?: string
  /** pwd 模式是否展示密码框, 默认 true */
  isShowPwdInput?: boolean
  /** 是否有隐私协议勾选项 */
  needProtocol?: boolean
  /** 隐私协议是否已勾选 */
  protocolChecked?: boolean
}

/**
 * 内置输入框模式下登录按钮是否可点:
 *   pwd:    账号非空 且 (不展示密码框 或 密码非空)
 *   verify: 手机/邮箱 与 验证码都非空
 * 有协议勾选项时还要求已勾选。
 */
export function isLoginReady(state: LoginReadyState): boolean {
  const { loginType, isShowPwdInput = true, needProtocol, protocolChecked } = state
  const inputsReady =
    loginType === 'pwd'
      ? filled(state.account) && (!isShowPwdInput || filled(state.password))
      : filled(state.telOrMail) && filled(state.verify)
  return inputsReady && (!needProtocol || !!protocolChecked)
}

export interface CountdownTimer {
  setInterval: (fn: () => void, ms: number) => any
  clearInterval: (id: any) => void
}

export interface CountdownOptions {
  /** 倒计时秒数 */
  duration: number
  /** 每秒回调剩余秒数 (开始时立即回调一次 duration) */
  onTick?: (remaining: number) => void
  /** 倒计时结束 (不含 stop() 主动停止) */
  onEnd?: () => void
  /** 可注入定时器, 便于测试 */
  timer?: CountdownTimer
}

export interface Countdown {
  start: () => void
  stop: () => void
  isRunning: () => boolean
  getRemaining: () => number
}

/** 秒级倒计时: duration, duration-1, ..., 1, 然后结束。重复 start 不会叠加定时器。 */
export function createCountdown(options: CountdownOptions): Countdown {
  const timer: CountdownTimer = options.timer ?? {
    setInterval: (fn, ms) => setInterval(fn, ms),
    clearInterval: (id) => clearInterval(id),
  }
  let id: any = null
  let remaining = 0

  const stop = () => {
    if (id !== null) timer.clearInterval(id)
    id = null
  }

  const start = () => {
    stop()
    remaining = Math.max(0, Math.floor(options.duration))
    if (remaining <= 0) {
      options.onEnd?.()
      return
    }
    options.onTick?.(remaining)
    id = timer.setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        stop()
        options.onEnd?.()
      } else {
        options.onTick?.(remaining)
      }
    }, 1000)
  }

  return {
    start,
    stop,
    isRunning: () => id !== null,
    getRemaining: () => remaining,
  }
}
