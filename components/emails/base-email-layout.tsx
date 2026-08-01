import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
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
  
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={sharedStyles.main}>
        <Container style={sharedStyles.container}>
          <Section style={headerStyle}>
            <Heading style={sharedStyles.h1}>yücelavize</Heading>
          </Section>
          <Section style={sharedStyles.content}>
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
