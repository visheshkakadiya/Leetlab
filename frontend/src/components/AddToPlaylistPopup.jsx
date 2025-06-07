import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getOwnPlaylists } from '../store/Slices/playlistSlice.js';

export const AddToPlaylistPopup = ({ isOpen, onClose, problemId, currentPlaylistId, onAdd }) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const ownPlaylists = useSelector((state) => state.playlist?.playlists || []);
    // console.log("ownPlaylists", ownPlaylists);
    // console.log("isOpen", isOpen);

    useEffect(() => {
        if (isOpen) {
            dispatch(getOwnPlaylists());
            setSelectedPlaylist('');
            setError('');
        }
    }, [isOpen, dispatch]);

    const availablePlaylists = ownPlaylists.filter(playlist => playlist.id !== currentPlaylistId);

    const handleAddToPlatlist = async () => {
        if (!selectedPlaylist) {
            setError('Please select a playlist');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const playlist = ownPlaylists.find(p => p.id === selectedPlaylist);

            const problemExists = playlist?.problems?.some(p => p.problemId === problemId);

            if (problemExists) {
                setError('Problem already exists in this playlist');
                setLoading(false);
                return;
            }

            await onAdd(selectedPlaylist, problemId);

            onClose();
        } catch (err) {
            setError(err.message || 'Failed to add problem to playlist');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#222222] rounded-xl border border-slate-700 w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-100">Add to Playlist</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Select Playlist
                    </label>
                    <select
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                        className="w-full bg-white/10 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none transition-colors"
                    >
                        <option value="" className="text-slate-400">Choose a playlist...</option>
                        {availablePlaylists.map((playlist) => (
                            <option key={playlist.id} value={playlist.id} className="text-black">
                                {playlist.name}
                            </option>
                        ))}
                    </select>


                    {availablePlaylists.length === 0 && (
                        <div className="mt-4 text-center py-4">
                            <div className="text-slate-400 mb-2">No other playlists found</div>
                            <p className="text-slate-500 text-sm">Create a new playlist to add this problem</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="px-6 pb-2">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddToPlatlist}
                        disabled={loading || !selectedPlaylist}
                        className="bg-white/10 hover:cursor-pointer disabled:bg-slate-700 disabled:text-slate-400 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <span>Adding...</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                <span>Add to Playlist</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};