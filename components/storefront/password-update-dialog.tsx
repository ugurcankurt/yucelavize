"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function PasswordUpdateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    if (newPassword.length < 6) {
      setStatus("error");
      setErrorMessage("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Şifreler eşleşmiyor.");
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(newPassword);
      
      if (result.error) {
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        setStatus("success");
        setNewPassword("");
        setConfirmPassword("");
        // Optional: Close dialog automatically after a delay
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
        }, 2000);
      }
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closed
      setStatus("idle");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={
        <Button
          variant="outline"
          className="rounded-xl border-border/80 font-bold shrink-0 h-11 px-6 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
        />
      }>
        Güncelle
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[32px] p-8 border-border/60">
        <DialogHeader className="mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm mx-auto sm:mx-0">
            <Key className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black text-center sm:text-left">Şifreyi Güncelle</DialogTitle>
          <DialogDescription className="text-center sm:text-left text-base font-medium">
            Hesabınızın güvenliği için güçlü bir şifre belirleyin.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center text-success mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Şifreniz Güncellendi!</h3>
            <p className="text-muted-foreground font-medium">
              Yeni şifreniz başarıyla kaydedildi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-destructive leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="font-bold text-muted-foreground ml-1">Yeni Şifre</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="En az 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isPending}
                  className="rounded-xl h-12 px-4 bg-muted/50 border-border/60 focus:bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-bold text-muted-foreground ml-1">Şifreyi Onayla</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                  className="rounded-xl h-12 px-4 bg-muted/50 border-border/60 focus:bg-background"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl font-bold text-base shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Güncelleniyor...
                </>
              ) : (
                "Şifreyi Kaydet"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
