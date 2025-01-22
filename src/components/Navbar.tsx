import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Menu, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-[#0ea2bd] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Mail className="h-6 w-6" />
              <span className="font-bold text-xl">techy 2</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/resources" className="hover:text-gray-200">Resources</Link>
              <Link to="/newsletters" className="hover:text-gray-200">Newsletters</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:text-gray-200">Admin Panel</Link>
              )}
              {user ? (
                <div className="flex items-center space-x-4">
                  <span>{user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="bg-white text-[#0ea2bd] px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="bg-white text-[#0ea2bd] px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}