import Link from "next/link";
import { Leaf, Menu as MenuIcon } from "lucide-react";

const items = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Menu", href: "/menu" },
  { label: "Contacto", href: "/#contacto" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-shell/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/#inicio" className="flex items-center gap-2 text-lg font-black tracking-normal">
          <span className="grid size-9 place-items-center rounded-full bg-ink text-citron">
            <Leaf size={18} />
          </span>
          Mesa Viva
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-ink hover:text-shell"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <details className="relative">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-ink/10">
              <MenuIcon size={18} />
            </summary>
            <div className="absolute right-0 mt-3 grid w-44 gap-1 rounded-2xl border border-ink/10 bg-shell p-2 shadow-soft">
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 text-sm font-semibold">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
