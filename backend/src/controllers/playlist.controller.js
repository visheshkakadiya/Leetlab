import { db } from "../libs/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {

    const { name, description } = req.body;

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

const getUserPlaylists = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const playlist = await db.playlist.findMany({
        where: {
            userId,
            isPublished: true,
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
        throw new ApiError(404, "No playlists found");
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlists fetched successfully")
    )
});

const getOwnPlaylists = asyncHandler(async (req, res) => {

    const playlist = await db.playlist.findMany({
        where: {
            userId: req.user.id,
        },
        orderBy: {
            createdAt: "desc",
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
        throw new ApiError(404, "No playlists found");
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlists fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await db.playlist.findUnique({
        where: {
            id: playlistId,
        },
        include: {
            problems: {
                include: {
                    problem: {
                        include: {
                            solvedBy: {
                                where: {
                                    userId: req.user.id,
                                },
                                select: {
                                    problem: true,
                                }
                            }
                        }
                    }
                }
            },
            user: {
                select: {
                    name: true,
                }
            }
        }
    });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    )
});

const addProblemToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, problemId } = req.params;

    const checkPlaylist = await db.playlist.findUnique({
        where: {
            id: playlistId,
        }
    })

    if (!checkPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    const problem = await db.problem.findUnique({
        where: {
            id: problemId,
        }
    })

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    const existingProblem = await db.problemInPlaylist.findUnique({
        where: {
            playlistId_problemId: {
                playlistId,
                problemId,
            }
        }
    })

    if (existingProblem) {
        throw new ApiError(400, "Problem already exists in playlist");
    }

    const playlist = await db.problemInPlaylist.create({
        data: {
            playlistId,
            problemId,
        }
    });

    if (!playlist) {
        throw new ApiError(500, "Error adding problem to playlist");
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Problem added to playlist successfully")
    )
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await db.playlist.findUnique({
        where: {
            id: playlistId,
        }
    })

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const deletedPlaylist = await db.playlist.delete({
        where: {
            id: playlistId,
        }
    })

    if (!deletedPlaylist) {
        throw new ApiError(500, "Error deleting playlist");
    }

    res.status(200).json(
        new ApiResponse(200, "Playlist deleted successfully")
    )
});

const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, problemId } = req.params;

    const checkPlaylist = await db.playlist.findUnique({
        where: {
            id: playlistId,
        }
    })

    if (!checkPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    const problem = await db.problem.findUnique({
        where: {
            id: problemId,
        }
    })

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    const deleteProblem = await db.problemInPlaylist.delete({
        where: {
            playlistId_problemId: {
                playlistId,
                problemId,
            }
        }
    });

    if (!deleteProblem) {
        throw new ApiError(500, "Error removing problem from playlist");
    }

    res.status(200).json(
        new ApiResponse(200, "Problem removed from playlist successfully")
    )
});

const copyPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user.id;

    const originalPlaylist = await db.playlist.findUnique({
        where: {
            id: playlistId,
        },
        include: {
            problems: {
                include: {
                    problem: true,
                }
            }
        }
    });

    if (!originalPlaylist && !originalPlaylist.isPublished) {
        throw new ApiError(404, "Playlist not found");
    }

    const newPlaylist = await db.playlist.create({
        data: {
            name: originalPlaylist.name,
            description: originalPlaylist.description || "",
            userId: userId,
        }
    })

    if (!newPlaylist) {
        throw new ApiError(500, "Error creating new playlist");
    }

    const problems = originalPlaylist.problems.map((problem) => ({
        playlistId: newPlaylist.id,
        problemId: problem.problemId,
    }));

    await db.problemInPlaylist.createMany({
        data: problems,
    })

    res.status(200).json(
        new ApiResponse(200, newPlaylist, "Playlist copied successfully")
    )
})

const togglePublished = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user.id;

    const playlist = await db.playlist.findUnique({
        where: {
            id: playlistId,
        }
    });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.userId !== userId) {
        throw new ApiError(403, "You are not allowed to publish this playlist");
    }

    const togglePlaylistPublish = await db.playlist.update({
        where: {
            id: playlistId,
        },
        data: {
            isPublished: !playlist.isPublished,
        }
    })
    if (!togglePlaylistPublish) {
        throw new ApiError(500, "Error toggling playlist publish status");
    }

    res.status(200).json(
        new ApiResponse(200, { isPublished: togglePlaylistPublish.isPublished }, "Playlist publish status toggled successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getOwnPlaylists,
    togglePublished,
    getPlaylistById,
    addProblemToPlaylist,
    removeProblemFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    copyPlaylist
}