import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseEmailLayout } from "./base-email-layout";
import { sharedStyles } from "./shared-styles";

interface AdminNewOrderEmailProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  couponCode?: string | null;
  discountTotal?: number | null;
}

export const AdminNewOrderEmail = ({
  orderId,
  customerName,
  customerEmail,
  totalAmount,
  couponCode,
  discountTotal,
}: AdminNewOrderEmailProps) => {
  const shortOrderId = orderId.split("-")[0].toUpperCase();
  const subTotal = totalAmount + (discountTotal || 0);

  return (
    <BaseEmailLayout previewText={`Yeni Sipariş Alındı: #${shortOrderId}`} theme="admin">
      <Heading style={sharedStyles.h2}>Sisteme Yeni Sipariş Düştü!</Heading>
      <Text style={sharedStyles.text}>
        Yönetici panelinizden siparişin durumunu takip edebilir ve onaylayabilirsiniz.
      </Text>
      
      <Section style={sharedStyles.sectionAdmin}>
        <Text style={sharedStyles.strongAdmin}>Müşteri Bilgileri</Text>
        <Hr style={sharedStyles.sectionHrAdmin} />
        <Text style={sharedStyles.textRow}>
          <span style={sharedStyles.label}>İsim:</span> <span style={sharedStyles.value}>{customerName}</span>
        </Text>
        <Text style={sharedStyles.textRow}>
          <span style={sharedStyles.label}>E-Posta:</span> <span style={sharedStyles.value}>{customerEmail}</span>
        </Text>
        
        <Text style={{ ...sharedStyles.strongAdmin, marginTop: "24px" }}>Sipariş Bilgileri</Text>
        <Hr style={sharedStyles.sectionHrAdmin} />
        <Text style={sharedStyles.textRow}>
          <span style={sharedStyles.label}>Sipariş Kodu:</span> <span style={sharedStyles.value}>#{shortOrderId}</span>
        </Text>
        
        <Hr style={sharedStyles.sectionHrAdmin} />
        
        {couponCode && discountTotal && discountTotal > 0 ? (
          <>
            <Text style={sharedStyles.textRow}>
              <span style={sharedStyles.label}>Ara Toplam:</span> 
              <span style={sharedStyles.value}>₺{subTotal.toLocaleString("tr-TR")}</span>
            </Text>
            <Text style={sharedStyles.textRow}>
              <span style={sharedStyles.label}>İndirim ({couponCode}):</span> 
              <span style={sharedStyles.valueDiscount}>-₺{discountTotal.toLocaleString("tr-TR")}</span>
            </Text>
            <Text style={sharedStyles.textRow}>
              <span style={sharedStyles.label}>Ödenen Toplam:</span> 
              <span style={sharedStyles.valueTotalAdmin}>₺{totalAmount.toLocaleString("tr-TR")}</span>
            </Text>
          </>
        ) : (
          <Text style={sharedStyles.textRow}>
            <span style={sharedStyles.label}>Ödenen Toplam Tutar:</span> 
            <span style={sharedStyles.valueTotalAdmin}>₺{totalAmount.toLocaleString("tr-TR")}</span>
          </Text>
        )}
      </Section>
    </BaseEmailLayout>
  );
};

export default AdminNewOrderEmail;
