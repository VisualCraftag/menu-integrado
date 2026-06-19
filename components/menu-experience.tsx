"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, Utensils, Wifi } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category, ProductWithCategory } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type Props = {
  initialCategories: Category[];
  initialProducts: ProductWithCategory[];
  isDemo: boolean;
};

export function MenuExperience({ initialCategories, initialProducts, isDemo }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const [live, setLive] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const load = async () => {
      const [categoryResult, productResult] = await Promise.all([
        supabase.from("categories").select("*").order("created_at", { ascending: true }),
        supabase.from("products").select("*, categories(id, name)").order("created_at", { ascending: false }),
      ]);

      if (!categoryResult.error && categoryResult.data) setCategories(categoryResult.data);
      if (!productResult.error && productResult.data) setProducts(productResult.data as ProductWithCategory[]);
      setLive(true);
    };

    void load();

    const channel = supabase
      .channel("public-menu")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, load)
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category_id === activeCategory;
      const haystack = `${product.name} ${product.description} ${product.categories?.name ?? ""}`.toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });

    if (sort === "low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [activeCategory, products, query, sort]);

  const heroProduct = filteredProducts[0] ?? products[0];

  return (
    <section id="menu" className="bg-ink py-16 text-shell sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-shell/15 bg-white/5 px-3 py-2 text-sm font-bold text-citron">
              <Sparkles size={16} />
              Menu vivo e interactivo
            </div>
            <h2 className="max-w-xl text-4xl font-black tracking-normal sm:text-5xl">
              Elegir un plato deberia sentirse como explorar una app premium.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-shell/70">
              Navegacion por categorias, busqueda instantanea, filtros dinamicos y tarjetas visuales pensadas para celular.
            </p>
          </div>
          <div className="rounded-[2rem] border border-shell/10 bg-shell/8 p-3 shadow-soft">
            <div className="flex items-center justify-between rounded-[1.4rem] bg-shell p-3 text-ink">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-citron">
                  <Utensils size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/45">Sugerencia</p>
                  <p className="font-black">{heroProduct?.name ?? "Menu destacado"}</p>
                </div>
              </div>
              <span className="rounded-full bg-ink px-3 py-2 text-sm font-black text-shell">
                {heroProduct ? formatCurrency(heroProduct.price) : "$0"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/45" size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por plato, ingrediente o categoria"
              className="h-14 w-full rounded-2xl border border-transparent bg-shell pl-12 pr-4 text-base font-semibold text-ink outline-none ring-citron transition placeholder:text-ink/40 focus:ring-4"
            />
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            className="h-14 rounded-2xl border border-shell/10 bg-shell px-4 text-sm font-bold text-ink outline-none ring-citron focus:ring-4"
          >
            <option value="featured">Destacados</option>
            <option value="low">Menor precio</option>
            <option value="high">Mayor precio</option>
          </select>
          <div className="flex h-14 items-center gap-2 rounded-2xl border border-shell/10 bg-white/5 px-4 text-sm font-bold">
            <Wifi size={18} className={cn(live ? "text-citron" : "text-shell/35")} />
            {live ? "Tiempo real" : isDemo ? "Modo demo" : "Conectando"}
          </div>
        </div>

        <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "shrink-0 rounded-full border px-5 py-3 text-sm font-black transition",
              activeCategory === "all"
                ? "border-citron bg-citron text-ink"
                : "border-shell/15 bg-white/5 text-shell/75 hover:bg-white/10",
            )}
          >
            Todo
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "shrink-0 rounded-full border px-5 py-3 text-sm font-black transition",
                activeCategory === category.id
                  ? "border-citron bg-citron text-ink"
                  : "border-shell/15 bg-white/5 text-shell/75 hover:bg-white/10",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <article
              key={product.id}
              className="group animate-lift-in overflow-hidden rounded-[1.7rem] bg-shell text-ink shadow-soft"
              style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-shell/90 px-3 py-2 text-xs font-black uppercase text-ink">
                  {product.categories?.name ?? categories.find((item) => item.id === product.category_id)?.name ?? "Menu"}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-black">{product.name}</h3>
                  <span className="shrink-0 rounded-full bg-citron px-3 py-2 text-sm font-black">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/65">{product.description}</p>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-shell/10 bg-white/5 p-10 text-center">
            <p className="text-lg font-black">No encontramos platos con esos filtros.</p>
            <p className="mt-2 text-shell/60">Prueba otra categoria o cambia la busqueda.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
