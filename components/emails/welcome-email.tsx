import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { BaseEmailLayout } from "./base-email-layout";
import { sharedStyles } from "./shared-styles";

interface WelcomeEmailProps {
  customerName: string;
}

export const WelcomeEmail = ({ customerName }: WelcomeEmailProps) => {
  return (
    <BaseEmailLayout previewText="Yücel Avize'ye Hoş Geldiniz!" theme="storefront">
      <Text style={sharedStyles.h2}>Hoş Geldiniz, {customerName}!</Text>
      <Text style={sharedStyles.text}>
        Yücel Avize ailesine katıldığınız için teşekkür ederiz. Hesabınız başarıyla oluşturuldu. Artık siparişlerinizi kolayca takip edebilir ve yeni alışverişlerinizde daha hızlı işlem yapabilirsiniz.
      </Text>
      <Section style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
        <Button href={`https://yucelavize.com/account`} style={sharedStyles.button}>
          Hesabıma Git
        </Button>
      </Section>
      <Text style={sharedStyles.text}>
        Keyifli alışverişler dileriz!
      </Text>
    </BaseEmailLayout>
  );
};
