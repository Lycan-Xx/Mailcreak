import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Users, LayoutDashboard, Send, Settings } from 'lucide-react';

function Sidebar() {
  return (
    <div className="w-64 bg-[#13151a] text-white p-4">
      <div className="flex items-center gap-2 mb-8">
        <Mail className="w-8 h-8 text-[#4fd1c5]" />
        <h1 className="text-xl font-bold">MAILCREAK</h1>
      </div>
      
      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-[#4fd1c5] text-[#13151a]'
                : 'hover:bg-[#1a1d24] text-gray-300'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        
        <NavLink
          to="/subscribers"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-[#4fd1c5] text-[#13151a]'
                : 'hover:bg-[#1a1d24] text-gray-300'
            }`
          }
        >
          <Users className="w-5 h-5" />
          Subscribers
        </NavLink>
        
        <NavLink
          to="/newsletters"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-[#4fd1c5] text-[#13151a]'
                : 'hover:bg-[#1a1d24] text-gray-300'
            }`
          }
        >
          <Send className="w-5 h-5" />
          Newsletters
        </NavLink>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <button className="flex items-center gap-2 p-3 w-full rounded-lg hover:bg-[#1a1d24] text-gray-300 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
}

export default Sidebar;