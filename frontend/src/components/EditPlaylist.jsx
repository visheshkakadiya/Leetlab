import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import { updatePlaylist, getOwnPlaylists, getPlaylistById } from '../store/Slices/playlistSlice.js';
import { playlistSchema } from '../schemas/playlistValidate.js';

export const EditPlaylist = ({ isOpen, onClose, playlist }) => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.playlist?.loading);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  // Set form values when playlist data is available
  useEffect(() => {
    if (playlist && isOpen) {
      setValue('name', playlist.name || '');
      setValue('description', playlist.description || '');
    }
  }, [playlist, setValue, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const watchTitle = watch('name', '');
  const watchDescription = watch('description', '');

  const handleEdit = async (data) => {
    try {     
      const updateData = {
        playlistId: playlist.id,
        name: data.name.trim(),
        description: data.description.trim()
      };

      await dispatch(updatePlaylist(updateData));
      await dispatch(getOwnPlaylists());
      onClose();
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-lg shadow-lg w-[95%] max-w-md p-6 relative border border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Edit Playlist</h2>
          <button onClick={handleClose} aria-label="Close">
            <X className="text-gray-400 hover:text-white w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleEdit)}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter a list name"
              className="w-full px-3 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 1, message: 'Name cannot be empty' },
                maxLength: { value: 30, message: 'Name cannot exceed 30 characters' }
              })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            <p className="text-xs text-gray-500 mt-1">{watchTitle.length}/30</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              placeholder="Describe your list"
              className="w-full px-3 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-md resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('description', {
                maxLength: { value: 150, message: 'Description cannot exceed 150 characters' }
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{watchDescription.length}/150</p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-300 border border-gray-500 rounded-md hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 transition-colors"
              disabled={!playlist?.id}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};