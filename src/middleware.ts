import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROUTES = {
  "/admin": ["ADMIN"],
  "/partner": ["PARTNER"],
  "/delivery": ["DELIVERY_AGENT"],
  "/dashboard": ["CUSTOMER", "PARTNER", "DELIVERY_AGENT", "ADMIN"],
  "/orders": ["CUSTOMER", "PARTNER", "DELIVERY_AGENT", "ADMIN"],
};

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const protectedPrefix = Object.keys(ROLE_ROUTES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (protectedPrefix) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const allowedRoles = ROLE_ROUTES[protectedPrefix as keyof typeof ROLE_ROUTES];
    if (!allowedRoles.includes(session.user?.role ?? "")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/delivery/:path*", "/orders/:path*", "/dashboard/:path*"],
};
