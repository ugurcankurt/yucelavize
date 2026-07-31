import { createClient } from "@/lib/supabase/server";
import { MapPin, Edit2, Trash2, Plus } from "lucide-react";
import { AddressDialog } from "@/components/storefront/address-dialog";
import { deleteAddress } from "@/app/actions/account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Adreslerim | Yücel Avize" };

export default async function AddressesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  
  let addresses: any[] = [];
  try {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    addresses = data || [];
  } catch (error) {
    console.error("Addresses table not ready:", error);
  }
  
  return (
    <div className="bg-background border border-border/60 rounded-3xl p-6 sm:p-10 shadow-sm min-h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          Kayıtlı Adreslerim
          <Badge variant="secondary" className="px-3 py-1 text-sm font-bold shadow-sm rounded-full">
            {addresses.length} Adres
          </Badge>
        </h2>
        
        <AddressDialog />
      </div>
      
      {addresses.length === 0 ? (
        <Card className="border-2 border-dashed border-border shadow-none bg-muted/10 rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center text-center py-20 px-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
              <MapPin className="w-12 h-12" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground mb-3">
              Henüz adres eklemediniz
            </h3>
            <p className="text-base font-medium text-muted-foreground mb-8 max-w-md mx-auto">
              Siparişlerinizin daha hızlı teslim edilmesi için hemen bir adres ekleyin.
            </p>
            {/* The AddressDialog trigger acts as the button here, but since AddressDialog contains its own trigger, 
                we might just rely on the one in the header. Alternatively, we could render another dialog here, 
                but keeping it clean is fine. */}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className="group relative border-border/60 rounded-3xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-300 bg-card/50 flex flex-col"
            >
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/20 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-foreground tracking-wide">
                      {address.title}
                    </CardTitle>
                    {address.is_default && (
                      <Badge variant="default" className="mt-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                        Varsayılan
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-border/80 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await deleteAddress(address.id);
                    }}
                  >
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 rounded-full border-border/80 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 flex-1 bg-card">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="font-bold text-foreground text-base">
                    {address.full_name}
                  </p>
                  <p className="leading-relaxed line-clamp-2">
                    {address.address_line}
                  </p>
                  <p className="font-medium">
                    {address.city} {address.zip_code && `, ${address.zip_code}`}
                  </p>
                  <div className="pt-3 mt-3 border-t border-border/40">
                    <p className="font-bold text-foreground">
                      {address.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
