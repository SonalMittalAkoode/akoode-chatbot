'use client';

import { useEffect } from 'react';

const SCRIPT_ID = 'schema-blog-faq';

export default function FaqSchemaInjector({ faqEntities = [], nonce }) {
  useEffect(() => {
    if (!Array.isArray(faqEntities) || faqEntities.length === 0) {
      const existing = document.getElementById(SCRIPT_ID);
      if (existing) existing.remove();
      return;
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqEntities.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    let script = document.getElementById(SCRIPT_ID);
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      if (nonce) {
        script.nonce = nonce;
      }
      document.head.appendChild(script);
    }
    if (nonce) {
      script.nonce = nonce;
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const current = document.getElementById(SCRIPT_ID);
      if (current) current.remove();
    };
  }, [faqEntities, nonce]);

  return null;
}

