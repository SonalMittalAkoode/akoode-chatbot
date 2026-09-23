// Get all Life at Akoode images (admin)
export async function getLifeAtAkoodeTableData() {
    try {
        const userDataStr = sessionStorage.getItem("user");
        let token = null;
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            token = userData?.token;
        }

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
        const response = await fetch(apiUrl + "api/life-at-akoode-image", {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Life at Akoode images");
        }

        const data = await response.json();
        return Array.isArray(data) ? data : (data.data || data);
    } catch (error) {
        console.error("Error fetching Life at Akoode images:", error);
        return [];
    }
}

// Get single image by ID
export const getLifeAtAkoodeByID = async (id: string) => {
    const userDataStr = sessionStorage.getItem("user");
    if (!userDataStr) {
        throw new Error("User not authenticated!");
    }
    const userData = JSON.parse(userDataStr);
    const token = userData?.token;
    if (!token) {
        throw new Error("User not authenticated!");
    }

    const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
    const response = await fetch(apiUrl + `api/life-at-akoode-image/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get image");
    }

    return response.json();
};

// Create new Life at Akoode image
export const addLifeAtAkoodeAPI = async (formData: FormData) => {
    const userDataStr = sessionStorage.getItem("user");
    if (!userDataStr) {
        throw new Error("User not authenticated!");
    }
    const userData = JSON.parse(userDataStr);
    const token = userData?.token;

    if (!token) {
        throw new Error("User not authenticated!");
    }

    const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
    const fullUrl = apiUrl + "api/life-at-akoode-image";

    console.log('🚀 [UPLOAD] Sending POST to:', fullUrl);
    console.log('📦 [UPLOAD] FormData entries:');
    for (const [key, value] of formData.entries()) {
        console.log(`  - ${key}:`, value instanceof File ? `File(${value.name})` : value);
    }

    const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    console.log('📡 [UPLOAD] Response status:', response.status, response.statusText);

    if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [UPLOAD] Error response:', errorData);
        throw new Error(errorData.message || "Failed to add image");
    }

    const result = await response.json();
    console.log('✅ [UPLOAD] Success response:', result);
    return result;
};

// Update Life at Akoode image
export const updateLifeAtAkoodeAPI = async (id: string, formData: FormData) => {
    const userDataStr = sessionStorage.getItem("user");
    if (!userDataStr) {
        throw new Error("User not authenticated!");
    }
    const userData = JSON.parse(userDataStr);
    const token = userData?.token;

    if (!token) {
        throw new Error("User not authenticated!");
    }

    const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
    const response = await fetch(apiUrl + `api/life-at-akoode-image/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update image");
    }

    return response.json();
};

// Delete Life at Akoode image
export const deleteLifeAtAkoodeAPI = async (id: string) => {
    const userDataStr = sessionStorage.getItem("user");
    if (!userDataStr) {
        throw new Error("User not authenticated!");
    }
    const userData = JSON.parse(userDataStr);
    const token = userData?.token;
    if (!token) {
        throw new Error("User not authenticated!");
    }

    const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
    const response = await fetch(apiUrl + `api/life-at-akoode-image/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete image");
    }

    return response.json();
};
