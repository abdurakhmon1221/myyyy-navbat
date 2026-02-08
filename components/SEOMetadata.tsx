
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Organization } from '../types';

interface SEOMetadataProps {
    organization?: Organization;
}

const SEOMetadata: React.FC<SEOMetadataProps> = ({ organization }) => {
    // Dynamic Title & Description
    const title = organization
        ? `${organization.name} - Navbat olish`
        : 'NAVBAT - O\'zbekistondagi eng tezkor navbat tizimi';

    const description = organization
        ? `${organization.name} tashkilotiga onlayn navbat oling. Manzil: ${organization.address}. Ish vaqti: 09:00 - 18:00.`
        : 'O\'zbekiston bo\'ylab davlat idoralari, banklar va poliklinikalarga onlayn navbat olish, vaqtni tejash va qulay xizmat.';

    const url = organization
        ? `https://navbat.uz/org/${organization.id}`
        : 'https://navbat.uz';

    const image = '/logo.png'; // Default OG Image

    // JSON-LD Structured Data for Google Rich Snippets
    const schemaData = organization ? {
        "@context": "https://schema.org",
        "@type": organization.category === 'Health' ? 'Hospital' : 'GovernmentOffice',
        "name": organization.name,
        "image": image,
        "telephone": organization.phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": organization.address,
            "addressLocality": "Tashkent",
            "addressCountry": "UZ"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": organization.location.lat,
            "longitude": organization.location.lng
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
        },
        "potentialAction": {
            "@type": "ReserveAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `https://navbat.uz/org/${organization.id}`,
                "actionPlatform": [
                    "https://schema.org/DesktopWebPlatform",
                    "https://schema.org/MobileWebPlatform"
                ]
            },
            "result": {
                "@type": "Ticket",
                "name": "E-Navbat Chiptasi"
            }
        }
    } : {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "NAVBAT",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Android, iOS",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "UZS"
        },
        "description": description
    };

    return (
        <Helmet>
            {/* Standard Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph (Facebook/Telegram) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="NAVBAT" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEOMetadata;
