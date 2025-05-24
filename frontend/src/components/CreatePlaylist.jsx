import { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form'
import { createPlaylist } from '../store/Slices/playlistSlice.js';
import { useDispatch } from 'react-redux';
import { getOwnPlaylists } from '../store/Slices/playlistSlice.js';
import {zodResolver} from '@hookform/resolvers/zod';
import { playlistSchema } from '../schemas/playlistValidate.js';

export const CreatePlaylistModal = ({ isOpen, onClose }) => {

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(playlistSchema)
    });

    const watchTitle = watch('name', '');
    const watchDescription = watch('description', '');

    const handleCreate = async (data) => {
        await dispatch(createPlaylist(data));
        await dispatch(getOwnPlaylists());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 rounded-lg shadow-lg w-[95%] max-w-md p-6 relative border border-zinc-700">

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold text-lg">Create New List</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-400 hover:text-white w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleCreate)}>
                    <div className="mb-4">
                        <label className="text-sm text-gray-400">Title</label>
                        <input
                            type="text"
                            placeholder="Enter a list name"
                            className="mt-1 w-full px-3 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register('name', {required: true})}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">name is required</p>}
                        <p className="text-xs text-gray-500 mt-1">{watchTitle.length}/30</p>
                    </div>

                    <div className="mb-4">
                        <label className="text-sm text-gray-400">Description</label>
                        <textarea
                            placeholder="Describe your list"
                            className="mt-1 w-full px-3 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-md resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register('description')}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">description is required</p>}
                        <p className="text-xs text-gray-500 mt-1">{watchDescription.length}/150</p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-300 border border-gray-500 rounded-md hover:bg-zinc-700"
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
