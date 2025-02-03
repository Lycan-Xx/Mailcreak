import React from 'react';
import { Mail, Users, LayoutDashboard, Send, Settings2 } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Subscribers from './components/Subscribers';
import Newsletters from './components/Newsletters';
import Settings from './components/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#1a1d24]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subscribers" element={<Subscribers />} />
            <Route path="/newsletters/*" element={<Newsletters />} />
			<Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;