import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = { 
  user: user || null, 
  isSuccess: false, 
  isRegisterSuccess: false,
  isVerifySuccess: false,
  isLoading: false, 
  isError: false, 
  message: '' 
};

export const register = createAsyncThunk('auth/register', async (u, t) => {
  try { 
    return await authService.register(u); 
  } catch (e) { 
    const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
    return t.rejectWithValue(message); 
  }
});

export const login = createAsyncThunk('auth/login', async (u, t) => {
  try { 
    return await authService.login(u); 
  } catch (e) { 
    const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
    return t.rejectWithValue(message); 
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (u, t) => {
  try { 
    return await authService.verifyOtp(u); 
  } catch (e) { 
    const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
    return t.rejectWithValue(message); 
  }
});

export const resendOtp = createAsyncThunk('auth/resendOtp', async (u, t) => {
  try { 
    return await authService.resendOtp(u); 
  } catch (e) { 
    const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
    return t.rejectWithValue(message); 
  }
});

export const logout = createAsyncThunk('auth/logout', () => authService.logout());


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    reset: (s) => { 
      s.isLoading = false; 
      s.isSuccess = false; 
      s.isRegisterSuccess = false;
      s.isVerifySuccess = false;
      s.isError = false; 
      s.message = ''; 
    } 
  },
  extraReducers: (b) => {
    b.addCase(register.pending, (s) => { s.isLoading = true; })
     .addCase(register.fulfilled, (s) => { s.isLoading = false; s.isRegisterSuccess = true; })
     .addCase(register.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })
     .addCase(login.pending, (s) => { s.isLoading = true; })
     .addCase(login.fulfilled, (s, a) => { s.isLoading = false; s.user = a.payload; })
     .addCase(login.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })
     .addCase(verifyOtp.pending, (s) => { s.isLoading = true; })
     .addCase(verifyOtp.fulfilled, (s, a) => { s.isLoading = false; s.isVerifySuccess = true; s.user = a.payload; })
     .addCase(verifyOtp.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })
     .addCase(resendOtp.pending, (s) => { s.isLoading = true; })
     .addCase(resendOtp.fulfilled, (s, a) => { s.isLoading = false; s.isSuccess = true; s.message = a.payload.message; })
     .addCase(resendOtp.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })
     .addCase(logout.fulfilled, (s) => { s.user = null; });
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
