import { CollectionPage, ItemList, WithContext } from "schema-dts";

interface CollectionJsonLdProps {
  name: string;
  description?: string;
  url: string;
  imageUrl?: string;
  products: {
    name: string;
    url: string;
  }[];
}

export function CollectionJsonLd({
  name,
  description,
  url,
  imageUrl,
  products,
}: CollectionJsonLdProps) {
  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    ...(imageUrl && { image: imageUrl }),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: product.url,
        name: product.name,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
