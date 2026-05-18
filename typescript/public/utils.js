export function formatTime(minutes) {
    if (!minutes) return "0min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;

    return `${mins}min`; 
}

export async function apiRequest(url, options = {}) {
    try {
        const res = await fetch(url, options);
        const payload = await res.json();
        
        if (!res.ok) {
            return { data: null, error: payload.error || "An unexpected error occurred." };
        }
        return { data: payload, error: null };
    } catch (err) {
        return { data: null, error: "Network communication failure. Please check your connection." };
    }
}