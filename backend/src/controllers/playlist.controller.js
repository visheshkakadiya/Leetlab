import { db } from "../libs/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {

        const { name,  description} = req.body;

        if (!name || !description) {
            throw new ApiError(400, "Name and description are required");
        }

        const userId = req.user.id;

        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId,
            }
        })

        if (!playlist) {
            throw new ApiError(500, "Error creating playlist");
        }

        res.status(201).json(
            new ApiResponse(
                201,
                {
                    id: playlist.id,
                    name: playlist.name,
                    description: playlist.description,
                },
                "Playlist created successfully"
            )
        )
});

const updatePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;
    const { name, description } = req.body;

        if (!name || !description) {
            throw new ApiError(400, "Name and description are required");
        }

        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
            }
        })

        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        const updatedPlaylist = await db.playlist.update({
            where: {
                id: playlistId,
            },
            data: {
                name,
                description,
            }
        })

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    id: updatedPlaylist.id,
                    name: updatedPlaylist.name,
                    description: updatedPlaylist.description,
                },
                "Playlist updated successfully"
            )
        )
});

const getAllPlaylists = async (req, res) => {
    try {
        const playlist = await db.playlist.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    }
                }
            }
        });

        if (!playlist) {
            return res.status(404).json({
                success: false,
                error: "No playlists found",
            })
        }

        res.status(200).json({
            success: true,
            message: "All playlists fetched successfully",
            playlist,
        })
    } catch (error) {
        console.error("Error fetching playlists: ", error);
        return res.status(500).json({
            success: false,
            error: "Error fetching playlists",
        })
    }
}

const getPlaylistDetails = async (req, res) => {
    const { playlistId }  = req.params;

    try {
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    }
                }
            }
        });

        if (!playlist) {
            return res.status(404).json({
                success: false,
                error: "Playlist not found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Playlist details fetched successfully",
            playlist,
        })

    } catch (error) {
        console.error("Error fetching playlist details: ", error);
        return res.status(500).json({
            success: false,
            error: "Error fetching playlist details",
        })       
    }
}

const addProblemToPlaylist = async (req, res) => {
    const { playlistId, problemId } = req.params;

    try {
        const checkPlaylist = await db.playlist.findUnique({
            where: {
                id: playlistId,
            }
        })

        if (!checkPlaylist) {
            return res.status(404).json({
                success: false,
                error: "Playlist not found",
            })
        }

        const problem = await db.problem.findUnique({
            where: {
                id: problemId,
            }
        })

        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found",
            })
        }

        const existingProblem = await db.problemsInPlaylist.findUnique({
            where: {
                playlistId_problemId: {
                    playlistId,
                    problemId,
                }
            }
        })

        if (existingProblem) {
            return res.status(400).json({
                success: false,
                error: "Problem already exists in the playlist",
            })
        }

        const playlist = await db.problemsInPlaylist.create({
            data: {
                playlistId,
                problemId,
            }
        });

        if (!playlist) {
            return res.status(400).json({
                success: false,
                error: "Error adding problem to playlist",
            })
        }

        res.status(200).json({
            success: true,
            message: "Problem added to playlist successfully",
            playlistProblem,
        }) 
    } catch (error) {
        console.error("Error adding problem to playlist: ", error);
        return res.status(500).json({
            success: false,
            error: "Error adding problem to playlist",
        })
    }
}

const deletePlaylist = async (req, res) => {
    const { playlistId } = req.params;

    try {
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
            }
        })

        if (!playlist) {
            return res.status(404).json({
                success: false,
                error: "Playlist not found",
            })
        }

        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            }
        })

        if (!deletedPlaylist) {
            return res.status(400).json({
                success: false,
                error: "Error deleting playlist",
            })
        }

        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletedPlaylist,
        })

    } catch (error) {
        console.error("Error deleting playlist: ", error);
        return res.status(500).json({
            success: false,
            error: "Error deleting playlist",
        })
    }
}

const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId, problemId } = req.params;

    try {
        const checkPlaylist = await db.playlist.findUnique({
            where: {
                id: playlistId,
            }
        })

        if (!checkPlaylist) {
            return res.status(404).json({
                success: false,
                error: "Playlist not found",
            })
        }

        const problem = await db.problem.findUnique({
            where: {
                id: problemId,
            }
        })

        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found",
            })
        }

        const deleteProblem = await db.problemsInPlaylist.delete({
            where: {
                playlistId_problemId: {
                    playlistId,
                    problemId,
                }
            }
        });

        if (!deleteProblem) {
            return res.status(400).json({
                success: false,
                error: "Error removing problem from playlist",
            })
        }

        res.status(200).json({
            success: true,
            message: "Problem removed from playlist successfully",
            deleteProblem,
        })

    } catch (error) {
        console.error("Error removing problem from playlist: ", error);
        return res.status(500).json({
            success: false,
            error: "Error removing problem from playlist",
        })
    }
}

export {
    createPlaylist,
    getAllPlaylists,
    getPlaylistDetails,
    addProblemToPlaylist,
    removeProblemFromPlaylist,
    updatePlaylist,
    deletePlaylist,
}