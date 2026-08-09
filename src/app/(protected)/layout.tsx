import { MobileNav } from "@/components/layout/mobile-nav";
import { ProtectedHeader } from "@/components/layout/protected-header";

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <ProtectedHeader />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
