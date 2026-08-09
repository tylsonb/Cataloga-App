import { Sidebar } from "@/components/layout/sidebar";

export default function SellerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
