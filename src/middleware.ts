import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

import {
  withMiddlewareAuthRequired,
  getSession,
} from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired(async (req: NextRequest) => {
  const res = NextResponse.next();

  const user = await getSession(req, res);

  if (!user) {
    return NextResponse.redirect("/api/auth/login");
  }

  return res;
});

// only work on the '/' path
export const config = {
  matcher: "/profile",
};
