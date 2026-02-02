"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, Loader2, Scan } from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";
import { useLogoutMutation } from "@/services/auth.service";
import { signOut } from "next-auth/react";
import LanguageSwitcher from "./components/LanguageSwitcher";

// --- TIPE & DICTIONARY TRANSLASI ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface HeaderTranslations {
  hi: string;
  pilihOutlet: string;
  outletPusat: string;
}

const HEADER_TEXT: Record<LocaleCode, HeaderTranslations> = {
  id: {
    hi: "Hai,",
    pilihOutlet: "Pilih Outlet",
    outletPusat: "Outlet Pusat Jakarta",
  },
  en: {
    hi: "Hi,",
    pilihOutlet: "Select Outlet",
    outletPusat: "Jakarta Central Outlet",
  },
  ar: {
    hi: "مرحباً،",
    pilihOutlet: "اختر الفرع",
    outletPusat: "فرع جاكرتا الرئيسي",
  },
  fr: {
    hi: "Salut,",
    pilihOutlet: "Choisir un point de vente",
    outletPusat: "Point de vente central de Jakarta",
  },
  kr: {
    hi: "안녕,",
    pilihOutlet: "매장 선택",
    outletPusat: "자카르타 중앙 매장",
  },
  jp: {
    hi: "こんにちは、",
    pilihOutlet: "店舗を選択",
    outletPusat: "ジャカルタ中央店",
  },
};

interface HeaderProps {
  onScanClick: () => void;
}

export default function Header({ onScanClick }: HeaderProps) {
  const { locale } = useI18n();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // State untuk waktu (AM/PM) dan mounting check
  const [isPm, setIsPm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Safe Locale Access
  const safeLocale = (
    HEADER_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = HEADER_TEXT[safeLocale];

  useEffect(() => {
    // Set mounted true untuk menghindari hydration mismatch pada image
    setMounted(true);

    // Cek waktu saat ini
    const hours = new Date().getHours();
    // PM dianggap dari jam 12 siang sampai 11:59 malam
    setIsPm(hours >= 12 && hours < 24);

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await signOut({ callbackUrl: "/auth/login", redirect: true });
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full max-w-md mx-auto rounded-b-xl relative overflow-hidden border-b border-[#896b41]/10 transition-all duration-500 ease-in-out ${
        isPm
          ? "bg-gradient-to-b from-[#0f172a] to-[#1e293b]" // Night: Dark Gradient
          : "bg-gradient-to-b from-sky-200/50 via-white/95 to-white/95 backdrop-blur-md" // Day: Blue top gradient to white
      }`}
    >
      {/* --- DEKORASI BACKGROUND (SUN/MOON + CLOUD) --- */}
      {mounted && (
        <div className="absolute top-0 left-0 w-[140px] h-[100px] pointer-events-none select-none z-0">
          {/* Gambar Utama: Moon (PM) atau Sun (AM) */}
          <div className="absolute -top-4 -left-4 w-[90px] h-[90px]">
            <Image
              src={isPm ? "/images/moon.png" : "/images/sun.png"}
              alt={isPm ? "Moon" : "Sun"}
              fill
              className="object-contain opacity-90"
              priority
            />
          </div>

          {/* Gambar Awan */}
          <div className="absolute top-[35px] left-[45px] w-[50px] h-[35px]">
            <Image
              src="/images/cloud.png"
              alt="Cloud"
              fill
              className="object-contain opacity-95"
            />
          </div>
          <div className="absolute top-[10px] left-[2px] w-[50px] h-[35px]">
            <Image
              src="/images/cloud2.png"
              alt="Cloud"
              fill
              className="object-contain opacity-95"
            />
          </div>
          <div className="absolute top-[40px] left-0 w-[50px] h-[35px]">
            <Image
              src="/images/cloud3.png"
              alt="Cloud"
              fill
              className="object-contain opacity-95"
            />
          </div>
        </div>
      )}

      {/* Konten Header */}
      <div className="max-w-md mx-auto px-4 pt-5 pb-4 relative z-10">
        {/* Baris Atas: Sapaan & Logout */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 font-comfortaa pl-16">
            <span
              className={`text-sm font-medium transition-colors ${
                isPm ? "text-gray-200" : "text-gray-500"
              }`}
            >
              {t.hi}
            </span>
            <span
              className={`text-sm font-bold transition-colors ${
                isPm ? "text-green-300" : "text-[#3b5e40]"
              }`}
            >
              Guest
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 bg-white/90 rounded-full shadow-sm border border-[#896b41]/10 text-red-500 active:scale-95 transition-all hover:bg-red-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Floating Card: Outlet & Scan */}
        <div className="relative flex items-center bg-[#faf4e6] rounded-2xl border border-[#896b41]/20 shadow-sm overflow-hidden">
          {/* Bagian Pilih Outlet */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex-1 flex items-center justify-between px-4 py-2 outline-none group"
          >
            <div className="flex items-center gap-3">
              {/* Logo Brand */}
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-inner border border-[#896b41]/10 overflow-hidden">
                <Image
                  src="/ibadahapp-logo.png"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="text-[#3b5e40] font-bold text-sm font-comfortaa">
                {t.pilihOutlet}
              </span>
            </div>

            <div
              className={`p-1 rounded-full border border-[#896b41]/30 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="w-3 h-3 text-[#896b41]" />
            </div>
          </button>

          {/* Divider */}
          <div className="h-10 w-[1px] bg-[#896b41]/10"></div>

          {/* Tombol Scan (Aksen Merah Soft) */}
          <button
            className="px-5 py-4 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors group"
            onClick={onScanClick}
          >
            <Scan className="w-6 h-6 text-red-600 transition-transform group-active:scale-90" />
          </button>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#896b41]/20 rounded-xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-1"
            >
              <div
                className="px-4 py-3 hover:bg-[#faf4e6] rounded-lg cursor-pointer transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <p className="text-xs font-bold text-[#3b5e40]">
                  {t.outletPusat}
                </p>
                <p className="text-[10px] text-gray-500 font-comfortaa">
                  Jl. Contoh Alamat No. 123
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}