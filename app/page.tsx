"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  TicketPercent,
  MessageCircle,
  Truck,
} from "lucide-react";

// Services
import { useLogoutMutation } from "@/services/auth.service";

// I18n & Types
import { useI18n } from "./hooks/useI18n";
import { signOut } from "next-auth/react";
import Header from "./header";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// --- TIPE & DICTIONARY ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface HomeTranslations {
  latestArticles: string;
  viewAll: string;
  loading: string;
  section: {
    specialToday: string;
    discountCashback: string;
    new: string;
    voucherPackage: string;
  };
  product: {
    bundle: string;
    sparks: string;
    buy3: string;
    tiramisuLatte: string;
    tiramisuMocha: string;
    croissant: string;
    cromboloni: string;
  };
  ui: {
    claim: string;
    shipping: string;
    chat: string;
    legal: string;
    gExpress: string;
  };
}

const HOME_TEXT: Record<LocaleCode, HomeTranslations> = {
  id: {
    latestArticles: "Artikel Terbaru",
    viewAll: "Lihat Semua",
    loading: "Memuat...",
    section: {
      specialToday: "Spesial Hari Ini",
      discountCashback: "Diskon & Cashback",
      new: "Baru!",
      voucherPackage: "Voucher Package",
    },
    product: {
      bundle: "Bundle Disc 30%",
      sparks: "Sparks B1G1 Bun...",
      buy3: "Beli 3 Hanya...",
      tiramisuLatte: "Tiramisu Latte",
      tiramisuMocha: "Tiramisu Mocha Latte",
      croissant: "Butter Croissant",
      cromboloni: "Chocolate Cromboloni",
    },
    ui: {
      claim: "Klaim",
      shipping: "Ongkir",
      chat: "Curhat ke 6281 7075 6865 (Chat Only)",
      legal:
        "Informasi Kontak Layanan Pengaduan Konsumen Direktorat Jenderal Perlindungan Konsumen dan Tertib Niaga, Kementerian Perdagangan Republik Indonesia. Whatsapp Ditjen PKTN: 0853-1111-1010",
      gExpress: "GExpress",
    },
  },
  en: {
    latestArticles: "Latest Articles",
    viewAll: "View All",
    loading: "Loading...",
    section: {
      specialToday: "Special Today",
      discountCashback: "Discounts & Cashback",
      new: "New!",
      voucherPackage: "Voucher Package",
    },
    product: {
      bundle: "30% Disc Bundle",
      sparks: "Sparks B1G1 Bun...",
      buy3: "Buy 3 Only...",
      tiramisuLatte: "Tiramisu Latte",
      tiramisuMocha: "Tiramisu Mocha Latte",
      croissant: "Butter Croissant",
      cromboloni: "Chocolate Cromboloni",
    },
    ui: {
      claim: "Claim",
      shipping: "Shipping",
      chat: "Chat with us at 6281 7075 6865",
      legal:
        "Consumer Complaint Service Contact Information Directorate General of Consumer Protection and Trade Compliance, Ministry of Trade of the Republic of Indonesia.",
      gExpress: "GExpress",
    },
  },
  ar: {
    latestArticles: "أحدث المقالات",
    viewAll: "عرض الكل",
    loading: "جار التحميل...",
    section: {
      specialToday: "مميز اليوم",
      discountCashback: "خصومات واسترداد نقدي",
      new: "جديد!",
      voucherPackage: "باقة القسائم",
    },
    product: {
      bundle: "خصم 30% حزمة",
      sparks: "سباركس B1G1...",
      buy3: "اشتري 3 فقط...",
      tiramisuLatte: "تيراميسو لاتيه",
      tiramisuMocha: "تيراميسو موكا لاتيه",
      croissant: "كرواسون بالزبدة",
      cromboloni: "كرومبولوني بالشوكولاتة",
    },
    ui: {
      claim: "مطالبة",
      shipping: "شحن",
      chat: "دردش معنا على 6281 7075 6865",
      legal:
        "معلومات الاتصال بخدمة شكاوى المستهلكين المديرية العامة لحماية المستهلك والامتثال التجاري، وزارة التجارة في جمهورية إندونيسيا.",
      gExpress: "جي إكسبريس",
    },
  },
  fr: {
    latestArticles: "Derniers articles",
    viewAll: "Voir tout",
    loading: "Chargement...",
    section: {
      specialToday: "Spécial Aujourd'hui",
      discountCashback: "Remises & Cashback",
      new: "Nouveau!",
      voucherPackage: "Forfait Voucher",
    },
    product: {
      bundle: "Pack Remise 30%",
      sparks: "Sparks B1G1 Bun...",
      buy3: "Achetez 3 Seulement...",
      tiramisuLatte: "Tiramisu Latte",
      tiramisuMocha: "Tiramisu Mocha Latte",
      croissant: "Croissant au Beurre",
      cromboloni: "Cromboloni Chocolat",
    },
    ui: {
      claim: "Réclamer",
      shipping: "Livraison",
      chat: "Discutez avec nous au 6281 7075 6865",
      legal:
        "Informations de contact du service des plaintes des consommateurs Direction générale de la protection des consommateurs et de la conformité commerciale, ministère du Commerce de la République d'Indonésie.",
      gExpress: "GExpress",
    },
  },
  kr: {
    latestArticles: "최신 기사",
    viewAll: "모두 보기",
    loading: "로딩 중...",
    section: {
      specialToday: "오늘의 스페셜",
      discountCashback: "할인 & 캐시백",
      new: "새로운!",
      voucherPackage: "바우처 패키지",
    },
    product: {
      bundle: "번들 30% 할인",
      sparks: "스파크 B1G1...",
      buy3: "3개 구매 시...",
      tiramisuLatte: "티라미수 라떼",
      tiramisuMocha: "티라미수 모카 라떼",
      croissant: "버터 크루아상",
      cromboloni: "초콜릿 크롬볼로니",
    },
    ui: {
      claim: "받기",
      shipping: "배송비",
      chat: "문의하기 6281 7075 6865",
      legal:
        "인도네시아 공화국 무역부 소비자 보호 및 거래 준수 총국 소비자 불만 처리 서비스 연락처 정보.",
      gExpress: "GExpress",
    },
  },
  jp: {
    latestArticles: "最新記事",
    viewAll: "すべて見る",
    loading: "読み込み中...",
    section: {
      specialToday: "今日のスペシャル",
      discountCashback: "割引 & キャッシュバック",
      new: "新着!",
      voucherPackage: "バウチャーパッケージ",
    },
    product: {
      bundle: "30%割引バンドル",
      sparks: "スパークス B1G1...",
      buy3: "3つ購入で...",
      tiramisuLatte: "ティラミスラテ",
      tiramisuMocha: "ティラミスモカラテ",
      croissant: "バタークロワッサン",
      cromboloni: "チョコクロンボローニ",
    },
    ui: {
      claim: "請求",
      shipping: "送料",
      chat: "チャット: 6281 7075 6865",
      legal:
        "インドネシア共和国貿易省 消費者保護および取引コンプライアンス総局 消費者苦情サービス連絡先情報。",
      gExpress: "GExpress",
    },
  },
};

