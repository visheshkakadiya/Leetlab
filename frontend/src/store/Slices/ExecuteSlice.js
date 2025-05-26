import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance.js";
import { toast } from "react-hot-toast";

const initialState = {
    executing: false,
    submission: null,
}

export const executeCode = createAsyncThunk("executeCode", async ({code, language_id, stdin, expected_outputs, id}) => {
    try {
        const response = await axiosInstance.post("/execute-code", {code, language_id, stdin, expected_outputs, id});
        toast.success("Code executed")
        return response.data.data;
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
            .addCase(executeCode.pending, (state) => {
                state.executing = true;
            })
            .addCase(executeCode.fulfilled, (state, action) => {
                state.executing = false;
                state.submission = action.payload;
            })
            .addCase(executeCode.rejected, (state) => {
                state.executing = false;
            })
    }
})

export default executeSlice.reducer;