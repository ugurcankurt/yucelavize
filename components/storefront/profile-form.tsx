"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { updateProfile } from "@/app/actions/account";
interface ProfileFormProps {
  initialFullName: string;
  initialPhone: string;
  initialGender?: string;
}
export function ProfileForm({
  initialFullName,
  initialPhone,
  initialGender = "",
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [gender, setGender] = useState(initialGender);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    setLoading(false);
    if (result.error) {
      setStatus({ type: "error", message: result.error });
    } else {
      setStatus({
        type: "success",
        message: "Profiliniz başarıyla güncellendi.",
      });
      setTimeout(() => setStatus(null), 3000);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {" "}
      {status && (
        <div
          className={`p-3 text-sm font-medium rounded-xl border ${status.type === "success" ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/20"}`}
        >
          {" "}
          {status.message}{" "}
        </div>
      )}{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {" "}
        <div className="space-y-2">
          {" "}
          <Label
            htmlFor="fullName"
            className="text-muted-foreground font-semibold text-sm"
          >
            Ad Soyad
          </Label>{" "}
          <Input
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
          />{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <Label
            htmlFor="phone"
            className="text-muted-foreground font-semibold text-sm"
          >
            Telefon Numarası
          </Label>{" "}
          <Input
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0 (555) 555 55 55"
            className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
          />{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <Label
            htmlFor="gender"
            className="text-muted-foreground font-semibold text-sm"
          >
            Cinsiyet
          </Label>{" "}
          <NativeSelect
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl w-full flex items-center px-3"
          >
            {" "}
            <NativeSelectOption value="">
              Belirtmek İstemiyorum
            </NativeSelectOption>{" "}
            <NativeSelectOption value="erkek">Erkek</NativeSelectOption>{" "}
            <NativeSelectOption value="kadin">Kadın</NativeSelectOption>{" "}
          </NativeSelect>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex justify-end">
        {" "}
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full bg-foreground hover:bg-background text-background font-semibold px-8 h-11"
        >
          {" "}
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}{" "}
        </Button>{" "}
      </div>{" "}
    </form>
  );
}
