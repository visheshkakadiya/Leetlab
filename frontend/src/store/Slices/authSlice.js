import axiosInstance from "../../helper/axiosInstance.js";
import { toast } from "react-hot-toast";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    userData: null,
    isLoading: false,
    status: false,
    streak: null,
    error: null
}

export const registerUser = createAsyncThunk("register", async (data) => {
    
    try {
        const response = await axiosInstance.post("/auth/register", data);
        toast.success("registered");
        return response.data;
    } catch (error) {
        throw error;
    }
})

export const loginUser = createAsyncThunk("login", async (data) => {
    try {
        const response = await axiosInstance.post("/auth/login", data);
        toast.success("logged in");
        return response.data.data;
    } catch (error) {
        throw error;
    }
})

export const logoutUser = createAsyncThunk("logout", async () => {
    try {
        const response = await axiosInstance.post("/auth/logout");
        toast.success("logged out");
        return response.data;
    } catch (error) {
        throw error;
    }
})

export const refreshAccessToken = createAsyncThunk("refreshAccessToken", async () => {
    try {
        const response = await axiosInstance.post("/auth/refreshToken");
        toast.success("Access token refreshed");
        return response.data.data;
    } catch (error) {
        throw error;
    }
})

export const currentUser = createAsyncThunk("currentUser", async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data.data;
})

export const forgotPassword = createAsyncThunk("forgotPassword", async (email) => {
    try {
        const response = await axiosInstance.post("auth/forgot-password", { email });
        toast.success("Password reset link sent to your email");
        return response.data;
    } catch (error) {
        throw error;
    }
})

export const resetPassword = createAsyncThunk("resetPassword", async ({ token, newPassword }) => {
    try {
        const response = await axiosInstance.post(`auth/reset-password/${token}`, { newPassword });
        toast.success("Password reset successfully");
        return response.data;
    } catch (error) {
        throw error;
    }
})

const updateProfile = createAsyncThunk("updateProfile", async (data) => {
    try {
        const response = await axiosInstance.put("/auth/update-profile", data);
        toast.success("Profile updated");
        return response.data;
    } catch (error) {
        throw error;
    }
})

export const getStreak = createAsyncThunk("getStreak", async () => {
    try {
        const response = await axiosInstance.get("/auth/streak");
        return response.data.data;
    } catch (error) {
        throw error;
    }
})

export const getProfile = createAsyncThunk("getProfile", async (userId) => {
    try {
        const response = await axiosInstance.get(`/auth/user-profile/${userId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.status = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.status = false;
            })
            .addCase(currentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(currentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.status = true;
            })
            .addCase(currentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.status = false;
                state.error = action.error.message;
            })
            .addCase(refreshAccessToken.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getStreak.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getStreak.fulfilled, (state, action) => {
                state.isLoading = false;
                state.streak = action.payload;
            })
            .addCase(getStreak.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userData = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    }
})

export default authSlice.reducer;