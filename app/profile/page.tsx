"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Settings,
  LogOut,
  ChevronRight,
  ShoppingBag,
  QrCode,
  Lock,
  Edit3,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  HelpCircle,
  FileText,
  LucideIcon,
  LogIn,
} from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
type ViewState = "dashboard" | "orders" | "account" | "qrcode" | "password";

// Interface untuk Props InputGroup
interface InputGroupProps {
  label: string;
  value?: string;
  placeholder?: string;
  icon: LucideIcon;
  type?: string;
}

// --- TRANSLATIONS ---
interface ProfileTranslations {
  title: string;
  guestName: string;
  hi: string;
  loginBtn: string;
  level: string;
  points: string;
  dailyCheckIn: string;
  menuHeader: string;
  menus: {
    orders: string;
    qr: string;
    account: string;
    password: string;
    logout: string;
    help: string;
    about: string;
  };
  orders: {
    title: string;
    active: string;
    history: string;
    empty: string;
    orderNow: string;
    loginFirst: string;
  };
  account: {
    title: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    birth: string;
    save: string;
  };
  password: {
    title: string;
    old: string;
    new: string;
    confirm: string;
    submit: string;
  };
}

const PROFILE_TEXT: Record<LocaleCode, ProfileTranslations> = {
  id: {
    title: "Profil Saya",
    guestName: "Tamu",
    hi: "Hai,",
    loginBtn: "Masuk atau Daftar",
    level: "Member Silver",
    points: "Poin Herbal",
    dailyCheckIn: "Absen Harian",
    menuHeader: "Menu",
    menus: {
      orders: "Pesanan Saya",
      qr: "QR Code Member",
      account: "Data Akun",
      password: "Ubah Password",
      logout: "Keluar",
      help: "Bantuan",
      about: "Tentang Aplikasi",
    },
    orders: {
      title: "Riwayat Pesanan",
      active: "Sedang Jalan",
      history: "Riwayat",
      empty: "Belum ada pesanan",
      orderNow: "PESAN SEKARANG",
      loginFirst: "Silakan login untuk melihat pesanan.",
    },
    account: {
      title: "Edit Profil",
      name: "Nama Lengkap",
      email: "Email",
      phone: "Nomor HP",
      gender: "Jenis Kelamin",
      birth: "Tanggal Lahir",
      save: "Simpan Profil",
    },
    password: {
      title: "Ubah Password",
      old: "Password Lama",
      new: "Password Baru",
      confirm: "Konfirmasi Password",
      submit: "Ganti Password",
    },
  },
  en: {
    title: "My Profile",
    guestName: "Guest",
    hi: "Hi,",
    loginBtn: "Login or Register",
    level: "Silver Member",
    points: "Herbal Points",
    dailyCheckIn: "Daily Check-In",
    menuHeader: "Menu",
    menus: {
      orders: "My Orders",
      qr: "Member QR Code",
      account: "Account Data",
      password: "Change Password",
      logout: "Logout",
      help: "Help",
      about: "About App",
    },
    orders: {
      title: "Order History",
      active: "Active",
      history: "History",
      empty: "No orders yet",
      orderNow: "ORDER NOW",
      loginFirst: "Please login to view orders.",
    },
    account: {
      title: "Edit Profile",
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      gender: "Gender",
      birth: "Date of Birth",
      save: "Save Profile",
    },
    password: {
      title: "Change Password",
      old: "Old Password",
      new: "New Password",
      confirm: "Confirm Password",
      submit: "Update Password",
    },
  },
  ar: {
    title: "ملفي الشخصي",
    guestName: "ضيف",
    hi: "مرحباً،",
    loginBtn: "دخول أو تسجيل",
    level: "عضو فضي",
    points: "نقاط الأعشاب",
    dailyCheckIn: "تسجيل الدخول اليومي",
    menuHeader: "قائمة",
    menus: {
      orders: "طلباتي",
      qr: "رمز الاستجابة السريعة",
      account: "بيانات الحساب",
      password: "تغيير كلمة المرور",
      logout: "تسجيل الخروج",
      help: "مساعدة",
      about: "عن التطبيق",
    },
    orders: {
      title: "سجل الطلبات",
      active: "نشط",
      history: "سجل",
      empty: "لا توجد طلبات بعد",
      orderNow: "اطلب الآن",
      loginFirst: "الرجاء تسجيل الدخول لعرض الطلبات.",
    },
    account: {
      title: "تعديل الملف الشخصي",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      gender: "الجنس",
      birth: "تاريخ الميلاد",
      save: "حفظ الملف الشخصي",
    },
    password: {
      title: "تغيير كلمة المرور",
      old: "كلمة المرور القديمة",
      new: "كلمة المرور الجديدة",
      confirm: "تأكيد كلمة المرور",
      submit: "تحديث كلمة المرور",
    },
  },
  fr: {
    title: "Mon Profil",
    guestName: "Invité",
    hi: "Salut,",
    loginBtn: "Connexion ou Inscription",
    level: "Membre Argent",
    points: "Points Herbal",
    dailyCheckIn: "Pointage Quotidien",
    menuHeader: "Menu",
    menus: {
      orders: "Mes Commandes",
      qr: "QR Code Membre",
      account: "Données du Compte",
      password: "Changer le Mot de Passe",
      logout: "Déconnexion",
      help: "Aide",
      about: "À propos",
    },
    orders: {
      title: "Historique des Commandes",
      active: "En cours",
      history: "Historique",
      empty: "Aucune commande",
      orderNow: "COMMANDER",
      loginFirst: "Veuillez vous connecter pour voir les commandes.",
    },
    account: {
      title: "Modifier le Profil",
      name: "Nom Complet",
      email: "Email",
      phone: "Téléphone",
      gender: "Genre",
      birth: "Date de Naissance",
      save: "Enregistrer",
    },
    password: {
      title: "Changer le Mot de Passe",
      old: "Ancien Mot de Passe",
      new: "Nouveau Mot de Passe",
      confirm: "Confirmer",
      submit: "Mettre à jour",
    },
  },
  kr: {
    title: "내 프로필",
    guestName: "게스트",
    hi: "안녕하세요,",
    loginBtn: "로그인 또는 가입",
    level: "실버 회원",
    points: "허브 포인트",
    dailyCheckIn: "매일 출석체크",
    menuHeader: "메뉴",
    menus: {
      orders: "내 주문",
      qr: "회원 QR 코드",
      account: "계정 정보",
      password: "비밀번호 변경",
      logout: "로그아웃",
      help: "도움말",
      about: "앱 정보",
    },
    orders: {
      title: "주문 내역",
      active: "진행 중",
      history: "내역",
      empty: "주문 내역이 없습니다",
      orderNow: "지금 주문하기",
      loginFirst: "주문을 보려면 로그인하십시오.",
    },
    account: {
      title: "프로필 수정",
      name: "이름",
      email: "이메일",
      phone: "전화번호",
      gender: "성별",
      birth: "생년월일",
      save: "프로필 저장",
    },
    password: {
      title: "비밀번호 변경",
      old: "현재 비밀번호",
      new: "새 비밀번호",
      confirm: "비밀번호 확인",
      submit: "비밀번호 업데이트",
    },
  },
  jp: {
    title: "プロフィール",
    guestName: "ゲスト",
    hi: "こんにちは、",
    loginBtn: "ログインまたは登録",
    level: "シルバー会員",
    points: "ハーブポイント",
    dailyCheckIn: "デイリーチェックイン",
    menuHeader: "メニュー",
    menus: {
      orders: "注文履歴",
      qr: "会員QRコード",
      account: "アカウント情報",
      password: "パスワード変更",
      logout: "ログアウト",
      help: "ヘルプ",
      about: "アプリについて",
    },
    orders: {
      title: "注文履歴",
      active: "進行中",
      history: "履歴",
      empty: "注文はまだありません",
      orderNow: "今すぐ注文",
      loginFirst: "注文を表示するにはログインしてください。",
    },
    account: {
      title: "プロフィール編集",
      name: "氏名",
      email: "メール",
      phone: "電話番号",
      gender: "性別",
      birth: "生年月日",
      save: "プロフィール保存",
    },
    password: {
      title: "パスワード変更",
      old: "現在のパスワード",
      new: "新しいパスワード",
      confirm: "パスワード確認",
      submit: "パスワード更新",
    },
  },
};

