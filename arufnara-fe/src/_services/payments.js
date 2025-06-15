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

export const getPaymentHistory = async () => {
  try {
    const token = localStorage.getItem('token'); // atau sessionStorage.getItem('token')
    const { data } = await API.get("http://localhost:8000/api/payments", {
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

export const getPaymentByOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/payments/order/${orderId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Gagal mengambil data payment');
    const data = await response.json();
    return data.data; // Ambil objek data dari response
}

export const createPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.post("http://localhost:8000/api/payments", paymentData, {
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
