"use client";

import { useState } from "react";
import { useGlobalModal } from "./modal-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  onSuccess: () => void;
}

export const LoginModal = ({ onSuccess }: Props) => {
  const { login } = useAuth();
  const { closeModal } = useGlobalModal();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const success = login(username, password);
    if (success) {
      closeModal();
      onSuccess();
    } else {
      setError("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button className="w-full" onClick={handleSubmit}>
        Đăng nhập
      </Button>
    </div>
  );
};
