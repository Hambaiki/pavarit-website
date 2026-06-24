import { redirect } from "next/navigation";

import { serverLogout } from "@/features/auth/actions";

export const dynamic = "force-dynamic";

export default async function LogoutPage() {
  await serverLogout();
  redirect("/");
}
