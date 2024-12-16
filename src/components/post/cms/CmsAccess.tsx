"use server";

import { getSession } from "@auth0/nextjs-auth0";
import { jwtDecode } from "jwt-decode";

async function CmsAccess() {
  const session = await getSession();

  async function checkCMSAuthorized() {
    const accessToken = session?.accessToken;
    if (!accessToken) {
      return false;
    } else {
      const decodedToken: { permissions: string[] } = jwtDecode(accessToken);
      const isCMSAuthorized = decodedToken.permissions.includes("write:system");

      return isCMSAuthorized;
    }
  }

  const authorized = await checkCMSAuthorized();

  if (authorized) {
    return (
      <div className="px-4 py-2 transition-colors text-center bg-black hover:bg-neutral-950">
        <span className="text-sm font-bold">Cms</span>
      </div>
    );
  }

  return null;
}

export default CmsAccess;
