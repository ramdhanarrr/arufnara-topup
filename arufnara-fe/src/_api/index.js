import axios from "axios"

const API = axios.create({
  baseURL: "https://arunfara.karyakreasi.id",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the token in all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle common errors
API.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("accessToken")
      // Redirect to login if needed
    }
    return Promise.reject(error)
  }
)

export default API