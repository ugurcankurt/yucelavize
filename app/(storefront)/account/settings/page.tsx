import { createClient } from "@/lib/supabase/server";
import { User, Mail, Shield, Bell, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/storefront/profile-form";
import { PasswordUpdateDialog } from "@/components/storefront/password-update-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const metadata = { title: "Hesap Ayarları | Yücel Avize" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="bg-background border border-border/60 rounded-3xl p-6 sm:p-10 shadow-sm min-h-[500px] animate-in fade-in-50 duration-500 flex flex-col">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Hesap Ayarları
        </h2>
        <p className="text-muted-foreground font-medium text-base">
          Hesap bilgilerinizi, güvenlik ayarlarınızı ve bildirim tercihlerinizi buradan yönetin.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full flex-1 flex flex-col">
        <div className="w-full mb-8">
          <TabsList className="flex flex-col sm:flex-row w-full gap-3 sm:gap-1 bg-transparent sm:bg-muted/50 p-0 sm:p-1.5 h-auto group-data-horizontal/tabs:h-auto sm:rounded-2xl">
            <TabsTrigger
              value="general"
              className="w-full h-auto flex items-center justify-start sm:justify-center gap-3 sm:gap-2 px-5 py-4 sm:py-2.5 rounded-2xl sm:rounded-xl text-[15px] sm:text-sm font-bold text-muted-foreground bg-card sm:bg-transparent border border-border/60 sm:border-transparent shadow-sm sm:shadow-none transition-all data-[state=active]:bg-primary/5 sm:data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:border-primary/30 sm:data-[state=active]:border-border/40 sm:data-[state=active]:shadow-sm"
            >
              <User className="w-5 h-5 sm:w-4 sm:h-4 shrink-0" /> 
              <span>Genel Bilgiler</span>
            </TabsTrigger>
            
            <TabsTrigger
              value="security"
              className="w-full h-auto flex items-center justify-start sm:justify-center gap-3 sm:gap-2 px-5 py-4 sm:py-2.5 rounded-2xl sm:rounded-xl text-[15px] sm:text-sm font-bold text-muted-foreground bg-card sm:bg-transparent border border-border/60 sm:border-transparent shadow-sm sm:shadow-none transition-all data-[state=active]:bg-primary/5 sm:data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:border-primary/30 sm:data-[state=active]:border-border/40 sm:data-[state=active]:shadow-sm"
            >
              <Shield className="w-5 h-5 sm:w-4 sm:h-4 shrink-0" /> 
              <span>Güvenlik & Şifre</span>
            </TabsTrigger>
            
            <TabsTrigger
              value="notifications"
              className="w-full h-auto flex items-center justify-start sm:justify-center gap-3 sm:gap-2 px-5 py-4 sm:py-2.5 rounded-2xl sm:rounded-xl text-[15px] sm:text-sm font-bold text-muted-foreground bg-card sm:bg-transparent border border-border/60 sm:border-transparent shadow-sm sm:shadow-none transition-all data-[state=active]:bg-primary/5 sm:data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:border-primary/30 sm:data-[state=active]:border-border/40 sm:data-[state=active]:shadow-sm"
            >
              <Bell className="w-5 h-5 sm:w-4 sm:h-4 shrink-0" /> 
              <span>Bildirim Tercihleri</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-6 mt-0 outline-none">
          <Card className="border-border/60 rounded-3xl shadow-sm bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                Profil Bilgileri
              </CardTitle>
              <CardDescription className="text-base">
                Size daha iyi hitap edebilmemiz için bilgilerinizi güncel tutun.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-2xl">
              <ProfileForm
                initialFullName={profile?.full_name || ""}
                initialPhone={user.user_metadata?.phone || ""}
                initialGender={user.user_metadata?.gender || ""}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-0 outline-none">
          <Card className="border-border/60 rounded-3xl shadow-sm bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                Giriş Yöntemleri
              </CardTitle>
              <CardDescription className="text-base">
                Hesabınıza erişimi yönetin ve güvenliğinizi artırın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info shrink-0 shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base">
                        E-posta Adresi
                      </p>
                      <p className="text-muted-foreground font-medium text-sm mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base">
                        Hesap Şifresi
                      </p>
                      <p className="text-muted-foreground font-medium text-sm mt-0.5 tracking-widest">
                        ••••••••
                      </p>
                    </div>
                  </div>
                  <PasswordUpdateDialog />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="space-y-6 mt-0 outline-none"
        >
          <Card className="border-border/60 rounded-3xl shadow-sm bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                Bildirim Tercihleri
              </CardTitle>
              <CardDescription className="text-base">
                Size nasıl ulaşacağımızı seçin. İstediğiniz zaman değiştirebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl border border-border/60 rounded-2xl bg-card overflow-hidden divide-y divide-border/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-muted/10 transition-colors">
                  <div className="flex-1 pr-6">
                    <p className="font-bold text-foreground text-base">
                      Sipariş Güncellemeleri
                    </p>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                      Sipariş durumunuz değiştiğinde anında e-posta veya SMS ile bilgilendirilin.
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-primary shrink-0"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-muted/10 transition-colors">
                  <div className="flex-1 pr-6">
                    <p className="font-bold text-foreground text-base">
                      Kampanya ve İndirimler
                    </p>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                      Size özel indirimlerden ve yeni ürünlerden ilk sizin haberiniz olsun.
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary shrink-0" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-muted/10 transition-colors">
                  <div className="flex-1 pr-6">
                    <p className="font-bold text-foreground text-base">
                      Stok Uyarıları
                    </p>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                      Favorilerinizdeki ürünlerin stoğu azaldığında haber verelim.
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary shrink-0" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
