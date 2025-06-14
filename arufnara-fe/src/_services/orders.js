import API from "../_api";

export const getOrders = async () => {
  try {
    const token = localStorage.getItem('token'); // atau sessionStorage.getItem('token')
    
    const { data } = await API.get("http://localhost:8000/api/admin/orders", {
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

export const getOrderUser = async () => {
  try {
    const token = localStorage.getItem('token'); // atau sessionStorage.getItem('token')

    const { data } = await API.get("http://localhost:8000/api/orders", {
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

export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.post("http://localhost:8000/api/orders", orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get(`http://localhost:8000/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data; // Pastikan backend return { success: true, data: {...} }
  } catch (error) {
    console.error(error);
    throw error;
  }
};