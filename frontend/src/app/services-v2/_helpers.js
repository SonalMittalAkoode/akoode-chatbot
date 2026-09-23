// All pure data + utility functions for the services-v2 page.
// No React imports — safe to use in both client and server contexts.

import {
  Brain, Layers, Network, MessageSquare, Zap, BarChart3,
  Code2, RefreshCw, Package, Monitor, Users, Smartphone,
  Globe, ShoppingCart, Cpu, TrendingUp, Cloud, Database,
} from 'lucide-react';
import resolveImageUrl from '@/utils/resolveImageUrl';

// ─── Icon mapping ─────────────────────────────────────────────────────────────

export const SICON_MAP = [
  { kw: ['artificial-intelligence','ai-service','machine-learning','ai-ml','deep-learning','genai','generative','neural'], icon: Brain },
  { kw: ['nlp','chatbot','conversational','natural-language'], icon: MessageSquare },
  { kw: ['computer-vision','vision','image-recognition','video'], icon: Monitor },
  { kw: ['software-dev','software-development','custom-software','enterprise-app','saas-dev','erp','crm'], icon: Code2 },
  { kw: ['mobile-app','mobile-application','ios','android','react-native','flutter','app-dev'], icon: Smartphone },
  { kw: ['ecommerce','e-commerce','shopify','woocommerce','magento','b2b-commerce','online-store'], icon: ShoppingCart },
  { kw: ['web-dev','web-development','website','next-js','jamstack','cms','portal','frontend'], icon: Globe },
  { kw: ['digital-marketing','marketing','seo','social-media','ppc','content','cro','campaign','360'], icon: TrendingUp },
  { kw: ['cloud','aws','azure','gcp','infrastructure','hosting'], icon: Cloud },
  { kw: ['devops','ci-cd','kubernetes','docker','pipeline','deploy'], icon: Layers },
  { kw: ['iot','internet-of-things','sensor','embedded'], icon: Cpu },
  { kw: ['blockchain','crypto','nft','defi','web3','smart-contract'], icon: Network },
  { kw: ['data','analytics','bi','warehouse','dashboard','big-data','reporting'], icon: BarChart3 },
  { kw: ['automation','rpa','workflow','process'], icon: Zap },
  { kw: ['ar','vr','xr','metaverse','augmented','virtual','immersive','3d'], icon: Cpu },
  { kw: ['staff','augmentation','hire','team','outsource','it-staff'], icon: Users },
  { kw: ['database','sql','nosql','postgresql','mongodb'], icon: Database },
  { kw: ['migration','modernization','legacy','transform','replatform'], icon: RefreshCw },
  { kw: ['package','product','suite','platform'], icon: Package },
];

export const stripHtml = (html) => (html ?? '').replace(/<[^>]*>/g, '').trim();
export const serviceLabel = (item) => stripHtml(item?.project || item?.title || '');

export function getServiceIcon(slug = '', title = '') {
  const s = `${slug} ${title}`.toLowerCase().replace(/[^a-z0-9-]/g, ' ');
  const match = SICON_MAP.find(({ kw }) => kw.some((k) => s.includes(k)));
  return match?.icon ?? Globe;
}

export function makeTitleParts(label = '') {
  const words = label.trim().split(/\s+/);
  if (words.length <= 1) return [{ text: label, purple: true }];
  const last = words.pop();
  return [
    { text: words.join(' ') + ' ', purple: false },
    { text: last, purple: true },
  ];
}

// ─── Trust badge data ─────────────────────────────────────────────────────────

import { Bot, Award, Clock, MapPin, Boxes } from 'lucide-react';

export const TRUST_BADGES = [
  { Icon: Bot,   title: 'AI First Since 2023' },
  { Icon: Boxes, title: '180 Projects Shipped' },
  { Icon: Award, title: 'Clutch Top AI Companies in India' },
  { Icon: MapPin, title: 'UK / US / India' },
  { Icon: Clock, title: '15+ Industries Served' },
];

// ─── Editorial copy keyed by slug pattern ────────────────────────────────────

