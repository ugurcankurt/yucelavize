import { Navbar } from "@/components/storefront/navbar";
import { Footer } from "@/components/storefront/footer";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { ScrollToTop } from "@/components/storefront/scroll-to-top";
export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      {" "}
      <Navbar
        user={user}
        profile={profile}
        categories={categories || []}
      />{" "}
      <main className="flex-1 flex flex-col mb-16 lg:mb-0">{children}</main> <Footer />{" "}
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
