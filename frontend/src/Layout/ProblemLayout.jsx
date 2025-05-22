import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SideBar } from '../components/SideBar';

const ProblemLayout = () => {
  return (
    <div className="h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProblemLayout;
