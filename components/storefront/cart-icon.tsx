"use client";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateCoupon } from "@/app/actions/coupon";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
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
  DrawerSwipeHandle,
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
  hideDrawer?: boolean;
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

  const productPreviewNode = (
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
      <Drawer open={open} onOpenChange={onOpenChange}>
        {" "}
        <DrawerTrigger render={<button className="text-muted-foreground hover:text-destructive transition-colors p-1" />}>
          {" "}
          <Trash2 className="w-4 h-4" />{" "}
        </DrawerTrigger>{" "}
        <DrawerContent className="z-[60] rounded-t-[32px] rounded-b-none px-4 pb-8 h-auto bg-background border-none shadow-2xl !m-0 !max-w-none w-full [--drawer-inset:0px]">
          {" "}
          <DrawerHeader className="text-center sm:text-center mt-2 px-0 border-0">
            {" "}
            <DrawerTitle className="text-xl font-bold flex justify-center text-foreground">Sepetten Çıkar?</DrawerTitle>{" "}
            {productPreviewNode}
          </DrawerHeader>{" "}
          <div className="flex gap-3 pt-6 w-full">
            {" "}
            <DrawerClose render={
              <Button variant="secondary" className="flex-1 h-12 rounded-full font-bold text-base bg-muted hover:bg-muted/80 text-foreground" onClick={() => onOpenChange(false)}>
                Vazgeç
              </Button>
            } />
            <Button variant="destructive" className="flex-1 h-12 rounded-full font-bold text-base" onClick={() => { onRemove(); onOpenChange(false); }}>
              Evet, Sil
            </Button>{" "}
          </div>{" "}
        </DrawerContent>{" "}
      </Drawer>
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
          {productPreviewNode}
        </AlertDialogHeader>{" "}
        <AlertDialogFooter className="flex-row gap-3 pt-4 sm:justify-center w-full">
          {" "}
          <AlertDialogCancel render={
            <Button variant="secondary" className="flex-1 h-12 rounded-full font-bold text-base bg-muted hover:bg-muted/80 text-foreground mt-0">
              Vazgeç
            </Button>
          } onClick={() => onOpenChange(false)} />
          <AlertDialogAction 
            variant="destructive" 
            className="flex-1 h-12 rounded-full font-bold text-base mt-0" 
            onClick={() => { onRemove(); onOpenChange(false); }}
          >
            Evet, Sil
          </AlertDialogAction>
        </AlertDialogFooter>{" "}
      </AlertDialogContent>{" "}
    </AlertDialog>
  );
}

