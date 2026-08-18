import { Heading, Hr, Section, Text, Img } from "react-email";
import * as React from "react";
import { BaseEmailLayout } from "./base-email-layout";
import { sharedStyles } from "./shared-styles";

interface OrderItem {
  id?: string;
  quantity: number;
  unit_price: number;
  product?: {
    name: string;
    images?: string[];
  };
}

interface AdminNewOrderEmailProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  couponCode?: string | null;
  discountTotal?: number | null;
  items?: OrderItem[];
}

export const AdminNewOrderEmail = ({
  orderId,
  customerName,
  customerEmail,
  totalAmount,
  couponCode,
  discountTotal,
  items = [],
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
        
        {items && items.length > 0 && (
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            {items.map((item, index) => {
              const rawImageUrl = item.product?.images?.[0] || "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=200&auto=format&fit=crop";
              const imageUrl = rawImageUrl.includes("supabase.co") 
                ? `https://www.yucelavize.com/api/image-proxy?url=${encodeURIComponent(rawImageUrl)}`
                : rawImageUrl;
              const productName = item.product?.name || "İsimsiz Ürün";
              const isLast = index === items.length - 1;
              
              return (
                <div key={index} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: isLast ? "0" : "12px", 
                  borderBottom: isLast ? "none" : "1px solid #d4d4d8", 
                  paddingBottom: isLast ? "0" : "12px" 
                }}>
                  <div style={{ flexShrink: 0, marginRight: "16px" }}>
                    <Img 
                      src={imageUrl} 
                      alt={productName} 
                      width="60" 
                      height="60" 
                      style={{ objectFit: "cover", borderRadius: "8px", border: "1px solid #e4e4e7" }} 
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ margin: "0", fontSize: "14px", fontWeight: "bold", color: "#18181b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {productName}
                    </Text>
                    <Text style={{ margin: "4px 0 0", fontSize: "12px", color: "#71717a" }}>
                      {item.quantity} adet x ₺{(item.unit_price).toLocaleString("tr-TR")}
                    </Text>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right", paddingLeft: "12px" }}>
                    <Text style={{ margin: "0", fontSize: "14px", fontWeight: "bold", color: "#18181b" }}>
                      ₺{(item.unit_price * item.quantity).toLocaleString("tr-TR")}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
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
