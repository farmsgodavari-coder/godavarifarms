import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  redirect("/admin");
  return null;
}
