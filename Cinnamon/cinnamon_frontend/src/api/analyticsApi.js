import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("user");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getTrendingProduct = () => API.get("/sellespredict/trending");
export const getSellerProducts = () => API.get("/sellespredict/products");
export const getProductSales = (productId) =>
  API.get(`/sellespredict/product-sales/${productId}`);
export const getMonthlySales = () => API.get("/sellespredict/monthly-sales");
export const getPrediction = () => API.get("/prediction/next-month");