export default function Home() {
  const { locale } = useI18n();

  // --- STATE DROPDOWN & LOGOUT ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  // Fungsi untuk update index saat slide berubah
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Fungsi untuk klik pada dot
  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const carouselItems = [
    { id: 1, image: "https://picsum.photos/seed/promo1/800/400" },
    { id: 2, image: "https://picsum.photos/seed/promo2/800/400" },
    { id: 3, image: "https://picsum.photos/seed/promo3/800/400" },
  ];

  const currentHour = new Date().getHours();

  // Safe Locale Access
  const safeLocale = (
    HOME_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const uiText = HOME_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // --- Logic Click Outside Dropdown ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Logic Logout ---
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error(
        "Logout backend gagal, melanjutkan logout frontend...",
        error,
      );
    } finally {
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });
    }
  };

  // --- Sapaan Berdasarkan Waktu ---
  const getGreeting = () => {
    const greetings: Record<
      string,
      { morning: string; afternoon: string; evening: string }
    > = {
      id: {
        morning: "Selamat Pagi",
        afternoon: "Selamat Siang",
        evening: "Selamat Malam",
      },
      en: {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening",
      },
      ar: {
        morning: "صباح الخير",
        afternoon: "مساء الخير",
        evening: "مساء الخير",
      },
      fr: {
        morning: "Bonjour",
        afternoon: "Bon après-midi",
        evening: "Bonsoir",
      },
      kr: {
        morning: "좋은 아침",
        afternoon: "좋은 오후",
        evening: "좋은 저녁",
      },
      jp: {
        morning: "おはよう",
        afternoon: "こんにちは",
        evening: "こんばんは",
      },
    };
    const set = greetings[locale] || greetings.id;
    return currentHour < 12
      ? set.morning
      : currentHour < 18
        ? set.afternoon
        : set.evening;
  };

  const greeting = getGreeting();

  // --- MOCK DATA FOR UI SECTIONS ---
  const specialProducts = [
    {
      id: 1,
      title: uiText.product.bundle,
      price: "Rp21.700",
      image: "https://picsum.photos/seed/coffee1/200/200",
      tag: "30%",
    },
    {
      id: 2,
      title: uiText.product.sparks,
      price: "Rp18.000",
      image: "https://picsum.photos/seed/drink1/200/200",
      tag: "B1G1",
    },
    {
      id: 3,
      title: uiText.product.buy3,
      price: "Rp47.000",
      image: "https://picsum.photos/seed/coffee2/200/200",
      tag: null,
    },
  ];

  const newProducts = [
    {
      id: 4,
      title: uiText.product.tiramisuLatte,
      price: "Rp20.000",
      image: "https://picsum.photos/seed/latte1/200/200",
      isNew: true,
    },
    {
      id: 5,
      title: uiText.product.tiramisuMocha,
      price: "Rp25.000",
      image: "https://picsum.photos/seed/latte2/200/200",
      isNew: true,
    },
  ];

  const bakeryProducts = [
    {
      id: 6,
      title: uiText.product.croissant,
      price: "Rp15.000",
      image: "https://picsum.photos/seed/bread1/200/200",
    },
    {
      id: 7,
      title: uiText.product.cromboloni,
      price: "Rp26.000",
      image: "https://picsum.photos/seed/bread2/200/200",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-28" dir={isRtl ? "rtl" : "ltr"}>
      <Header onScanClick={() => console.log("Membuka Scanner...")} />

      <main className="max-w-md mx-auto px-4 py-4 space-y-8">
        {/* --- 1. CAROUSEL SECTION --- */}
        <section
          className="relative overflow-hidden rounded-xl shadow-sm group"
          ref={emblaRef}
        >
          <div className="flex">
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="relative flex-[0_0_100%] min-w-0 h-40 sm:h-48"
              >
                <Image
                  src={item.image}
                  alt={`Banner ${item.id}`}
                  fill
                  className="object-cover"
                  priority={item.id === 1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b5e40]/70 to-transparent flex flex-col justify-end p-4 pb-8">
                  <h2 className="text-[#faf4e6] font-bold text-lg font-comfortaa">
                    {greeting}
                  </h2>
                </div>
              </div>
            ))}
          </div>
          {/* DOTS */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                // Active: Gold (#d0aa47), Inactive: White transparent
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? "w-5 bg-[#d0aa47]"
                    : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* --- 2. SPESIAL HARI INI --- */}
        <section>
          <div className="flex items-center justify-between mb-3">
            {/* Judul: Hijau Herbal (#3b5e40) */}
            <h3 className="font-bold text-[#3b5e40] text-lg">
              {uiText.section.specialToday}
            </h3>
            <button className="text-[#896b41]/60">
              <ChevronRight
                className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Scrollbar hidden dengan utility tailwind */}
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {specialProducts.map((item) => (
              <div
                key={item.id}
                className="min-w-[140px] flex flex-col gap-2 cursor-pointer group"
              >
                <div className="relative w-full h-[140px] rounded-xl overflow-hidden bg-[#faf4e6]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {item.tag && (
                    // Tag: Brown (#896b41) untuk stok/alert
                    <div className="absolute bottom-0 left-0 right-0 bg-[#896b41] text-[#faf4e6] text-[10px] font-bold text-center py-1">
                      {item.tag === "30%"
                        ? "Persediaan Cup Holder Terbatas!"
                        : item.tag}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#3b5e40] line-clamp-1">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {item.tag === "30%" || item.tag === "B1G1" ? (
                      // Badge Diskon: Background Cream + Text Brown
                      <div className="bg-[#faf4e6] border border-[#896b41]/20 text-[#896b41] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <TicketPercent className="w-3 h-3 text-[#d0aa47]" />
                        {item.price}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-[#3b5e40]">
                        {item.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 3. DISKON & CASHBACK --- */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TicketPercent className="w-5 h-5 text-[#d0aa47] fill-[#d0aa47]/20" />
            <h3 className="font-bold text-[#3b5e40] text-lg">
              {uiText.section.discountCashback}
            </h3>
          </div>

          <div className="border border-[#896b41]/10 rounded-xl p-3 shadow-sm bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#faf4e6] p-2 rounded-lg">
                <Truck className="w-5 h-5 text-[#3b5e40]" />
              </div>
              <div className="flex flex-col">
                <span className="bg-[#3b5e40] text-white text-[10px] font-bold px-1.5 rounded w-fit mb-0.5">
                  {uiText.ui.shipping}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-[#3b5e40]">5.000</span>
                  <span className="text-[10px] text-[#896b41] font-medium">
                    {uiText.ui.gExpress}
                  </span>
                </div>
              </div>
            </div>
            {/* Tombol Klaim: Outline Brown */}
            <button className="border border-[#896b41] text-[#896b41] text-sm font-bold px-4 py-1.5 rounded-full hover:bg-[#896b41] hover:text-[#faf4e6] transition-colors">
              {uiText.ui.claim}
            </button>
          </div>
        </section>

        {/* --- 4. BARU! --- */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#3b5e40] text-lg">
              {uiText.section.new}
            </h3>
            <button className="text-[#896b41]/60">
              <ChevronRight
                className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Grid 2 Column for Drinks */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {newProducts.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 cursor-pointer">
                <div className="relative w-full aspect-square rounded-full overflow-hidden border border-[#faf4e6] shadow-sm bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {/* Badge New: Gold (#d0aa47) */}
                  <div className="absolute bottom-2 left-2 bg-[#d0aa47] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    New
                  </div>
                </div>
                <div className="text-center px-1">
                  <h4 className="font-bold text-[#3b5e40] text-sm leading-tight mb-1">
                    {item.title}
                  </h4>
                  <span className="text-sm text-[#896b41] font-medium">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Grid 2 Column for Bakery */}
          <div className="grid grid-cols-2 gap-4">
            {bakeryProducts.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 cursor-pointer">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#faf4e6]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#3b5e40] text-sm mb-0.5">
                    {item.title}
                  </h4>
                  <span className="text-sm text-[#896b41] font-medium">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 5. BANNER PROMO --- */}
        <section className="w-full h-36 relative rounded-xl overflow-hidden">
          <Image
            src="https://picsum.photos/seed/promoBanner/800/300"
            alt="Promo Banner"
            fill
            className="object-cover"
          />
          {/* Gradient menggunakan Cream (#faf4e6) agar menyatu dengan background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf4e6]/95 to-transparent p-5 flex flex-col justify-center">
            <h2 className="text-[#3b5e40] text-2xl font-bold leading-tight w-2/3">
              Gratis Minuman & Beli 1 Gratis 1
            </h2>
            <p className="text-[10px] text-[#896b41] mt-1 font-bold tracking-wider">
              SETIAP HARI*
            </p>
          </div>
        </section>

        {/* --- 6. VOUCHER PACKAGE HEADER --- */}
        <section>
          <h3 className="font-bold text-[#3b5e40] text-lg border-b pb-2 border-[#896b41]/10">
            {uiText.section.voucherPackage}
          </h3>
        </section>

        {/* --- 7. WHATSAPP CONTACT --- */}
        <section>
          <div className="bg-white border border-[#896b41]/10 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <div className="bg-[#25D366] rounded-full p-2 text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="font-bold text-[#3b5e40] text-sm">
              {uiText.ui.chat}
            </span>
          </div>
        </section>

        {/* --- 8. FOOTER LEGAL --- */}
        <section className="pb-4">
          <p className="text-[10px] text-[#896b41]/70 leading-relaxed text-justify">
            {uiText.ui.legal}
          </p>
        </section>
      </main>
    </div>
  );
}