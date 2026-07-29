import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Package, LogOut, Heart, MapPin, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";
import { UserAvatar } from "@/components/storefront/user-avatar";
import { AvatarUpload } from "@/components/storefront/avatar-upload";
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }
  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return (
    <div className="w-full bg-muted font-sans min-h-screen py-10 md:py-16">
      {" "}
      <div className="container mx-auto px-4 max-w-6xl">
        {" "}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          {" "}
          <div>
            {" "}
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              Hesabım
            </h1>{" "}
            <p className="text-muted-foreground font-medium mt-1">
              {" "}
              Hoş geldiniz,{" "}
              <span className="font-bold text-foreground">
                {profile?.full_name || user.email?.split("@")[0]}
              </span>{" "}
            </p>{" "}
          </div>{" "}
          <form action={logout}>
            {" "}
            <Button
              variant="outline"
              className="text-destructive border-destructive/30 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/40 rounded-full font-semibold px-6"
            >
              {" "}
              <LogOut className="w-4 h-4 mr-2" /> Çıkış Yap{" "}
            </Button>{" "}
          </form>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {" "}
          {/* Sidebar Navigation */}{" "}
          <div className="lg:col-span-3 space-y-6">
            {" "}
            <div className="bg-background border border-border rounded-[32px] overflow-hidden shadow-sm shadow-gray-100/50">
              {" "}
              <div className="p-8 border-b border-gray-50 flex flex-col items-center text-center">
                {" "}
                <UserAvatar
                  user={user}
                  profile={profile}
                  className="w-24 h-24 border-4 border-border shadow-lg ring-1 ring-muted mb-4"
                  fallbackClassName="bg-primary/5 text-primary text-2xl font-black"
                />{" "}
                <h2 className="font-bold text-lg text-foreground">
                  {profile?.full_name || "Değerli Müşterimiz"}
                </h2>{" "}
                <p className="text-xs font-medium text-muted-foreground mt-1 mb-4">
                  {user.email}
                </p>{" "}
                <AvatarUpload
                  userId={user.id}
                  currentAvatarUrl={
                    profile?.avatar_url || user.user_metadata?.avatar_url
                  }
                />{" "}
                <div className="px-3 py-1 bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider rounded-full border border-success/20">
                  {" "}
                  Onaylı Hesap{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex flex-col p-4 space-y-1">
                {" "}
                {/* Since we are rendering these on the server, we don't have access to usePathname() directly in the layout to highlight the active link perfectly, so we'll use a slightly generic styling or create a client component for the sidebar menu if we want active states. For now, we use a clean hover design. */}{" "}
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-semibold rounded-2xl hover:bg-muted hover:text-primary transition-colors"
                >
                  {" "}
                  <Package className="w-5 h-5" /> Siparişlerim{" "}
                </Link>{" "}
                <Link
                  href="/account/favorites"
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-semibold rounded-2xl hover:bg-muted hover:text-primary transition-colors"
                >
                  {" "}
                  <Heart className="w-5 h-5" /> Favorilerim{" "}
                </Link>{" "}
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-semibold rounded-2xl hover:bg-muted hover:text-primary transition-colors"
                >
                  {" "}
                  <MapPin className="w-5 h-5" /> Adreslerim{" "}
                </Link>{" "}
                <Link
                  href="/account/settings"
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-semibold rounded-2xl hover:bg-muted hover:text-primary transition-colors"
                >
                  {" "}
                  <Settings className="w-5 h-5" /> Hesap Ayarları{" "}
                </Link>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Main Content Area */}{" "}
          <div className="lg:col-span-9 space-y-6"> {children} </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
