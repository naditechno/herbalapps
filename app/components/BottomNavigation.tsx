"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home,
  LayoutGrid,
  Award,
  ShoppingBag,
  User,
  X,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface NavLabels {
  home: string;
  menu: string;
  vip: string;
  merch: string;
  profile: string;
  auth: string;
}

interface AuthTranslations {
  otherMethod: string;
  instantWa: string;
  waHelper: string;
  waHeader: string;
  phonePlaceholder: string;
  continue: string;
  or: string;
  google: string;
  forgotPassword: string; // Added Type
}

// --- DICTIONARIES ---
const NAV_TEXT: Record<LocaleCode, NavLabels> = {
  id: {
    home: "Beranda",
    menu: "Menu",
    vip: "VIP",
    merch: "Merch",
    profile: "Saya",
    auth: "Daftar atau Masuk",
  },
  en: {
    home: "Home",
    menu: "Menu",
    vip: "VIP",
    merch: "Merch",
    profile: "Me",
    auth: "Register or Login",
  },
  ar: {
    home: "الرئيسية",
    menu: "القائمة",
    vip: "كبار الشخصيات",
    merch: "سلع",
    profile: "أنا",
    auth: "سجل أو دخول",
  },
  fr: {
    home: "Accueil",
    menu: "Menu",
    vip: "VIP",
    merch: "Boutique",
    profile: "Moi",
    auth: "S'inscrire",
  },
  kr: {
    home: "홈",
    menu: "메뉴",
    vip: "VIP",
    merch: "굿즈",
    profile: "나",
    auth: "가입하기",
  },
  jp: {
    home: "ホーム",
    menu: "メニュー",
    vip: "VIP",
    merch: "グッズ",
    profile: "マイ",
    auth: "登録する",
  },
};

const AUTH_TEXT: Record<LocaleCode, AuthTranslations> = {
  id: {
    otherMethod: "Metode Lainnya",
    instantWa: "Masuk / Daftar Instan",
    waHelper: "BARU! Masuk atau Daftar instan dengan WhatsApp—tanpa ribet OTP!",
    waHeader: "WhatsApp Masuk / Daftar Instan",
    phonePlaceholder: "Nomor Handphone",
    continue: "Lanjut Konfirmasi",
    or: "ATAU",
    google: "Lanjutkan dengan Google",
    forgotPassword: "Lupa Password?",
  },
  en: {
    otherMethod: "Other Methods",
    instantWa: "Instant Login / Register",
    waHelper: "NEW! Instant Login or Register via WhatsApp—no OTP hassle!",
    waHeader: "WhatsApp Instant Login / Register",
    phonePlaceholder: "Phone Number",
    continue: "Continue Confirmation",
    or: "OR",
    google: "Continue with Google",
    forgotPassword: "Forgot Password?",
  },
  ar: {
    otherMethod: "طرق أخرى",
    instantWa: "دخول / تسجيل فوري",
    waHelper: "جديد! دخول أو تسجيل فوري عبر واتساب - بدون عناء رمز التحقق!",
    waHeader: "واتساب دخول / تسجيل فوري",
    phonePlaceholder: "رقم الهاتف",
    continue: "متابعة التأكيد",
    or: "أو",
    google: "الاستمرار مع جوجل",
    forgotPassword: "نسيت كلمة المرور؟",
  },
  fr: {
    otherMethod: "Autres méthodes",
    instantWa: "Connexion instantanée",
    waHelper:
      "NOUVEAU! Connexion ou inscription instantanée via WhatsApp—sans OTP!",
    waHeader: "WhatsApp Connexion / Inscription",
    phonePlaceholder: "Numéro de téléphone",
    continue: "Continuer la confirmation",
    or: "OU",
    google: "Continuer avec Google",
    forgotPassword: "Mot de passe oublié ?",
  },
  kr: {
    otherMethod: "다른 방법",
    instantWa: "즉시 로그인 / 가입",
    waHelper:
      "신규! OTP 번거로움 없이 WhatsApp으로 즉시 로그인 또는 가입하세요!",
    waHeader: "WhatsApp 즉시 로그인 / 가입",
    phonePlaceholder: "휴대폰 번호",
    continue: "확인 계속",
    or: "또는",
    google: "Google로 계속하기",
    forgotPassword: "비밀번호 찾기",
  },
  jp: {
    otherMethod: "他の方法",
    instantWa: "インスタントログイン / 登録",
    waHelper:
      "新機能！WhatsAppでインスタントログインまたは登録—OTPの手間なし！",
    waHeader: "WhatsApp インスタントログイン / 登録",
    phonePlaceholder: "携帯電話番号",
    continue: "確認を続ける",
    or: "または",
    google: "Googleで続ける",
    forgotPassword: "パスワードを忘れた場合",
  },
};

interface NavItem {
  href: string;
  key: keyof NavLabels;
  icon: React.ComponentType<{ className?: string }>;
}

