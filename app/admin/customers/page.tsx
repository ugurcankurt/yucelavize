import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Müşteriler</h2>
      </div>
      <div className="rounded-md border bg-white dark:bg-black">
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
            {uniqueCustomers.map((customer, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{customer.name}</TableCell>
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
                  <Button variant="outline" size="sm">
                    Siparişleri Gör
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
