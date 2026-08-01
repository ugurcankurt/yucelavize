import Image from "next/image";
import React, { ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbType {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  description?: string;
  imageUrl?: string | null;
  breadcrumbs?: BreadcrumbType[];
  children?: ReactNode;
}

export function PageHero({ title, description, imageUrl, breadcrumbs, children }: PageHeroProps) {
  return (
    <div
      className={`relative w-full -mt-[70px] pt-[85px] pb-6 md:-mt-[80px] md:pt-[100px] md:pb-8 flex flex-col items-center justify-center overflow-hidden ${imageUrl ? "" : "bg-gradient-to-br from-muted via-muted/50 to-background"
        }`}
    >
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover absolute inset-0 z-0"
          />
          <div className="absolute inset-0 bg-black/60 z-0" />
        </>
      )}

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4 md:mb-5 w-full flex justify-center lg:justify-start">
            <div className={`
              inline-flex items-center px-2 py-1 rounded-full text-[8px] sm:text-[9px] transition-all duration-300
              ${imageUrl ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg" : "bg-background/60 backdrop-blur-md border border-border shadow-sm"}
            `}>
              <Breadcrumb>
                <BreadcrumbList className={imageUrl ? "text-white/80" : "text-muted-foreground"}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className={`hover:text-primary transition-colors ${imageUrl ? "hover:text-white" : ""}`}>
                      <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((bc, idx) => (
                    <React.Fragment key={idx}>
                      <BreadcrumbSeparator className={imageUrl ? "text-white/40" : "text-muted-foreground/40"}>
                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        {bc.href ? (
                          <BreadcrumbLink href={bc.href} className={`hover:text-primary transition-colors ${imageUrl ? "hover:text-white" : ""}`}>
                            {bc.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className={imageUrl ? "text-white font-semibold" : "font-semibold text-foreground"}>
                            {bc.label}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col items-center lg:items-start lg:text-left">
          <h1
            className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 max-w-4xl leading-tight ${imageUrl ? "text-white" : "text-foreground"
              }`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`text-base md:text-lg font-medium max-w-2xl mb-4 leading-relaxed ${imageUrl ? "text-white/90" : "text-muted-foreground"
                }`}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
