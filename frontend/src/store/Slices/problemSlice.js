import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axiosInstance from '../../helper/axiosInstance'
import {toast} from 'react-hot-toast'

const initialState = {
    loading: false,
    problem: null,
    problems: [],
    solvedProblems: [],
}

export const createProblem = createAsyncThunk("createProblem", async ({name, description}) => {
    try {
        const response = await axiosInstance.post("/problems/create-problem", {name, description})
        toast.success("Problem created")
        return response.data
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create problem")
        throw error
    }
})

export const updateProblem = createAsyncThunk("updateProblem", async (data, problemId) => {
    try {
        const response = await axiosInstance.put(`/problems/update-problem/${problemId}`, data)
        toast.success("Problem updated")
        return response.data
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update problem")
        throw error
    }
})

export const deleteProblem = createAsyncThunk("deleteProblem", async (problemId) => {
    try {
        const response = await axiosInstance.delete(`/problems/delete-problem/${problemId}`)
        toast.success("Problem deleted")
        return response.data
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete problem")
        throw error
    }
})

export const getAllProblems = createAsyncThunk("getAllProblems", async () => {
    try {
        const response = await axiosInstance.get("/problems/get-allProblems")
        return response.data.data
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get problems")
        throw error
    }
})

export const getProblemById = createAsyncThunk("getProblemById", async (problemId) => {
    try {
        const response = await axiosInstance.get(`/problems/get-problem/${problemId}`)
        return response.data.problem
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get problem")
        throw error
    }
})

export const getProblemSolvedByUser = createAsyncThunk("getProblemSolvedByUser", async () => {
    try {
        const response = await axiosInstance.get("/problems/get-solved-problems")
        return response.data.problems
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to get problem")
        throw error
    }
})

const problemSlice = createSlice({
    name: "Problem",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createProblem.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProblem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProblem.rejected, (state) => {
                state.loading = false;
            })
            .addCase(updateProblem.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProblem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProblem.rejected, (state) => {
                state.loading = false;
            })
            .addCase(deleteProblem.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProblem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteProblem.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getAllProblems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllProblems.fulfilled, (state, action) => {
                state.loading = false;
                state.problems = action.payload;
            })
            .addCase(getAllProblems.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getProblemById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProblemById.fulfilled, (state, action) => {
                state.loading = false;
                state.problem = action.payload;
            })
            .addCase(getProblemById.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getProblemSolvedByUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProblemSolvedByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.solvedProblems = action.payload;
            })
            .addCase(getProblemSolvedByUser.rejected, (state) => {
                state.loading = false;
            })
    }
})

export default problemSlice.reducer