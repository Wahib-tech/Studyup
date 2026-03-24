import axios from 'axios';
const API_URL = '/api/auth/';
const register = async (u) => {
  const r = await axios.post(API_URL + 'register', u);
  return r.data;
};
const login = async (u) => {
  const r = await axios.post(API_URL + 'login', u);
  if (r.data.token) localStorage.setItem('user', JSON.stringify(r.data));
  return r.data;
};
const verifyOtp = async (u) => {
  const r = await axios.post(API_URL + 'verify-otp', u);
  if (r.data.token) localStorage.setItem('user', JSON.stringify(r.data));
  return r.data;
};
const resendOtp = async (u) => {
  const r = await axios.post(API_URL + 'resend-otp', u);
  return r.data;
};
const forgotPassword = async (u) => {
  const r = await axios.post(API_URL + 'forgot-password', u);
  return r.data;
};
const resetPassword = async (u) => {
  const r = await axios.post(API_URL + 'reset-password', u);
  return r.data;
};
const logout = () => localStorage.removeItem('user');
export default { register, login, logout, verifyOtp, resendOtp, forgotPassword, resetPassword };
