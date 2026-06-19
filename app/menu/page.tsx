import { Navbar } from "@/components/navbar";
import { MenuExperience } from "@/components/menu-experience";
import { getMenuData } from "@/lib/menu-service";

export default async function MenuPage() {
  const { categories, products, isDemo } = await getMenuData();

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <MenuExperience initialCategories={categories} initialProducts={products} isDemo={isDemo} />
    </main>
  );
}