export const STATIC_EDITORIAL = {
  ai: {
    subtitle: 'We build AI that is explainable, production-ready, and aligned to how your business actually makes decisions - not just demos that impress in a boardroom. Our AI solutions drive measurable outcomes across automation, prediction, and decision intelligence. ',
    dividerDesc: "From machine learning and deep learning to generative AI and computer vision, Akoode's AI practice covers the full spectrum of intelligent systems development. We work with B2B companies across the UK, US, and India to design, build, and deploy AI that creates real operational and competitive advantage.",
    ctaLabel: 'Explore all AI capabilities',
    caseStudyTitleParts: [{ text: 'How We Built an AI Diagnostic System ', purple: false }, { text: 'That Matches Clinical Accuracy', purple: true }],
    caseStudies: [
      { title: 'AI-Powered Demand Forecasting Cuts Stockouts by 68% for UK Retailer', slug: 'ai-demand-forecasting-uk-retailer', industry: 'Retail', country: 'UK', stat1Value: '68%', stat1Label: 'Fewer Stockouts', stat2Value: '3.2x', stat2Label: 'ROI in Year One', shortdescription: 'A mid-market UK retailer replaced spreadsheet-driven buying with a custom ML forecasting engine — reducing over-ordering by £1.4M annually.', image: '/industries_page/hero.png' },
      { title: 'Generative AI Copilot Reduces Legal Document Review Time by 74%', slug: 'genai-legal-document-review', industry: 'Legal Tech', country: 'UK', stat1Value: '74%', stat1Label: 'Faster Review', stat2Value: '£2.1M', stat2Label: 'Annual Cost Saving', shortdescription: 'A UK legal services firm deployed a GPT-4 powered document review assistant — cutting average contract review time from 4.2 hours to under 65 minutes per matter.', image: '/industries_page/hero.png' },
    ],
  },
  software: {
    subtitle: 'Scalable, secure, and built to evolve. We engineer software around your actual workflows and business logic - not off-the-shelf templates that require your team to adapt around the tool.',
    dividerDesc: "Whether you need a full enterprise application, a lean startup MVP, or a cloud-native SaaS product, Akoode's software development team delivers end-to-end solutions with clean architecture, strong documentation, and the technical rigour that enterprise clients expect.",
    ctaLabel: 'Explore all software capabilities',
    caseStudyTitleParts: [{ text: 'How We Replaced Spreadsheets and Email ', purple: false }, { text: 'Chains With One HR Platform ', purple: true }],
    caseStudies: [
      { title: 'Brokerage CRM Rebuilt on Next.js — 12,000 Agents, Zero Downtime', slug: 'brokerage-crm-rebuilt', industry: 'Real Estate', country: 'UK', stat1Value: '94%', stat1Label: 'Faster Search', stat2Value: '1.6M', stat2Label: 'Listings Indexed', shortdescription: 'A property platform with 12,000 agents replaced a legacy monolith and cut listing-publish time from 6 minutes to under 90 seconds.', image: '/industries_page/hero.png' },
    ],
  },
  mobile: {
    subtitle: 'iOS, Android, native, hybrid - we build mobile experiences that users choose to keep on their phones. From consumer apps to complex enterprise mobility solutions, we deliver across every major platform and framework.',
    dividerDesc: 'As a full-cycle mobile app development company, Akoode covers the entire product lifecycle - from UX strategy and prototyping to development, testing, deployment, and post-launch support. Our mobile teams have shipped apps for startups, scale-ups, and enterprise clients across the UK, US, and India. ',
    ctaLabel: 'Explore all mobile capabilities',
    caseStudyTitleParts: [{ text: 'How We Built a Travel Dating App With ', purple: false }, { text: 'an ML Matchmaking Engine', purple: true }],
    caseStudies: [
      { title: 'HealthTech App Reaches 200K Users in 6 Months Post-Launch', slug: 'healthtech-app-200k-users', industry: 'HealthTech', country: 'UK', stat1Value: '200K', stat1Label: 'Active Users', stat2Value: '4.8★', stat2Label: 'App Store Rating', shortdescription: 'A digital-first GP network needed an iOS and Android app handling onboarding, consultations, and prescriptions within NHS compliance. Akoode delivered in 12 weeks.', image: '/industries_page/hero.png' },
    ],
  },
  ecommerce: {
    subtitle: 'We build eCommerce platforms that convert browsers into buyers and buyers into repeat customers - from Shopify and Magento to fully custom commerce engines built for scale. ',
    dividerDesc: "An ecommerce platform is only as valuable as the revenue it generates. We build and optimize Shopify, WooCommerce, Magento, and fully custom ecommerce stores - with conversion-optimized UX, seamless payment integrations, and AI-powered product discovery baked in from day one. Whether you're launching a new store or scaling an existing one, we engineer for growth.",
    ctaLabel: 'Explore all eCommerce capabilities',
    caseStudyTitleParts: [{ text: 'See how a headless Shopify replatform ', purple: false }, { text: 'lifted conversion by 38% for a £30M UK fashion retailer.', purple: true }],
    caseStudies: [
      { title: 'Headless Shopify Replatform Lifts Conversion Rate by 38%', slug: 'headless-shopify-conversion-lift', industry: 'Fashion Retail', country: 'UK', stat1Value: '38%', stat1Label: 'Conversion Uplift', stat2Value: '1.1s', stat2Label: 'Avg Page Load', shortdescription: 'A £30M fashion retailer rebuilt as headless Next.js + Shopify Plus. Page load dropped from 4.8s to 1.1s, conversion lifted 38%.', image: '/industries_page/hero.png' },
    ],
  },
  web: {
    subtitle: 'Custom web solutions built to perform, scale, and rank. Whether you need a brand website, a complex web application, or an AI-powered digital platform, our web development team delivers technical excellence without cutting corners.',
    dividerDesc: 'Your website is your highest-traffic salesperson. We build custom websites, web applications, and full-stack platforms engineered for speed, scalability, and conversion - from marketing sites that rank to enterprise web apps that handle millions of users. Every line of code is written with one goal: measurable business outcomes.',
    ctaLabel: 'Explore all web capabilities',
    caseStudyTitleParts: [{ text: "How We Transformed Mullen Equipment's Outdated Website", purple: false }, { text: 'Into a Lead-Generating Platform', purple: true }],
    caseStudies: [
      { title: 'Law Firm Redesign Generates 4x More Qualified Enquiries in 90 Days', slug: 'law-firm-redesign-enquiries', industry: 'Legal', country: 'UK', stat1Value: '4x', stat1Label: 'More Enquiries', stat2Value: '98', stat2Label: 'Lighthouse Score', shortdescription: 'A 60-partner UK law firm rebuilt on Next.js with practice-area SEO achieved first-page rankings for 14 target keywords within 90 days.', image: '/industries_page/hero.png' },
    ],
  },
  'digital-marketing': {
    subtitle: 'Technology without traffic is a building with no address. We connect your digital product to the customers who need it - combining SEO, paid media, content strategy, and analytics into a single growth engine. ',
    dividerDesc: "Akoode's digital marketing practice works alongside our technology teams to ensure the products we build also acquire, engage, and retain users. From technical SEO and international search to performance-driven paid campaigns, we treat marketing as an extension of product strategy.",
    ctaLabel: 'Explore all marketing capabilities',
    caseStudyTitleParts: [{ text: 'How We Built an Offline AI Platform ', purple: false }, { text: 'That Automates Construction Estimation', purple: true }],
    caseStudies: [
      { title: 'B2B SaaS Goes from 800 to 22,000 Monthly Organic Visits in 14 Months', slug: 'b2b-saas-seo-growth', industry: 'SaaS', country: 'US', stat1Value: '22K', stat1Label: 'Organic Visits/Mo', stat2Value: '67%', stat2Label: 'Lower CAC vs Paid', shortdescription: 'A US-based project management SaaS rebuilt content strategy and fixed 140 technical SEO issues — 22,000 organic visits/month 14 months later.', image: '/industries_page/hero.png' },
    ],
  },
  emerging: {
    subtitle: "The technology stack of 2030 is being built today. We help forward-thinking businesses integrate IoT, blockchain, big data, and cloud infrastructure before their competitors do - building the operational capabilities that define industry leadership. ",
    dividerDesc: "Akoode's emerging technology practice covers the full spectrum of next-generation infrastructure - from connected device ecosystems and distributed ledger applications to enterprise cloud migrations and immersive metaverse experiences. ",
    ctaLabel: 'Explore all emerging tech capabilities',
    caseStudyTitleParts: [{ text: 'See how an IoT sensor network ', purple: false }, { text: 'saved a UK manufacturer £420K annually in energy costs.', purple: true }],
    caseStudies: [
      { title: 'IoT Sensor Network Reduces Energy Costs by £420K Annually', slug: 'iot-energy-optimisation-manufacturer', industry: 'Manufacturing', country: 'UK', stat1Value: '£420K', stat1Label: 'Annual Savings', stat2Value: '2,400', stat2Label: 'Sensors Deployed', shortdescription: 'A UK manufacturer deployed 2,400 IoT sensors across 6 production facilities — surfacing £420K in annual savings within the first operational year.', image: '/industries_page/hero.png' },
    ],
  },
};

