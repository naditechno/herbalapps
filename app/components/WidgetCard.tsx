"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";
import { cn } from "@/lib/utils"; // Utilitas standar shadcn untuk penggabungan class

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface WidgetTranslations {
  status: {
    current: string;
    upcoming: string;
    completed: string;
  };
  labels: {
    prayerTime: string;
    lastActivity: string;
  };
}

interface WidgetCardProps {
  type: "prayer" | "activity";
  title: string;
  subtitle: string;
  time?: string;
  status?: "current" | "upcoming" | "completed";
  activity?: string;
  icon: React.ReactNode;
  className?: string; // Properti ditambahkan untuk memperbaiki error TypeScript
}

// --- TRANSLATION DICTIONARY ---
const WIDGET_TEXT: Record<LocaleCode, WidgetTranslations> = {
  id: {
    status: {
      current: "Sekarang",
      upcoming: "Berikutnya",
      completed: "Selesai",
    },
    labels: {
      prayerTime: "Waktu Sholat",
      lastActivity: "Aktivitas Terakhir",
    },
  },
  en: {
    status: {
      current: "Now",
      upcoming: "Next",
      completed: "Done",
    },
    labels: {
      prayerTime: "Prayer Time",
      lastActivity: "Last Activity",
    },
  },
  ar: {
    status: {
      current: "الآن",
      upcoming: "القادم",
      completed: "تم",
    },
    labels: {
      prayerTime: "وقت الصلاة",
      lastActivity: "آخر نشاط",
    },
  },
  fr: {
    status: {
      current: "Maint.",
      upcoming: "Suiv.",
      completed: "Fait",
    },
    labels: {
      prayerTime: "Heure de Prière",
      lastActivity: "Dernière Activité",
    },
  },
  kr: {
    status: {
      current: "현재",
      upcoming: "다음",
      completed: "완료",
    },
    labels: {
      prayerTime: "기도 시간",
      lastActivity: "마지막 활동",
    },
  },
  jp: {
    status: {
      current: "現在",
      upcoming: "次",
      completed: "完了",
    },
    labels: {
      prayerTime: "礼拝時間",
      lastActivity: "最後の活動",
    },
  },
};

export default function WidgetCard({
  type,
  title,
  subtitle,
  time,
  status,
  activity,
  icon,
  className,
}: WidgetCardProps) {
  const { locale } = useI18n();

  // Validasi locale agar selalu aman saat mengakses dictionary
  const safeLocale = (
    WIDGET_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = WIDGET_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // Helper untuk merender teks status berdasarkan i18n
  const getStatusLabel = (s: "current" | "upcoming" | "completed") => {
    return t.status[s];
  };

  return (
    <Card
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "border-awqaf-border-light hover:shadow-md transition-all duration-200 h-full relative overflow-visible",
        className,
      )}
    >
      {/* Status Badge */}
      {status && (
        <Badge
          variant={status === "current" ? "default" : "secondary"}
          className={cn(
            "absolute -top-1 z-10 text-[10px] px-2 py-0.5 shadow-sm",
            isRtl ? "-left-1" : "-right-1",
            status === "current"
              ? "bg-emerald-600 text-white" // Warna disesuaikan ke Hijau Sukses
              : "bg-amber-100 text-amber-700",
          )}
        >
          {getStatusLabel(status)}
        </Badge>
      )}

      <CardContent className="p-3 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-black/5">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-card-foreground text-[11px] font-comfortaa leading-tight truncate">
              {title}
            </h3>
            <p className="text-[9px] text-gray-500 font-comfortaa leading-tight mt-0.5 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-center">
          {type === "prayer" && time && (
            <div className="text-center">
              <div className="text-xl font-bold text-[#3b5e40] font-comfortaa tracking-tight">
                {time}
              </div>
              <p className="text-[9px] font-semibold text-gray-400 font-comfortaa mt-1 uppercase tracking-wider">
                {t.labels.prayerTime}
              </p>
            </div>
          )}

          {type === "activity" && activity && (
            <div className="text-center">
              <div className="text-[11px] font-bold text-gray-700 font-comfortaa leading-snug line-clamp-2 min-h-[2.8em] flex items-center justify-center px-1">
                {activity}
              </div>
              <p className="text-[9px] font-semibold text-gray-400 font-comfortaa mt-1 uppercase tracking-wider">
                {t.labels.lastActivity}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}