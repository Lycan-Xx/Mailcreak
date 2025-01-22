import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Newsletter } from '../types';
import toast from 'react-hot-toast';

export default function NewsletterManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newNewsletter, setNewNewsletter] = useState({
    title: '',
    content: '',
    scheduled_for: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchNewsletters = async () => {
      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNewsletters(data);
      } catch (error) {
        toast.error('Failed to load newsletters');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [user, navigate]);

  const handleCreateNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .insert([
          {
            title: newNewsletter.title,
            content: newNewsletter.content,
            scheduled_for: newNewsletter.scheduled_for || null,
            created_by: user?.id
          }
        ])
        .select();

      if (error) throw error;

      setNewsletters([data[0], ...newsletters]);
      setShowNewForm(false);
      setNewNewsletter({ title: '', content: '', scheduled_for: '' });
      toast.success('Newsletter created successfully');
    } catch (error) {
      toast.error('Failed to create newsletter');
    }
  };

  const handleSendNewsletter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletters')
        .update({ status: 'sent' })
        .eq('id', id);

      if (error) throw error;

      setNewsletters(
        newsletters.map((n) =>
          n.id === id ? { ...n, status: 'sent' } : n
        )
      );
      toast.success('Newsletter sent successfully');
    } catch (error) {
      toast.error('Failed to send newsletter');
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
        <h1 className="text-3xl font-bold text-gray-900">Newsletter Manager</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Newsletter
        </button>
      </div>

      {showNewForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Newsletter</h2>
          <form onSubmit={handleCreateNewsletter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={newNewsletter.title}
                onChange={(e) =>
                  setNewNewsletter({ ...newNewsletter, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                required
                value={newNewsletter.content}
                onChange={(e) =>
                  setNewNewsletter({ ...newNewsletter, content: e.target.value })
                }
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule For (Optional)
              </label>
              <input
                type="datetime-local"
                value={newNewsletter.scheduled_for}
                onChange={(e) =>
                  setNewNewsletter({
                    ...newNewsletter,
                    scheduled_for: e.target.value
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
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
                Create Newsletter
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {newsletters.map((newsletter) => (
          <div
            key={newsletter.id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{newsletter.title}</h2>
                <p className="text-sm text-gray-500">
                  Created on {new Date(newsletter.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {newsletter.scheduled_for && (
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-5 w-5 mr-1" />
                    <span className="text-sm">
                      {new Date(newsletter.scheduled_for).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {newsletter.status === 'draft' && (
                  <button
                    onClick={() => handleSendNewsletter(newsletter.id)}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Now
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{newsletter.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}