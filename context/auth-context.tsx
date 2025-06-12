"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import { baseApi, identityPath } from "@/lib/axios";
import { IUser } from "@/types/user";

const AUTH_PATH = `${identityPath}/system_users`;
const OTP_PATH = `${identityPath}/otp`;

const AuthApi = {
  urlPreLogin: `${AUTH_PATH}/pre_login`,
  urlLogin: `${AUTH_PATH}/login`,
  urlAuthenticate: `${AUTH_PATH}/me`,
  urlLogout: `${AUTH_PATH}/logout`,
  urlSendOTP: `${OTP_PATH}/create`,
  urlVerifyOTP: `${OTP_PATH}/verify`,
};

interface LoginData {
  email: string;
  password: string;
  captchaToken: string;
}

interface PayloadLogin {
  email: string;
  password: string;
  userId: string;
}

interface AuthContextType {
  payloadLogin: PayloadLogin;
  user: IUser | null;
  step: "login" | "verify";
  loadingLogin: boolean;
  loadingSendOTP: boolean;
  loadingVerify: boolean;
  errorLogin: string;
  codeVerification: string;
  setCodeVerification: (v: string) => void;
  setStep: (v: "login" | "verify") => void;
  handleLogin: (data: LoginData) => Promise<void>;
  handleVerify: () => Promise<void>;
  handleRetryOTP: () => Promise<void>;
  handleLogout: () => void;
  handleBackLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [payloadLogin, setPayloadLogin] = useState<PayloadLogin>({
    email: "",
    password: "",
    userId: "",
  });

  const [user, setUser] = useState<IUser | null>(null);
  const [step, setStep] = useState<"login" | "verify">("login");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSendOTP, setLoadingSendOTP] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [codeVerification, setCodeVerification] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  async function getMe() {
    return baseApi<IUser>({
      url: AuthApi.urlAuthenticate,
      method: "GET",
    });
  }

  async function preLogin(data: {
    email: string;
    password: string;
    captchaToken: string;
  }) {
    return baseApi<{ userId: string; email: string; otpType: string }>({
      url: AuthApi.urlPreLogin,
      method: "POST",
      data: { ...data, system: "identity" },
    });
  }

  function login(otpToken: string, userId: string) {
    return baseApi<{
      refreshToken: string;
      accessToken: string;
      userId: string;
    }>({
      url: AuthApi.urlLogin,
      method: "POST",
      headers: { "otp-token-email": otpToken },
      data: { userId },
    });
  }

  async function sendOTP(data: {
    type: "email" | "sms";
    userId: string;
    scenario: string;
  }) {
    try {
      await baseApi({
        url: AuthApi.urlSendOTP,
        method: "POST",
        data,
        headers: { "x-user-id": data.userId },
      });
      toast.success("Gửi mã OTP thành công");
    } catch {
      toast.error("Gửi mã OTP không thành công");
    }
  }

  function verifyOTP(data: {
    type: "email" | "sms";
    userId: string;
    otpCode: string;
    scenario: string;
  }) {
    return baseApi<{ otpToken: string }>({
      url: AuthApi.urlVerifyOTP,
      method: "POST",
      data,
      headers: { "x-user-id": data.userId },
    });
  }

  const handleVerify = async () => {
    try {
      setLoadingVerify(true);
      const { otpToken } = await verifyOTP({
        type: "email",
        userId: payloadLogin.userId,
        otpCode: codeVerification,
        scenario: "login",
      });

      const response = await login(otpToken, payloadLogin.userId);

      Cookies.set("access_token", response.accessToken);
      Cookies.set("refresh_token", response.refreshToken);
      Cookies.set("user_id", response.userId);

      const data = await getMe();
      setUser(data);
      toast.success("Đăng nhập thành công");
    } catch (error: any) {
      setUser(null);
      setErrorLogin(error?.message || "Đăng nhập không thành công");
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleRetryOTP = async () => {
    try {
      setLoadingSendOTP(true);
      await sendOTP({
        type: "email",
        userId: payloadLogin.userId,
        scenario: "login",
      });
    } finally {
      setLoadingSendOTP(false);
    }
  };

  const handleLogin = async (data: LoginData) => {
    setLoadingLogin(true);
    try {
      const { userId, email: preEmail } = await preLogin(data);
      await sendOTP({ type: "email", userId, scenario: "login" });

      setPayloadLogin({ email: preEmail, userId, password: data.password });
      setStep("verify");
    } catch (err: any) {
      setErrorLogin(err?.message || "Đăng nhập không thành công");
    } finally {
      setLoadingLogin(false);
    }
  };

  function handleLogout() {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_id");
    setUser(null);
    toast.success("Đã đăng xuất");
  }

  function handleBackLogin() {
    setUser(null);
    setCodeVerification("");
    setErrorLogin("");
    setLoadingLogin(false);
    setLoadingVerify(false);
    setLoadingSendOTP(false);
    setStep("login");
  }

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        payloadLogin,
        user,
        step,
        loadingLogin,
        loadingSendOTP,
        loadingVerify,
        errorLogin,
        codeVerification,
        setCodeVerification,
        setStep,
        handleLogin,
        handleVerify,
        handleRetryOTP,
        handleLogout,
        handleBackLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
