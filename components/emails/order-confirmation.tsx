import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseEmailLayout } from "./base-email-layout";
import { sharedStyles } from "./shared-styles";

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  totalAmount: number;
  couponCode?: string | null;
  discountTotal?: number | null;
}

export const OrderConfirmationEmail = ({
  orderId,
  customerName,
  totalAmount,
  couponCode,
  discountTotal,
}: OrderConfirmationEmailProps) => {
  const shortOrderId = orderId.split("-")[0].toUpperCase();
  const subTotal = totalAmount + (discountTotal || 0);
  
  return (
    <BaseEmailLayout previewText="Siparişiniz başarıyla alındı!" theme="storefront">
      <Heading style={sharedStyles.h2}>Teşekkürler, {customerName}!</Heading>
      <Text style={sharedStyles.text}>
        Siparişiniz başarıyla alındı. Havale/EFT işleminiz onaylandıktan sonra siparişiniz hızla kargoya verilecektir.
      </Text>
      
      <Section style={sharedStyles.sectionStorefront}>
        <Text style={sharedStyles.strongStorefront}>Sipariş Özeti</Text>
        <Hr style={sharedStyles.sectionHrStorefront} />
        <Text style={sharedStyles.textRow}>
          <span style={sharedStyles.label}>Sipariş Numarası:</span> 
          <span style={sharedStyles.value}>#{shortOrderId}</span>
        </Text>
        
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
              <span style={sharedStyles.label}>Genel Toplam:</span> 
              <span style={sharedStyles.valueTotalStorefront}>₺{totalAmount.toLocaleString("tr-TR")}</span>
            </Text>
          </>
        ) : (
          <Text style={sharedStyles.textRow}>
            <span style={sharedStyles.label}>Toplam Tutar:</span> 
            <span style={sharedStyles.valueTotalStorefront}>₺{totalAmount.toLocaleString("tr-TR")}</span>
          </Text>
        )}
      </Section>
      
      <Text style={sharedStyles.text}>
        Siparişinizin durumunu web sitemiz üzerinden hesabınıza giriş yaparak takip edebilirsiniz.
      </Text>
      
      <Hr style={sharedStyles.hr} />
      <Text style={sharedStyles.footer}>
        Bizi tercih ettiğiniz için teşekkür ederiz.<br />
        <strong>Yücel Avize Ekibi</strong>
      </Text>
    </BaseEmailLayout>
  );
};

export default OrderConfirmationEmail;
