import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

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
    <Html>
      <Head />
      <Preview>Sipariş Durumu: {readableStatus}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>yücelavize</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>Sipariş Durumunuz Güncellendi</Heading>
            <Text style={text}>Merhaba <strong>{customerName}</strong>,</Text>
            <Text style={text}>
              #{shortOrderId} numaralı siparişinizin durumu <strong style={{color: '#dc2626'}}>{readableStatus}</strong> olarak güncellendi.
            </Text>

            {(trackingNumber || shippingCompany) && (
              <Section style={section}>
                <Text style={strong}>Kargo Bilgileri</Text>
                <Hr style={sectionHr} />
                
                {shippingCompany && (
                  <Text style={textRow}>
                    <span style={label}>Firma:</span> <span style={value}>{shippingCompany}</span>
                  </Text>
                )}
                
                {trackingNumber && (
                  <Text style={textRow}>
                    <span style={label}>Takip No:</span> <span style={value}>{trackingNumber}</span>
                  </Text>
                )}
                
                {trackingUrl && (
                  <Section style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Link href={trackingUrl} style={button}>
                      Kargomu Takip Et
                    </Link>
                  </Section>
                )}
              </Section>
            )}

            {status === "delivered" && (
              <Section style={reviewSection}>
                <Text style={strong}>Ürünlerinizi Değerlendirin</Text>
                <Text style={text}>
                  Siparişiniz başarıyla teslim edildi. Satın aldığınız ürünleri web sitemiz üzerinden bularak sayfasında değerlendirebilir ve diğer müşterilerimize yardımcı olabilirsiniz!
                </Text>
                <Section style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Link href="https://yucelavize.com/account" style={buttonOutline}>
                    Siparişlerime Git
                  </Link>
                </Section>
              </Section>
            )}

            <Hr style={hr} />
            <Text style={footer}>
              Bizi tercih ettiğiniz için teşekkür ederiz.<br />
              <strong>Yücel Avize Ekibi</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily: 'Inter, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#dc2626", // Red theme primary
  padding: "40px 20px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "900",
  margin: "0",
  letterSpacing: "-1px",
};

const content = {
  padding: "40px 40px",
};

const h2 = {
  color: "#18181b",
  fontSize: "24px",
  fontWeight: "800",
  margin: "0 0 16px",
  letterSpacing: "-0.5px",
};

const text = {
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 20px",
};

const section = {
  padding: "24px",
  backgroundColor: "#fef2f2", // Light red bg
  borderRadius: "16px",
  margin: "30px 0",
  border: "1px solid #fecaca", // Red border
};

const strong = {
  color: "#dc2626",
  fontWeight: "800",
  fontSize: "18px",
  margin: "0 0 16px",
};

const sectionHr = {
  borderColor: "#fca5a5",
  margin: "12px 0 16px",
};

const textRow = {
  margin: "0 0 10px",
  fontSize: "15px",
  color: "#3f3f46",
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
};

const label = {
  fontWeight: "600",
};

const value = {
  fontWeight: "700",
  color: "#18181b",
  float: "right" as const,
};

const button = {
  backgroundColor: "#dc2626",
  color: "#ffffff",
  padding: "16px 32px",
  borderRadius: "9999px",
  textDecoration: "none",
  display: "inline-block",
  fontWeight: "800",
  fontSize: "16px",
  letterSpacing: "0.5px",
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "30px 0",
};

const footer = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
};

const reviewSection = {
  ...section,
  backgroundColor: "#f4f4f5",
  borderColor: "#d4d4d8",
};

const buttonOutline = {
  ...button,
  backgroundColor: "transparent",
  color: "#18181b",
  border: "2px solid #18181b",
};

export default OrderStatusUpdateEmail;
