import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import { toast } from "react-hot-toast";

const initialState = {
    loading: false,
    replies: [],
    // reply: null,
}

export const getDiscussionReplies = createAsyncThunk("getDiscussionReplies", async (discussionId) => {
    try {
        const response = await axiosInstance.get(`/replies/get-replies/${discussionId}`);
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get replies");
        throw error;
    }
})

export const addReply = createAsyncThunk("addReply", async (data) => {
    try {
        const response = await axiosInstance.post("/replies/add-reply", data);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create reply");
        throw error;
    }
})

export const deleteReply = createAsyncThunk("deleteReply", async (replyId) => {
    try {
        const response = await axiosInstance.delete(`/replies/delete-reply/${replyId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete reply");
        throw error;
    }
})

export const updateReply = createAsyncThunk("updateReply", async ({ replyId, data }) => {
    try {
        const response = await axiosInstance.put(`/replies/update-reply/${replyId}`, data);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update reply");
        throw error;
    }
})

const repliesSlice = createSlice({
    name: "replies",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDiscussionReplies.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDiscussionReplies.fulfilled, (state, action) => {
                state.loading = false;
                state.replies = action.payload;
            })           
    }
})

export default repliesSlice.reducer