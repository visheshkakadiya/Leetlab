import React, { useState, useEffect } from 'react';
import {
    NotepadText,
    Library,
    Plus,
    Globe,
    Lock
} from 'lucide-react';
import { CreatePlaylistModal } from './CreatePlaylist';
import { getOwnPlaylists } from '../store/Slices/playlistSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const SideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const playlists = useSelector((state) => state.playlist.playlists);
    const isPublish = useSelector((state) => state.playlist.isPublished);

    useEffect(() => {
        dispatch(getOwnPlaylists());
    }, [dispatch]);

    return (
        <div className="bg-[#0e1111] text-white w-64 h-screen p-4 space-y-2 border-r-1 border-gray-600">
            <div className="flex items-center space-x-2 bg-white/10 text-white px-3 py-2 rounded-lg mt-2 mb-8">
                <span><Library size={20} /></span>
                <span className='font-bold'>Programs</span>
            </div>

            <hr />

            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer justify-between mt-0">
                <span className='text-gray-400'>Playlists</span>
                <span className='hover:bg-white/10 p-2 rounded-[5px]' onClick={() => setModalOpen(true)}>
                    <Plus size={20} />
                </span>
            </div>

            <CreatePlaylistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

            <ul className="space-y-1">
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <li
                            key={playlist.id}
                            className="flex items-center justify-between px-4 py-2 hover:bg-[#222222] transition-colors rounded-md"
                            onClick={() => navigate(`/playlist/${playlist.id}`)}
                        >
                            <div className="flex items-center gap-2 cursor-pointer w-full">
                                <span><NotepadText size={20} /></span>
                                <span className="truncate text-sm text-white flex-1">{playlist.name}</span>
                                {isPublish ? (
                                    <span><Globe size={20} /></span>
                                ) : (
                                    <span><Lock size={20} /></span>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-2 text-gray-500">No playlists available</li>
                )}
            </ul>
        </div>
    );
};
