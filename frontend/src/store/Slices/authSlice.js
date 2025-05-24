import axiosInstance from "../../helper/axiosInstance.js";
import { toast } from "react-hot-toast";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    isLoading: false,
    status: false,
    error: null
}

export const registerUser = createAsyncThunk("register", async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);
    if (data.avatar) {
        formData.append("avatar", data.avatar);
    }

    try {
        const response = await axiosInstance.post("/auth/register", formData);
        toast.success("registered");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed");
        throw error;
    }
})

export const loginUser = createAsyncThunk("login", async (data) => {
    try {
        const response = await axiosInstance.post("/auth/login", data);
        toast.success("logged in");
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
        throw error;
    }
})

export const logoutUser = createAsyncThunk("logout", async () => {
    try {
        const response = await axiosInstance.post("/auth/logout");
        toast.success("logged out");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed");
        throw error;
    }
})

export const refreshAccessToken = createAsyncThunk("refreshAccessToken", async () => {
    try {
        const response = await axiosInstance.post("/auth/refreshToken");
        toast.success("Access token refreshed");
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to refresh access token");
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
        toast.error(error.response?.data?.message || "Failed to send password reset link");
        throw error;
    }
})

export const resetPassword = createAsyncThunk("resetPassword", async ({ token, newPassword }) => {
    try {
        const response = await axiosInstance.post(`auth/reset-password/${token}`, { newPassword });
        toast.success("Password reset successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to reset password");
        throw error;
    }
})

const updateProfile = createAsyncThunk("updateProfile", async (data) => {
    try {
        const response = await axiosInstance.put("/auth/update-profile", data);
        toast.success("Profile updated");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update account details");
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
                state.status = false;
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
    }
})

export default authSlice.reducer;