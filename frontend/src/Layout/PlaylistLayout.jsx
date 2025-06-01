import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SideBar } from '../components/SideBar';

const PlaylistLayout = () => {
    return (
        <div className="h-screen flex flex-col w-full">
            <div className="flex flex-1 overflow-hidden">
                <SideBar />
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default PlaylistLayout;
