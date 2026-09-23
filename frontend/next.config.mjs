/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "react-icons"],
    optimizeCss: false,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Files under /public are served by Next with `Cache-Control: public,
  // max-age=0` by default, so every repeat visitor revalidates every image and
  // font on every page. These filenames are deploy-versioned content, not CMS
  // data, so a 30-day cache is safe. Deliberately scoped to static media only:
  // llms.txt, robots.txt and sitemap.xml must stay revalidating.
  async headers() {
    return [
      {
        source: "/:all*(webp|avif|png|jpg|jpeg|gif|svg|ico|woff|woff2|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/about.php",
        destination: "/about-us",
        permanent: true, // 301
      },
      {
        source: "/artificial-intelligence.php",
        destination: "/services/artificial-intelligence",
        permanent: true, // 301
      },
      {
        source: "/deep-learning.php",
        destination: "/services/deep-learning-and-data-science",
        permanent: true, // 301
      },
      {
        source: "/integrated-intelligence-services.php",
        destination: "/services/integrated-intelligence",
        permanent: true, // 301
      },
      {
        source: "/computer-vision-technology.php",
        destination: "/services/computer-vision-technology",
        permanent: true, // 301
      },
      {
        source: "/3d-and-metaverse-based.php",
        destination: "/services/3d-and-metaverse-based",
        permanent: true, // 301
      },

      {
        source: "/pioneering-generative-ai-integration.php",
        destination: "/services/pioneering-generative-ai-integration",
        permanent: true, // 301
      },
      {
        source: "/software-development.php",
        destination: "/services/software-development",
        permanent: true, // 301
      },
      {
        source: "/mobile-app-development.php",
        destination: "/services/mobile-app-development",
        permanent: true, // 301
      },
      {
        source: "/services/mobile-app-developement",
        destination: "/services/mobile-app-development",
        permanent: true, // 301
      },
      {
        source: "/services/end-to-end-tailored-software-solutions",
        destination: "/services/software-development",
        permanent: true, // 301
      },
      {
        source: "/ios-app-development.php",
        destination: "/services/ios-app-development",
        permanent: true, // 301
      },
      {
        source: "/android-app-development.php",
        destination: "/services/android-app-development",
        permanent: true, // 301
      },
      {
        source: "/native-app-development.php",
        destination: "/services/native-app-development",
        permanent: true, // 301
      },
      {
        source: "/hybrid-app-development.php",
        destination: "/services/hybrid-app-development",
        permanent: true, // 301
      },
      {
        source: "/flutter-development.php",
        destination: "/services/flutter-app-development",
        permanent: true, // 301
      },
      {
        source: "/web-development.php",
        destination: "/services/web-development",
        permanent: true, // 301
      },
      {
        source: "/web-development-technology.php",
        destination: "/services/web-development-technology",
        permanent: true, // 301
      },
      {
        source: "/custom-website-development.php",
        destination: "/services/custom-website-development",
        permanent: true, // 301
      },
      {
        source: "/dyanamic-website-development.php",
        destination: "/services/web-app-development",
        permanent: true, // 301
      },
      {
        source: "/static-website-development.php",
        destination: "/services/website-design",
        permanent: true, // 301
      },
      {
        source: "/services/dynamic-website-development",
        destination: "/services/web-app-development",
        permanent: true, // 301
      },
      {
        source: "/services/static-website-development",
        destination: "/services/website-design",
        permanent: true, // 301
      },
      {
        source: "/services/deep-learning-and-data-science",
        destination: "/services/deep-learning-development",
        permanent: true, // 301
      },
      // {
      //   source: "/services/static-website-development",
      //   destination: "/services/website-design",
      //   permanent: true, // 301
      // },
      {
        source: "/full-stack-website-development.php",
        destination: "/services/full-stack-website-development",
        permanent: true, // 301
      },
      {
        source: "/ai-powered-website-development.php",
        destination: "/services/ai-powered-website-development",
        permanent: true, // 301
      },
      {
        source: "/ecommerce-development-company-gurgaon.php",
        destination: "/services/ecommerce-development",
        permanent: true, // 301
      },
      {
        source: "/magento-development-company-india.php",
        destination: "/services/magento-development",
        permanent: true, // 301
      },
      {
        source: "/opencart-development-company-india.php",
        destination: "/services/opencart-development",
        permanent: true, // 301
      },
      {
        source: "/shopify-development-company-india.php",
        destination: "/services/shopify-development",
        permanent: true, // 301
      },
      {
        source: "/woocommerce-development-company-india.php",
        destination: "/services/woocommerce-development",
        permanent: true, // 301
      },
      {
        source: "/industries/retail",
        destination: "/industries/retail-and-ecommerce",
        permanent: true, // 301
      },
      // services
      {
        source: "/iot.php",
        destination: "/services/iot",
        permanent: true, // 301
      },
      {
        source: "/category/mobile-app-development-in-gurgaon",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/big-data.php",
        destination: "/services/big-data",
        permanent: true, // 301
      },
      {
        source: "/blockchain-development.php",
        destination: "/services/blockchain-development",
        permanent: true, // 301
      },
      {
        source: "/staff-augmentation-services.php",
        destination: "/services/staff-augmentation",
        permanent: true, // 301
      },
      {
        source: "/digital-marketing-services.php",
        destination: "/services/360-digital-marketing",
        permanent: true, // 301
      },
      {
        source: "/career.php",
        destination: "/career",
        permanent: true, // 301
      },
      {
        source: "/blog/",
        destination: "/blog",
        permanent: true, // 301
      },
      // Blog legacy pagination + tag URLs (no matching routes in App Router)
      {
        source: "/blog/page/:path*",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/tag/:path*",
        destination: "/blog",
        permanent: true, // 301
      },
      // /blog/category/[slug] is now a real route (renamed from /blog/cat) —
      // send the old /blog/cat URLs there instead of swallowing them into /blog.
      {
        source: "/blog/cat/:slug",
        destination: "/blog/category/:slug",
        permanent: true, // 301
      },
      {
        source: "/contact.php",
        destination: "/contact-us",
        permanent: true, // 301
      },
      {
        source: "/post-requirement.php",
        destination: "/post-requirement",
        permanent: true, // 301
      },
      {
        source: "/clients.php",
        destination: "/case-studies",
        permanent: true, // 301
      },
      // case-study → case-studies (canonical rename)
      {
        source: "/case-study",
        destination: "/case-studies",
        permanent: true,
      },
      {
        source: "/case-study/mullen",
        destination: "/case-studies/mullen-equipment-digital-transformation",
        permanent: true, // 301
      },
      {
        source: "/case-studies/mullen",
        destination: "/case-studies/mullen-equipment-digital-transformation",
        permanent: true, // 301
      },
      {
        source: "/case-study/:path*",
        destination: "/case-studies/:path*",
        permanent: true,
      },
      {
        source: "/blog/oftware-development-cost-philadelphia",
        destination: "/blog/software-development-cost-philadelphia",
        permanent: true, // 301
      },
      {
        source: "/blog/mobile-app-development-gurgaon/",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/mobile-app-development-gurgaon",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/guide-connecting-android-app-development-company-gurgaon-introduction",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/services-features-top-firms-developing-mobile-apps-offer",
        destination: "/blog",
        permanent: true, // 301
      }
      ,
      {
        source: "/blog/hire-dedicated-mobile-app-developer",
        destination: "/blog",
        permanent: true, // 301
      }
      ,
      {
        source: "/blog/why-does-your-business-need-a-mobile-application",
        destination: "/blog",
        permanent: true, // 301
      }
      ,
      {
        source: "/blog/select-best-mobile-app-development",
        destination: "/blog",
        permanent: true, // 301
      }
      ,
      {
        source: "/blog/mobile-app-development",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/top-rated-ecommerce",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/build-ecommerce-mobile-application",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/importance-mobile-app-development-ecommerce",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/ecommerce-website-development-gurgaon",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/need-ecommerce-application-business-growth",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/ecommerce-mobile-app-development-gurgaon",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/many-ecommerce-websites-users-jump-hoops-part-money-technical-team-builds-ecommerce-website-without-understanding-sound-marketing-fundamentals-resu",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/ecommerce-website-vs-social-media-marketplace",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/killer-ecommerce-strategies-business-growth",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/software-development-company-india-usa",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/reasons-web-development-considered-mandatory-business",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/is-it-possible-carry-ecommerce-website-migration",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/build-effective-social-media-strategies-business-growth",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/blog/ecommerce-business-trends-know-2022",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/uiux-design.php",
        destination: "/services/software-development",
        permanent: true, // 301
      },
      {
        source: "/industry-landing.php",
        destination: "/",
        permanent: true, // 301
      },
      {
        source: "/ecommerce-solutions-in-gurgaon.php",
        destination: "/services/ecommerce-development",
        permanent: true, // 301
      },
      {
        source: "/industry.php",
        destination: "/",
        permanent: true, // 301
      },
      {
        source: "/resources.php",
        destination: "/blog",
        permanent: true, // 301
      },
      {
        source: "/seo-company-india.php",
        destination: "/services/360-digital-marketing",
        permanent: true, // 301
      },
      {
        source: "/smo-company-india.php",
        destination: "/services/360-digital-marketing",
        permanent: true, // 301
      },
      {
        source: "/uk/software-development-company-united-kingdom",
        destination: "/uk/software-development-company",
        permanent: true, // 301
      },
      {
        source: "/us/software-development-company",
        destination: "/usa/software-development-company",
        permanent: true, // 301
      },
      {
        source: "/laravel-developement.php",
        destination: "/services/software-development",
        permanent: true, // 301
      },
      {
        source: "/blog/ai-agent-development-cost-2026",
        destination: "/blog/enterprise-ai-agent-architecture",
        permanent: true, // 301
      },
      {
        source: "/uk/edinburgh/services/mvp-development-for-startups",
        destination: "/uk/edinburgh/mobile-app-development",
        permanent: true, // 301
      },
      {
        source: "/usa/las-vegas/locationslas-vegasmobile-app-development",
        destination: "/usa/las-vegas/mobile-app-development",
        permanent: true, // 301
      },
      {
        source: "/uk",
        destination: "/uk/software-development-company",
        permanent: true, // 301
      },
      {
        source: "/usa",
        destination: "/usa/software-development-company",
        permanent: true, // 301
      },
      {
        source: "/services/ecommerce-solutions",
        destination: "/services/ecommerce-development",
        permanent: true, // 301
      },
    ];
  },
  // Optimize images
  images: {
  formats: ['image/webp', 'image/avif'],
  dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'api.akoode.com',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'akoode-frontend.vercel.app',
      pathname: '/**',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '5000',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      pathname: '/**',
    },
    {
      protocol: 'http',
      hostname: '127.0.0.1',
      port: '5000',
      pathname: '/**',
    }
  ],
},
};

export default nextConfig;
