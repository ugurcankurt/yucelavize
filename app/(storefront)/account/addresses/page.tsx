import { createClient } from "@/lib/supabase/server";
import { MapPin, Edit2, Trash2 } from "lucide-react";
import { AddressDialog } from "@/components/storefront/address-dialog";
import { deleteAddress } from "@/app/actions/account";
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
    <div className="bg-background border border-border rounded-[32px] p-6 sm:p-10 shadow-sm shadow-gray-100/50 min-h-[500px]">
      {" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {" "}
        <h2 className="text-xl font-black text-foreground flex items-center gap-3">
          {" "}
          Kayıtlı Adreslerim{" "}
          <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
            {addresses.length} Adres
          </span>{" "}
        </h2>{" "}
        <AddressDialog />{" "}
      </div>{" "}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-border rounded-[24px]">
          {" "}
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
            {" "}
            <MapPin className="w-10 h-10" />{" "}
          </div>{" "}
          <h3 className="text-lg font-bold text-foreground mb-2">
            Henüz adres eklemediniz
          </h3>{" "}
          <p className="text-sm font-medium text-muted-foreground mb-6">
            Siparişlerinizin daha hızlı teslim edilmesi için bir adres ekleyin.
          </p>{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {" "}
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative border border-border rounded-2xl p-6 bg-background hover:border-primary/50 hover:shadow-md transition-all group"
            >
              {" "}
              {address.is_default && (
                <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {" "}
                  Varsayılan Adres{" "}
                </div>
              )}{" "}
              <div className="flex justify-between items-start mb-4">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {" "}
                    <MapPin className="w-4 h-4" />{" "}
                  </div>{" "}
                  <h3 className="font-bold text-foreground">
                    {address.title}
                  </h3>{" "}
                </div>{" "}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {" "}
                  <button className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    {" "}
                    <Edit2 className="w-3.5 h-3.5" />{" "}
                  </button>{" "}
                  <form
                    action={async () => {
                      "use server";
                      await deleteAddress(address.id);
                    }}
                  >
                    {" "}
                    <button
                      type="submit"
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      {" "}
                      <Trash2 className="w-3.5 h-3.5" />{" "}
                    </button>{" "}
                  </form>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-2 text-sm text-muted-foreground">
                {" "}
                <p className="font-semibold text-foreground">
                  {address.full_name}
                </p>{" "}
                <p className="line-clamp-2">{address.address_line}</p>{" "}
                <p>
                  {address.city} {address.zip_code && `, ${address.zip_code}`}
                </p>{" "}
                <p className="pt-2 font-medium">{address.phone}</p>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
}
