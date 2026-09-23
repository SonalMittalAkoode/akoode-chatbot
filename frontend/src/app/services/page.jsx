import JsonLdScript from '@/components/security/JsonLdScript';
import ServicesPageClient from '@/app/services-v2/_components/ServicesPageClient';
import { normalizedSiteUrl, buildCanonical } from '@/utils/seo';

const SITE = normalizedSiteUrl;
const canonical = buildCanonical('/services');

const listingSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Technology Services — Akoode Technologies',
      description:
        'Browse Akoode services including AI, software development, mobile apps, web platforms, cloud, and digital marketing.',
      url: canonical,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: normalizedSiteUrl || '/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: canonical },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Technology Services',
      itemListElement: [
        { '@type': 'ListItem', position: 1,  name: 'Artificial Intelligence',    url: `${SITE}/services/artificial-intelligence` },
        { '@type': 'ListItem', position: 2,  name: 'Deep Learning Development',  url: `${SITE}/services/deep-learning-development` },
        { '@type': 'ListItem', position: 3,  name: 'Software Development',       url: `${SITE}/services/software-development` },
        { '@type': 'ListItem', position: 4,  name: 'Mobile App Development',     url: `${SITE}/services/mobile-app-development` },
        { '@type': 'ListItem', position: 5,  name: 'eCommerce Development',      url: `${SITE}/services/ecommerce-development` },
        { '@type': 'ListItem', position: 6,  name: 'Web Development',            url: `${SITE}/services/web-development` },
        { '@type': 'ListItem', position: 7,  name: 'IoT Development',            url: `${SITE}/services/iot` },
        { '@type': 'ListItem', position: 8,  name: 'Blockchain Development',     url: `${SITE}/services/blockchain-development` },
        { '@type': 'ListItem', position: 9,  name: 'Cloud & DevOps',             url: `${SITE}/services/cloud-and-devops-solutions` },
        { '@type': 'ListItem', position: 10, name: '360° Digital Marketing',     url: `${SITE}/services/360-digital-marketing` },
      ],
    },
    {
      '@type': 'Service',
      serviceType: 'AI Development',
      provider: { '@id': `${SITE}/#organization` },
      areaServed: ['IN', 'GB', 'US'],
      url: `${SITE}/services/artificial-intelligence`,
    },
    {
      '@type': 'Service',
      serviceType: 'Software Development',
      provider: { '@id': `${SITE}/#organization` },
      areaServed: ['IN', 'GB', 'US'],
      url: `${SITE}/services/software-development`,
    },
    {
      '@type': 'Service',
      serviceType: 'Mobile App Development',
      provider: { '@id': `${SITE}/#organization` },
      areaServed: ['IN', 'GB', 'US'],
      url: `${SITE}/services/mobile-app-development`,
    },
    {
      '@type': 'Service',
      serviceType: 'eCommerce Development',
      provider: { '@id': `${SITE}/#organization` },
      areaServed: ['IN', 'GB', 'US'],
      url: `${SITE}/services/ecommerce-development`,
    },
    {
      '@type': 'Service',
      serviceType: 'Web Development',
      provider: { '@id': `${SITE}/#organization` },
      areaServed: ['IN', 'GB', 'US'],
      url: `${SITE}/services/web-development`,
    },
    {
      '@type': 'Service',
      serviceType: '360° Digital Marketing',
      provider: { '@id': `${SITE}/#organization` },
      areaServed: ['IN', 'GB', 'US'],
      url: `${SITE}/services/360-digital-marketing`,
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <JsonLdScript id="schema-services-listing" data={listingSchema} />
      <ServicesPageClient />
    </>
  );
}
