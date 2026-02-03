
import React, { useEffect } from 'react';
import { Organization } from '../types';

interface SEOMetadataProps {
    organization?: Organization;
}

const SEOMetadata: React.FC<SEOMetadataProps> = ({ organization }) => {
    useEffect(() => {
        // Basic Meta Tags
        document.title = organization
            ? `${organization.name} - Navbat olish`
            : 'NAVBAT - O\'zbekistondagi eng tezkor navbat tizimi';

        const description = organization
            ? `${organization.name} tashkilotiga onlayn navbat oling. Manzil: ${organization.address}.`
            : 'O\'zbekiston bo\'ylab davlat idoralari, banklar va poliklinikalarga onlayn navbat olish tizimi.';

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', description);

        // JSON-LD Schema
        const schemaId = 'navbat-jsonld';
        let scriptTag = document.getElementById(schemaId) as HTMLScriptElement;
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = schemaId;
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }

        const schemaData = organization ? {
            "@context": "https://schema.org",
            "@type": organization.category === 'Health' ? 'Hospital' : 'GovernmentOffice',
            "name": organization.name,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": organization.address,
                "addressLocality": "Tashkent",
                "addressCountry": "UZ"
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
                    "name": "E-Navbat"
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
            }
        };

        scriptTag.text = JSON.stringify(schemaData);

        return () => {
            // Optional: cleanup
        };
    }, [organization]);

    return null;
};

export default SEOMetadata;
