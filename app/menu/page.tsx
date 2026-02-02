"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Heart,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// ... (TYPES & TRANSLATIONS sama seperti sebelumnya) ...
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface OutletData {
  id: number;
  name: string;
  address: string;
  isFavorite: boolean;
  services: {
    delivery: boolean;
    pickup: boolean;
    dineIn: boolean;
  };
}

interface PageTranslations {
  title: string;
  searchPlaceholder: string;
  filters: {
    allOrder: string;
    pickup: string;
    driveThru: string;
    delivery: string;
    dineIn: string;
  };
  card: {
    detail: string;
    delivery: string;
    pickup: string;
    dineIn: string;
  };
  loadMore: string;
  noMoreData: string;
}

const PAGE_TEXT: Record<LocaleCode, PageTranslations> = {
  id: {
    title: "Daftar Outlet Herbal",
    searchPlaceholder: "Cari lokasi outlet...",
    filters: {
      allOrder: "Semua Order",
      pickup: "Ambil Sendiri",
      driveThru: "Drive Thru",
      delivery: "Pesan Antar",
      dineIn: "Makan di Tempat",
    },
    card: {
      detail: "Detail",
      delivery: "Delivery",
      pickup: "Pickup",
      dineIn: "Dine-In",
    },
    loadMore: "Lihat outlet lainnya",
    noMoreData: "Semua outlet telah ditampilkan",
  },
  en: {
    title: "Herbal Outlet List",
    searchPlaceholder: "Search outlet location...",
    filters: {
      allOrder: "All Orders",
      pickup: "Pickup",
      driveThru: "Drive Thru",
      delivery: "Delivery",
      dineIn: "Dine-In",
    },
    card: {
      detail: "Detail",
      delivery: "Delivery",
      pickup: "Pickup",
      dineIn: "Dine-In",
    },
    loadMore: "View more outlets",
    noMoreData: "All outlets loaded",
  },
  ar: {
    title: "قائمة منافذ الأعشاب",
    searchPlaceholder: "البحث عن موقع المنفذ...",
    filters: {
      allOrder: "كل الطلبات",
      pickup: "استلام",
      driveThru: "درايف ثرو",
      delivery: "توصيل",
      dineIn: "تناول الطعام",
    },
    card: {
      detail: "تفاصيل",
      delivery: "توصيل",
      pickup: "استلام",
      dineIn: "محلي",
    },
    loadMore: "عرض المزيد من المنافذ",
    noMoreData: "تم تحميل جميع المنافذ",
  },
  fr: {
    title: "Liste des Points de Vente",
    searchPlaceholder: "Rechercher un emplacement...",
    filters: {
      allOrder: "Toutes commandes",
      pickup: "À emporter",
      driveThru: "Service au volant",
      delivery: "Livraison",
      dineIn: "Sur place",
    },
    card: {
      detail: "Détails",
      delivery: "Livraison",
      pickup: "Retrait",
      dineIn: "Sur place",
    },
    loadMore: "Voir plus de points de vente",
    noMoreData: "Tous les points de vente affichés",
  },
  kr: {
    title: "허브 매장 목록",
    searchPlaceholder: "매장 위치 검색...",
    filters: {
      allOrder: "모든 주문",
      pickup: "픽업",
      driveThru: "드라이브 스루",
      delivery: "배달",
      dineIn: "매장 식사",
    },
    card: { detail: "상세", delivery: "배달", pickup: "픽업", dineIn: "매장" },
    loadMore: "매장 더 보기",
    noMoreData: "모든 매장이 로드되었습니다",
  },
  jp: {
    title: "ハーブ店舗一覧",
    searchPlaceholder: "店舗の場所を検索...",
    filters: {
      allOrder: "全注文",
      pickup: "ピックアップ",
      driveThru: "ドライブスルー",
      delivery: "デリバリー",
      dineIn: "店内飲食",
    },
    card: {
      detail: "詳細",
      delivery: "デリバリー",
      pickup: "ピックアップ",
      dineIn: "店内",
    },
    loadMore: "他の店舗を見る",
    noMoreData: "すべての店舗を表示しました",
  },
};

const generateDummyData = (): OutletData[] => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    name: `Herbal House ${i % 2 === 0 ? "Center" : "Garden"} - Branch ${i + 1}`,
    address: `Jl. Kesehatan Alami No. ${i + 1}, Lantai ${i % 3 === 0 ? "Ground" : "1"}, Blok ${String.fromCharCode(65 + (i % 5))}`,
    isFavorite: i < 3,
    services: {
      delivery: true,
      pickup: true,
      dineIn: i % 2 === 0,
    },
  }));
};

