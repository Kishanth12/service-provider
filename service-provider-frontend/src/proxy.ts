import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_DASHBOARDS: Record<string, string> = {
  ADMIN: "/admin",
  PROVIDER: "/provider",
  USER: "/user",
};

const getAuthFromCookies = (request: NextRequest) => {
  const authCookie = request.cookies.get("auth-storage")?.value;

  if (!authCookie) return { isAuthenticated: false, userRole: null };

  try {
    const authData = JSON.parse(authCookie);
    return {
      isAuthenticated: authData?.state?.isAuthenticated || false,
      userRole: authData?.state?.user?.role || null,
    };
  } catch {
    return { isAuthenticated: false, userRole: null };
  }
};

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const { isAuthenticated, userRole } = getAuthFromCookies(request);

  const isProtectedRoute = ["/user", "/provider", "/admin"].some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = ["/login", "/register"].includes(path);

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated && userRole) {
    const dashboard = ROLE_DASHBOARDS[userRole] || "/user";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Role-based access control for protected routes
  if (isProtectedRoute && isAuthenticated) {
    const allowedRoutes: Record<string, string[]> = {
      "/admin": ["ADMIN"],
      "/provider": ["PROVIDER", "ADMIN"],
      "/user": ["USER", "ADMIN"],
    };

    const matchedRoute = Object.keys(allowedRoutes).find((route) =>
      path.startsWith(route)
    );

    if (matchedRoute && !allowedRoutes[matchedRoute].includes(userRole!)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/provider/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
