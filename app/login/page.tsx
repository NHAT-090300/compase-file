"use client";

import { z } from "zod";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { If } from "@/components/custom/condition";
import { SliderCaptchaBox } from "@/components/custom/slider-captcha";
import { FolderInput } from "@/components/custom/folder-input";

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

const LoginPage = () => {
  const [error, setError] = useState("");

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      captchaToken: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login:", data);
    // call API here
  };

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(selected);
  };

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setUploading(false);
    alert(result.success ? "Upload thành công!" : "Lỗi upload");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="space-y-4">
          <Link href="/" className="mx-auto">
            <img
              className="cursor-pointer h-6 md:h-8"
              src="/logo_risegate.svg"
              alt="risegate"
            />
          </Link>

          <h1 className="text-2xl font-bold text-center">
            Đăng nhập bằng tài khoản của bạn
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={cn(
                  "focus:outline-none focus-visible:ring-0",
                  errors.email && "border-red-500"
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={cn(
                  "focus:outline-none focus-visible:ring-0",
                  errors.password && "border-red-500"
                )}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <SliderCaptchaBox
              onVerifySuccess={(token) => setValue("captchaToken", token)}
              warning={Boolean(errors.captchaToken?.message)}
            />

            <If
              condition={error?.length > 0}
              Then={
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        Kiểm tra thất bại
                      </h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              }
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card> */}

      <Card className="p-4">
        <CardContent>
          <FolderInput
            type="file"
            multiple
            onChange={handleChange}
            className="mb-2"
          />
          <Button onClick={handleUpload} disabled={uploading || !files.length}>
            {uploading ? "Uploading..." : "Upload Folder"}
          </Button>

          <ul className="mt-4 text-sm">
            {files.map((file, idx) => (
              <li key={idx}>{(file as any).webkitRelativePath || file.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
