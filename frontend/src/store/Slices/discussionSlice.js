import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance.js";
import { toast } from "react-hot-toast";
import { BASE_URL } from "@/constants.js";

const initialState = {
    loading: false,
    discussions: [],
    discussion: null,
}

export const getAllDiscussions = createAsyncThunk("getAllDiscussions", async (sort) => {
    try {
        const url = new URL(`${BASE_URL}/discussion/get-all-discussions`);
        
        if(sort) url.searchParams.append("sort", sort);

        const response = await axiosInstance.get(url);
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get discussions");
        throw error;
    }
})

export const createDiscussion = createAsyncThunk("createDiscussion", async (data) => {
    try {
        const response = await axiosInstance.post("/discussion/create-discussion", data);
        toast.success("Discussion created");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create discussion");
        throw error;
    }
})

export const getDiscussionById = createAsyncThunk("getDiscussionById", async (discussionId) => {
    try {
        const response = await axiosInstance.get(`discussion/get-discussion/${discussionId}`);
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get discussion");
        throw error;
    }
})

export const getOwnDiscussions = createAsyncThunk("getOwnDiscussions", async (userId) => {
    try {
        const response = await axiosInstance.get(`/discussion/get-own-discussions/${userId}`);
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get own discussions");
        throw error;
    }
})

export const deleteDiscussion = createAsyncThunk("deleteDiscussion", async (discussionId) => {
    try {
        const response = await axiosInstance.delete(`/discussion/delete-discussion/${discussionId}`);
        toast.success("Discussion deleted");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete discussion");
        throw error;
    }
})

export const updateDiscussion = createAsyncThunk("updateDiscussion", async ({ discussionId, data }) => {
    try {
        const response = await axiosInstance.put(`/discussion/update-discussion/${discussionId}`, data);
        toast.success("Discussion updated");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update discussion");
        throw error;
    }
})

const discussionSlice = createSlice({
    name: "discussion",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllDiscussions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllDiscussions.fulfilled, (state, action) => {
                state.loading = false;
                state.discussions = action.payload;
            })
            .addCase(createDiscussion.pending, (state) => {
                state.loading = true;
            })
            .addCase(createDiscussion.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getDiscussionById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDiscussionById.fulfilled, (state, action) => {
                state.loading = false;
                state.discussion = action.payload;
            })
            .addCase(deleteDiscussion.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDiscussion.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateDiscussion.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDiscussion.fulfilled, (state, action) => {
                state.loading = false;
                state.discussion = action.payload;
            })
            .addCase(getOwnDiscussions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOwnDiscussions.fulfilled, (state, action) => {
                state.loading = false;
                state.discussions = action.payload;
            })
    }
})

export default discussionSlice.reducer