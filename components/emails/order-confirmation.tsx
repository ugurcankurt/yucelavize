import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

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
    <Html>
      <Head />
      <Preview>Siparişiniz başarıyla alındı!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>yücelavize</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>Teşekkürler, {customerName}!</Heading>
            <Text style={text}>
              Siparişiniz başarıyla alındı. Havale/EFT işleminiz onaylandıktan sonra siparişiniz hızla kargoya verilecektir.
            </Text>
            
            <Section style={section}>
              <Text style={strong}>Sipariş Özeti</Text>
              <Hr style={sectionHr} />
              <Text style={textRow}>
                <span style={label}>Sipariş Numarası:</span> 
                <span style={value}>#{shortOrderId}</span>
              </Text>
              
              {couponCode && discountTotal && discountTotal > 0 ? (
                <>
                  <Text style={textRow}>
                    <span style={label}>Ara Toplam:</span> 
                    <span style={value}>₺{subTotal.toLocaleString("tr-TR")}</span>
                  </Text>
                  <Text style={textRow}>
                    <span style={label}>İndirim ({couponCode}):</span> 
                    <span style={valueDiscount}>-₺{discountTotal.toLocaleString("tr-TR")}</span>
                  </Text>
                  <Text style={textRow}>
                    <span style={label}>Genel Toplam:</span> 
                    <span style={valueTotal}>₺{totalAmount.toLocaleString("tr-TR")}</span>
                  </Text>
                </>
              ) : (
                <Text style={textRow}>
                  <span style={label}>Toplam Tutar:</span> 
                  <span style={valueTotal}>₺{totalAmount.toLocaleString("tr-TR")}</span>
                </Text>
              )}
            </Section>
            
            <Text style={text}>
              Siparişinizin durumunu web sitemiz üzerinden hesabınıza giriş yaparak takip edebilirsiniz.
            </Text>
            
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

const valueTotal = {
  ...value,
  fontSize: "18px",
  color: "#dc2626",
};

const valueDiscount = {
  ...value,
  color: "#16a34a", // Green for discount
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

export default OrderConfirmationEmail;
