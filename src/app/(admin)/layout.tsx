import { Sidebar } from "@/components/layout/sidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar variant="admin" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
