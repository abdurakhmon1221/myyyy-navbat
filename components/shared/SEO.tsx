
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
    image?: string;
    url?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    name = 'NAVBAT',
    type = 'website',
    image = '/logo.png', // Add a default OG image if available
    url = typeof window !== 'undefined' ? window.location.href : 'https://navbat.uz'
}) => {
    const siteTitle = title ? `${title} - ${name}` : name;
    const metaDescription = description || "O'zbekistondagi barcha navbatlarni onlayn kuzatish va bron qilish tizimi.";

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name='description' content={metaDescription} />
            <link rel="canonical" href={url} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={metaDescription} />
        </Helmet>
    );
}

export default SEO;
