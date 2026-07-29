"use client";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
export function CartIcon() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const itemCount = mounted ? cart.getItemCount() : 0;
  const cartTotal = mounted ? cart.getTotal() : 0;
  return (
    <Sheet>
      {" "}
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="w-9 h-9 relative" />
        }
      >
        {" "}
        <ShoppingCart className="h-5 w-5" />{" "}
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-[10px] font-bold text-background flex items-center justify-center">
            {" "}
            {itemCount}{" "}
          </span>
        )}{" "}
        <span className="sr-only">Sepet</span>{" "}
      </SheetTrigger>{" "}
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        {" "}
        <SheetHeader className="p-6 border-b border-border">
          {" "}
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            {" "}
            Sepetim{" "}
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {itemCount} Ürün
            </span>{" "}
          </SheetTitle>{" "}
        </SheetHeader>{" "}
        {!mounted ? (
          <div className="flex-1 flex items-center justify-center">
            {" "}
            <p className="text-sm text-muted-foreground">Yükleniyor...</p>{" "}
          </div>
        ) : cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            {" "}
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              {" "}
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />{" "}
            </div>{" "}
            <h3 className="text-xl font-bold text-foreground">Sepetiniz boş</h3>{" "}
            <p className="text-sm text-muted-foreground max-w-[250px]">
              {" "}
              Sepetinizde henüz ürün bulunmamaktadır. Alışverişe başlamak için
              ürünlerimize göz atın.{" "}
            </p>{" "}
            <SheetClose
              nativeButton={false}
              render={
                <Button
                  className="mt-8 rounded-full px-8 h-12"
                  nativeButton={false}
                  render={<Link href="/products" />}
                />
              }
            >
              {" "}
              Alışverişe Başla{" "}
            </SheetClose>{" "}
          </div>
        ) : (
          <>
            {" "}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {" "}
              {cart.items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.color || idx}`}
                  className="flex gap-4"
                >
                  {" "}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-muted"
                  >
                    {" "}
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        {" "}
                        <ShoppingCart className="w-6 h-6 text-muted-foreground" />{" "}
                      </div>
                    )}{" "}
                  </Link>{" "}
                  <div className="flex-1 flex flex-col min-w-0">
                    {" "}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors"
                    >
                      {" "}
                      {item.product.name}{" "}
                    </Link>{" "}
                    {item.color && (
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                        {" "}
                        Renk:{" "}
                        <span className="text-muted-foreground">{item.color}</span>{" "}
                      </p>
                    )}{" "}
                    <p className="text-sm font-bold text-primary mt-1">
                      ₺{item.product.price}
                    </p>{" "}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      {" "}
                      <div className="flex items-center border border-border rounded-full bg-background">
                        {" "}
                        <button
                          onClick={() =>
                            cart.updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.color,
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-muted-foreground disabled:cursor-not-allowed"
                        >
                          {" "}
                          <Minus className="w-3 h-3" />{" "}
                        </button>{" "}
                        <span className="w-6 text-center text-xs font-semibold text-foreground">
                          {" "}
                          {item.quantity}{" "}
                        </span>{" "}
                        <button
                          onClick={() =>
                            cart.updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.color,
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                        >
                          {" "}
                          <Plus className="w-3 h-3" />{" "}
                        </button>{" "}
                      </div>{" "}
                      <AlertDialog>
                        {" "}
                        <AlertDialogTrigger
                          render={
                            <button className="text-muted-foreground hover:text-destructive transition-colors p-1" />
                          }
                        >
                          {" "}
                          <Trash2 className="w-4 h-4" />{" "}
                        </AlertDialogTrigger>{" "}
                        <AlertDialogContent>
                          {" "}
                          <AlertDialogHeader>
                            {" "}
                            <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>{" "}
                            <AlertDialogDescription>
                              {" "}
                              Bu ürünü sepetinizden kaldırmak istediğinize emin
                              misiniz?{" "}
                            </AlertDialogDescription>{" "}
                          </AlertDialogHeader>{" "}
                          <AlertDialogFooter>
                            {" "}
                            <AlertDialogCancel>Vazgeç</AlertDialogCancel>{" "}
                            <AlertDialogAction
                              onClick={() => {
                                cart.removeItem(item.product.id, item.color);
                                toast.add({
                                  title: "Silindi",
                                  description:
                                    "Ürün sepetinizden başarıyla kaldırıldı.",
                                  type: "success",
                                } as any);
                              }}
                            >
                              {" "}
                              Sil{" "}
                            </AlertDialogAction>{" "}
                          </AlertDialogFooter>{" "}
                        </AlertDialogContent>{" "}
                      </AlertDialog>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className="border-t border-border p-6 bg-muted space-y-4">
              {" "}
              <div className="flex items-center justify-between text-sm">
                {" "}
                <span className="text-muted-foreground font-medium">
                  Ara Toplam
                </span>{" "}
                <span className="font-bold text-foreground">
                  ₺{cartTotal.toFixed(2)}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center justify-between text-sm">
                {" "}
                <span className="text-muted-foreground font-medium">
                  Kargo
                </span>{" "}
                <span className="font-bold text-success">Ücretsiz</span>{" "}
              </div>{" "}
              <Separator className="bg-secondary" />{" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="text-base font-bold text-foreground">
                  Toplam
                </span>{" "}
                <span className="text-xl font-black text-primary">
                  ₺{cartTotal.toFixed(2)}
                </span>{" "}
              </div>{" "}
              <SheetClose
                nativeButton={false}
                render={
                  <Button
                    className="w-full h-14 rounded-full text-base font-bold shadow-lg shadow-primary/20"
                    nativeButton={false}
                    render={<Link href="/checkout" />}
                  />
                }
              >
                {" "}
                Sepeti Onayla <ArrowRight className="w-5 h-5 ml-2" />{" "}
              </SheetClose>{" "}
            </div>{" "}
          </>
        )}{" "}
      </SheetContent>{" "}
    </Sheet>
  );
}
