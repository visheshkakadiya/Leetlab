import React from 'react'
import { 
    NotepadText,
    Library,
    Plus 
} from 'lucide-react';

export const SideBar = () => {
    return (
        <div className="bg-[#0e1111] text-white w-64 h-screen p-4 space-y-2 border-r-1 border-gray-600">
            {/* Home - Active */}
            <div className="flex items-center space-x-2 bg-white/10 text-white px-3 py-2 rounded-lg mt-2 mb-8">
                <span><Library size={20}/></span>
                <span className='font-bold'>Programs</span>
            </div>

            <hr />

            {/* Search */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer justify-between mt-0">
                <span className='text-gray-400'>Playlists</span>
                <span className='hover:bg-white/10 p-2 rounded-[5px]'><Plus size={20}/></span>
            </div>

            {/* Inbox */}
            <div className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer ">
                <span><NotepadText size={20}/></span>
                <span className='font-bold'>Playlists</span>
            </div>
        </div>

    )
}
