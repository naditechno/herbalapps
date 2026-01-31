"use client";

import {
  Search,
  ShoppingBag,
  Loader2,
  LogOut,
  ChevronDown,
  User,
  Clock,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Components
import WidgetCard from "./components/WidgetCard";
import ProgressWidget from "./components/ProgressWidget";
import FeatureNavigation from "./components/FeatureNavigation";
import ArticleCard from "./components/ArticleCard";
import SearchModal from "./components/SearchModal";
import LanguageSwitcher from "./components/LanguageSwitcher";

// Services
import { useGetArticlesQuery } from "@/services/public/article.service";
import { usePrayerTracker } from "@/app/prayer-tracker/hooks/usePrayerTracker";
import { useGetSurahsQuery } from "@/services/public/quran.service";
import { useLogoutMutation } from "@/services/auth.service";

// I18n & Types
import { useI18n } from "./hooks/useI18n";
import { Article } from "@/types/public/article";
import { signOut } from "next-auth/react";
import Header from "./header";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// --- TIPE & DICTIONARY ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

interface HomeTranslations {
  latestArticles: string;
  viewAll: string;
  noArticles: string;
  loading: string;
  quran: {
    verse: string;
    surah: string;
    notRead: string;
  };
  menu: {
    logout: string;
  };
}

const HOME_TEXT: Record<LocaleCode, HomeTranslations> = {
  id: {
    latestArticles: "Artikel Terbaru",
    viewAll: "Lihat Semua",
    noArticles: "Belum ada artikel terbaru.",
    loading: "Memuat...",
    quran: { verse: "Ayat", surah: "Surah", notRead: "Belum ada aktivitas" },
    menu: { logout: "Keluar" },
  },
  en: {
    latestArticles: "Latest Articles",
    viewAll: "View All",
    noArticles: "No latest articles yet.",
    loading: "Loading...",
    quran: { verse: "Verse", surah: "Surah", notRead: "No activity yet" },
    menu: { logout: "Log Out" },
  },
  ar: {
    latestArticles: "أحدث المقالات",
    viewAll: "عرض الكل",
    noArticles: "لا توجد مقالات جديدة.",
    loading: "جار التحميل...",
    quran: { verse: "آية", surah: "سورة", notRead: "لا يوجد نشاط" },
    menu: { logout: "تسجيل خروج" },
  },
  fr: {
    latestArticles: "Derniers articles",
    viewAll: "Voir tout",
    noArticles: "Aucun article récent.",
    loading: "Chargement...",
    quran: { verse: "Verset", surah: "Sourate", notRead: "Aucune activité" },
    menu: { logout: "Se déconnecter" },
  },
  kr: {
    latestArticles: "최신 기사",
    viewAll: "모두 보기",
    noArticles: "최신 기사가 없습니다.",
    loading: "로딩 중...",
    quran: { verse: "절", surah: "수라", notRead: "활동 없음" },
    menu: { logout: "로그아웃" },
  },
  jp: {
    latestArticles: "最新記事",
    viewAll: "すべて見る",
    noArticles: "最新の記事はありません。",
    loading: "読み込み中...",
    quran: { verse: "節", surah: "スーラ", notRead: "活動なし" },
    menu: { logout: "ログアウト" },
  },
};

export default function Home() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    { id: 1, image: "https://picsum.photos/seed/herbal1/800/400" },
    { id: 2, image: "https://picsum.photos/seed/herbal2/800/400" },
    { id: 3, image: "https://picsum.photos/seed/herbal3/800/400" },
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

  // --- 1. Sapaan Berdasarkan Waktu ---
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

  // --- API HOOKS ---
  const { data: articlesData, isLoading: isLoadingArticles } =
    useGetArticlesQuery({
      page: 1,
      paginate: 5,
    });

  const { data: surahList } = useGetSurahsQuery({ lang: "id" });
  const { currentPrayerKey, prayerTimes } = usePrayerTracker();

  const [lastQuranActivity, setLastQuranActivity] = useState(uiText.loading);

  useEffect(() => {
    const lastRead = localStorage.getItem("quran-last-read");
    if (lastRead) {
      const parsed = JSON.parse(lastRead);
      setLastQuranActivity(
        `${parsed.surahName} : ${uiText.quran.verse} ${parsed.verse}`,
      );
    } else {
      const recent = localStorage.getItem("quran-recent");
      if (recent) {
        const arr = JSON.parse(recent);
        if (arr.length > 0) {
          const surahId = arr[0];
          const surahName = surahList?.find(
            (s) => s.id === surahId,
          )?.transliteration;
          setLastQuranActivity(
            surahName
              ? `${uiText.quran.surah} ${surahName}`
              : `${uiText.quran.surah} ${surahId}`,
          );
        }
      } else {
        setLastQuranActivity(uiText.quran.notRead);
      }
    }
  }, [surahList, locale, uiText]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      kr: "ko-KR",
      jp: "ja-JP",
    };
    return date.toLocaleDateString(localeMap[locale] || "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const latestArticles = useMemo(() => {
    if (!articlesData?.data) return [];
    const sorted = [...articlesData.data].sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );

    return sorted.map((article: Article) => {
      let title = article.title;
      let content = article.content;
      let categoryName = article.category?.name || "Umum";

      const articleTranslations = article.translations || [];
      const localized = articleTranslations.find((t) => t.locale === locale);

      if (localized) {
        if (localized.title) title = localized.title;
        if (localized.content) content = localized.content;
      } else {
        const idFallback = articleTranslations.find((t) => t.locale === "id");
        if (idFallback) {
          if (idFallback.title) title = idFallback.title;
          if (idFallback.content) content = idFallback.content;
        }
      }

      const catTranslations = article.category?.translations || [];
      const catTrans =
        catTranslations.find((t) => t.locale === locale) ||
        catTranslations.find((t) => t.locale === "id");
      if (catTrans && catTrans.name) categoryName = catTrans.name;

      const cleanContent = content ? content.replace(/<[^>]*>?/gm, "") : "";

      return {
        id: article.id.toString(),
        slug: article.id.toString(),
        title: title,
        excerpt: cleanContent.substring(0, 100) + "...",
        category: categoryName,
        readTime: "5 min",
        views: "1.2K",
        publishedAt: formatDate(article.published_at),
        image: article.image,
      };
    });
  }, [articlesData, locale]);

  const prayerWidgetData = useMemo(() => {
    if (!prayerTimes) return { title: uiText.loading, time: "--:--" };
    const prayerNames: Record<string, Record<PrayerKey, string>> = {
      id: {
        fajr: "Subuh",
        dhuhr: "Dzuhur",
        asr: "Ashar",
        maghrib: "Maghrib",
        isha: "Isya",
      },
      en: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      ar: {
        fajr: "الفجر",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
      },
      fr: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      kr: {
        fajr: "파즈르",
        dhuhr: "두후르",
        asr: "아스르",
        maghrib: "마그립",
        isha: "이샤",
      },
      jp: {
        fajr: "ファジュル",
        dhuhr: "ズフル",
        asr: "アスル",
        maghrib: "マグリブ",
        isha: "イシャー",
      },
    };

    const activeNames = prayerNames[locale] || prayerNames.id;
    const key = (currentPrayerKey || "fajr") as PrayerKey;
    const times = prayerTimes as unknown as Record<string, string>;

    return {
      title: activeNames[key] || key,
      time: times[key] || "--:--",
    };
  }, [prayerTimes, currentPrayerKey, locale, uiText]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header onScanClick={() => console.log("Membuka Scanner...")} />

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* --- CAROUSEL SECTION --- */}
        <section
          className="relative overflow-hidden rounded-2xl shadow-sm group"
          ref={emblaRef}
        >
          <div className="flex">
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="relative flex-[0_0_100%] min-w-0 h-44 sm:h-52"
              >
                <Image
                  src={item.image}
                  alt={`Banner ${item.id}`}
                  fill
                  className="object-cover"
                  priority={item.id === 1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 pb-8">
                  <h2 className="text-white font-bold text-lg font-comfortaa">
                    {greeting}
                  </h2>
                  <p className="text-white/80 text-xs font-comfortaa">
                    {uiText.latestArticles}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* --- DOTS INDICATOR --- */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? "w-6 bg-[#d0aa47]" // Warna Gold aktif
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* --- WIDGET CARDS SECTION --- */}
        <div className="grid grid-cols-2 gap-4">
          {/* Widget Produk Herbal / Prayer */}
          <WidgetCard
            type="prayer"
            title={t("widgets.prayer")}
            subtitle={prayerWidgetData.title}
            time={prayerWidgetData.time}
            status="current"
            // Menggunakan warna hijau herbal sesuai identitas apps
            className="bg-[#faf4e6] border-[#896b41]/20"
            icon={<Clock className="w-5 h-5 text-[#3b5e40]" />}
          />

          {/* Widget Aktivitas / Quran */}
          <WidgetCard
            type="activity"
            title={(() => {
              const titles: Record<LocaleCode, string> = {
                id: "Aktivitas",
                en: "Activity",
                ar: "نشاط",
                fr: "Activité",
                kr: "활동",
                jp: "活動",
              };
              return titles[safeLocale];
            })()}
            subtitle={t("widgets.quran")}
            activity={lastQuranActivity}
            className="bg-[#faf4e6] border-[#896b41]/20"
            icon={<BookOpen className="w-5 h-5 text-[#d0aa47]" />}
          />
        </div>

        <ProgressWidget />
        <FeatureNavigation />

        {/* Articles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {uiText.latestArticles}
            </h2>
            <Link href="/artikel">
              <Button
                variant="ghost"
                size="sm"
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa"
              >
                {uiText.viewAll}
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {isLoadingArticles ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
              </div>
            ) : latestArticles.length > 0 ? (
              latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4 font-comfortaa bg-white/50 rounded-xl border border-dashed border-gray-200">
                {uiText.noArticles}
              </p>
            )}
          </div>
        </div>
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
