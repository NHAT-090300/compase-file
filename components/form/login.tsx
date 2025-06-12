import { useForm } from "react-hook-form";
import { XCircle } from "lucide-react";
import * as yup from "yup";

import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { If } from "../custom/condition";
import { SliderCaptchaBox } from "../custom/slider-captcha";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu ít nhất 6 ký tự"),
  captchaToken: yup.string().required("Vui lòng xác nhận captcha"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

export const LoginForm = () => {
  const {
    handleLogin,
    loadingLogin,
    loadingSendOTP,
    loadingVerify,
    errorLogin,
    step,
    setCodeVerification,
    codeVerification,
    handleRetryOTP,
    handleVerify,
    payloadLogin,
    handleBackLogin,
  } = useAuth();

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "", captchaToken: "" },
  });

  if (step === "verify") {
    return (
      <div className="bg-white rounded-md p-6 space-y-3 w-96 shadow-lg flex-shrink-0 h-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Xác thực email</h2>
        {loadingSendOTP ? (
          <h5 className="text-center mb-4" style={{ color: "#5e5e5e" }}>
            Đang gửi mã xác thực...
          </h5>
        ) : (
          <h5 className="text-center mb-4" style={{ color: "#5e5e5e" }}>
            Mã xác thực đã được gửi về {payloadLogin.email}
          </h5>
        )}
        <p className="mb-1">
          <strong>Mã xác thực</strong> (Hết hiệu lực trong 15 phút)
        </p>

        <Input
          disabled={loadingVerify || loadingSendOTP}
          type="text"
          onChange={(e) => setCodeVerification(e.target.value)}
          value={codeVerification}
        />

        <Button
          className="w-full"
          disabled={loadingVerify || loadingSendOTP}
          onClick={handleVerify}
        >
          {loadingVerify ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang xác thực...
            </>
          ) : (
            <>Xác thực ngay</>
          )}
        </Button>

        <Button
          disabled={loadingVerify || loadingSendOTP}
          className="w-full"
          variant="outline"
          type="button"
          onClick={handleRetryOTP}
        >
          {loadingSendOTP ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang gửi lại mã xác thực...
            </>
          ) : (
            <>Gửi lại mã xác thực</>
          )}
        </Button>
        <Button
          disabled={loadingVerify || loadingSendOTP}
          className="w-full"
          variant="outline"
          type="button"
          onClick={handleBackLogin}
        >
          Quay về
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="bg-white rounded-md p-6 space-y-3 w-96 shadow-lg flex-shrink-0 h-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email")}
          disabled={loadingLogin}
          id="email"
          type="email"
          className={cn(
            "focus:outline-none focus-visible:ring-0",
            errors.email && "border-red-500"
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          {...register("password")}
          disabled={loadingLogin}
          id="password"
          type="password"
          className={cn(
            "focus:outline-none focus-visible:ring-0",
            errors.password && "border-red-500"
          )}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <SliderCaptchaBox
        onVerifySuccess={(token) => setValue("captchaToken", token)}
        warning={Boolean(errors.captchaToken?.message)}
      />

      <If
        condition={Boolean(errorLogin)}
        Then={
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Kiểm tra thất bại
                </h3>
                <p className="text-sm text-red-700 mt-1">{errorLogin}</p>
              </div>
            </div>
          </div>
        }
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || loadingLogin}
      >
        {isSubmitting || loadingLogin ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
};
