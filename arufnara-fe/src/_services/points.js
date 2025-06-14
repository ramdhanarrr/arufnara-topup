// services/points.js

export async function getPoints(token) {
    const response = await fetch('http://localhost:8000/api/points', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        // credentials: 'include', // jika pakai sanctum
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data poin');
    }

    const data = await response.json();
    return data.total_points;
}