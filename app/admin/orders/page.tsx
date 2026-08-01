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
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText } from "lucide-react";

export default async function AdminOrders() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Siparişler" />
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
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
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant="default" className="uppercase bg-green-500 hover:bg-green-600">{order.coupon_code}</Badge>
                      <span className="text-[11px] text-muted-foreground">-₺{order.discount_total || 0}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status as any} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/orders/${order.id}`} className="cursor-pointer flex items-center" />}>
                        <FileText className="w-4 h-4 mr-2" /> Detayı Görüntüle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  );
}
