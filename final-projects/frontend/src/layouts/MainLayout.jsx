import React from 'react';
import { Outlet } from 'react-router-dom';
import TaskSidebar from '../components/TaskSidebar';

const MainLayout = () => {
   return (
      <div className="flex h-screen bg-gray-100">
         {/* Sidebar */}
         <div className="w-64 bg-white shadow-md">
            <div className="p-4">
               <h2 className="text-xl font-semibold mb-4">Navigation</h2>
               <TaskSidebar />
            </div>
         </div>

         {/* Main Content */}
         <div className="flex-1 overflow-auto">
            <Outlet />
         </div>
      </div>
   );
};

export default MainLayout; 