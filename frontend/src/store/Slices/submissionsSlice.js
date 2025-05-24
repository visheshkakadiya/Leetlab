import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import { toast } from "react-hot-toast";

const initialState = {
    loading: false,
    submissions: [],
    submission: [],
    submissionCount: 0
}

export const getAllSubmissions = createAsyncThunk("getAllSubmissions", async () => {
    try {
        const response = await axiosInstance.get("/submission/get-all-submissions")
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "No Submissions found")
        throw error
    }
})

export const getSubmissionsForProblem = createAsyncThunk("getSubmissionsForProblem", async (problemId) => {
    try {
        const response = await axiosInstance.get(`/submission/get-submission/${problemId}`)
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "No Submissions found")
        throw error
    }
})

export const totalSubmissionsForProblem = createAsyncThunk("totalSubmissionsForProblem", async (problemIds) => {
    try {
        const response = await axiosInstance.post(`/submission/get-submissions-count`, {problemIds})
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "No Submissions found")
        throw error
    }
})

const submissionsSlice = createSlice({
    name: "submissions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSubmissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload;
            })
            .addCase(getSubmissionsForProblem.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubmissionsForProblem.fulfilled, (state, action) => {
                state.loading = false;
                state.submission = action.payload;
            })
            .addCase(totalSubmissionsForProblem.pending, (state) => {
                state.loading = true;
            })
            .addCase(totalSubmissionsForProblem.fulfilled, (state, action) => {
                state.loading = false;
                state.submissionCount = action.payload;
            })
    }
})

export default submissionsSlice.reducer