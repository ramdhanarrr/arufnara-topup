import API from "../_api";

export const getPayments = async () => {
  try {
    const token = localStorage.getItem('token'); // atau sessionStorage.getItem('token')
    
    const { data } = await API.get("http://localhost:8000/api/admin/payments", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}