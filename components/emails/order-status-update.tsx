import { Heading, Hr, Link, Section, Text, Img } from "react-email";
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

interface OrderStatusUpdateEmailProps {
  orderId: string;
  customerName: string;
  status: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shippingCompany?: string | null;
  totalAmount?: number;
  couponCode?: string | null;
  discountTotal?: number | null;
  items?: OrderItem[];
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
  totalAmount,
  couponCode,
  discountTotal,
  items = [],
}: OrderStatusUpdateEmailProps) => {
  const shortOrderId = orderId.split("-")[0].toUpperCase();
  const readableStatus = statusMap[status] || status;
  const subTotal = (totalAmount || 0) + (discountTotal || 0);

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

      {/* Sipariş Özeti (Özellikle İptal Durumlarında veya Ürünler Gönderildiğinde Gösterilir) */}
      {items && items.length > 0 && (
        <Section style={sharedStyles.sectionStorefront}>
          <Text style={sharedStyles.strongStorefront}>Sipariş Özeti</Text>
          
          <div style={{ marginBottom: "20px" }}>
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
                  borderBottom: isLast ? "none" : "1px solid #99f6e4", 
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

          <Hr style={sharedStyles.sectionHrStorefront} />
          <Text style={sharedStyles.textRow}>
            <span style={sharedStyles.label}>Sipariş Numarası:</span> 
            <span style={sharedStyles.value}>#{shortOrderId}</span>
          </Text>
          
          {totalAmount !== undefined && (
            couponCode && discountTotal && discountTotal > 0 ? (
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
                  <span style={sharedStyles.label}>İade Edilen Tutar:</span> 
                  <span style={sharedStyles.valueTotalStorefront}>₺{totalAmount.toLocaleString("tr-TR")}</span>
                </Text>
              </>
            ) : (
              <Text style={sharedStyles.textRow}>
                <span style={sharedStyles.label}>{status === 'cancelled' ? 'İade Edilen Tutar:' : 'Toplam Tutar:'}</span> 
                <span style={sharedStyles.valueTotalStorefront}>₺{totalAmount.toLocaleString("tr-TR")}</span>
              </Text>
            )
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
