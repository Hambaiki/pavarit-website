import { createUser, getUserByAuth0Sub } from "@/lib/db/users";
import {
  AfterCallbackAppRoute,
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
} from "@auth0/nextjs-auth0";
import { NextApiRequest } from "next";

const logoutUrl = [
  `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?`,
  `client_id=${process.env.AUTH0_CLIENT_ID}`,
  `&returnTo=${process.env.AUTH0_BASE_URL}`,
];

const afterCallback: AfterCallbackAppRoute = async (_, session) => {
  // Check if user exists in database
  const user = await getUserByAuth0Sub(session.user.sub);
  // If user doesn't exist, create them
  if (!user) {
    const newUser = await createUser({
      auth0_sub: session.user.sub,
      email: session.user.email,
      name: session.user.name,
    });
    // Get the newly created user
    if (newUser) {
      session.user.id = newUser.id;
    }
  } else {
    session.user.id = user[0].id;
  }
  return session;
};

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: process.env.AUTH0_SCOPE,
    },
    getLoginState: (req: NextApiRequest) => {
      // Extract returnTo from URL search params
      const url = new URL(req.url || "", process.env.AUTH0_BASE_URL);
      const returnTo = url.searchParams.get("returnTo") || "/profile";

      return {
        returnTo,
      };
    },
  }),
  logout: handleLogout({
    returnTo: logoutUrl.join(""),
  }),
  callback: handleCallback({
    afterCallback,
  }),
});