export default function OutletListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useI18n();

  const safeLocale = (
    PAGE_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = PAGE_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [outlets] = useState<OutletData[]>(generateDummyData());
  const [visibleCount, setVisibleCount] = useState(10);
  const [activeFilter, setActiveFilter] = useState("all");

  // Get selected ID from URL (e.g. /outlet?selectedId=1)
  const selectedId = searchParams.get("selectedId");

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, outlets.length));
  };

  const visibleOutlets = useMemo(() => {
    return outlets.slice(0, visibleCount);
  }, [outlets, visibleCount]);

  const hasMore = visibleCount < outlets.length;

  // Function: Select outlet -> Go back to Menu
  const handleSelectOutlet = (id: number) => {
    router.push(`/menu-list?outletId=${id}`);
  };

  // Function: Go to Detail (Stop Propagation)
  const handleDetailClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    router.push(`/menu/${id}`);
  };

  return (
    <div
      className="min-h-screen bg-[#faf4e6] pb-10 w-full max-w-md mx-auto"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#896b41]/10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft
              className={`w-6 h-6 text-[#3b5e40] ${isRtl ? "rotate-180" : ""}`}
            />
          </button>
          <h1 className="text-lg font-bold text-[#3b5e40] flex-1">{t.title}</h1>
        </div>

        <div className="max-w-md mx-auto px-4 pb-4 bg-white">
          <div className="relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRtl ? "right-3" : "left-3"}`}
            />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className={`w-full bg-gray-100 text-[#3b5e40] placeholder:text-gray-400 rounded-full py-2.5 outline-none focus:ring-1 focus:ring-[#d0aa47] ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto mt-4 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { id: "all", label: t.filters.allOrder },
              { id: "pickup", label: t.filters.pickup },
              { id: "drive", label: t.filters.driveThru },
              { id: "deliv", label: t.filters.delivery },
              { id: "dine", label: t.filters.dineIn },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${activeFilter === filter.id ? "bg-white border-[#3b5e40] text-[#3b5e40] shadow-sm" : "bg-white border-gray-200 text-gray-400 hover:border-[#896b41]/30"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {visibleOutlets.map((item) => {
          // Check if this item is currently selected
          const isSelected = selectedId === item.id.toString();

          return (
            <div
              key={item.id}
              onClick={() => handleSelectOutlet(item.id)} // Select logic
              // Conditional Border: Brown (#896b41) thick border if selected
              className={`
                bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 group active:scale-[0.99] transition-all cursor-pointer relative
                ${isSelected ? "border-2 border-[#896b41] bg-[#faf4e6]/10" : "border border-[#896b41]/10 hover:border-[#896b41]/40"}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#faf4e6] flex items-center justify-center shrink-0 border border-[#896b41]/10">
                  <Heart
                    className={`w-5 h-5 ${item.isFavorite ? "fill-[#d0aa47] text-[#d0aa47]" : "text-[#896b41]"}`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#3b5e40] text-base leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#896b41]/70 mt-1 leading-relaxed line-clamp-2">
                    {item.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-[#896b41]/10 pt-3">
                <div className="flex items-center gap-1.5">
                  {item.services.delivery ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3b5e40]" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-gray-300" />
                  )}
                  <span
                    className={`text-xs font-medium ${item.services.delivery ? "text-[#3b5e40]" : "text-gray-400"}`}
                  >
                    {t.card.delivery}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.services.pickup ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-gray-300" />
                  )}
                  <span
                    className={`text-xs font-medium ${item.services.pickup ? "text-[#3b5e40]" : "text-gray-400"}`}
                  >
                    {t.card.pickup}
                  </span>
                </div>
                {item.services.dineIn && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full border border-[#896b41] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#896b41] rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium text-[#896b41]">
                      {t.card.dineIn}
                    </span>
                  </div>
                )}

                {/* Detail Button: Stop Propagation */}
                <button
                  onClick={(e) => handleDetailClick(e, item.id)}
                  className="ml-auto flex items-center gap-1 text-[#d0aa47] font-bold text-xs hover:underline"
                >
                  {t.card.detail}
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>
          );
        })}

        <div className="pt-4 pb-8 flex flex-col items-center justify-center">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              className="text-[#896b41] font-bold text-sm py-2 px-4 hover:bg-[#faf4e6] rounded-full transition-colors flex items-center gap-2"
            >
              {t.loadMore}
              <ChevronRight className={`w-4 h-4 rotate-90`} />
            </button>
          ) : (
            <p className="text-xs text-gray-400 font-medium italic">
              -- {t.noMoreData} --
            </p>
          )}
        </div>
      </main>
    </div>
  );
}