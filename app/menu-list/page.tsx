"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import { ChevronDown, TicketPercent, Plus } from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface MenuTranslations {
  selectOutlet: string;
  discountHeader: string;
  claim: string;
  shipping: string;
  gExpress: string;
  promo: string;
  new: string;
  herbal: string;
  wellness: string;
  honey: string;
}

interface Category {
  id: keyof MenuTranslations;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId: string;
  tags?: string[];
}

// --- TRANSLATIONS ---
const MENU_TEXT: Record<LocaleCode, MenuTranslations> = {
  id: {
    selectOutlet: "Pilih Outlet",
    discountHeader: "Diskon & Cashback",
    claim: "Klaim",
    shipping: "Ongkir",
    gExpress: "GExpress",
    promo: "Promo & Combo",
    new: "Baru!",
    herbal: "Herbal Series",
    wellness: "Wellness Kits",
    honey: "Honey Series",
  },
  en: {
    selectOutlet: "Select Outlet",
    discountHeader: "Discounts & Cashback",
    claim: "Claim",
    shipping: "Shipping",
    gExpress: "GExpress",
    promo: "Promo & Combo",
    new: "New!",
    herbal: "Herbal Series",
    wellness: "Wellness Kits",
    honey: "Honey Series",
  },
  ar: {
    selectOutlet: "اختر المنفذ",
    discountHeader: "الخصومات والاسترداد النقدي",
    claim: "مطالبة",
    shipping: "شحن",
    gExpress: "جي إكسبريس",
    promo: "العروض والكومبو",
    new: "جديد!",
    herbal: "سلسلة الأعشاب",
    wellness: "مجموعات العافية",
    honey: "سلسلة العسل",
  },
  fr: {
    selectOutlet: "Choisir le point de vente",
    discountHeader: "Remises et Cashback",
    claim: "Réclamer",
    shipping: "Livraison",
    gExpress: "GExpress",
    promo: "Promo & Combo",
    new: "Nouveau!",
    herbal: "Série aux herbes",
    wellness: "Kits bien-être",
    honey: "Série Miel",
  },
  kr: {
    selectOutlet: "매장 선택",
    discountHeader: "할인 & 캐시백",
    claim: "받기",
    shipping: "배송비",
    gExpress: "GExpress",
    promo: "프로모션 & 콤보",
    new: "새로운!",
    herbal: "허브 시리즈",
    wellness: "웰니스 키트",
    honey: "허니 시리즈",
  },
  jp: {
    selectOutlet: "店舗を選択",
    discountHeader: "割引 & キャッシュバック",
    claim: "請求",
    shipping: "送料",
    gExpress: "GExpress",
    promo: "プロモ & コンボ",
    new: "新着!",
    herbal: "ハーブシリーズ",
    wellness: "ウェルネスキット",
    honey: "ハニーシリーズ",
  },
};

// --- DUMMY DATA ---
const CATEGORIES: Category[] = [
  { id: "promo", name: "Promo & Combo" },
  { id: "new", name: "Baru!" },
  { id: "herbal", name: "Herbal Tea" },
  { id: "wellness", name: "Wellness" },
  { id: "honey", name: "Honey Series" },
];

const PRODUCTS: Product[] = [
  // Promo
  {
    id: 1,
    name: "Free Upsize Large",
    price: 20000,
    originalPrice: 25000,
    image: "https://picsum.photos/seed/promo1/200/200",
    categoryId: "promo",
    tags: ["Hemat"],
  },
  {
    id: 2,
    name: "Bundle Disc 30%",
    price: 26600,
    originalPrice: 38000,
    image: "https://picsum.photos/seed/promo2/200/200",
    categoryId: "promo",
    tags: ["30% OFF"],
  },
  {
    id: 3,
    name: "Sparks B1G1 Bundle",
    price: 21000,
    originalPrice: 42000,
    image: "https://picsum.photos/seed/promo3/200/200",
    categoryId: "promo",
    tags: ["B1G1"],
  },
  // New
  {
    id: 4,
    name: "Golden Ginger Latte",
    price: 23000,
    image: "https://picsum.photos/seed/new1/200/200",
    categoryId: "new",
    tags: ["New"],
  },
  {
    id: 5,
    name: "Royal Honey Mocha",
    price: 28000,
    image: "https://picsum.photos/seed/new2/200/200",
    categoryId: "new",
    tags: ["New"],
  },
  {
    id: 6,
    name: "Cinnamon Roll",
    price: 18000,
    image: "https://picsum.photos/seed/new3/200/200",
    categoryId: "new",
    tags: ["New"],
  },
  // Herbal Tea
  {
    id: 7,
    name: "Chamomile Calming",
    price: 15000,
    image: "https://picsum.photos/seed/tea1/200/200",
    categoryId: "herbal",
  },
  {
    id: 8,
    name: "Rosella Fresh",
    price: 16000,
    image: "https://picsum.photos/seed/tea2/200/200",
    categoryId: "herbal",
  },
];

