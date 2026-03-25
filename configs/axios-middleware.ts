// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
// });

// /* ================= REQUEST ================= */

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// /* ================= RESPONSE ================= */

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // 🔥 If token expired
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem("refresh");

//         if (!refreshToken) {
//           // window.location.href = "/login";
//           return Promise.reject(error);
//         }

//         // 🔥 CALL YOUR REFRESH API
//         const refreshResponse = await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
//           {
//             refresh: refreshToken,
//           }
//         );

//         const newAccessToken = refreshResponse.data.access;

//         // 🔥 SAVE NEW ACCESS TOKEN
//         localStorage.setItem("token", newAccessToken);

//         // 🔥 UPDATE HEADER
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         // 🔥 RETRY ORIGINAL REQUEST
//         return axiosInstance(originalRequest);

//       } catch (refreshError) {
//         // 🔥 If refresh also expired → logout
//         localStorage.clear();
//         // window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

/* ================= REQUEST ================= */

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    // ✅ token irundha mattum attach
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/* ================= RESPONSE ================= */

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ token illa na refresh try panna koodathu
    const refreshToken = localStorage.getItem("refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken // ✅ only if refresh exists
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;

        // ✅ save new token
        localStorage.setItem("token", newAccessToken);

        // ✅ retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // 🔥 refresh fail → logout
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
