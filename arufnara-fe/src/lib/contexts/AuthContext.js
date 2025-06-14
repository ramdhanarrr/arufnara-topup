// src/lib/contexts/AuthContext.js (atau src/contexts/AuthContext.js)
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Pastikan Anda sudah menginstal: npm install js-cookie

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Untuk menandai apakah data user dari localStorage sudah dimuat
    const router = useRouter();

    useEffect(() => {
        try {
            const storedUser = Cookies.get("user"); // Baca dari Cookies
            const storedToken = Cookies.get("token"); // Baca dari Cookies

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Failed to parse user data from Cookies", error);
            Cookies.remove("user");
            Cookies.remove("token");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, accessToken) => {
        setUser(userData);
        setToken(accessToken);
        Cookies.set("user", JSON.stringify(userData), { expires: 7 }); // Simpan ke Cookies
        Cookies.set("token", accessToken, { expires: 7 }); // Simpan ke Cookies
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        Cookies.remove("user"); // Hapus dari Cookies
        Cookies.remove("token"); // Hapus dari Cookies
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}