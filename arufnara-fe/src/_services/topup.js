import API from "../_api";

export const getTopup = async () => {
  const token = localStorage.getItem('token');
  const { data } = await API.get("http://localhost:8000/api/topup_options/", {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return data.data; // <-- harus array
}