export default function ProfilePage() {
  const { locale } = useI18n();
  const router = useRouter();
  const { data: session } = useSession(); // SESSION DETECTED HERE

  const safeLocale = (
    PROFILE_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = PROFILE_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // --- STATE ---
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");

  // Logic: Session exists?
  const isLoggedIn = !!session;
  const userName = session?.user?.name || t.guestName;
  const userEmail = session?.user?.email || "";

  // --- HANDLERS ---
  const handleBack = () => setCurrentView("dashboard");
  const handleLoginRedirect = () => router.push("/auth/login");
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/profile" });
  };

  // --- RENDER COMPONENT HELPERS ---

  // 1. DASHBOARD VIEW
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="relative bg-gradient-to-b from-[#faf4e6] to-white pb-6 pt-2 px-4 rounded-b-[2rem] shadow-sm border-b border-[#896b41]/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#3b5e40] border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              {isLoggedIn ? (
                <Image
                  src="https://picsum.photos/seed/user/200/200"
                  alt="User"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-[#faf4e6]" />
              )}
            </div>
            <div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">
                  {t.hi}
                </span>
                <h2 className="font-bold text-[#3b5e40] text-xl font-comfortaa">
                  {userName}
                </h2>
              </div>
              {!isLoggedIn && (
                <button
                  onClick={handleLoginRedirect}
                  className="mt-1 text-sm text-[#d0aa47] font-bold flex items-center gap-1 hover:underline"
                >
                  {t.loginBtn} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => setCurrentView("account")}
              className="p-2 bg-white rounded-full shadow-sm border border-[#896b41]/10 text-[#896b41]"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* MEMBER CARD (Only if Logged In) */}
        {isLoggedIn && (
          <div className="bg-white rounded-2xl p-4 shadow-md border border-[#d0aa47]/20 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d0aa47]/10 rounded-bl-full -mr-4 -mt-4"></div>

            <div className="flex justify-between items-start mb-2 relative z-10">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {t.level}
                </p>
                <h3 className="text-[#3b5e40] font-bold text-lg">Silver</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {t.points}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  <div className="w-4 h-4 rounded-full bg-[#d0aa47] flex items-center justify-center text-[10px] text-white font-bold">
                    P
                  </div>
                  <h3 className="text-[#896b41] font-bold text-lg">150</h3>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>0</span>
                <span>500 to Gold</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#896b41] to-[#d0aa47] w-[30%]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 space-y-6 pb-24">
        {/* DAILY CHECK-IN (Only if Logged In) */}
        {isLoggedIn && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#896b41]/10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[#3b5e40]">{t.dailyCheckIn}</h3>
              <span className="text-xs text-[#d0aa47] font-bold cursor-pointer">
                Detail
              </span>
            </div>
            <div className="flex justify-between gap-2 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4, 5].map((day, idx) => (
                <div
                  key={day}
                  className={`flex flex-col items-center gap-1 min-w-[50px] p-2 rounded-lg border ${idx === 0 ? "border-[#d0aa47] bg-[#faf4e6]" : "border-gray-100"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? "bg-[#d0aa47] text-white" : "bg-gray-200 text-gray-400"}`}
                  >
                    {idx === 0 ? "✓" : "+10"}
                  </div>
                  <span className="text-[10px] text-gray-500">Day {day}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENU LIST */}
        <div className="space-y-3">
          <h3 className="font-bold text-[#3b5e40] px-1">{t.menuHeader}</h3>

          <MenuButton
            icon={ShoppingBag}
            label={t.menus.orders}
            onClick={() =>
              isLoggedIn ? setCurrentView("orders") : handleLoginRedirect()
            }
          />

          {isLoggedIn && (
            <>
              <MenuButton
                icon={QrCode}
                label={t.menus.qr}
                onClick={() => setCurrentView("qrcode")}
              />
              <MenuButton
                icon={User}
                label={t.menus.account}
                onClick={() => setCurrentView("account")}
              />
              <MenuButton
                icon={Lock}
                label={t.menus.password}
                onClick={() => setCurrentView("password")}
              />
            </>
          )}

          <div className="h-px bg-gray-100 my-2"></div>

          <MenuButton
            icon={HelpCircle}
            label={t.menus.help}
            onClick={() => {}}
          />
          <MenuButton
            icon={FileText}
            label={t.menus.about}
            onClick={() => {}}
          />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              {t.menus.logout}
            </button>
          ) : (
            // Show Login Button in Menu if not logged in (Optional, for easy access)
            <button
              onClick={handleLoginRedirect}
              className="w-full flex items-center gap-3 p-4 bg-[#3b5e40]/10 text-[#3b5e40] rounded-xl font-bold hover:bg-[#3b5e40]/20 transition-colors mt-4"
            >
              <LogIn className="w-5 h-5" />
              {t.loginBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // 2. ORDER HISTORY VIEW
  const renderOrders = () => (
    <div className="min-h-screen bg-white">
      <SubPageHeader title={t.orders.title} onBack={handleBack} />

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-4">
        <button className="flex-1 py-4 text-[#3b5e40] font-bold border-b-2 border-[#3b5e40]">
          {t.orders.active}
        </button>
        <button className="flex-1 py-4 text-gray-400 font-medium">
          {t.orders.history}
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
        <div className="w-24 h-24 bg-[#faf4e6] rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 text-[#d0aa47]" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-6">
          {t.orders.empty}
        </h3>
        <button
          onClick={() => router.push("/menu")}
          className="px-8 py-3 bg-white border border-[#896b41] text-[#896b41] rounded-lg font-bold hover:bg-[#faf4e6] transition-colors"
        >
          {t.orders.orderNow}
        </button>
      </div>
    </div>
  );

  // 3. EDIT PROFILE VIEW
  const renderAccount = () => (
    <div className="min-h-screen bg-white mb-14">
      <SubPageHeader title={t.account.title} onBack={handleBack} />
      <div className="p-4 space-y-5">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-[#faf4e6]">
              <Image
                src="https://picsum.photos/seed/user/200/200"
                alt="User"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-[#3b5e40] rounded-full text-white shadow-sm border-2 border-white">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <InputGroup label={t.account.name} value={userName || ""} icon={User} />
        <InputGroup
          label={t.account.email}
          value={userEmail || ""}
          icon={Mail}
        />
        <InputGroup label={t.account.phone} value="081234567890" icon={Phone} />

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">
            {t.account.gender}
          </label>
          <div className="flex gap-4">
            <button className="flex-1 py-2.5 rounded-lg border border-[#3b5e40] bg-[#faf4e6] text-[#3b5e40] font-bold text-sm">
              Wanita
            </button>
            <button className="flex-1 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-500 font-medium text-sm">
              Pria
            </button>
          </div>
        </div>

        <InputGroup
          label={t.account.birth}
          value="1998-05-21"
          icon={Calendar}
          type="date"
        />

        <button className="w-full bg-[#3b5e40] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#3b5e40]/20 mt-2 active:scale-[0.98] transition-transform">
          {t.account.save}
        </button>
      </div>
    </div>
  );

  // 4. QR CODE VIEW
  const renderQr = () => (
    <div className="min-h-screen bg-[#3b5e40] flex flex-col">
      <SubPageHeader title={t.menus.qr} onBack={handleBack} lightMode={false} />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xs flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              <Image
                src="https://picsum.photos/seed/user/200/200"
                alt="User"
                width={32}
                height={32}
              />
            </div>
            <span className="font-bold text-gray-800">{userName}</span>
          </div>
          <div className="w-64 h-64 bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <QrCode className="w-32 h-32" />
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            Scan this code at the cashier to earn points
          </p>
        </div>
      </div>
    </div>
  );

  // 5. CHANGE PASSWORD VIEW
  const renderPassword = () => (
    <div className="min-h-screen bg-white">
      <SubPageHeader title={t.password.title} onBack={handleBack} />
      <div className="p-4 space-y-5 pt-8">
        <InputGroup
          label={t.password.old}
          placeholder="******"
          icon={Lock}
          type="password"
        />
        <InputGroup
          label={t.password.new}
          placeholder="******"
          icon={Lock}
          type="password"
        />
        <InputGroup
          label={t.password.confirm}
          placeholder="******"
          icon={ShieldCheck}
          type="password"
        />

        <button className="w-full bg-[#896b41] text-white py-3.5 rounded-xl font-bold shadow-lg mt-8">
          {t.password.submit}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="w-full max-w-md mx-auto bg-gray-50 min-h-screen relative"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {currentView === "dashboard" && renderDashboard()}
      {currentView === "orders" && renderOrders()}
      {currentView === "account" && renderAccount()}
      {currentView === "qrcode" && renderQr()}
      {currentView === "password" && renderPassword()}
    </div>
  );
}

// --- SUB COMPONENTS ---

function MenuButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#faf4e6] flex items-center justify-center text-[#896b41]">
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-bold text-gray-700 text-sm">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );
}

function SubPageHeader({
  title,
  onBack,
  lightMode = true,
}: {
  title: string;
  onBack: () => void;
  lightMode?: boolean;
}) {
  return (
    <div
      className={`sticky top-0 z-50 px-4 h-16 flex items-center gap-4 ${lightMode ? "bg-white border-b border-gray-100" : "bg-[#3b5e40]"}`}
    >
      <button
        onClick={onBack}
        className={`p-2 rounded-full transition-colors ${lightMode ? "hover:bg-gray-100 text-[#3b5e40]" : "hover:bg-white/10 text-white"}`}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1
        className={`text-lg font-bold flex-1 ${lightMode ? "text-[#3b5e40]" : "text-white"}`}
      >
        {title}
      </h1>
    </div>
  );
}

function InputGroup({
  label,
  value,
  placeholder,
  icon: Icon,
  type = "text",
}: InputGroupProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:border-[#3b5e40] focus:bg-white transition-all"
        />
      </div>
    </div>
  );
}