"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, Heart, CheckCircle2, Circle } from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface OperationalHour {
  day: string;
  time: string;
}

interface OutletDetail {
  id: string;
  name: string;
  address: string;
  distance: string;
  image: string;
  isFavorite: boolean;
  services: {
    delivery: boolean;
    pickup: boolean;
  };
  coordinates: { lat: number; lng: number };
  hours: OperationalHour[];
}

// --- TRANSLATIONS ---
interface DetailTranslations {
  title: string;
  delivery: string;
  pickup: string;
  locationLabel: string;
  hoursTitle: string;
  selectLocation: string;
  days: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
}

const DETAIL_TEXT: Record<LocaleCode, DetailTranslations> = {
  id: {
    title: "Detail Outlet",
    delivery: "Delivery",
    pickup: "Pickup",
    locationLabel: "Lokasi",
    hoursTitle: "Jam operasional",
    selectLocation: "PILIH LOKASI INI",
    days: {
      mon: "Senin",
      tue: "Selasa",
      wed: "Rabu",
      thu: "Kamis",
      fri: "Jumat",
      sat: "Sabtu",
      sun: "Minggu",
    },
  },
  en: {
    title: "Outlet Detail",
    delivery: "Delivery",
    pickup: "Pickup",
    locationLabel: "Location",
    hoursTitle: "Operational Hours",
    selectLocation: "SELECT THIS LOCATION",
    days: {
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
      sun: "Sunday",
    },
  },
  ar: {
    title: "تفاصيل المنفذ",
    delivery: "توصيل",
    pickup: "استلام",
    locationLabel: "الموقع",
    hoursTitle: "ساعات العمل",
    selectLocation: "اختر هذا الموقع",
    days: {
      mon: "الاثنين",
      tue: "الثلاثاء",
      wed: "الأربعاء",
      thu: "الخميس",
      fri: "الجمعة",
      sat: "السبت",
      sun: "الأحد",
    },
  },
  fr: {
    title: "Détails du point de vente",
    delivery: "Livraison",
    pickup: "À emporter",
    locationLabel: "Emplacement",
    hoursTitle: "Heures d'ouverture",
    selectLocation: "SÉLECTIONNER CE LIEU",
    days: {
      mon: "Lundi",
      tue: "Mardi",
      wed: "Mercredi",
      thu: "Jeudi",
      fri: "Vendredi",
      sat: "Samedi",
      sun: "Dimanche",
    },
  },
  kr: {
    title: "매장 상세",
    delivery: "배달",
    pickup: "픽업",
    locationLabel: "위치",
    hoursTitle: "운영 시간",
    selectLocation: "이 위치 선택",
    days: {
      mon: "월요일",
      tue: "화요일",
      wed: "수요일",
      thu: "목요일",
      fri: "금요일",
      sat: "토요일",
      sun: "일요일",
    },
  },
  jp: {
    title: "店舗詳細",
    delivery: "デリバリー",
    pickup: "ピックアップ",
    locationLabel: "場所",
    hoursTitle: "営業時間",
    selectLocation: "この場所を選択",
    days: {
      mon: "月曜日",
      tue: "火曜日",
      wed: "水曜日",
      thu: "木曜日",
      fri: "金曜日",
      sat: "土曜日",
      sun: "日曜日",
    },
  },
};

// --- DUMMY DATA FETCHING ---
const getOutletById = (id: string, t: DetailTranslations): OutletDetail => {
  return {
    id,
    name: `Herbal House Center - Branch ${id}`,
    address: `Jl. Pemuda Herbal No. ${id}, Kemirirejo, Kec. Magelang Tengah, Kota Magelang, Jawa Tengah 56122`,
    distance: "39.1 KM",
    image: "https://picsum.photos/seed/herbalstore/800/400",
    isFavorite: id === "1",
    services: {
      delivery: true,
      pickup: true,
    },
    coordinates: { lat: -7.47, lng: 110.21 },
    hours: [
      { day: t.days.sun, time: "00:01 - 23:49" },
      { day: t.days.mon, time: "08:00 - 22:00" },
      { day: t.days.tue, time: "08:00 - 22:00" },
      { day: t.days.wed, time: "08:00 - 22:00" },
      { day: t.days.thu, time: "08:00 - 22:00" },
      { day: t.days.fri, time: "08:00 - 23:00" },
      { day: t.days.sat, time: "08:00 - 23:00" },
    ],
  };
};

export default function OutletDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { locale } = useI18n();

  const safeLocale = (
    DETAIL_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = DETAIL_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [data, setData] = useState<OutletDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const outletData = getOutletById(params.id as string, t);
      setData(outletData);
      setIsFavorite(outletData.isFavorite);
    }
  }, [params, t]);

  // --- HANDLER SELECT LOCATION ---
  const handleSelectLocation = () => {
    if (data) {
      // Mengarahkan ke menu list dengan membawa parameter outletId
      router.push(`/menu-list?outletId=${data.id}`);
    }
  };

  if (!data) return <div className="p-10 text-center">{t.title}...</div>;

  return (
    <div className="min-h-screen bg-white pb-24" dir={isRtl ? "rtl" : "ltr"}>
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
      </header>

      <main className="max-w-md mx-auto">
        <div className="relative w-full h-56 bg-gray-200">
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        </div>

        <div className="px-5 py-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3b5e40]" />
              <span className="text-xs font-bold text-[#3b5e40]">
                {t.delivery}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
              <span className="text-xs font-bold text-[#3b5e40]">
                {t.pickup}
              </span>
            </div>
            <div className="px-2 py-0.5 bg-[#faf4e6] border border-[#d0aa47]/30 rounded text-[#896b41] text-xs font-bold ml-2">
              {data.distance}
            </div>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#3b5e40] mb-2 leading-tight">
                {data.name}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {data.address}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1 min-w-[50px]">
              <button className="w-10 h-10 rounded-full bg-[#E0F2F1] flex items-center justify-center hover:bg-[#d1e9e8] transition-colors">
                <MapPin className="w-5 h-5 text-[#2196F3] fill-[#2196F3]/20" />
              </button>
              <span className="text-[10px] font-bold text-gray-500">
                {t.locationLabel}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isFavorite ? "fill-[#d0aa47] text-[#d0aa47]" : "text-[#896b41]"}`}
              />
            </button>
          </div>

          <div className="h-px bg-gray-100 w-full my-6"></div>

          <div>
            <h3 className="text-base font-bold text-[#3b5e40] mb-4">
              {t.hoursTitle}
            </h3>
            <div className="space-y-3">
              {data.hours.map((schedule, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    {schedule.day}
                  </span>
                  <span className="text-gray-800 font-medium">
                    {schedule.time} (WIB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- STICKY FOOTER BUTTON --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <div className="max-w-md mx-auto">
          {/* Update onClick untuk navigasi */}
          <button
            onClick={handleSelectLocation}
            className="w-full bg-[#896b41] hover:bg-[#7a5f3a] text-[#faf4e6] font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all"
          >
            {t.selectLocation}
          </button>
        </div>
      </div>
    </div>
  );
}