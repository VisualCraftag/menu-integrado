import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";
import { getMenuData } from "@/lib/menu-service";
import { cookies } from "next/headers";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("mesa-viva-admin")?.value === "ok";

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  const { categories, products } = await getMenuData();

  return <AdminDashboard initialCategories={categories} initialProducts={products} />;
}
