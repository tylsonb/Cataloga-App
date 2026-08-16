import { Sidebar } from "@/components/layout/sidebar";

export default function SellerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
    </div>
  );
}
