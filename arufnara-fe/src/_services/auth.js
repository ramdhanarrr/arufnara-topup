import { useJwt } from "react-jwt";
import API from "../_api";

export const login = async ({ email, password }) => {
  try {
    const { data } = await API.post('/login', { email, password });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async ({ token }) => {
  try {
    const { data } = await API.post('/logout', { token }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    localStorage.removeItem('accessToken');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerUser = async ({ name, email, password }) => {
  try {
    const { data } = await API.post('/register', { name, email, password });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// NOTE: Ini hanya bisa dipakai di dalam React component atau custom hook.
export const useDecodeToken = (token) => {
  const { decodedToken, isExpired } = useJwt(token);

  if (!token) {
    return {
      success: false,
      message: "Token tidak tersedia",
      data: null
    };
  }

  if (isExpired) {
    return {
      success: false,
      message: "Token expired",
      data: null
    };
  }

  return {
    success: true,
    message: "Token valid",
    data: decodedT
  };
};