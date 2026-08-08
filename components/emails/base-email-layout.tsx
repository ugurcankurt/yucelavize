import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Img,
  Row,
  Column,
} from "react-email";
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.yucelavize.com";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={sharedStyles.main}>
        <Container style={sharedStyles.container}>
          <Section style={headerStyle}>
            <div style={{ padding: "10px 0" }}>
              <table align="center" border={0} cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: "0 auto" }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: "middle", paddingRight: "16px" }}>
                      <Img 
                        src={`${baseUrl}/yucel_avize_logo_white.webp`} 
                        width="62" 
                        height="62"
                        alt="Yücel Avize Logo" 
                        style={{ display: "block" }} 
                      />
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      <div style={{ 
                        color: "#ffffff", 
                        fontSize: "22px", 
                        fontWeight: "900", 
                        letterSpacing: "0.2em",
                        lineHeight: "1",
                        textTransform: "uppercase",
                        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                      }}>
                        YÜCEL AVİZE
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
