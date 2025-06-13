"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Upload, Shield, CheckCircle, ArrowRight } from "lucide-react";

export default function GuidePage() {
  const steps = [
    // {
    //   number: "01",
    //   title: "Kết nối ví Web3",
    //   description:
    //     "Kết nối ví Web3 của bạn (MetaMask hoặc Coinbase Wallet) để truy cập các tính năng trên blockchain.",
    //   icon: Wallet,
    //   color: "from-blue-500 to-indigo-600",
    //   bgColor: "from-blue-50 to-indigo-50",
    //   borderColor: "border-blue-200",
    // },
    {
      number: "01",
      title: "Phát hành tài liệu",
      description:
        "Hệ thống trích xuất 'sinh trắc học' tài liệu và lưu trữ blockchain phục vụ xác minh bản gốc.",
      icon: Upload,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
    },
    {
      number: "02",
      title: "Xác thực tài liệu",
      description:
        "Tải file cần xác thực để đối chiếu 'Sinh trắc học' với bản gốc",
      icon: Shield,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hướng dẫn sử dụng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Làm theo các bước đơn giản sau để bắt đầu sử dụng hệ thống trích
            xuất "sinh trắc học" tài liệu và Xác thực tài liệu của chúng tôi
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div
                    className={`lg:w-1/3 bg-gradient-to-br ${step.bgColor} p-8 flex items-center justify-center`}
                  >
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.color} rounded-full mb-4`}
                      >
                        <step.icon className="h-10 w-10 text-white" />
                      </div>
                      <div className="text-6xl font-bold text-gray-300 mb-2">
                        {step.number}
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-2/3 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {index === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Tải ví Web3
                            </p>
                            <p className="text-gray-600 text-sm">
                              Tải ví Web3{" "}
                              <a
                                className="text-blue-600 hover:underline"
                                href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                                target="_blank"
                              >
                                MetaMask
                              </a>{" "}
                              hoặc{" "}
                              <a
                                className="text-blue-600 hover:underline"
                                href="https://chromewebstore.google.com/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad"
                                target="_blank"
                              >
                                Coinbase Wallet
                              </a>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Kết nối với mạng được hỗ trợ
                            </p>
                            <p className="text-gray-600 text-sm">
                              Sử dụng mạng MetaDAP Enterprise Block Chain
                              Moonnet (Devnet)
                            </p>
                            <ul className="text-sm text-gray-600 list-disc pl-5 mt-2">
                              <li>
                                <strong>Network name:</strong> MetaDAP
                                Enterprise Moonnet
                              </li>
                              <li>
                                <strong>Chain ID:</strong> 89359
                              </li>
                              <li>
                                <strong>Symbol:</strong> DAP
                              </li>
                              <li>
                                <strong>Network URL:</strong>
                                <span className="break-all">
                                  https://rpc.moonnet.chain.metadap.io
                                </span>
                              </li>
                              <li>
                                <strong>Block explorer URL:</strong>
                                <span className="break-all">
                                  https://explorer.moonnet.chain.metadap.io
                                </span>
                              </li>
                            </ul>
                            <p className="text-sm mt-2 text-red-500">
                              Lưu ý: MetaDAP Enterprise Moonnet là mạng chỉ sử
                              dụng với mục đích kiểm thử.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Nhận DAP Credit
                            </p>
                            <p className="text-gray-600 text-sm">
                              Try cập vào{" "}
                              <a
                                className="text-blue-600 hover:underline"
                                href="https://faucet.moonnet.chain.metadap.io "
                                target="_blank"
                              >
                                trang faucet
                              </a>{" "}
                              để nhận DAP Credit miễn phí
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Nhấn vào Kết nối Ví
                            </p>
                            <p className="text-gray-600 text-sm">
                              Phê duyệt kết nối trong Ví của bạn
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Nhấn vào "Phát hành tài liệu"
                            </p>
                            <p className="text-gray-600 text-sm">
                              Nhấn vào "Phát hành tài liệu" để truy cập vào
                              trang phát hành tài liệu
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Đăng nhập
                            </p>
                            <p className="text-gray-600 text-sm">
                              Đăng nhập vào màn hình "phát hành tài liệu" với
                              tài khoản được RiseGate cung cấp
                            </p>
                            {/* <ul className="text-sm text-gray-600 list-disc pl-5 mt-2">
                              <li>
                                <strong>Tên đăng nhập:</strong> risegate.io
                              </li>
                              <li>
                                <strong>Mật khẩu:</strong> risegate@2025
                              </li>
                            </ul> */}
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Chọn tài liệu cần phát hành
                            </p>
                            <p className="text-gray-600 text-sm">
                              Chọn file tài liệu cần phát hành trên thiết bị của
                              bạn (giới hạn 100MB)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Tải tài liệu lên Blockchain
                            </p>
                            <p className="text-gray-600 text-sm">
                              Nhấn vào nút "tải lên"
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Nhận xác nhận
                            </p>
                            <p className="text-gray-600 text-sm">
                              Ví Web3 sẽ hiển thị thông báo xác nhận giao dịch
                              và nhấn vào nút "xác nhận"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {index === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Nhấn vào "Xác thực tài liệu"
                            </p>
                            <p className="text-gray-600 text-sm">
                              Nhấn vào "Xác thực tài liệu" để truy cập vào trang
                              Xác thực tài liệu
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Chọn tài liệu cần xác thực
                            </p>
                            <p className="text-gray-600 text-sm">
                              Tải file tài liệu cần xác thực (giới hạn 100MB)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Hiển thị kết quả
                            </p>
                            <p className="text-gray-600 text-sm">
                              Nhận kết quả xác minh chi tiết và trạng thái xác
                              thực
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
