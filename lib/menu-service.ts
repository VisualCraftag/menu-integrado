import { createClient } from "@/lib/supabase/server";
import { demoCategories, demoProducts } from "@/lib/menu-data";
import type { Category, ProductWithCategory } from "@/lib/types";

export async function getMenuData(): Promise<{
  categories: Category[];
  products: ProductWithCategory[];
  isDemo: boolean;
}> {
  const supabase = await createClient();

  if (!supabase) {
    return { categories: demoCategories, products: demoProducts, isDemo: true };
  }

  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    supabase
      .from("products")
      .select("*, categories(id, name)")
      .order("created_at", { ascending: false }),
  ]);

  if (categoriesResult.error || productsResult.error) {
    return { categories: demoCategories, products: demoProducts, isDemo: true };
  }

  const categories = categoriesResult.data ?? [];
  const products = (productsResult.data ?? []) as ProductWithCategory[];

  if (categories.length === 0 || products.length === 0) {
    return { categories: demoCategories, products: demoProducts, isDemo: true };
  }

  return { categories, products, isDemo: false };
}
