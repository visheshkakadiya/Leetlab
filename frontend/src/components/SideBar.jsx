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
import { NavLink, useLocation } from 'react-router-dom';

export const SideBar = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const playlists = useSelector((state) => state.playlist.playlists);

  useEffect(() => {
    dispatch(getOwnPlaylists());
  }, [dispatch]);

  return (
    <div className="bg-[#0e1111] text-white w-64 h-screen p-4 space-y-2 border-r-1 border-gray-600">
      <NavLink
        to="/problems"
        className={({ isActive }) =>
          `flex items-center space-x-2 px-3 py-2 rounded-lg mt-2 mb-8 transition-colors ${isActive ? 'bg-[#222222] text-white pointer-events-none' : 'hover:bg-white/10 text-white'
          }`
        }
      >
        <span><Library size={20} /></span>
        <span className='font-bold'>Programs</span>
      </NavLink>

      <hr />

      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer justify-between mt-0">
        <span className='text-gray-400'>Playlists</span>
        <span
          className='hover:bg-white/10 p-2 rounded-[5px]'
          onClick={() => setModalOpen(true)}
        >
          <Plus size={20} />
        </span>
      </div>

      <CreatePlaylistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <div className="space-y-1">
        {playlists.length > 0 ? (
          playlists.map((playlist) => {
            const path = `/playlist/${playlist.id}`;

            return (
              <NavLink
                key={playlist.id}
                to={path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-[#222222] text-white pointer-events-none' : 'hover:bg-[#222222]'
                  }`
                }
              >
                <div className="flex items-center gap-2 w-full">
                  <NotepadText size={20} />
                  <span className="truncate text-sm flex-1">{playlist.name}</span>
                  {playlist?.isPublished ? (
                    <Globe size={20} />
                  ) : (
                    <Lock size={20} />
                  )}
                </div>
              </NavLink>
            );
          })
        ) : (
          <div className="px-4 py-2 text-gray-500">No playlists available</div>
        )}
      </div>
    </div>
  );
};
