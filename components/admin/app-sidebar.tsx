"use client";
import { Home, Package, ShoppingCart, Users, Settings, ImageIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Siparişler", url: "/admin/orders", icon: ShoppingCart },
  { title: "Kategoriler", url: "/admin/categories", icon: Package },
  { title: "Ürünler", url: "/admin/products", icon: Package },
  { title: "Müşteriler", url: "/admin/customers", icon: Users },
  { title: "Slider Yönetimi", url: "/admin/slides", icon: ImageIcon },
  { title: "Kampanyalar", url: "/admin/campaigns", icon: Package },
  { title: "Kuponlar", url: "/admin/coupons", icon: Package },
  { title: "Ayarlar", url: "/admin/settings", icon: Settings },
];
export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      {" "}
      <SidebarContent>
        {" "}
        <SidebarGroup>
          {" "}
          <SidebarGroupLabel>Yücel Avize Yönetim</SidebarGroupLabel>{" "}
          <SidebarGroupContent>
            {" "}
            <SidebarMenu>
              {" "}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {" "}
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                  >
                    {" "}
                    <item.icon /> <span>{item.title}</span>{" "}
                  </SidebarMenuButton>{" "}
                </SidebarMenuItem>
              ))}{" "}
            </SidebarMenu>{" "}
          </SidebarGroupContent>{" "}
        </SidebarGroup>{" "}
      </SidebarContent>{" "}
    </Sidebar>
  );
}
