import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, ExternalLink, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Resource } from '../types';
import toast from 'react-hot-toast';

export default function ResourceLibrary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    access_level: 'public' as const
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResources(data);
      } catch (error) {
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [user, navigate]);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([
          {
            ...newResource,
            created_by: user?.id
          }
        ])
        .select();

      if (error) throw error;

      setResources([data[0], ...resources]);
      setShowNewForm(false);
      setNewResource({
        title: '',
        description: '',
        url: '',
        access_level: 'public'
      });
      toast.success('Resource created successfully');
    } catch (error) {
      toast.error('Failed to create resource');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Resource
          </button>
        )}
      </div>

      {showNewForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Resource</h2>
          <form onSubmit={handleCreateResource} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={newResource.title}
                onChange={(e) =>
                  setNewResource({ ...newResource, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={newResource.description}
                onChange={(e) =>
                  setNewResource({ ...newResource, description: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="url"
                required
                value={newResource.url}
                onChange={(e) =>
                  setNewResource({ ...newResource, url: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Access Level</label>
              <select
                value={newResource.access_level}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    access_level: e.target.value as 'public' | 'user' | 'admin'
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="public">Public</option>
                <option value="user">Registered Users</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Add Resource
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Book className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold">{resource.title}</h2>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500 capitalize">
                  {resource.access_level}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80"
            >
              View Resource
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}