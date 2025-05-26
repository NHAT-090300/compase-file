"use client";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-4 w-full border-b pb-4 sm:pb-0 sm:border-none sm:w-auto justify-between">
            <a href="https://risegate.vn/" target="_blank">
              <img
                className="cursor-pointer h-6 md:h-8"
                src="/logo_risegate.svg"
                alt="risegate"
              />
            </a>
            <b className="text-red-600 text-sm md:text-base">
              Phiên bản thử nghiệm
            </b>
          </div>
          <div className="typography-h6 flex-1 text-right">
            <span className="text-[#9EA3AE] font-medium text-sm md:text-base">
              Powered by{" "}
            </span>
            <a href="https://risegate.vn/" target="_blank">
              <b className="text-[#4D5461] text-sm md:text-base">RiseGate</b>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
