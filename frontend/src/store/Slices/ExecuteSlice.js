import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance.js";
import { toast } from "react-hot-toast";

const initialState = {
    executing: false,
    submission: null,
    runCodeRes: null,
    running: false
}

export const submitCode = createAsyncThunk("submitCode", async ({code, language_id, stdin, expected_outputs, id}) => {
    try {
        const response = await axiosInstance.post("/execute-code/submit", {code, language_id, stdin, expected_outputs, id});
        toast.success("Code executed")
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to execute code")
        throw error
    }
})

export const runCode = createAsyncThunk("runCode", async ({code, language_id, stdin, expected_outputs, id}) => {
    try {
        const response = await axiosInstance.post("/execute-code/run", {code, language_id, stdin, expected_outputs, id});
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to execute code")
        throw error
    }
})

const executeSlice = createSlice({
    name: "execute",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitCode.pending, (state) => {
                state.executing = true;
            })
            .addCase(submitCode.fulfilled, (state, action) => {
                state.executing = false;
                state.submission = action.payload;
            })
            .addCase(submitCode.rejected, (state) => {
                state.executing = false;
            })
            .addCase(runCode.pending, (state) => {
                state.running = true;
            })
            .addCase(runCode.fulfilled, (state, action) => {
                state.running = false;
                state.runCodeRes = action.payload;
            })
            .addCase(runCode.rejected, (state) => {
                state.running = false;
            })
    }
})

export default executeSlice.reducer;