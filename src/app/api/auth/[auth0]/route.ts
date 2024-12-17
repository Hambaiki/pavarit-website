import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";
import { NextApiRequest } from "next";

const logoutUrl = [
  `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?`,
  `client_id=${process.env.AUTH0_CLIENT_ID}`,
  `&returnTo=${process.env.AUTH0_BASE_URL}`,
];

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: process.env.AUTH0_SCOPE,
    },
    getLoginState: (req: NextApiRequest) => {
      // Extract returnTo from URL search params
      const url = new URL(req.url || "", process.env.AUTH0_BASE_URL);
      const returnTo = url.searchParams.get("returnTo")
        ? decodeURIComponent(url.searchParams.get("returnTo") as string)
        : "/profile";

      return {
        returnTo,
      };
    },
  }),
  logout: handleLogout({
    returnTo: logoutUrl.join(""),
  }),
});
