"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category, ProductWithCategory } from "@/lib/types";
import { formatCurrency, slugify } from "@/lib/utils";
import { categorySchema, productSchema } from "@/lib/validators";

type ProductForm = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url: string;
};

const blankProduct: ProductForm = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  image_url: "",
};

export function AdminDashboard({
  initialCategories,
  initialProducts,
}: {
  initialCategories: Category[];
  initialProducts: ProductWithCategory[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(blankProduct);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const loadData = useCallback(async () => {
    if (!supabase) return;
    const [categoryResult, productResult] = await Promise.all([
      supabase.from("categories").select("*").order("created_at", { ascending: true }),
      supabase.from("products").select("*, categories(id, name)").order("created_at", { ascending: false }),
    ]);
    if (!categoryResult.error && categoryResult.data) setCategories(categoryResult.data);
    if (!productResult.error && productResult.data) setProducts(productResult.data as ProductWithCategory[]);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("admin-menu")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, loadData)
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadData, supabase]);

  const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    if (!supabase) return setMessage("Supabase no esta configurado.");

    const parsed = categorySchema.safeParse({ name: categoryName });
    if (!parsed.success) return setMessage(parsed.error.issues[0]?.message ?? "Categoria invalida.");

    setLoading(true);
    const result = editingCategory
      ? await supabase.from("categories").update(parsed.data).eq("id", editingCategory.id)
      : await supabase.from("categories").insert(parsed.data);
    setLoading(false);

    if (result.error) return setMessage(result.error.message);
    setCategoryName("");
    setEditingCategory(null);
    await loadData();
  };

  const deleteCategory = async (category: Category) => {
    if (!supabase) return;
    const confirmed = window.confirm(`Eliminar categoria "${category.name}"?`);
    if (!confirmed) return;
    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    if (error) setMessage("No se pudo eliminar. Revisa si tiene productos asociados.");
    await loadData();
  };

  const uploadImage = async (file: File) => {
    if (!supabase) throw new Error("Supabase no esta configurado.");
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${slugify(file.name.replace(`.${ext}`, ""))}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    return supabase.storage.from("menu-images").getPublicUrl(path).data.publicUrl;
  };

  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    if (!supabase) return setMessage("Supabase no esta configurado.");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("image") as File | null;
    let imageUrl = productForm.image_url;

    try {
      setLoading(true);
      if (file && file.size > 0) {
        imageUrl = await uploadImage(file);
      }

      const parsed = productSchema.safeParse({ ...productForm, image_url: imageUrl });
      if (!parsed.success) {
        setLoading(false);
        return setMessage(parsed.error.issues[0]?.message ?? "Producto invalido.");
      }

      const payload = {
        name: parsed.data.name,
        description: parsed.data.description,
        price: parsed.data.price,
        image_url: parsed.data.image_url || imageUrl,
        category_id: parsed.data.category_id,
      };

      const result = productForm.id
        ? await supabase.from("products").update(payload).eq("id", productForm.id)
        : await supabase.from("products").insert(payload);

      setLoading(false);
      if (result.error) return setMessage(result.error.message);
      setProductForm(blankProduct);
      formElement.reset();
      await loadData();
    } catch (error) {
      setLoading(false);
      setMessage(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    }
  };

  const editProduct = (product: ProductWithCategory) => {
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: String(product.price),
      category_id: product.category_id,
      image_url: product.image_url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (product: ProductWithCategory) => {
    if (!supabase) return;
    const confirmed = window.confirm(`Eliminar "${product.name}"?`);
    if (!confirmed) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) setMessage(error.message);
    await loadData();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-oat px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-4 rounded-[2rem] bg-ink p-5 text-shell sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-citron">Mesa Viva</p>
            <h1 className="mt-2 text-3xl font-black">Administracion del menu</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-full bg-shell px-4 py-3 text-sm font-black text-ink">
            <LogOut size={17} />
            Salir
          </button>
        </header>

        {message ? (
          <div className="mt-5 rounded-2xl bg-tomato/10 p-4 text-sm font-bold text-tomato">{message}</div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[2rem] bg-shell p-5 shadow-soft">
            <h2 className="text-2xl font-black">Categorias</h2>
            <form onSubmit={saveCategory} className="mt-4 flex gap-3">
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                className="h-12 min-w-0 flex-1 rounded-2xl border border-ink/10 bg-oat px-4 font-semibold outline-none focus:ring-4 focus:ring-citron"
                placeholder="Nueva categoria"
              />
              <button disabled={loading} className="grid size-12 shrink-0 place-items-center rounded-full bg-basil text-white disabled:opacity-60">
                {editingCategory ? <Pencil size={18} /> : <Plus size={18} />}
              </button>
            </form>
            {editingCategory ? (
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryName("");
                }}
                className="mt-3 inline-flex items-center gap-2 text-sm font-black text-ink/60"
              >
                <X size={16} /> Cancelar edicion
              </button>
            ) : null}
            <div className="mt-5 grid gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded-2xl bg-oat p-3">
                  <span className="font-black">{category.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryName(category.name);
                      }}
                      className="grid size-9 place-items-center rounded-full bg-shell"
                    >
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteCategory(category)} className="grid size-9 place-items-center rounded-full bg-tomato text-white">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-shell p-5 shadow-soft">
            <h2 className="text-2xl font-black">{productForm.id ? "Editar producto" : "Crear producto"}</h2>
            <form onSubmit={saveProduct} className="mt-4 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={productForm.name}
                  onChange={(event) => setProductForm((value) => ({ ...value, name: event.target.value }))}
                  className="h-12 rounded-2xl border border-ink/10 bg-oat px-4 font-semibold outline-none focus:ring-4 focus:ring-citron"
                  placeholder="Nombre"
                />
                <input
                  value={productForm.price}
                  onChange={(event) => setProductForm((value) => ({ ...value, price: event.target.value }))}
                  className="h-12 rounded-2xl border border-ink/10 bg-oat px-4 font-semibold outline-none focus:ring-4 focus:ring-citron"
                  placeholder="Precio, ej: 12000"
                  inputMode="decimal"
                  type="text"
                />
              </div>
              <textarea
                value={productForm.description}
                onChange={(event) => setProductForm((value) => ({ ...value, description: event.target.value }))}
                className="min-h-28 rounded-2xl border border-ink/10 bg-oat px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-citron"
                placeholder="Descripcion"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  value={productForm.category_id}
                  onChange={(event) => setProductForm((value) => ({ ...value, category_id: event.target.value }))}
                  className="h-12 rounded-2xl border border-ink/10 bg-oat px-4 font-semibold outline-none focus:ring-4 focus:ring-citron"
                >
                  <option value="">Categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-oat px-4 text-sm font-black">
                  <Camera size={18} />
                  Imagen
                  <input name="image" type="file" accept="image/*" className="sr-only" />
                </label>
              </div>
              {productForm.image_url ? (
                <input
                  value={productForm.image_url}
                  onChange={(event) => setProductForm((value) => ({ ...value, image_url: event.target.value }))}
                  className="h-12 rounded-2xl border border-ink/10 bg-oat px-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-citron"
                  placeholder="URL de imagen actual"
                />
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button disabled={loading} className="h-14 rounded-full bg-basil px-5 py-4 text-sm font-black text-white transition hover:bg-ink disabled:opacity-60">
                  {loading ? "Guardando..." : productForm.id ? "Guardar cambios" : "Crear producto"}
                </button>
                {productForm.id ? (
                  <button
                    type="button"
                    onClick={() => setProductForm(blankProduct)}
                    className="h-14 rounded-full border border-ink/10 px-5 py-4 text-sm font-black"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </form>
          </section>
        </div>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Productos</h2>
              <p className="text-sm font-semibold text-ink/55">{products.length} elementos publicados</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[1.6rem] bg-shell shadow-soft">
                <div className="relative aspect-[4/3]">
                  <Image src={product.image_url} alt={product.name} fill sizes="(min-width: 1280px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-basil">
                        {product.categories?.name ?? "Menu"}
                      </p>
                      <h3 className="mt-1 text-lg font-black">{product.name}</h3>
                    </div>
                    <span className="rounded-full bg-citron px-3 py-2 text-sm font-black">{formatCurrency(product.price)}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">{product.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => editProduct(product)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-black text-shell">
                      <Pencil size={16} /> Editar
                    </button>
                    <button onClick={() => deleteProduct(product)} className="grid size-11 place-items-center rounded-full bg-tomato text-white">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
