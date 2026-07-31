"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const STATUS_OPTIONS = [
  { value: "pending", label: "Bekliyor (Havale)" },
  { value: "confirmed", label: "Onaylandı" },
  { value: "shipped", label: "Kargolandı" },
  { value: "delivered", label: "Teslim Edildi" },
  { value: "cancelled", label: "İptal Edildi" },
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus || "pending");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setStatus(newStatus);
    
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.error) {
        setStatus(currentStatus); // revert on error
        alert("Durum güncellenirken bir hata oluştu: " + result.error);
      } else {
        // Optional: show success toast
      }
    });
  };

  const getStatusColor = (val: string) => {
    switch (val) {
      case "pending":
        return "bg-warning/20 text-warning border-warning/50";
      case "confirmed":
        return "bg-info/20 text-info border-info/50";
      case "shipped":
        return "bg-primary/20 text-primary border-primary/50";
      case "delivered":
        return "bg-success/20 text-success border-success/50";
      case "cancelled":
        return "bg-destructive/20 text-destructive border-destructive/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className={`h-8 w-[140px] text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
        <SelectValue placeholder="Durum Seç" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium cursor-pointer">
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