export default function MenuListPage() {
  const { locale } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter(); // Use Router

  const safeLocale = (
    MENU_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = MENU_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [activeCategory, setActiveCategory] = useState<string>("promo");

  // Logic outlet
  const outletId = searchParams.get("outletId");
  const selectedOutlet = outletId
    ? {
        name: `Herbal House Center - Branch ${outletId}`,
        address: `Jl. Pemuda Herbal No. ${outletId}, Kota Magelang`,
      }
    : {
        name: "Rest Area Km 379A (Container)",
        address: "Jl. Tol Semarang - Batang No. Km 379A",
      };

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Navigasi ke Halaman List Outlet
  const goToOutletList = () => {
    // Kirim ID saat ini agar bisa di-highlight di list
    const currentIdQuery = outletId ? `?selectedId=${outletId}` : "";
    router.push(`/menu${currentIdQuery}`);
  };

  return (
    // Max Width MD added
    <div
      className="min-h-screen bg-white pb-24 w-full max-w-md mx-auto"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* --- 1. HEADER OUTLET (Fixed Top) --- */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="p-4 border-b border-[#faf4e6]">
          {/* CLICKABLE HEADER */}
          <div
            onClick={goToOutletList}
            className="bg-[#faf4e6] border border-[#896b41]/10 rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform hover:border-[#896b41]/30"
          >
            <div className="overflow-hidden">
              <h2 className="font-bold text-[#3b5e40] text-sm truncate">
                {selectedOutlet.name}
              </h2>
              <p className="text-[10px] text-[#896b41] truncate">
                {selectedOutlet.address}
              </p>
            </div>
            <ChevronDown className="w-5 h-5 text-[#896b41]" />
          </div>
        </div>

        {/* --- 2. CATEGORY TABS --- */}
        <div className="flex overflow-x-auto bg-white px-4 border-b border-[#faf4e6] scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`
                whitespace-nowrap px-4 py-3 text-sm font-bold border-b-2 transition-colors
                ${
                  activeCategory === cat.id
                    ? "border-[#d0aa47] text-[#3b5e40]"
                    : "border-transparent text-gray-400 hover:text-[#896b41]"
                }
              `}
            >
              {t[cat.id] || cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="space-y-6 pt-4">
        {/* ... (Sisa kode Voucher & Product List sama seperti sebelumnya) ... */}
        {/* --- 3. VOUCHER SECTION --- */}
        <section className="px-4">
          <div className="flex items-center gap-2 mb-3">
            <TicketPercent className="w-5 h-5 text-[#3b5e40] fill-[#d0aa47]/20" />
            <h3 className="font-bold text-[#3b5e40]">{t.discountHeader}</h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Voucher 1 */}
            <div className="min-w-[260px] bg-white border border-[#3b5e40]/20 rounded-xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-[#3b5e40]/10 p-2 rounded-lg">
                  <span className="text-[10px] font-bold text-[#3b5e40] block leading-none">
                    {t.shipping}
                  </span>
                  <span className="text-lg font-bold text-[#3b5e40]">
                    5.000
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#3b5e40]">
                    Voucher Ongkir
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {t.gExpress}
                  </span>
                </div>
              </div>
              <button className="px-4 py-1.5 rounded-full border border-[#d0aa47] text-[#d0aa47] text-xs font-bold hover:bg-[#faf4e6]">
                {t.claim}
              </button>
            </div>
            {/* Voucher 2 */}
            <div className="min-w-[260px] bg-white border border-[#3b5e40]/20 rounded-xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-[#d0aa47]/10 p-2 rounded-lg">
                  <span className="text-lg font-bold text-[#d0aa47]">50%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#3b5e40]">
                    Diskon Herbal
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Min. Pembelian 50rb
                  </span>
                </div>
              </div>
              <button className="px-4 py-1.5 rounded-full border border-[#d0aa47] text-[#d0aa47] text-xs font-bold hover:bg-[#faf4e6]">
                {t.claim}
              </button>
            </div>
          </div>
        </section>

        {/* --- 4. PRODUCT LIST --- */}
        <div className="bg-[#faf4e6]/30 pb-4">
          {CATEGORIES.map((cat) => {
            const catProducts = PRODUCTS.filter((p) => p.categoryId === cat.id);
            if (catProducts.length === 0) return null;

            return (
              <section key={cat.id} id={cat.id} className="pt-6 px-4">
                <h3 className="text-lg font-bold text-[#3b5e40] mb-4">
                  {t[cat.id] || cat.name}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {catProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm border border-[#896b41]/10 overflow-hidden group cursor-pointer"
                    >
                      <div className="relative aspect-square bg-[#faf4e6]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.tags && product.tags.length > 0 && (
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-[#896b41] text-[#faf4e6] text-[10px] font-bold rounded-full w-fit shadow-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-[#3b5e40] text-sm leading-tight line-clamp-2 mb-2 min-h-[2.5em]">
                          {product.name}
                        </h4>
                        <div className="flex flex-col gap-0.5">
                          {product.originalPrice && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400 line-through">
                                Rp
                                {product.originalPrice.toLocaleString("id-ID")}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div
                              className={`font-bold text-sm ${product.originalPrice ? "text-[#d0aa47] bg-[#faf4e6] px-1.5 py-0.5 rounded border border-[#d0aa47]/20" : "text-[#3b5e40]"}`}
                            >
                              Rp{product.price.toLocaleString("id-ID")}
                            </div>
                            <button className="w-6 h-6 rounded-full bg-[#3b5e40] flex items-center justify-center text-white active:scale-90 transition-transform">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}