export default function BottomNavigation() {
  const pathname = usePathname();
  const { locale } = useI18n();

  // Logic Session & Modal State
  const session = false;
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"selection" | "phone">("selection");
  const [phoneNumber, setPhoneNumber] = useState("");

  const safeLocale = (
    NAV_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;

  const t_nav = NAV_TEXT[safeLocale];
  const t_auth = AUTH_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const navItems: NavItem[] = [
    { href: "/", key: "home", icon: Home },
    { href: "/menu-list", key: "menu", icon: LayoutGrid },
    { href: "/vip", key: "vip", icon: Award },
    { href: "/merch", key: "merch", icon: ShoppingBag },
    { href: "/profile", key: "profile", icon: User },
  ];

  // Disable scroll when modal is open
  useEffect(() => {
    if (isAuthOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isAuthOpen]);

  // Reset view when closing
  const handleClose = () => {
    setIsAuthOpen(false);
    setTimeout(() => {
      setAuthView("selection");
      setPhoneNumber("");
    }, 300);
  };

  return (
    <>
      {/* --- AUTH MODAL / SHEET --- */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Modal Content */}
          <div className="w-full max-w-md mx-auto bg-white rounded-t-2xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            {/* Close Button (Absolute Top Right) */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="p-5 pt-8 pb-10">
              {/* VIEW 1: SELECTION */}
              {authView === "selection" && (
                <div className="space-y-4">
                  {/* Tombol Metode Lainnya */}
                  <button
                    onClick={() => setAuthView("phone")}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#d0aa47] rounded-lg group active:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-[#3b5e40]">
                      {t_auth.otherMethod}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-[#3b5e40] ${
                        isRtl ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Tombol WhatsApp (Highlight) */}
                  <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg px-4 py-3 flex items-center justify-center gap-3 shadow-md active:scale-[0.98] transition-all">
                    <MessageCircle className="w-6 h-6 fill-white" />
                    <span className="font-bold text-base">
                      {t_auth.instantWa}
                    </span>
                  </button>

                  {/* Helper Text */}
                  <p className="text-center text-xs text-gray-500 leading-relaxed px-4">
                    {t_auth.waHelper}
                  </p>
                </div>
              )}

              {/* VIEW 2: PHONE INPUT & GOOGLE */}
              {authView === "phone" && (
                <div className="animate-in slide-in-from-right duration-300">
                  <button
                    onClick={() => setAuthView("selection")}
                    className="flex items-center gap-2 mb-6 border border-[#d0aa47] rounded-lg p-2.5 w-fit hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft
                      className={`w-5 h-5 text-[#3b5e40] ${
                        isRtl ? "rotate-180" : ""
                      }`}
                    />
                    <span className="font-bold text-sm text-[#3b5e40] pr-2">
                      {t_auth.waHeader}
                    </span>
                  </button>

                  {/* Phone Input */}
                  <div className="bg-gray-100 rounded-lg flex items-center px-4 py-3 mb-4">
                    <span className="font-bold text-gray-800 text-lg mr-2">
                      +62
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder={t_auth.phonePlaceholder}
                      className="bg-transparent w-full outline-none text-lg font-bold placeholder:font-semibold placeholder:text-gray-400 text-gray-800"
                    />
                  </div>

                  {/* Continue Button */}
                  <button
                    disabled={phoneNumber.length < 5}
                    className={`w-full py-3.5 rounded-lg font-bold text-white transition-all ${
                      phoneNumber.length >= 5
                        ? "bg-[#3b5e40] shadow-md active:scale-[0.98]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {t_auth.continue}
                  </button>

                  {/* UPDATE: Button Forget Password */}
                  <button className="w-full mt-3 text-xs font-bold text-[#3b5e40] hover:underline transition-all">
                    {t_auth.forgotPassword}
                  </button>

                  {/* Divider OR */}
                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <span className="relative bg-white px-3 text-xs text-gray-400 font-medium">
                      {t_auth.or}
                    </span>
                  </div>

                  {/* Google Button */}
                  <button className="w-full border border-gray-300 rounded-full py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                    {/* Google Icon SVG */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="font-bold text-gray-700 text-sm">
                      {t_auth.google}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- BOTTOM NAV CONTAINER --- */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex flex-col pointer-events-none"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* 1. BUTTON DAFTAR/MASUK (Div Atas) */}
        {!session && (
          <div className="w-full max-w-md mx-auto px-4 pointer-events-auto">
            <div className="bg-[#faf4e6] p-2 rounded-t-xl shadow-md">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center justify-center w-full py-3.5 text-white font-bold bg-[#3b5e40] rounded-xl shadow-md hover:bg-[#2d4a32] transition-transform active:scale-95"
              >
                {t_nav.auth}
              </button>
            </div>
          </div>
        )}

        {/* 2. NAVIGATION BAR (Div Bawah) */}
        <nav className="w-full bg-[#faf4e6] border-t border-[#896b41]/10 shadow-[0_-10px_25px_rgba(0,0,0,0.06)] pointer-events-auto relative">
          <div className="max-w-md mx-auto flex items-center justify-around px-2 relative h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const label = t_nav[item.key];

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-end flex-1 h-full pb-2 transition-all"
                >
                  {/* KONDISI AKTIF: Ikon melayang ke atas dengan lengkungan */}
                  {isActive && (
                    <div className="absolute top-[-24px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Background lengkungan/notch putih-cream */}
                      <div className="absolute top-[-2px] w-[66px] h-[33px] bg-[#faf4e6] rounded-t-full border-t border-[#896b41]/10 -z-10 shadow-sm"></div>

                      {/* Bulatan Ikon */}
                      <div className="w-14 h-14 bg-[#faf4e6] rounded-full flex items-center justify-center border border-[#896b41]/10 shadow-sm">
                        <div className="w-11 h-11 bg-[#d0aa47]/15 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#3b5e40]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KONDISI TIDAK AKTIF: Ikon diletakkan lebih rendah */}
                  {!isActive && (
                    <div className="mb-1 opacity-50">
                      <Icon className="w-6 h-6 text-[#896b41]" />
                    </div>
                  )}

                  {/* LABEL TEKS */}
                  <span
                    className={`
                  text-[10px] font-bold transition-colors leading-none
                  ${isActive ? "text-[#3b5e40]" : "text-[#896b41] opacity-50"}
                `}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Area bawah untuk notch iPhone / Padding tambahan */}
          <div className="h-4 bg-[#faf4e6] w-full"></div>
        </nav>
      </div>
    </>
  );
}