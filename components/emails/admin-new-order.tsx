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
    <Html>
      <Head />
      <Preview>Yeni Sipariş Alındı: #{shortOrderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>yücelavize</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>Sisteme Yeni Sipariş Düştü!</Heading>
            <Text style={text}>
              Yönetici panelinizden siparişin durumunu takip edebilir ve onaylayabilirsiniz.
            </Text>
            
            <Section style={section}>
              <Text style={strong}>Müşteri Bilgileri</Text>
              <Hr style={sectionHr} />
              <Text style={textRow}>
                <span style={label}>İsim:</span> <span style={value}>{customerName}</span>
              </Text>
              <Text style={textRow}>
                <span style={label}>E-Posta:</span> <span style={value}>{customerEmail}</span>
              </Text>
              
              <Text style={strong2}>Sipariş Bilgileri</Text>
              <Hr style={sectionHr} />
              <Text style={textRow}>
                <span style={label}>Sipariş Kodu:</span> <span style={value}>#{shortOrderId}</span>
              </Text>
              
              <Hr style={sectionHr} />
              
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
                    <span style={label}>Ödenen Toplam:</span> 
                    <span style={valueTotal}>₺{totalAmount.toLocaleString("tr-TR")}</span>
                  </Text>
                </>
              ) : (
                <Text style={textRow}>
                  <span style={label}>Ödenen Toplam Tutar:</span> 
                  <span style={valueTotal}>₺{totalAmount.toLocaleString("tr-TR")}</span>
                </Text>
              )}
            </Section>
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
  backgroundColor: "#18181b", // Dark theme for admin
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
  backgroundColor: "#f4f4f5", // Light gray
  borderRadius: "16px",
  margin: "30px 0",
  border: "1px solid #e4e4e7", 
};

const strong = {
  color: "#18181b",
  fontWeight: "800",
  fontSize: "18px",
  margin: "0 0 16px",
};

const strong2 = {
  ...strong,
  marginTop: "24px",
};

const sectionHr = {
  borderColor: "#d4d4d8",
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
  color: "#2563eb",
};

const valueDiscount = {
  ...value,
  color: "#16a34a",
};

export default AdminNewOrderEmail;
