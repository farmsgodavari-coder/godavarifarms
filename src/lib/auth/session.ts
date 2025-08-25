import { cookies } from "next/headers";

const SESSION_COOKIE = "session";

type AdminUser = {
  uid: string;
  email: string;
  role: "admin";
};

export async function getSessionUser(): Promise<AdminUser | null> {
  // Direct admin mode: always authenticated
  return { uid: "direct-admin", email: "admin@local", role: "admin" };
}
