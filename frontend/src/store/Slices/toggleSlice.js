import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance.js";
import {toast as Toast} from "react-hot-toast";

const initialState = {
    loading: false,
    isReputed: false,
    isUpVoted: false,
    isDownVoted: false
}

export const toggleReputation = createAsyncThunk("toggleReputation", async (userId) => {
    try {
        const response = await axiosInstance.post(`/toggle/toggle-reputation/${userId}`);
        return response.data;
    } catch (error) {
        Toast.error(error.response?.data?.message || "Failed to reputation");
        throw error;
    }
})

export const toggleUpVotes = createAsyncThunk("toggleUpVotes", async (discussionId) => {
    try {
        const response = await axiosInstance.post(`/toggle/toggle-upvotes/${discussionId}`);
        return response.data;
    } catch (error) {
        Toast.error(error.response?.data?.message || "Failed to upvotes");
        throw error;
    }
})

export const toggleDownVotes = createAsyncThunk("toggleDownVotes", async (discussionId) => {
    try {
        const response = await axiosInstance.post(`/toggle/toggle-downvotes/${discussionId}`);
        return response.data;
    } catch (error) {
        Toast.error(error.response?.data?.message || "Failed to downvotes");
        throw error;
    }
})

const toggleSlice = createSlice({
    name: "toggle",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleReputation.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleReputation.fulfilled, (state, action) => {
                state.isReputed = !state.isReputed;
                state.loading = false;
            })
            .addCase(toggleUpVotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleUpVotes.fulfilled, (state, action) => {
                state.isUpVoted = !state.isUpVoted;
                state.loading = false;
            })
            .addCase(toggleDownVotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleDownVotes.fulfilled, (state, action) => {
                state.isDownVoted = !state.isDownVoted;
                state.loading = false;
            })
    }
})

export default toggleSlice.reducer