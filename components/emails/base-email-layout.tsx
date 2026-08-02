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
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <Img 
                src={`${baseUrl}/yucel_avize_white_logo.png`} 
                width="120" 
                alt="Yücel Avize Logo" 
                style={{ margin: "0 auto", display: "block" }} 
              />
              <div style={{ 
                color: "#ffffff", 
                fontSize: "28px", 
                fontWeight: "900", 
                letterSpacing: "-1px", 
                lineHeight: "1",
                marginTop: "4px",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}>
                yücelavize
              </div>
            </div>
          </Section>
          <Section style={sharedStyles.content}>
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
