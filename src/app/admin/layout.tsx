import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
