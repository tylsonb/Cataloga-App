import Link from "next/link";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="grid min-h-screen place-items-center bg-secondary/30 p-4"><div className="w-full max-w-md"><Link href="/" className="mb-8 block text-center text-2xl font-bold">Catáloga</Link>{children}</div></main>;
}