export function findEditorial(slug = '') {
  const s = slug.toLowerCase();
  if (s.includes('ai') || s.includes('machine') || s.includes('artificial')) return STATIC_EDITORIAL.ai;
  if (s.includes('software') || s.includes('enterprise') || s.includes('saas')) return STATIC_EDITORIAL.software;
  if (s.includes('mobile') || s.includes('app')) return STATIC_EDITORIAL.mobile;
  if (s.includes('ecommerce') || s.includes('e-commerce') || s.includes('shopify')) return STATIC_EDITORIAL.ecommerce;
  if (s.includes('digital-marketing') || s.includes('marketing') || s.includes('360')) return STATIC_EDITORIAL['digital-marketing'];
  if (s.includes('web') || s.includes('website') || s.includes('frontend')) return STATIC_EDITORIAL.web;
  return null;
}

// ─── Fixed nav pill labels ────────────────────────────────────────────────────

export function getFixedTabLabel(slug = '') {
  const s = slug.toLowerCase();
  if (s.includes('ai') || s.includes('artificial') || s.includes('machine-learning')) return 'AI Intelligence';
  if (s.includes('software') || s.includes('software-dev')) return 'Software Development';
  if (s.includes('mobile') || s.includes('mobile-app')) return 'Mobile Apps';
  if (s.includes('ecommerce') || s.includes('e-commerce') || s.includes('shopify')) return 'Ecommerce';
  if (s.includes('digital-marketing') || s.includes('marketing') || s.includes('360')) return 'Digital Marketing';
  if (s.includes('web-dev') || s.includes('web-development')) return 'Web';
  if (s.includes('web') && !s.includes('development')) return 'Web';
  return null;
}

