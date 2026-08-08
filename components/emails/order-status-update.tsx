import { Heading, Hr, Link, Section, Text } from "react-email";
import * as React from "react";
import { BaseEmailLayout } from "./base-email-layout";
import { sharedStyles } from "./shared-styles";

interface OrderStatusUpdateEmailProps {
  orderId: string;
  customerName: string;
  status: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shippingCompany?: string | null;
}

const statusMap: Record<string, string> = {
  pending: "Ödeme Bekleniyor",
  confirmed: "Onaylandı",
  shipped: "Kargolandı",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

export const OrderStatusUpdateEmail = ({
  orderId,
  customerName,
  status,
  trackingNumber,
  trackingUrl,
  shippingCompany,
}: OrderStatusUpdateEmailProps) => {
  const shortOrderId = orderId.split("-")[0].toUpperCase();
  const readableStatus = statusMap[status] || status;

  return (
    <BaseEmailLayout previewText={`Sipariş Durumu: ${readableStatus}`} theme="storefront">
      <Heading style={sharedStyles.h2}>Sipariş Durumunuz Güncellendi</Heading>
      <Text style={sharedStyles.text}>Merhaba <strong>{customerName}</strong>,</Text>
      <Text style={sharedStyles.text}>
        #{shortOrderId} numaralı siparişinizin durumu <strong style={{color: '#dc2626'}}>{readableStatus}</strong> olarak güncellendi.
      </Text>

      {(trackingNumber || shippingCompany) && (
        <Section style={sharedStyles.sectionStorefront}>
          <Text style={sharedStyles.strongStorefront}>Kargo Bilgileri</Text>
          <Hr style={sharedStyles.sectionHrStorefront} />
          
          {shippingCompany && (
            <Text style={sharedStyles.textRow}>
              <span style={sharedStyles.label}>Firma:</span> <span style={sharedStyles.value}>{shippingCompany}</span>
            </Text>
          )}
          
          {trackingNumber && (
            <Text style={sharedStyles.textRow}>
              <span style={sharedStyles.label}>Takip No:</span> <span style={sharedStyles.value}>{trackingNumber}</span>
            </Text>
          )}
          
          {trackingUrl && (
            <Section style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link href={trackingUrl} style={sharedStyles.button}>
                Kargomu Takip Et
              </Link>
            </Section>
          )}
        </Section>
      )}

      {status === "delivered" && (
        <Section style={sharedStyles.sectionAdmin}>
          <Text style={sharedStyles.strongAdmin}>Ürünlerinizi Değerlendirin</Text>
          <Text style={sharedStyles.text}>
            Siparişiniz başarıyla teslim edildi. Satın aldığınız ürünleri web sitemiz üzerinden bularak sayfasında değerlendirebilir ve diğer müşterilerimize yardımcı olabilirsiniz!
          </Text>
          <Section style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link href="https://www.yucelavize.com/account" style={sharedStyles.buttonOutline}>
              Siparişlerime Git
            </Link>
          </Section>
        </Section>
      )}

      <Hr style={sharedStyles.hr} />
      <Text style={sharedStyles.footer}>
        Bizi tercih ettiğiniz için teşekkür ederiz.<br />
        <strong>Yücel Avize Ekibi</strong>
      </Text>
    </BaseEmailLayout>
  );
};

export default OrderStatusUpdateEmail;
