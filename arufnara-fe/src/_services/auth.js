import { useJwt } from "react-jwt"
import API from "../_api"

export const login = async ({ email, password }) => {
  try {
    const { data } = await API.post("/login", { email, password })
    if (data.access_token) {
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
    }
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const logout = async () => {
  try {
    const token = localStorage.getItem("accessToken")
    if (!token) return { success: true }

    const { data } = await API.post(
      "/logout",
      { token },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const registerUser = async ({ username, email, password }) => {
  try {
    const { data } = await API.post("/register", { username, email, password })
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const useDecodeToken = (token) => {
  const { decodedToken, isExpired } = useJwt(token)
  try {
    if (isExpired) {
      return {
        success: false,
        message: "Token Expired",
        data: null,
      }
    }

    return {
      success: true,
      message: "Token valid",
      data: decodedToken,
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    }
  }
}
