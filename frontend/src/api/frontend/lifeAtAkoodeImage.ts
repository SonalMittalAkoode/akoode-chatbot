const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_FRONTEND_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function getLifeAtAkoodeImages() {
    try {
        const url = `${API_URL}/frontend/api/life-at-akoode-images`;
        // console.log('🔍 Fetching Life at Akoode images from:', url);

        const response = await fetch(url, {
            cache: 'no-store', // Always fetch fresh for SSR
        });

        // console.log('📡 Response status:', response.status, response.statusText);

        if (!response.ok) {
            console.error('Failed to fetch Life at Akoode images. Status:', response.status);
            return [];
        }

        const data = await response.json();
        let list = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : data?.images && Array.isArray(data.images) ? data.images : []);
        return list.map((item: Record<string, unknown>) => ({
            image: (item.image ?? item.imageUrl ?? item.url ?? item.src) ?? '',
            title: (item.title ?? item.name ?? item.caption) ?? 'Life @ Akoode',
            _id: item._id ?? item.id,
        })).filter((item) => Boolean(item.image));
    } catch (error) {
        console.error('Error fetching Life at Akoode images:', error);
        return []; // Return empty array on error (fallback will handle)
    }
}
