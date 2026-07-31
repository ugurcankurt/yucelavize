import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Package, LogOut, Heart, MapPin, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";
import { UserAvatar } from "@/components/storefront/user-avatar";
import { AvatarUpload } from "@/components/storefront/avatar-upload";
import { AccountNav } from "@/components/storefront/account-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="w-full bg-muted/30 font-sans min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="hidden lg:flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Hesabım
            </h1>
            <p className="text-muted-foreground font-medium mt-1 text-base">
              Hoş geldiniz,{" "}
              <span className="font-bold text-foreground">
                {profile?.full_name || user.email?.split("@")[0]}
              </span>
            </p>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-border/60 rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm sticky top-24">
              <div className="p-4 lg:p-8 border-b border-border/40 flex flex-row lg:flex-col items-center lg:text-center bg-muted/10 relative overflow-hidden gap-4 lg:gap-0">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                
                <UserAvatar
                  user={user}
                  profile={profile}
                  className="w-16 h-16 lg:w-24 lg:h-24 border-2 lg:border-4 border-background shadow-lg ring-1 ring-border/50 lg:mb-4 z-10 shrink-0"
                  fallbackClassName="bg-primary text-primary-foreground text-xl lg:text-3xl font-black"
                />
                
                <div className="flex-1 min-w-0 flex flex-col items-start lg:items-center">
                  <h2 className="font-black text-base lg:text-lg text-foreground z-10 truncate w-full text-left lg:text-center">
                    {profile?.full_name || "Değerli Müşterimiz"}
                  </h2>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5 lg:mt-1 lg:mb-5 z-10 truncate w-full text-left lg:text-center">
                    {user.email}
                  </p>
                  
                  <div className="hidden lg:block z-10 mb-4">
                    <AvatarUpload
                      userId={user.id}
                      currentAvatarUrl={
                        profile?.avatar_url || user.user_metadata?.avatar_url
                      }
                    />
                  </div>
                  
                  <Badge variant="success" className="px-2 lg:px-3 py-0.5 lg:py-1 font-bold uppercase tracking-wider rounded-full shadow-sm z-10 text-[9px] lg:text-[10px] mt-1 lg:mt-0">
                    Onaylı Hesap
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-2 lg:p-3">
                <AccountNav />
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-9 w-full min-w-0">
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
}
