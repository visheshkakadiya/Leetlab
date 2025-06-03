import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import { toast } from "react-hot-toast";

const initialState = {
    loading: false,
    submissions: [],
    submission: [],
    submissionIdData: null,
    submissionCount: 0,
    contribution: []
}

export const getAllSubmissions = createAsyncThunk("getAllSubmissions", async () => {
    try {
        const response = await axiosInstance.get("/submission/get-all-submissions")
        return response.data.data;
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

export const getSubmissionById = createAsyncThunk("getSubmissionById", async (submissionId) => {
    try {
        const response = await axiosInstance.get(`/submission/get-submission-details/${submissionId}`)
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "No Submissions found")
        throw error
    }
})

export const gitContribution = createAsyncThunk("gitContribution", async () => {
    try {
        const response = await axiosInstance.get(`/submission/git-contribution`)
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
            .addCase(getSubmissionById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubmissionById.fulfilled, (state, action) => {
                state.loading = false;
                state.submissionIdData = action.payload;
            })
            .addCase(gitContribution.pending, (state) => {
                state.loading = true;
            })
            .addCase(gitContribution.fulfilled, (state, action) => {
                state.loading = false;
                state.contribution = action.payload;
            })
    }
})

export default submissionsSlice.reducer