// Using the same pattern as other API files in the project
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:5000/admin/";
const FRONTEND_API_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";

export const subscribeNewsletterAPI = async (email: string) => {
    try {
        const response = await fetch(`${FRONTEND_API_URL}api/subscribeenquiry`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        return await response.json();
    } catch (error: any) {
        console.error("Newsletter Subscription Error:", error);
        throw error;
    }
};

// Admin API
export const getSubscribersAPI = async (
    token: string,
    filter: { limit?: number; page?: number } = {}
) => {
    try {
        const limit = filter.limit ?? 10;
        const page = filter.page ?? 1;
        const response = await fetch(`${ADMIN_API_URL}api/subscribeenquiry?limit=${limit}&page=${page}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch subscribers");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Get Subscribers Error:", error);
        throw error;
    }
};

export const deleteSubscriberAPI = async (id: string, token: string) => {
    try {
        const response = await fetch(`${ADMIN_API_URL}api/subscribeenquiry/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete subscriber");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Delete Subscriber Error:", error);
        throw error;
    }
};
