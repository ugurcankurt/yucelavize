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
  paymentMethod?: string;
  banks?: any[];
}

export const OrderConfirmationEmail = ({
  orderId,
  customerName,
  totalAmount,
  couponCode,
  discountTotal,
  paymentMethod,
  banks = [],
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
      
      {banks.length > 0 && (
        <Section style={sharedStyles.sectionStorefront}>
          <Text style={{ ...sharedStyles.strongStorefront, marginBottom: "10px" }}>Banka Havalesi İçin Hesap Bilgilerimiz</Text>
          <Text style={sharedStyles.text}>Lütfen toplam tutarı aşağıdaki banka hesaplarından birine havale/EFT yapınız. Açıklama kısmına <strong style={{ color: "#0d9488" }}>sipariş numaranızı ({shortOrderId})</strong> yazmayı unutmayınız.</Text>
          
          {banks.map((bank, index) => (
            <div key={index} style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
              <Text style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                <strong>Banka Adı:</strong> {bank.bankName || "Banka bilgisi yok"}
              </Text>
              <Text style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                <strong>Alıcı Adı / Şirket Ünvanı:</strong> {bank.accountName || "Alıcı bilgisi yok"}
              </Text>
              <Text style={{ margin: "0", fontSize: "16px", letterSpacing: "1px", fontWeight: "bold", fontFamily: "monospace" }}>
                <strong>IBAN:</strong> {bank.iban || "IBAN bilgisi yok"}
              </Text>
            </div>
          ))}
        </Section>
      )}
      
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
