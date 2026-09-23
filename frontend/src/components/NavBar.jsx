import NavBarClient from './NavBarClient';
import { NAV_SERVICES, NAV_INDUSTRIES } from '@/lib/cacheTags';

export default async function NavBar({ forceTransparent = false }) {
    const ADMIN_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? '').replace(/\/$/, '');
    const SERVER_BASE = ADMIN_BASE.replace(/\/admin$/, '');

    let initialServicesData = [];
    try {
        const res = await fetch(`${ADMIN_BASE}/api/services`, { next: { revalidate: 300, tags: [NAV_SERVICES] } });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) initialServicesData = data;
        }
    } catch { /* fall back to client-side fetch */ }

    const slimServices = initialServicesData.map((s) => ({
        _id: s?._id,
        slug: s?.slug,
        project: s?.project,
        title: s?.title,
        children: Array.isArray(s?.children)
            ? s.children.map((c) => ({ _id: c?._id, slug: c?.slug, project: c?.project, title: c?.title }))
            : [],
    }));

    let initialIndustriesData = [];
    try {
        const res = await fetch(`${SERVER_BASE}/frontend/api/industry/list`, { next: { revalidate: 300, tags: [NAV_INDUSTRIES] } });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.items)) initialIndustriesData = data.items;
        }
    } catch { /* fall back to client-side fetch */ }

    const slimIndustries = initialIndustriesData
        .map((i) => ({ _id: i?._id, slug: i?.slug, name: i?.name }))
        .sort((a, b) => (a._id < b._id ? -1 : 1)); // oldest-first (ObjectId embeds creation timestamp)

    return (
        <NavBarClient
            initialServicesData={slimServices}
            initialIndustriesData={slimIndustries}
            forceTransparent={forceTransparent}
        />
    );
}
