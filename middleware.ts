import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ROUTES } from "~/constants/routes";

// for test
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authSid = request.cookies.get("connect.sid")?.value;
  if (authSid) return NextResponse.next();
  return NextResponse.redirect(new URL(ROUTES.LOGIN(), request.url));
}

export const config = {
  matcher: ["/", "/programs/:path*"],
};
