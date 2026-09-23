import {
  Sparkles,
  Layers,
  ShieldCheck,
  Rocket,
  Zap,
  Globe,
  Cpu,
  Heart,
  Code2,
  Palette,
  Target,
  Lightbulb,
  BarChart3,
  Users,
  Monitor,
} from 'lucide-react';

/** Admin dropdown + public icon resolution */
export const WHY_CHOOSE_US_ICON_OPTIONS = [
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'layers', label: 'Layers' },
  { value: 'shield-check', label: 'Shield check' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'zap', label: 'Zap' },
  { value: 'globe', label: 'Globe' },
  { value: 'cpu', label: 'CPU' },
  { value: 'heart', label: 'Heart' },
  { value: 'code-2', label: 'Code' },
  { value: 'palette', label: 'Palette' },
  { value: 'target', label: 'Target' },
  { value: 'lightbulb', label: 'Lightbulb' },
  { value: 'bar-chart-3', label: 'Bar chart' },
  { value: 'users', label: 'Users' },
  { value: 'monitor', label: 'Monitor' },
];

const ICON_MAP = {
  sparkles: Sparkles,
  layers: Layers,
  'shield-check': ShieldCheck,
  rocket: Rocket,
  zap: Zap,
  globe: Globe,
  cpu: Cpu,
  heart: Heart,
  'code-2': Code2,
  palette: Palette,
  target: Target,
  lightbulb: Lightbulb,
  'bar-chart-3': BarChart3,
  users: Users,
  monitor: Monitor,
};

export function getWhyChooseUsIconComponent(key) {
  const k = String(key || 'sparkles')
    .toLowerCase()
    .trim()
    .replace(/_/g, '-');
  return ICON_MAP[k] || Sparkles;
}

export function emptyWhyChooseUsShowcase() {
  return {
    badge: '',
    title: '',
    subtitle: '',
    pulseCaption: '',
    pulseStat1Label: '',
    pulseStat1Value: '',
    pulseStat1Sub: '',
    pulseStat2Label: '',
    pulseStat2Value: '',
    pulseStat2Sub: '',
    pulseQualityTitle: '',
    pulseQualitySubtitle: '',
    features: [],
    footer: [],
  };
}

export function mergeWhyChooseUsShowcase(raw) {
  const e = emptyWhyChooseUsShowcase();
  if (!raw || typeof raw !== 'object') return e;
  const features = Array.isArray(raw.features)
    ? raw.features.map((f) => ({
        icon: typeof f?.icon === 'string' ? f.icon : 'sparkles',
        title: f?.title != null ? String(f.title) : '',
        description: f?.description != null ? String(f.description) : '',
      }))
    : [];
  const footer = Array.isArray(raw.footer)
    ? raw.footer.map((f) => ({
        label: f?.label != null ? String(f.label) : '',
        sublabel: f?.sublabel != null ? String(f.sublabel) : '',
      }))
    : [];
  return {
    ...e,
    badge: raw.badge != null ? String(raw.badge) : '',
    title: raw.title != null ? String(raw.title) : '',
    subtitle: raw.subtitle != null ? String(raw.subtitle) : '',
    pulseCaption: raw.pulseCaption != null ? String(raw.pulseCaption) : '',
    pulseStat1Label: raw.pulseStat1Label != null ? String(raw.pulseStat1Label) : '',
    pulseStat1Value: raw.pulseStat1Value != null ? String(raw.pulseStat1Value) : '',
    pulseStat1Sub: raw.pulseStat1Sub != null ? String(raw.pulseStat1Sub) : '',
    pulseStat2Label: raw.pulseStat2Label != null ? String(raw.pulseStat2Label) : '',
    pulseStat2Value: raw.pulseStat2Value != null ? String(raw.pulseStat2Value) : '',
    pulseStat2Sub: raw.pulseStat2Sub != null ? String(raw.pulseStat2Sub) : '',
    pulseQualityTitle: raw.pulseQualityTitle != null ? String(raw.pulseQualityTitle) : '',
    pulseQualitySubtitle: raw.pulseQualitySubtitle != null ? String(raw.pulseQualitySubtitle) : '',
    features,
    footer,
  };
}

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/** Whether the showcase block should render on the public case study page */
export function whyChooseUsShowcaseIsVisible(w) {
  if (!w || typeof w !== 'object') return false;
  if (stripHtml(w.title)) return true;
  if (stripHtml(w.subtitle)) return true;
  if (stripHtml(w.badge)) return true;
  if (stripHtml(w.pulseCaption)) return true;
  if (stripHtml(w.pulseStat1Value) || stripHtml(w.pulseQualityTitle)) return true;
  const features = Array.isArray(w.features) ? w.features : [];
  if (features.some((f) => stripHtml(f?.title) || stripHtml(f?.description))) return true;
  const footer = Array.isArray(w.footer) ? w.footer : [];
  if (footer.some((f) => stripHtml(f?.label) || stripHtml(f?.sublabel))) return true;
  return false;
}
