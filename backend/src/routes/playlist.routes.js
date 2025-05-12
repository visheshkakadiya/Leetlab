import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { 
    addProblemToPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getUserPlaylists,
    getOwnPlaylists,
    togglePublished,
    copyPlaylist, 
    getPlaylistById, 
    removeProblemFromPlaylist
} from '../controllers/playlist.controller.js';
import { validate } from "../middlewares/validator.middleware.js";
import { createPlaylistSchema, updatePlaylistSchema } from "../validators/playlist.validate.js";

const router = express.Router();

router.get('/', authMiddleware, getOwnPlaylists);

router.get("/user-playlists/:userId", authMiddleware, getUserPlaylists);

router.patch("/toggle-published/:playlistId", authMiddleware, togglePublished);

router.post("/copy-playlist/:playlistId", authMiddleware, copyPlaylist);

router.get('/:playlistId', authMiddleware, getPlaylistById);

router.post("/create-playlist", validate(createPlaylistSchema), authMiddleware, createPlaylist);

router.patch("/update-playlist/:playlistId", validate(updatePlaylistSchema), authMiddleware, updatePlaylist);

router.post("/add-problem/:playlistId/:problemId", authMiddleware, addProblemToPlaylist);

router.delete("/delete-playlist/:playlistId", authMiddleware, deletePlaylist);

router.delete("/remove-problem/:playlistId/:problemId", authMiddleware, removeProblemFromPlaylist);

export default router;