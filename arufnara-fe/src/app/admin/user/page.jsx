"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Search,
  Filter,
} from "lucide-react";
import API from "../../../_api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    point: "",
    role: "user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper function untuk mendapatkan auth token
  const getAuthToken = () => {
    return (
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("token")
    );
  };

  // Helper function untuk membuat config dengan auth header
  const getAuthConfig = () => {
    const token = getAuthToken();
    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      : {
          headers: {
            "Content-Type": "application/json",
          },
        };
  };

  // Helper function untuk extract data dari response
  const extractResponseData = (response, fallbackKey = "data") => {
    const data = response?.data;

    if (!data) return null;

    // Jika response berupa array langsung
    if (Array.isArray(data)) {
      return data;
    }

    // Cek berbagai kemungkinan struktur response
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data.users && Array.isArray(data.users)) {
      return data.users;
    }
    if (data.result && Array.isArray(data.result)) {
      return data.result;
    }
    if (data.success && data.data) {
      return Array.isArray(data.data) ? data.data : [data.data];
    }

    // Untuk single object (create/update response)
    if (data.user) {
      return data.user;
    }
    if (data.data && !Array.isArray(data.data)) {
      return data.data;
    }

    // Return data as is jika tidak ada struktur khusus
    return data;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const config = getAuthConfig();
      const response = await API.get("/admin/users", config);

      const userData = extractResponseData(response);

      // Debug: Log struktur data yang diterima
      console.log("Raw API Response:", response.data);
      console.log("Extracted User Data:", userData);

      if (Array.isArray(userData)) {
        // Debug: Log beberapa user pertama untuk melihat struktur
        if (userData.length > 0) {
          console.log("Sample user data:", userData[0]);
        }
        setUsers(userData);
      } else {
        console.warn("Response data is not an array:", userData);
        setUsers([]);
      }
    } catch (err) {
      console.error("Fetch users error:", err);

      let errorMessage = "Gagal mengambil data pengguna";

      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const serverMessage =
          err.response.data?.message || err.response.data?.error;

        if (status === 401) {
          errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        } else if (status === 403) {
          errorMessage =
            "Anda tidak memiliki akses untuk melihat data pengguna.";
        } else if (status === 404) {
          errorMessage = "Endpoint tidak ditemukan. Periksa konfigurasi API.";
        } else if (serverMessage) {
          errorMessage = `${errorMessage}: ${serverMessage}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }

      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCurrentUser(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      point: 0,
      role: "user",
    });
    setIsModalOpen(true);
    setError(null); // Clear any previous errors
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setCurrentUser(user);
    setFormData({
      name:
        typeof user.name === "object"
          ? JSON.stringify(user.name)
          : user.name || user.username || "",
      username:
        typeof user.username === "object"
          ? JSON.stringify(user.username)
          : user.username || "",
      email:
        typeof user.email === "object"
          ? JSON.stringify(user.email)
          : user.email || "",
      password: "",
      point:
        typeof (user.point || user.points) === "object"
          ? user.point?.total_points || user.points?.total_points || 0
          : user.point || user.points || 0,
      role:
        typeof user.role === "object"
          ? JSON.stringify(user.role)
          : user.role || "user",
    });
    setIsModalOpen(true);
    setError(null); // Clear any previous errors
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "user",
    });
    setError(null); // Clear any previous errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Nama tidak boleh kosong");
    if (!formData.username.trim()) errors.push("Username tidak boleh kosong");
    if (!formData.email.trim()) errors.push("Email tidak boleh kosong");
    if (modalMode === "create" && !formData.password)
      errors.push("Password tidak boleh kosong");

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push("Format email tidak valid");
    }

    return errors;
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const config = getAuthConfig();

      // Prepare data untuk dikirim
      const submitData = { ...formData };

      // Jika mode edit dan password kosong, hapus password dari data
      if (modalMode === "edit" && !submitData.password) {
        delete submitData.password;
      }

      let response;
      let successMessage;

      if (modalMode === "create") {
        response = await API.post("/admin/users", submitData, config);
        successMessage = "User berhasil dibuat.";
      } else {
        // Untuk edit, gunakan ID yang benar
        const userId = currentUser.id || currentUser._id;
        if (!userId) {
          throw new Error("ID user tidak ditemukan");
        }

        response = await API.put(`/admin/users/${userId}`, submitData, config);
        successMessage = "User berhasil diupdate.";
      }

      // Extract data dari response
      const responseData = extractResponseData(response);

      if (modalMode === "create") {
        // Tambahkan user baru ke state
        if (responseData) {
          setUsers((prev) => [...prev, responseData]);
        } else {
          // Jika tidak ada data response, fetch ulang untuk memastikan
          await fetchUsers();
        }
      } else {
        // Update user di state
        if (responseData) {
          setUsers((prev) =>
            prev.map((user) =>
              (user.id || user._id) === (currentUser.id || currentUser._id)
                ? { ...user, ...responseData }
                : user
            )
          );
        } else {
          // Jika tidak ada data response, fetch ulang
          await fetchUsers();
        }
      }

      alert(successMessage);
      closeModal();
    } catch (err) {
      console.error("Submit error:", err);

      let errorMessage = `Gagal ${
        modalMode === "create" ? "membuat" : "mengupdate"
      } pengguna`;

      if (err.response) {
        const status = err.response.status;
        const serverMessage =
          err.response.data?.message || err.response.data?.error;

        if (status === 400) {
          errorMessage = serverMessage || "Data yang dikirim tidak valid";
        } else if (status === 401) {
          errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        } else if (status === 403) {
          errorMessage =
            "Anda tidak memiliki akses untuk melakukan operasi ini.";
        } else if (status === 409) {
          errorMessage = "Username atau email sudah digunakan.";
        } else if (serverMessage) {
          errorMessage = `${errorMessage}: ${serverMessage}`;
        }
      } else if (err.request) {
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else if (err.message) {
        errorMessage = `${errorMessage}: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    const userId = user.id || user._id;
    const userName = user.name || user.username || "pengguna ini";

    if (!userId) {
      setError("ID user tidak ditemukan");
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus ${userName}?`)) {
      try {
        setError(null);
        const config = getAuthConfig();

        await API.delete(`/admin/users/${userId}`, config);

        // Update state - hapus user dari daftar
        setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));

        alert("User berhasil dihapus.");
      } catch (err) {
        console.error("Delete error:", err);

        let errorMessage = "Gagal menghapus pengguna";

        if (err.response) {
          const status = err.response.status;
          const serverMessage =
            err.response.data?.message || err.response.data?.error;

          if (status === 401) {
            errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
          } else if (status === 403) {
            errorMessage =
              "Anda tidak memiliki akses untuk menghapus pengguna.";
          } else if (status === 404) {
            errorMessage = "Pengguna tidak ditemukan.";
          } else if (serverMessage) {
            errorMessage = `${errorMessage}: ${serverMessage}`;
          }
        } else if (err.request) {
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        }

        setError(errorMessage);
      }
    }
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    // Ensure user properties are strings before filtering
    const userName =
      typeof user.name === "object"
        ? JSON.stringify(user.name)
        : user.name || "";
    const userUsername =
      typeof user.username === "object"
        ? JSON.stringify(user.username)
        : user.username || "";
    const userEmail =
      typeof user.email === "object"
        ? JSON.stringify(user.email)
        : user.email || "";
    const userRole =
      typeof user.role === "object"
        ? JSON.stringify(user.role)
        : user.role || "user";

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">Kelola data User</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          >
            <Plus size={20} />
            Tambah User
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 border-l-4 border-red-400 rounded-r-lg bg-red-50">
          <div className="flex items-start justify-between">
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, username, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <tr
                    key={user.id || user._id}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50/60"
                    } hover:bg-blue-100/60`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-blue-900">
                            {typeof user.name === "object"
                              ? JSON.stringify(user.name)
                              : user.name || user.username || "Unknown"}
                          </div>
                          <div className="text-sm text-blue-500">
                            @
                            {typeof user.username === "object"
                              ? JSON.stringify(user.username)
                              : user.username || "unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-900 border-b border-blue-100">
                      {typeof user.email === "object"
                        ? JSON.stringify(user.email)
                        : user.email || "-"}
                    </td>
                    <td className="px-6 py-4 border-b border-blue-100">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-500 border-b border-blue-100">
                      {user.created_at
                        ? typeof user.created_at === "string"
                          ? new Date(user.created_at).toLocaleDateString(
                              "id-ID"
                            )
                          : user.created_at.toLocaleDateString
                          ? user.created_at.toLocaleDateString("id-ID")
                          : String(user.created_at)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 border-b border-blue-100 space-x-2 text-sm">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center px-3 py-1 text-blue-700 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 shadow"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="inline-flex items-center px-3 py-1 text-red-700 transition-colors bg-red-100 rounded-lg hover:bg-red-200 shadow"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-blue-400"
                  >
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 mb-4 text-blue-200" />
                      <p className="text-lg font-semibold">
                        Tidak ada pengguna ditemukan
                      </p>
                      <p className="text-sm">
                        Cobalah mengubah filter pencarian atau tambah pengguna
                        baru
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModal}
            ></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "create" ? "Tambah User Baru" : "Edit User"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Error Display */}
              {error && (
                <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan alamat email"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Password{" "}
                    {modalMode === "create" && (
                      <span className="text-red-500">*</span>
                    )}
                    {modalMode === "edit" && (
                      <span className="text-xs text-gray-500">
                        (kosongkan jika tidak ingin mengubah)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalMode === "create"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      modalMode === "create"
                        ? "Masukkan password"
                        : "Kosongkan jika tidak diubah"
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Points
                  </label>
                  <input
                    type="number"
                    name="point"
                    value={formData.point}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4 space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {isSubmitting
                      ? "Menyimpan..."
                      : modalMode === "create"
                      ? "Simpan"
                      : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
