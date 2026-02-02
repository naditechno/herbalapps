"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "./components/BottomNavigation";

export default function NavigationWrapper() {
  const pathname = usePathname();

  const hiddenPaths = ["/auth/login", "/auth/register", "/login", "/register", "/menu"];

  const shouldHideNavigation =
    hiddenPaths.includes(pathname) ||
    pathname.startsWith("/menu/")

  if (shouldHideNavigation) {
    return null;
  }

  return <BottomNavigation />;
}