// ─── Build allSections from raw API servicesData ──────────────────────────────

// ─── Normalize a raw API case study into the ServiceCaseStudySection shape ────

function normalizeCaseStudy(cs) {
  const raw = cs.casestudyimage || '';
  const img = resolveImageUrl(raw) || '/industries_page/hero.png';
  return {
    title:            stripHtml(cs.title || cs.project || ''),
    slug:             cs.slug || '',
    industry:         cs.industry || '',
    country:          cs.country || '',
    shortdescription: stripHtml(cs.shortdescription || cs.aboutdescription || ''),
    image:            img,
    stat1Value:       null,
    stat1Label:       null,
    stat2Value:       null,
    stat2Label:       null,
  };
}

// Match case studies whose featuredInServices includes the section tab label.
function parseFeaturedInServices(val) {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  try { return JSON.parse(val); } catch { return []; }
}

function matchCaseStudies(allCaseStudies, tabLabel) {
  return allCaseStudies
    .filter((cs) => parseFeaturedInServices(cs.featuredInServices).includes(tabLabel))
    .map(normalizeCaseStudy);
}

export function buildSections(servicesData, caseStudiesData = []) {
  if (!servicesData.length) return [];

  const isDM = (s) => {
    const sl = `${s.slug || ''} ${serviceLabel(s)}`.toLowerCase();
    return sl.includes('digital-marketing') || sl.includes('digital marketing') || sl.includes('360');
  };

  const dmService   = servicesData.find(isDM);
  const withChildren = servicesData.filter((s) => !isDM(s) && s.children?.length > 0);
  const childless    = servicesData.filter((s) => !isDM(s) && !s.children?.length);

  const toFeature = (child) => ({
    Icon: getServiceIcon(child.slug || '', serviceLabel(child)),
    title: serviceLabel(child),
    desc: stripHtml(child.shortDescription || child.description || ''),
    href: `/services/${child.slug}`,
  });

  const toSection = (service) => {
    const lbl = serviceLabel(service);
    const tab = getFixedTabLabel(service.slug || '') || lbl;
    const ed  = findEditorial(service.slug || '');
    const apiDesc = stripHtml(service.description || service.shortDescription || '');
    return {
      id:          service.slug || String(service._id),
      tab,
      titleParts:  makeTitleParts(lbl),
      subtitle:    ed?.subtitle  || `Expert ${lbl} solutions for startups, scale-ups, and enterprise.`,
      dividerDesc: ed?.dividerDesc || null,
      apiDesc:     null,
      ctaLabel:         ed?.ctaLabel  || `Explore all ${lbl} capabilities`,
      ctaLink:          `/services/${service.slug}`,
      features:         (service.children || []).map(toFeature),
      caseStudies:         matchCaseStudies(caseStudiesData, tab),
      caseStudyTitleParts: ed?.caseStudyTitleParts || null,
    };
  };

  const parentSections = withChildren.map(toSection);

  const emergingSection = childless.length > 0 ? {
    id: 'emerging-tech',
    tab: 'Emerging Tech',
    titleParts: [{ text: 'Emerging ', purple: true }, { text: 'Technologies', purple: false }],
    subtitle:    STATIC_EDITORIAL.emerging.subtitle,
    dividerDesc: STATIC_EDITORIAL.emerging.dividerDesc,
    ctaLabel:    STATIC_EDITORIAL.emerging.ctaLabel,
    ctaLink:     '/services',
    features:    childless.map((s) => ({
      Icon:  getServiceIcon(s.slug || '', serviceLabel(s)),
      title: serviceLabel(s),
      desc:  stripHtml(s.shortDescription || s.description || ''),
      href:  `/services/${s.slug}`,
    })),
    caseStudies:         matchCaseStudies(caseStudiesData, 'Emerging Tech'),
    caseStudyTitleParts: STATIC_EDITORIAL.emerging.caseStudyTitleParts,
  } : null;

  const dmSection = dmService ? toSection(dmService) : null;
  if (dmSection) {
    const ed = STATIC_EDITORIAL['digital-marketing'];
    dmSection.tab        = 'Digital Marketing';
    dmSection.titleParts = [{ text: '360° ', purple: false }, { text: 'Digital Marketing', purple: true }];
    dmSection.subtitle   = ed.subtitle;
    dmSection.dividerDesc = ed.dividerDesc;
    dmSection.ctaLabel   = ed.ctaLabel;
    dmSection.caseStudies         = matchCaseStudies(caseStudiesData, 'Digital Marketing');
    dmSection.caseStudyTitleParts = ed.caseStudyTitleParts;
    if (!dmService.children?.length) {
      const link = dmSection.ctaLink;
      dmSection.features = [
        { Icon: TrendingUp, title: 'SEO & Content',        desc: 'Technical SEO, content strategy, and link building for sustainable organic growth.',        href: link },
        { Icon: BarChart3,  title: 'Paid Media',           desc: 'Google, Meta, and LinkedIn campaigns engineered for cost-per-acquisition.',                href: link },
        { Icon: Globe,      title: 'Social Media',         desc: 'Strategy, content creation, and community management across all major platforms.',         href: link },
        { Icon: Zap,        title: 'Marketing Automation', desc: 'HubSpot and custom automation workflows for lead nurturing at scale.',                      href: link },
        { Icon: Code2,      title: 'CRO',                  desc: 'Conversion rate optimization through A/B testing and data-driven iteration.',               href: link },
        { Icon: Network,    title: 'Analytics & Reporting', desc: 'Full-funnel attribution and performance reporting that drives decisions.',                  href: link },
      ];
    }
  }

  return [
    ...parentSections,
    ...(emergingSection ? [emergingSection] : []),
    ...(dmSection ? [dmSection] : []),
  ];
}
