import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { 
    addProblemToPlaylist,
    createPlaylist,
    deletePlaylist,
    getAllPlaylists, 
    getPlaylistDetails, 
    removeProblemFromPlaylist
} from '../controllers/playlist.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getAllPlaylists);

router.get('/:playlistId', authMiddleware, getPlaylistDetails);

router.post("/create-playlist", authMiddleware, createPlaylist);

router.post("/add-problem/:playlistId/:problemId", authMiddleware, addProblemToPlaylist);

router.delete("/:playlistId", authMiddleware, deletePlaylist);

router.delete("/remove-problem/:playlistId/:problemId", authMiddleware, removeProblemFromPlaylist);

export default router;