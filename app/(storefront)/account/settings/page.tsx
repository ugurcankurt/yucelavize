import { createClient } from "@/lib/supabase/server";
import { User, Mail, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/storefront/profile-form";
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
    <div className="bg-background border border-border rounded-[32px] p-6 sm:p-10 shadow-sm shadow-gray-100/50 min-h-[500px] animate-in fade-in-50 duration-500 flex flex-col">
      {" "}
      <div className="flex flex-col gap-2 mb-8">
        {" "}
        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          Hesap Ayarları
        </h2>{" "}
        <p className="text-muted-foreground font-medium text-sm">
          Hesap bilgilerinizi, güvenlik ayarlarınızı ve bildirim tercihlerinizi
          buradan yönetin.
        </p>{" "}
      </div>{" "}
      <Tabs defaultValue="general" className="w-full flex-1 flex flex-col">
        {" "}
        <div className="overflow-x-auto pb-2 border-b border-border mb-8">
          {" "}
          <TabsList className="bg-transparent h-auto p-0 flex justify-start gap-6 w-max">
            {" "}
            <TabsTrigger
              value="general"
              className="rounded-none px-0 py-3 text-sm font-bold text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
            >
              {" "}
              Genel Bilgiler{" "}
            </TabsTrigger>{" "}
            <TabsTrigger
              value="security"
              className="rounded-none px-0 py-3 text-sm font-bold text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
            >
              {" "}
              Güvenlik & Şifre{" "}
            </TabsTrigger>{" "}
            <TabsTrigger
              value="notifications"
              className="rounded-none px-0 py-3 text-sm font-bold text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
            >
              {" "}
              Bildirim Tercihleri{" "}
            </TabsTrigger>{" "}
          </TabsList>{" "}
        </div>{" "}
        <TabsContent value="general" className="space-y-8 mt-0 outline-none">
          {" "}
          <div>
            {" "}
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
              {" "}
              Profil Bilgileri{" "}
            </h3>{" "}
            <p className="text-muted-foreground font-medium text-sm mb-8">
              {" "}
              Size daha iyi hitap edebilmemiz için bilgilerinizi güncel
              tutun.{" "}
            </p>{" "}
            <div className="max-w-2xl">
              {" "}
              <ProfileForm
                initialFullName={profile?.full_name || ""}
                initialPhone={user.user_metadata?.phone || ""}
                initialGender={user.user_metadata?.gender || ""}
              />{" "}
            </div>{" "}
          </div>{" "}
        </TabsContent>{" "}
        <TabsContent value="security" className="space-y-8 mt-0 outline-none">
          {" "}
          <div>
            {" "}
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
              {" "}
              Giriş Yöntemleri{" "}
            </h3>{" "}
            <p className="text-muted-foreground font-medium text-sm mb-8">
              {" "}
              Hesabınıza erişimi yönetin ve güvenliğinizi artırın.{" "}
            </p>{" "}
            <div className="max-w-2xl space-y-4">
              {" "}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-muted hover:border-border transition-all group">
                {" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-primary shrink-0">
                    {" "}
                    <Mail className="w-5 h-5" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="font-bold text-foreground text-sm">
                      E-posta Adresi
                    </p>{" "}
                    <p className="text-muted-foreground font-medium text-sm mt-0.5">
                      {user.email}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border font-semibold shrink-0 h-9 px-5"
                >
                  {" "}
                  Değiştir{" "}
                </Button>{" "}
              </div>{" "}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-muted hover:border-border transition-all group">
                {" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {" "}
                    <Shield className="w-5 h-5" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="font-bold text-foreground text-sm">
                      Şifre
                    </p>{" "}
                    <p className="text-muted-foreground font-medium text-sm mt-0.5 tracking-widest">
                      ********
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border font-semibold shrink-0 h-9 px-5"
                >
                  {" "}
                  Güncelle{" "}
                </Button>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </TabsContent>{" "}
        <TabsContent
          value="notifications"
          className="space-y-8 mt-0 outline-none"
        >
          {" "}
          <div>
            {" "}
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
              {" "}
              Bildirim Tercihleri{" "}
            </h3>{" "}
            <p className="text-muted-foreground font-medium text-sm mb-8">
              {" "}
              Size nasıl ulaşacağımızı seçin. İstediğiniz zaman
              değiştirebilirsiniz.{" "}
            </p>{" "}
            <div className="max-w-2xl space-y-4">
              {" "}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-muted hover:border-border transition-colors">
                {" "}
                <div className="flex-1 pr-6">
                  {" "}
                  <p className="font-bold text-foreground text-sm">
                    Sipariş Güncellemeleri
                  </p>{" "}
                  <p className="text-muted-foreground text-xs font-medium mt-1">
                    Sipariş durumunuz değiştiğinde anında e-posta veya SMS ile
                    bilgilendirilin.
                  </p>{" "}
                </div>{" "}
                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-primary shrink-0"
                />{" "}
              </div>{" "}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-muted hover:border-border transition-colors">
                {" "}
                <div className="flex-1 pr-6">
                  {" "}
                  <p className="font-bold text-foreground text-sm">
                    Kampanya ve İndirimler
                  </p>{" "}
                  <p className="text-muted-foreground text-xs font-medium mt-1">
                    Size özel indirimlerden ve yeni ürünlerden ilk sizin
                    haberiniz olsun.
                  </p>{" "}
                </div>{" "}
                <Switch className="data-[state=checked]:bg-primary shrink-0" />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </TabsContent>{" "}
      </Tabs>{" "}
    </div>
  );
}
