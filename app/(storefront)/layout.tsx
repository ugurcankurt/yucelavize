import { Navbar } from "@/components/storefront/navbar";
import { Footer } from "@/components/storefront/footer";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { Suspense } from "react";
import { ScrollToTop } from "@/components/storefront/scroll-to-top";
import { getCachedCategories } from "@/lib/services/public-data";
import { FavoritesInitializer } from "@/components/storefront/favorites-initializer";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCachedCategories();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <FavoritesInitializer />
      
      <Suspense fallback={<div className="h-20 w-full border-b border-border bg-background" />}>
        <Navbar categories={categories || []} />
      </Suspense>
      
      <main className="flex-1 flex flex-col mb-16 lg:mb-0">{children}</main>
      <Footer />
      
      <Suspense 
        fallback={
          <div className="lg:hidden fixed left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900 rounded-[24px] shadow-2xl z-[60] bottom-6 h-16 pointer-events-none opacity-50" />
        }
      >
        <MobileBottomNav />
      </Suspense>
    </div>
  );
}
