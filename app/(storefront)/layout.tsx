import { Navbar } from "@/components/storefront/navbar";
import { Footer } from "@/components/storefront/footer";
import { WhatsappButton } from "@/components/storefront/whatsapp-button";
import { createClient } from "@/lib/supabase/server";
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
      {" "}
      <Navbar
        user={user}
        profile={profile}
        categories={categories || []}
      />{" "}
      <main className="flex-1 flex flex-col">{children}</main> <Footer />{" "}
      <WhatsappButton />{" "}
    </div>
  );
}
