import axios from "axios";

const API_BASE_URL = "http://20.244.56.144/test";

// Replace this with the token you obtained from the auth API
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNDc3MTk0LCJpYXQiOjE3NDI0NzY4OTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijc0MTdlYmMwLWM3N2MtNDNiYy1iMTkwLTNjMjVlMTRjN2VhOSIsInN1YiI6ImJyNDczOEBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiU1JNIElOU1RJVFVURSBPRiBTQ0lFTkNFIEFORCBURUNITk9MT0dZIiwiY2xpZW50SUQiOiI3NDE3ZWJjMC1jNzdjLTQzYmMtYjE5MC0zYzI1ZTE0YzdlYTkiLCJjbGllbnRTZWNyZXQiOiJ2R1pOUmRkWVhVT2loTlZTIiwib3duZXJOYW1lIjoiQmhhcmFkd2FqIiwib3duZXJFbWFpbCI6ImJyNDczOEBzcm1pc3QuZWR1LmluIiwicm9sbE5vIjoiUkEyMjExMDAzMDExNzMzIn0.AUhon4mHaoX5VSJUWKO7ZKv5ZrnV5jroqdkgkm5b2V0";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getUsers = () => {
  return axiosInstance.get("/users");
};

export const getPostsByUser = (userId) => {
  return axiosInstance.get(`/users/${userId}/posts`);
};

export const getCommentsByPost = (postId) => {
  return axiosInstance.get(`/posts/${postId}/comments`);
};