export function CartIcon({ className, iconClassName, badgeClassName, hideDrawer = false }: CartIconProps = {}) {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecommendations() {
      if (cart.items.length === 0) {
        setRecommendedProducts([]);
        return;
      }
      
      const supabase = createClient();
      const productIds = cart.items.map(item => item.product.id);
      
      // 1. Find collections of these products
      const { data: cpRel } = await supabase
        .from("collection_products")
        .select("collection_id")
        .in("product_id", productIds);
        
      if (!cpRel || cpRel.length === 0) return;
      
      const collectionIds = [...new Set(cpRel.map(c => c.collection_id))];
      
      // 2. Fetch products in these collections that are NOT in the cart
      const { data: recRel } = await supabase
        .from("collection_products")
        .select(`
          product:products (
            id, name, slug, price, discounted_price, images
          )
        `)
        .in("collection_id", collectionIds);
        
      if (!recRel) return;
      
      const recProducts = recRel
        .map(r => r.product as any)
        .filter((p: any) => p && !productIds.includes(p.id));
        
      // Deduplicate products
      const uniqueProducts = Array.from(new Map(recProducts.map((item: any) => [item.id, item])).values());
      
      setRecommendedProducts(uniqueProducts.slice(0, 4));
    }
    
    if (mounted) fetchRecommendations();
  }, [cart.items, mounted]);

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
  
  const isMobilePortrait = isMobile && !isLandscapeMobile;

  const triggerButton = (
    <Button variant="ghost" size="icon" className={className || "w-9 h-9 relative"} onClick={() => cart.openCart()}>
      <ShoppingCart className={iconClassName || "h-5 w-5"} />
      {itemCount > 0 && (
        <span className={badgeClassName || "absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-[10px] font-bold text-background flex items-center justify-center"}>
          {itemCount}
        </span>
      )}
      <span className="sr-only">Sepet</span>
    </Button>
  );

  if (hideDrawer) {
    return triggerButton;
  }

  const Wrapper = isMobilePortrait ? Drawer : Sheet;
  const WrapperTrigger = isMobilePortrait ? DrawerTrigger : SheetTrigger;
  const WrapperContent = isMobilePortrait ? DrawerContent : SheetContent;
  const WrapperHeader = isMobilePortrait ? DrawerHeader : SheetHeader;
  const WrapperTitle = isMobilePortrait ? DrawerTitle : SheetTitle;
  const WrapperClose = isMobilePortrait ? DrawerClose : SheetClose;
  return (
    <>
    <Wrapper {...(isMobilePortrait ? { direction: "top" } : {})} swipeDirection="up" open={cart.isOpen} onOpenChange={(open) => open ? cart.openCart() : cart.closeCart()}>
      {" "}
      <WrapperTrigger render={triggerButton}>
      </WrapperTrigger>{" "}
      <WrapperContent
        
        
        className={
          isMobile && !isLandscapeMobile
            ? "flex flex-col w-full !max-w-none h-full max-h-[85dvh] rounded-b-[32px] rounded-t-none z-[49] pt-6 px-0 pb-0 !m-0 [--drawer-inset:0px]"
            : isLandscapeMobile
              ? "flex flex-col w-full sm:max-w-md p-0 z-[49]"
              : "flex flex-col w-full sm:max-w-md p-0"
        }
      >
        {" "}
        <WrapperHeader className={isMobile && !isLandscapeMobile ? "shrink-0 px-6 pb-4 border-b border-border" : "shrink-0 p-6 border-b border-border"}>
          {" "}
          <WrapperTitle className="text-xl font-bold flex items-center gap-2">
            {" "}
            Sepetim{" "}
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {itemCount} Ürün
            </span>{" "}
          </WrapperTitle>{" "}
        </WrapperHeader>{" "}
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
            <WrapperClose
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
            </WrapperClose>{" "}
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
              ))} 
              
              {/* Çapraz Satış Önerileri */}
              {recommendedProducts.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                    Bunlar da İlginizi Çekebilir
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {recommendedProducts.map((rec) => (
                      <Link 
                        href={`/products/${rec.slug}`} 
                        key={rec.id}
                        className="group flex flex-col bg-background rounded-xl border border-border p-2 hover:border-primary/30 transition-colors"
                      >
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                          {rec.images?.[0] ? (
                            <Image 
                              src={rec.images[0]} 
                              alt={rec.name} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-300" 
                              sizes="120px" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-5 h-5 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {rec.name}
                        </span>
                        <span className="text-xs font-bold text-primary mt-1">
                          ₺{(rec.discounted_price || rec.price).toLocaleString("tr-TR")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div> 
            <div className={isMobile && !isLandscapeMobile ? "shrink-0 border-t border-border p-6 bg-muted space-y-4 rounded-b-[32px]" : "shrink-0 border-t border-border p-6 bg-muted space-y-4"}>
              
              {/* Coupon Section */}
              <div className="mb-2 pb-4 border-b border-border/50">
                {!cart.appliedCoupon ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Kupon Kodu" 
                        className="pl-9 h-10 bg-background uppercase text-sm" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      />
                    </div>
                    <Button 
                      variant="secondary" 
                      className="h-10 px-4 font-bold text-sm"
                      disabled={!couponCode || isApplying}
                      onClick={async () => {
                        setIsApplying(true);
                        const result = await validateCoupon(couponCode, cart.getTotal());
                        setIsApplying(false);
                        
                        if (result.error) {
                          toast.add({
                            title: "Hata",
                            description: result.error,
                            type: "error",
                          } as any);
                        } else if (result.coupon) {
                          cart.applyCoupon(result.coupon);
                          setCouponCode("");
                          toast.add({
                            title: "Başarılı",
                            description: "Kupon başarıyla uygulandı!",
                            type: "success",
                          } as any);
                        }
                      }}
                    >
                      {isApplying ? "..." : "Uygula"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-success/10 border border-success/20 rounded-xl">
                    <div className="flex items-center gap-2 text-success font-semibold text-sm">
                      <Tag className="w-4 h-4" />
                      <span>{cart.appliedCoupon.code} Uygulandı</span>
                    </div>
                    <button 
                      onClick={() => cart.removeCoupon()}
                      className="p-1 hover:bg-success/20 rounded-md text-success transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Ara Toplam
                </span>
                <span className="font-bold text-foreground">
                  ₺{cart.getTotal().toLocaleString("tr-TR")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Kargo
                </span>
                <span className="font-bold text-success">Ücretsiz</span>
              </div>

              {cart.appliedCoupon && (
                <div className="flex items-center justify-between text-sm text-success">
                  <span className="font-medium">İndirim ({cart.appliedCoupon.code})</span>
                  <span className="font-bold">
                    -₺{cart.getDiscountAmount().toLocaleString("tr-TR")}
                  </span>
                </div>
              )}

              <Separator className="bg-secondary" />
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground">
                  Toplam
                </span>
                <span className="text-xl font-black text-primary">
                  ₺{cart.getFinalTotal().toLocaleString("tr-TR")}
                </span>
              </div>
              <WrapperClose
                nativeButton={false}
                render={
                  <Button
                    className="w-full h-14 rounded-full text-base font-bold shadow-lg shadow-primary/20"
                    nativeButton={false}
                    render={<Link href="/checkout" />}
                  />
                }
              >
                Sepeti Onayla <ArrowRight className="w-5 h-5 ml-2" />
              </WrapperClose>
            </div>
          </>
        )}{" "}
        {isMobilePortrait && (
          <div className="flex justify-center pb-4 pt-2">
            <DrawerSwipeHandle className="after:bg-foreground" />
          </div>
        )}
      </WrapperContent>{" "}
    </Wrapper>
    
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
