import React, { useEffect, useRef, useState } from 'react';
import { Star, Globe, Plus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
    AddProblemToPlaylist,
    RemoveProblemFromPlaylist,
    getOwnPlaylists,
} from '../store/Slices/playlistSlice.js';
import { CreatePlaylistModal } from './CreatePlaylist.jsx';

export const AddToPlaylist = ({ problemId }) => {

    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    const playlists = useSelector((state) => state.playlist.playlists);
    const playlist = useSelector((state) => state.playlist.playlist);

    // console.log('playlists', playlists);
    // console.log('playlist', playlist);

    // const isPoblemInPlaylist = playlist?.problems?.some(p => p.problemId === problemId);

    const isProblemInAnyPlaylist = playlists?.some((p) =>
        p.problems?.some(pr => pr.problemId === problemId)
    );


    // console.log('isPoblemInPlaylist', isPoblemInPlaylist);
    // console.log('isProblemInAnyPlaylist', isProblemInAnyPlaylist);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        dispatch(getOwnPlaylists());
    }, [dispatch]);


    const handleToggleProblem = async (playlistId) => {
        const playlist = playlists.find((playlist) => playlist.id === playlistId);
        if (!playlist) return;

        const isInPlaylist = playlist.problems?.some(p => p.problemId === problemId);

        if (isInPlaylist) {
            await dispatch(RemoveProblemFromPlaylist({ playlistId, problemId }));
        } else {
            await dispatch(AddProblemToPlaylist({ playlistId, problemId }));
        }

        dispatch(getOwnPlaylists());
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button onClick={toggleDropdown}>
                <Star size={10}
                    className={`w-5 h-5 ${isProblemInAnyPlaylist
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white'
                        }`}
                />
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#222222] rounded-lg shadow-lg z-50 overflow-hidden border border-gray-700">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-300">My Lists</div>

                    <ul className="max-h-60 overflow-y-auto">
                        {playlists?.length > 0 ? (
                            playlists.map((playlist) => (
                                <li
                                    key={playlist.id}
                                    className="flex items-center justify-between px-4 py-2 hover:bg-white/10 transition-colors"
                                >
                                    <label className="flex items-center gap-2 cursor-pointer w-full">
                                        <input
                                            type="checkbox"
                                            checked={playlist.problems?.some(p => p.problemId === problemId)}
                                            onChange={() => handleToggleProblem(playlist.id)}
                                            className="checkbox checkbox-sm"
                                        />

                                        <span className="truncate text-sm text-white flex-1">{playlist.name}</span>
                                        <Globe className="w-4 h-4 text-gray-400" />
                                    </label>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No playlists available</li>
                        )}
                    </ul>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 border-t border-gray-700"
                    >
                        <Plus className="w-4 h-4" />
                        Create a new list
                    </button>
                </div>
            )}

            <CreatePlaylistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};
