import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Users, LayoutDashboard, Send, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update icon sizes and responsive behavior
  const iconSize = "w-6 h-6"; // Increased from w-5 h-5

  return (
    <div className={`relative bg-[#13151a] text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-[#4fd1c5] rounded-full p-1 text-[#13151a] hover:bg-[#38b2ac] transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div className="p-4">
        <div className={`flex items-center gap-2 mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
          <Mail className="w-8 h-8 text-[#4fd1c5]" />
          {!isCollapsed && <h1 className="text-xl font-bold">MAILCREAK</h1>}
        </div>
        
        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#4fd1c5] text-[#13151a]'
                  : 'hover:bg-[#1a1d24] text-gray-300'
              } ${isCollapsed ? 'justify-center w-14 h-14' : ''}`
            }
            title="Dashboard"
          >
            <LayoutDashboard className={iconSize} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink
            to="/subscribers"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#4fd1c5] text-[#13151a]'
                  : 'hover:bg-[#1a1d24] text-gray-300'
              } ${isCollapsed ? 'justify-center w-14 h-14' : ''}`
            }
            title="Subscribers"
          >
            <Users className={iconSize} />
            {!isCollapsed && <span>Subscribers</span>}
          </NavLink>
          
          <NavLink
            to="/newsletters"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#4fd1c5] text-[#13151a]'
                  : 'hover:bg-[#1a1d24] text-gray-300'
              } ${isCollapsed ? 'justify-center w-14 h-14' : ''}`
            }
            title="Newsletters"
          >
            <Send className={iconSize} />
            {!isCollapsed && <span>Newsletters</span>}
          </NavLink>
        </nav>
        
        <div className={`absolute bottom-4 ${isCollapsed ? 'left-0 right-0 flex justify-center' : 'left-4 right-4'}`}>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#4fd1c5] text-[#13151a]'
                  : 'hover:bg-[#1a1d24] text-gray-300'
              } ${isCollapsed ? 'justify-center w-14 h-14' : ''}`
            }
            title="Settings"
          >
            <Settings2 className={iconSize} />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;