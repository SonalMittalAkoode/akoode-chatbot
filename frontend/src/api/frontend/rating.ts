import { LIST_RATINGS, LIST_EMPLOYEES } from "@/lib/cacheTags";

export async function getFrontendRatings() {
    try {
        const backendBase =
            process.env.NEXT_PUBLIC_API_URL ||
            process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
            "http://localhost:5000/";

        const endpoint = `${backendBase.replace(/\/$/, "")}/frontend/api/rating/list`;

        const response = await fetch(endpoint, {
            next: { revalidate: 60, tags: [LIST_RATINGS] },
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("[getFrontendRatings] Error:", error);
        return [];
    }
}

export async function getEmployeeTableData() {
    try {
        const backendBase =
            process.env.NEXT_PUBLIC_API_URL ||
            process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
            "http://localhost:5000/";

        const endpoint = `${backendBase.replace(/\/$/, "")}/frontend/api/employee/list`;

        const response = await fetch(endpoint, {
            next: { revalidate: 60, tags: [LIST_EMPLOYEES] }
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("[getEmployeeTableData] Error:", error);
        return [];
    }
}
