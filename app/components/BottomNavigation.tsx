"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutGrid, Award, ShoppingBag, User } from "lucide-react";
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

interface NavItem {
  href: string;
  key: keyof NavLabels;
  icon: React.ComponentType<{ className?: string }>;
}

export default function BottomNavigation() {
  const pathname = usePathname();
  const { locale } = useI18n();

  // Logic Session (Bisa disesuaikan dengan state auth aplikasi Anda)
  const session = false;

  const safeLocale = (
    NAV_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t_nav = NAV_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const navItems: NavItem[] = [
    { href: "/", key: "home", icon: Home },
    { href: "/menu", key: "menu", icon: LayoutGrid },
    { href: "/vip", key: "vip", icon: Award },
    { href: "/merch", key: "merch", icon: ShoppingBag },
    { href: "/profile", key: "profile", icon: User },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex flex-col pointer-events-none"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* 1. BUTTON DAFTAR/MASUK (Div Atas) */}
      {!session && (
        <div className="w-full max-w-md mx-auto px-4 pointer-events-auto">
            <div className="bg-[#faf4e6] p-2 rounded-t-xl shadow-md">
            <Link
              href="/auth/login"
              className="flex items-center justify-center w-full py-3.5 text-white font-bold bg-[#3b5e40] rounded-xl shadow-md hover:bg-[#2d4a32] transition-transform active:scale-95"
            >
              {t_nav.auth}
            </Link>
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
  );
}