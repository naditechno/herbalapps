import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

type RoleObject = { name?: string; slug?: string; role?: string };
type RoleShape = string | RoleObject;
type TokenWithRoles = JWT & { roles?: RoleShape[] };

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search,
  );
  return NextResponse.redirect(url);
}

const roleName = (r: RoleShape): string =>
  typeof r === "string" ? r : (r.name ?? r.slug ?? r.role ?? "");

const isAdminOrSuperadmin = (roles?: RoleShape[]): boolean =>
  Array.isArray(roles) &&
  roles.some((r) =>
    ["superadmin", "admin"].includes(roleName(r).toLowerCase()),
  );

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as TokenWithRoles | null;

  const pathname = req.nextUrl.pathname;

  const isVipPage = pathname.startsWith("/vip");
  const isAdminPage = pathname.startsWith("/admin");

  if (isVipPage && !token) {
    return redirectToLogin(req);
  }

  if (isAdminPage) {
    if (!token) {
      return redirectToLogin(req);
    }
    if (!isAdminOrSuperadmin(token.roles)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};