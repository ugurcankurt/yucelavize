import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import Link from "next/link";

export default async function AdminOrders() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Siparişler</h2>
      </div>
      <div className="rounded-md border bg-white dark:bg-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş Kodu</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Kupon / İndirim</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-destructive py-6"
                >
                  Veriler yüklenirken hata oluştu.
                </TableCell>
              </TableRow>
            )}
            {!error && (!orders || orders.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-muted-foreground"
                >
                  Henüz sipariş bulunmuyor.
                </TableCell>
              </TableRow>
            )}
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.id.split("-")[0]}
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString("tr-TR")}
                </TableCell>
                <TableCell className="font-bold">₺{order.total_amount}</TableCell>
                <TableCell>
                  {order.coupon_code ? (
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-success uppercase">{order.coupon_code}</span>
                      <span className="text-[11px] text-muted-foreground">-₺{order.discount_total || 0}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Detay
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
