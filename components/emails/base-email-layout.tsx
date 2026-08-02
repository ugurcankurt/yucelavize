import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Img
} from "@react-email/components";
import * as React from "react";
import { sharedStyles } from "./shared-styles";

interface BaseEmailLayoutProps {
  previewText: string;
  theme?: "admin" | "storefront";
  children: React.ReactNode;
}

export const BaseEmailLayout = ({ previewText, theme = "storefront", children }: BaseEmailLayoutProps) => {
  const headerStyle = theme === "admin" ? sharedStyles.headerAdmin : sharedStyles.headerStorefront;
  
  // Base URL is required for images in emails. 
  // For local development it might break in real email clients but works fine in preview.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yucelavize.com";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={sharedStyles.main}>
        <Container style={sharedStyles.container}>
          <Section style={headerStyle}>
            <Img 
              src={`${baseUrl}/yucel_avize_white_logo.png`} 
              width="150" 
              alt="Yücel Avize Logo" 
              style={{ margin: "0 auto" }} 
            />
          </Section>
          <Section style={sharedStyles.content}>
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
