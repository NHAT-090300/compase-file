export interface IUser {
  id: string;
  address: string;
  builtIn: boolean;
  createdAt: Date;
  defaultOtpType: string;
  email: string;
  emailVerified: boolean;
  lastPasswordUpdate: Date;
  locale: string;
  name: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  description: string;
  role: {
    builtIn: boolean;
    description: string;
    id: string;
    level: number;
    name: string;
    permissions: string[];
  };
  walletAddress: string;
}
