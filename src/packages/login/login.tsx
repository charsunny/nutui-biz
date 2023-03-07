import React, {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { useConfig } from "@/packages/configprovider";
import { cn2 } from "@/utils/bem";
import { IComponent } from "@/utils/typings";
import {
  Input,
  Button,
  ButtonProps,
  Icon,
  Checkbox,
  Toast,
} from "@nutui/nutui-react";

export interface LoginParamsProps {
  account?: string;
  accountPlaceholder?: string;
  accountErrorText?: string;
  telOrMail?: string | any;
  telOrMailPlaceholder?: string;
  telOrMailErrorText?: string;
  password?: string | any;
  passwordPlaceholder?: string;
  passwordErrorText?: string;
  isShowPwdInput?: boolean;
  verify?: string;
  verifyPlaceholder?: string;
  verifyButtonText?: string;
  verifyErrorText?: string;
  getCodeErrorToast?: string;
  switchLoginText1?: string;
  switchLoginText2?: string;
  forgetPwdText?: string;
  [key: string]: any;
}
export interface LoginProps extends IComponent {
  logo: string;
  title: string;
  formParams: LoginParamsProps;
  loginType: string;
  loginButtonDisable: boolean;
  loginButtonText: string;
  hasForgetPassWord: boolean;
  slotProtocolText?: ReactNode;
  slotBottom?: ReactNode;
  hasHidePwd?: boolean;
  isGetCode?: boolean;
  countDownTime?: number;
  isHideSwitchBtn?: boolean;
  slotInput?: ReactNode;
  buttonProps?: ButtonProps;
  onInputChange?: (value: string, tag: string) => void;
  onLoginBtnClick?: (data: LoginParamsProps) => void;
  onVerifyBtnClick?: (formData: LoginParamsProps) => void;
  onForgetBtnClick?: () => void;
  onInputClear?: (tag: string) => void;
  onLoginTypeClick?: () => void;
}

const defaultProps = {
  logo: "",
  title: "",
  formParams: {},
  loginType: "verify",
  loginButtonDisable: true,
  loginButtonText: "登录",
  verifyButtonDisable: false,
  isGetCode: false,
  hasForgetPassWord: true,
  hasHidePwd: true,
  isHideSwitchBtn: false,
  countDownTime: 60,
} as LoginProps;

export const Login: FunctionComponent<
  Partial<LoginProps> & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">
> = (props) => {
  const { locale } = useConfig();
  const {
    className,
    style,
    logo,
    title,
    formParams,
    loginType,
    loginButtonDisable,
    loginButtonText = locale.login.loginButtonText,
    hasForgetPassWord,
    hasHidePwd,
    isGetCode,
    slotProtocolText,
    slotBottom,
    countDownTime = 60,
    isHideSwitchBtn,
    slotInput,
    buttonProps,
    onInputChange,
    onLoginBtnClick,
    onVerifyBtnClick,
    onForgetBtnClick,
    onInputClear,
    onLoginTypeClick,
  } = {
    ...defaultProps,
    ...props,
  };
  let [countTime, setCountTime] = useState(countDownTime);
  const [inCountDown, setInCountDown] = useState(false);
  const [isHidePwd, setIsHidePwd] = useState(true);
  const [isLoginDisable, setIsLoginDisable] = useState(loginButtonDisable);
  const [currLoginType, setCurrLoginType] = useState(loginType);
  const [isProtocol, setIsPrtocal] = useState(false);
  let timer: any = useRef(null);

  useEffect(() => {
    //初始化数据
    setLoginParams({ ...loginParams, ...formParams });
  }, [formParams]);
  //监听登录按钮是否禁用
  useEffect(() => {
    setIsLoginDisable(loginButtonDisable);
  }, [loginButtonDisable]);

  const [loginParams, setLoginParams] = useState<LoginParamsProps>({
    account: "",
    accountPlaceholder: locale.login.accountPlaceholder,
    accountErrorText: "",
    telOrMail: "",
    telOrMailPlaceholder: locale.login.telOrMailPlaceholder,
    telOrMailErrorText: "",
    password: "",
    passwordPlaceholder: locale.login.passwordPlaceholder,
    passwordErrorText: "",
    isShowPwdInput: true,
    verify: "",
    verifyPlaceholder: locale.login.verifyPlaceholder,
    verifyButtonText: locale.login.verifyButtonText,
    verifyErrorText: "",
    getCodeErrorToast: locale.login.getCodeErrorToast,
    switchLoginText1: locale.login.switchLoginText1,
    switchLoginText2: locale.login.switchLoginText2,
    forgetPwdText: locale.login.forgetPwdText,
  });

  const switchLogin = () => {
    if (currLoginType === "pwd") {
      setCurrLoginType("verify");
      resetParams();
    } else {
      setCurrLoginType("pwd");
      resetParams();
    }
    onLoginTypeClick && onLoginTypeClick();
  };
  //重置
  const resetParams = () => {
    const clearObj = {
      account: "",
      accountErrorText: "",
      telOrMail: "",
      telOrMailErrorText: "",
      password: "",
      passwordErrorText: "",
      verify: "",
      verifyErrorText: "",
    };
    setLoginParams({ ...loginParams, ...clearObj });
    setIsPrtocal(false);
    clearInterval(timer.current);
    setInCountDown(false);
    setCountTime(countDownTime);
  };
  useEffect(() => {
    const { account, telOrMail, password, verify, isShowPwdInput } =
      loginParams;
    //登录状态可点击情况
    let status1 =
      currLoginType === "pwd" &&
      account != "" &&
      password != "" &&
      isShowPwdInput;
    let status2 = currLoginType === "pwd" && account != "" && !isShowPwdInput;
    let status3 = currLoginType === "verify" && telOrMail != "" && verify != "";
    //用户自定义输入框slotInput时，登录按钮是否可点击用户控制
    if (slotProtocolText) {
      if ((status1 || status2 || status3) && isProtocol && !slotInput) {
        setIsLoginDisable(false);
        return;
      }
    } else {
      if ((status1 || status2 || status3) && !slotInput) {
        setIsLoginDisable(false);
        return;
      }
    }
    !slotInput && setIsLoginDisable(true);
  }, [loginParams, slotProtocolText, isProtocol, slotInput]);

  const inputOnChange = (value: any, tag: string) => {
    let params: any = { ...loginParams };
    params[tag] = value;
    setLoginParams({ ...loginParams, ...params });
    onInputChange && onInputChange(value, tag);
  };

  // 获取验证码
  const getCode = () => {
    const { telOrMail, getCodeErrorToast } = loginParams;
    //校验手机号和邮箱
    if (telOrMail.length) {
      onVerifyBtnClick && onVerifyBtnClick(loginParams);
    } else {
      Toast.text(getCodeErrorToast, { duration: 2 });
    }
  };
  useEffect(() => {
    if (isGetCode && countDownTime) {
      setCountTime(countDownTime);
      countDown(countDownTime);
    }
  }, [isGetCode]);

  // 倒计时
  const countDown = (time: number) => {
    setInCountDown(true);
    timer.current = setInterval(() => {
      setCountTime(countTime--);
      if (countTime < 10) {
        setCountTime(countTime);
        if (countTime == 0) {
          clearInterval(timer.current);
          setInCountDown(false);
          setCountTime(time);
        }
      }
    }, 1000);
  };

  const forgetClick = () => {
    onForgetBtnClick && onForgetBtnClick();
  };

  const loginClick = () => {
    onLoginBtnClick && onLoginBtnClick(loginParams);
  };
  const inputClear = (tag: string) => {
    let params: any = loginParams;
    params[tag] = "";
    onInputClear && onInputClear(tag);
    setLoginParams({ ...loginParams, ...params });
  };

  const isError = (tag: string) => {
    let name = tag + "ErrorText";
    return loginParams[name] != "";
  };

  const inputTpl = (tag: string) => {
    let placeholder = tag + "Placeholder";
    let errorText = tag + "ErrorText";

    return (
      <div className={`input-wrap ${isError(tag) ? "error" : ""}`}>
        <div className="input-item">
          <Input
            className="nut-input-text"
            border={false}
            defaultValue={loginParams[tag]}
            name={tag}
            placeholder={loginParams[placeholder]}
            type={isHidePwd && tag === "password" ? "password" : "text"}
            clearable
            onChange={(e) => {
              inputOnChange(e, tag);
            }}
            onClear={() => {
              inputClear(tag);
            }}
          />
          {tag === "password" && hasHidePwd ? (
            <div
              className="pwd-hide-icon"
              onClick={() => {
                setIsHidePwd(!isHidePwd);
              }}
            >
              <Icon
                name={isHidePwd ? "marshalling" : "eye"}
                size="14"
                color={isHidePwd ? "#ccc" : "#666"}
              />
            </div>
          ) : null}
          {tag === "verify" &&
            (!inCountDown ? (
              <div className="code-box" onClick={getCode}>
                {loginParams.verifyButtonText}
              </div>
            ) : (
              <div className="code-box disabled">
                <div className="counts">{countTime}s</div>
              </div>
            ))}
        </div>
        {tag === "password" && hasForgetPassWord ? (
          <div className="forget-pwd" onClick={forgetClick}>
            {loginParams.forgetPwdText}
          </div>
        ) : null}
        {loginParams[errorText] ? (
          <div className="error-msg">{loginParams[errorText]}</div>
        ) : null}
      </div>
    );
  };

  const b = cn2("login");
  return (
    <div className={`${b()} ${className}`} style={style}>
      {logo ? (
        <div className={`${b("logo")}`}>
          <img src={logo} />
        </div>
      ) : null}
      {title ? <div className={`${b("title")}`}>{title}</div> : null}
      <div className={`${b("content")}`}>
        {currLoginType == "pwd" ? (
          <>
            {inputTpl("account")}
            {loginParams.isShowPwdInput && inputTpl("password")}
          </>
        ) : (
          <>
            {inputTpl("telOrMail")}
            {inputTpl("verify")}
          </>
        )}
        {slotInput ? slotInput : null}
        {slotProtocolText && (
          <Checkbox
            className="login-protocal"
            iconSize={14}
            checked={isProtocol}
            onChange={(state) => {
              setIsPrtocal(state);
            }}
          >
            {slotProtocolText}
          </Checkbox>
        )}
      </div>
      <div className={`${b("btn")}`}>
        <Button
          block
          type="danger"
          shape="square"
          disabled={isLoginDisable}
          onClick={loginClick}
          {...buttonProps}
        >
          {loginButtonText}
        </Button>
      </div>
      {!isHideSwitchBtn && (
        <div className="switch-type" onClick={switchLogin}>
          {currLoginType === "verify"
            ? loginParams.switchLoginText1
            : loginParams.switchLoginText2}
        </div>
      )}
      {slotBottom && <div className="custom-slot">{slotBottom}</div>}
    </div>
  );
};

Login.defaultProps = defaultProps;
Login.displayName = "NutLogin";
