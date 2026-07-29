"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { addAddress } from "@/app/actions/account";
export function AddressDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await addAddress(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {" "}
      <DialogTrigger
        render={
          <button
            className={buttonVariants({
              className:
                "rounded-full bg-foreground hover:bg-background text-background font-semibold",
            })}
          />
        }
      >
        {" "}
        <Plus className="w-4 h-4 mr-2" /> Yeni Adres Ekle{" "}
      </DialogTrigger>{" "}
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0">
        {" "}
        <div className="px-6 py-4 border-b border-border bg-muted">
          {" "}
          <DialogTitle className="text-xl font-bold">
            Yeni Adres Ekle
          </DialogTitle>{" "}
          <DialogDescription className="text-muted-foreground mt-1">
            {" "}
            Siparişlerinizin teslimatı için adres bilgilerinizi girin.{" "}
          </DialogDescription>{" "}
        </div>{" "}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {" "}
          {error && (
            <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
              {" "}
              {error}{" "}
            </div>
          )}{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="title" className="text-muted-foreground">
              Adres Başlığı
            </Label>{" "}
            <Input
              id="title"
              name="title"
              required
              placeholder="Ev, İş vb."
              className="bg-muted"
            />{" "}
          </div>{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="fullName" className="text-muted-foreground">
                Ad Soyad
              </Label>{" "}
              <Input
                id="fullName"
                name="fullName"
                required
                placeholder="Teslim alacak kişi"
                className="bg-muted"
              />{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="phone" className="text-muted-foreground">
                Telefon
              </Label>{" "}
              <Input
                id="phone"
                name="phone"
                required
                placeholder="05XX XXX XX XX"
                className="bg-muted"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="city" className="text-muted-foreground">
              İl / İlçe
            </Label>{" "}
            <Input
              id="city"
              name="city"
              required
              placeholder="İstanbul / Kadıköy"
              className="bg-muted"
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="addressLine" className="text-muted-foreground">
              Açık Adres
            </Label>{" "}
            <Input
              id="addressLine"
              name="addressLine"
              required
              placeholder="Mahalle, sokak, bina no, daire..."
              className="bg-muted"
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="zipCode" className="text-muted-foreground">
              Posta Kodu (İsteğe Bağlı)
            </Label>{" "}
            <Input
              id="zipCode"
              name="zipCode"
              placeholder="34000"
              className="bg-muted"
            />{" "}
          </div>{" "}
          <div className="pt-4 flex justify-end gap-3">
            {" "}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full"
            >
              {" "}
              İptal{" "}
            </Button>{" "}
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
            >
              {" "}
              {loading ? "Ekleniyor..." : "Kaydet"}{" "}
            </Button>{" "}
          </div>{" "}
        </form>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
}
