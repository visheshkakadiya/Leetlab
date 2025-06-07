import axiosInstance from "../../helper/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    loading: false,
    playlist: {
        problems: []
    },
    playlists: [],
    isPublished: false
}

export const createPlaylist = createAsyncThunk("createPlaylist", async (data) => {
    try {
        const response = await axiosInstance.post("/playlist/create-playlist", data)
        toast.success("Playlist created")
        return response.data
    } catch (error) {
        throw error
    }
})


export const updatePlaylist = createAsyncThunk("updatePlaylist", async ({ playlistId, name, description }) => {
    try {
        const response = await axiosInstance.patch(`/playlist/update-playlist/${playlistId}`, {
            name,
            description
        });
        toast.success("Playlist updated");
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const deletePlaylist = createAsyncThunk("deletePlaylist", async (playlistId) => {
    try {
        const response = await axiosInstance.delete(`/playlist/delete-playlist/${playlistId}`)
        toast.success("Playlist deleted")
        return response.data
    } catch (error) {
        throw error
    }
})

export const getUserPlaylists = createAsyncThunk("getUserPlaylists", async (userId) => {
    try {
        const response = await axiosInstance.get(`/playlist/user-playlists/${userId}`)
        return response.data.data
    } catch (error) {
        throw error
    }
})

export const getOwnPlaylists = createAsyncThunk("getOwnerPlaylists", async () => {
    try {
        const response = await axiosInstance.get(`/playlist`)
        return response.data.data
    } catch (error) {
        console.log(error)
        throw error
    }
})

export const AddProblemToPlaylist = createAsyncThunk("AddProblemToPlaylist", async ({ playlistId, problemId }) => {
    try {
        const response = await axiosInstance.post(`/playlist/add-problem/${playlistId}/${problemId}`)
        toast.success("Problem added to playlist")
        return response.data
    } catch (error) {
        throw error
    }
})

export const RemoveProblemFromPlaylist = createAsyncThunk("RemoveProblemFromPlaylist", async ({ playlistId, problemId }) => {
    try {
        const response = await axiosInstance.delete(`/playlist/remove-problem/${playlistId}/${problemId}`)
        toast.success("Problem removed from playlist")
        return response.data
    } catch (error) {
        throw error
    }
})

export const togglePublish = createAsyncThunk("togglePublish", async (playlistId) => {
    try {
        const response = await axiosInstance.patch(`/playlist/toggle-published/${playlistId}`)
        return response.data
    } catch (error) {
        throw error
    }
})

export const copyPlaylist = createAsyncThunk("copyPlaylist", async (playlistId) => {
    try {
        const response = await axiosInstance.post(`/playlist/copy-playlist/${playlistId}`)
        toast.success("Playlist copied")
        return response.data
    } catch (error) {
        throw error
    }
})

export const getPlaylistById = createAsyncThunk("getPlaylistById", async (playlistId) => {
    try {
        const response = await axiosInstance.get(`/playlist/${playlistId}`)
        return response.data.data
    } catch (error) {
        throw error
    }
})

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updatePlaylist.pending, (state) => {
                state.loading = true
            })
            .addCase(updatePlaylist.fulfilled, (state, action) => {
                state.loading = false
                state.playlists = state.playlists.map((playlist) => {
                    if (playlist._id === action.payload._id) {
                        return action.payload
                    }
                    return playlist
                })
            })
            .addCase(updatePlaylist.rejected, (state) => {
                state.loading = false
            })
            .addCase(deletePlaylist.pending, (state) => {
                state.loading = true
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.loading = false
                state.playlists = state.playlists.filter((playlist) => playlist.id !== action.payload.id)
            })
            .addCase(AddProblemToPlaylist.pending, (state) => {
                state.loading = true
            })
            .addCase(AddProblemToPlaylist.fulfilled, (state, action) => {
                state.loading = false,
                    state.playlist = action.payload
            })
            .addCase(RemoveProblemFromPlaylist.pending, (state) => {
                state.loading = true
            })
            .addCase(RemoveProblemFromPlaylist.fulfilled, (state, action) => {
                state.loading = false,
                    state.playlist.problems = state.playlist.problems.filter(
                        (problemData) => problemData.problem?.id !== action.payload.id
                    );
            })
            .addCase(getUserPlaylists.fulfilled, (state, action) => {
                state.playlists = action.payload
            })
            .addCase(getOwnPlaylists.fulfilled, (state, action) => {
                state.loading = false
                state.playlists = action.payload
            })
            .addCase(getPlaylistById.fulfilled, (state, action) => {
                state.playlist = action.payload
            })
            .addCase(togglePublish.fulfilled, (state, action) => {
                state.loading = false
                state.isPublished = !state.isPublished
            })
    }
})

export default playlistSlice.reducer;