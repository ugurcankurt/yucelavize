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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
interface CartIconProps {
  className?: string;
  iconClassName?: string;
  badgeClassName?: string;
}

function RemoveItemDialog({
  item,
  onRemove,
  isMobile,
  open,
  onOpenChange
}: {
  item: any;
  onRemove: () => void;
  isMobile: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!item) return null;

  const ProductPreview = () => (
    <div className="flex gap-4 p-4 mt-6 mb-2 border border-border rounded-2xl bg-muted/30 shadow-sm items-center text-left">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-border shrink-0">
        {item.product.images?.[0] ? (
          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
        ) : (
          <ShoppingCart className="w-6 h-6 text-muted-foreground m-auto mt-5" />
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-bold text-foreground text-sm line-clamp-1">{item.product.name}</span>
        {item.color && <span className="text-xs text-muted-foreground mt-0.5">Renk: {item.color}</span>}
        <span className="font-bold text-primary mt-1">₺{item.product.price}</span>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {" "}
        <SheetTrigger render={<button className="text-muted-foreground hover:text-destructive transition-colors p-1" />}>
          {" "}
          <Trash2 className="w-4 h-4" />{" "}
        </SheetTrigger>{" "}
        <SheetContent side="bottom" overlayClassName="z-[60] bg-black/60 backdrop-blur-sm" className="z-[60] rounded-t-[32px] px-4 pb-8 h-auto bg-background border-none shadow-2xl">
          {" "}
          <SheetHeader className="text-center sm:text-center mt-2 px-0 border-0">
            {" "}
            <SheetTitle className="text-xl font-bold flex justify-center text-foreground">Sepetten Çıkar?</SheetTitle>{" "}
            <ProductPreview />
          </SheetHeader>{" "}
          <div className="flex gap-3 pt-6 w-full">
            {" "}
            <SheetClose render={
              <Button variant="secondary" className="flex-1 h-12 rounded-full font-bold text-base bg-muted hover:bg-muted/80 text-foreground" onClick={() => onOpenChange(false)}>
                Vazgeç
              </Button>
            } />
            <Button variant="destructive" className="flex-1 h-12 rounded-full font-bold text-base" onClick={() => { onRemove(); onOpenChange(false); }}>
              Evet, Sil
            </Button>{" "}
          </div>{" "}
        </SheetContent>{" "}
      </Sheet>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {" "}
      <AlertDialogTrigger render={<button className="text-muted-foreground hover:text-destructive transition-colors p-1" />}>
        {" "}
        <Trash2 className="w-4 h-4" />{" "}
      </AlertDialogTrigger>{" "}
      <AlertDialogContent className="p-6 bg-background border-none shadow-2xl">
        {" "}
        <AlertDialogHeader className="text-center sm:text-center">
          {" "}
          <AlertDialogTitle className="text-xl font-bold text-center text-foreground">Sepetten Çıkar?</AlertDialogTitle>{" "}
          <AlertDialogDescription className="sr-only">Bu ürünü sepetinizden kaldırmak istediğinize emin misiniz?</AlertDialogDescription>{" "}
          <ProductPreview />
        </AlertDialogHeader>{" "}
        <AlertDialogFooter className="flex-row gap-3 pt-4 sm:justify-center w-full">
          {" "}
          <AlertDialogCancel render={
            <Button variant="secondary" className="flex-1 h-12 rounded-full font-bold text-base bg-muted hover:bg-muted/80 text-foreground mt-0">
              Vazgeç
            </Button>
          } onClick={() => onOpenChange(false)} />
          <AlertDialogAction render={
            <Button variant="destructive" className="flex-1 h-12 rounded-full font-bold text-base mt-0" onClick={() => { onRemove(); onOpenChange(false); }}>
              Evet, Sil
            </Button>
          } />
        </AlertDialogFooter>{" "}
      </AlertDialogContent>{" "}
    </AlertDialog>
  );
}

export function CartIcon({ className, iconClassName, badgeClassName }: CartIconProps = {}) {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsLandscapeMobile(window.innerWidth < 1024 && window.innerHeight < 500);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const itemCount = mounted ? cart.getItemCount() : 0;
  const cartTotal = mounted ? cart.getTotal() : 0;
  return (
    <>
    <Sheet open={cart.isOpen} onOpenChange={(open) => open ? cart.openCart() : cart.closeCart()}>
      {" "}
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className={className || "w-9 h-9 relative"} onClick={() => cart.openCart()} />
        }
      >
        {" "}
        <ShoppingCart className={iconClassName || "h-5 w-5"} />{" "}
        {itemCount > 0 && (
          <span className={badgeClassName || "absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-[10px] font-bold text-background flex items-center justify-center"}>
            {" "}
            {itemCount}{" "}
          </span>
        )}{" "}
        <span className="sr-only">Sepet</span>{" "}
      </SheetTrigger>{" "}
      <SheetContent
        side={isMobile && !isLandscapeMobile ? "top" : "right"}
        overlayClassName={isMobile ? "z-[49]" : ""}
        className={
          isMobile && !isLandscapeMobile
            ? "flex flex-col w-full h-full max-h-[85dvh] rounded-b-[32px] z-[49] pt-[90px] px-0 pb-0"
            : isLandscapeMobile
              ? "flex flex-col w-full sm:max-w-md p-0 z-[49]"
              : "flex flex-col w-full sm:max-w-md p-0"
        }
      >
        {" "}
        <SheetHeader className={isMobile && !isLandscapeMobile ? "shrink-0 px-6 pb-4 border-b border-border" : "shrink-0 p-6 border-b border-border"}>
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
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
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
                      <button
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        onClick={() => setItemToRemove(item)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className={isMobile && !isLandscapeMobile ? "shrink-0 border-t border-border p-6 bg-muted space-y-4 rounded-b-[32px]" : "shrink-0 border-t border-border p-6 bg-muted space-y-4"}>
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
    
    <RemoveItemDialog 
      item={itemToRemove} 
      isMobile={isMobile}
      open={!!itemToRemove}
      onOpenChange={(open) => !open && setItemToRemove(null)}
      onRemove={() => {
        if (itemToRemove) {
          cart.removeItem(itemToRemove.product.id, itemToRemove.color);
          toast.add({
            title: "Silindi",
            description: "Ürün sepetinizden başarıyla kaldırıldı.",
            type: "success",
          } as any);
        }
      }} 
    />
    </>
  );
}
