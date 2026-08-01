import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShoppingBag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { createClient } from "@/lib/supabase/server";

export default async function AdminCustomers() {
  const supabase = await createClient();

  // Müşterileri siparişler tablosundan tekilleştirerek (distinct) çekiyoruz
  // veya eğer ayrı bir auth/users yapısı kurulsaydı oradan çekilebilirdi.
  // Bu aşamada sipariş verenleri müşteri olarak listeliyoruz.
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "customer_name, customer_email, customer_phone, shipping_address, created_at",
    )
    .order("created_at", { ascending: false });

  // Tekilleştirme mantığı (Aynı email veya telefonu kullananları grupla)
  const customersMap = new Map();
  if (orders) {
    orders.forEach((order) => {
      const key = order.customer_email || order.customer_phone;
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: order.customer_name,
          email: order.customer_email || "-",
          phone: order.customer_phone,
          address: order.shipping_address,
          last_order: order.created_at,
          total_orders: 1,
        });
      } else {
        const existing = customersMap.get(key);
        existing.total_orders += 1;
        customersMap.set(key, existing);
      }
    });
  }

  const uniqueCustomers = Array.from(customersMap.values());

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Müşteriler" />
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Müşteri Adı</TableHead>
              <TableHead>İletişim</TableHead>
              <TableHead>Sipariş Sayısı</TableHead>
              <TableHead>Son Sipariş</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-destructive py-6"
                >
                  Müşteri bilgileri yüklenemedi.
                </TableCell>
              </TableRow>
            )}
            {!error && uniqueCustomers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Henüz müşteri bulunmuyor.
                </TableCell>
              </TableRow>
            )}
            {uniqueCustomers.map((customer, i) => {
              const initials = customer.name?.substring(0, 2).toUpperCase() || "MÜ";
              return (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{customer.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {customer.phone}
                  </div>
                </TableCell>
                <TableCell>{customer.total_orders}</TableCell>
                <TableCell>
                  {new Date(customer.last_order).toLocaleDateString("tr-TR")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer flex items-center">
                        <ShoppingBag className="w-4 h-4 mr-2" /> Siparişleri Gör
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  );
}
