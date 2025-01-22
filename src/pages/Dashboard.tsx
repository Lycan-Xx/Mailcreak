import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Book, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Newsletter, Resource, Subscription } from '../types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [newslettersRes, resourcesRes, subscriptionsRes] = await Promise.all([
          supabase
            .from('newsletters')
            .select('*')
            .eq('status', 'sent')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
        ]);

        if (newslettersRes.error) throw newslettersRes.error;
        if (resourcesRes.error) throw resourcesRes.error;
        if (subscriptionsRes.error) throw subscriptionsRes.error;

        setNewsletters(newslettersRes.data);
        setResources(resourcesRes.data);
        setSubscriptions(subscriptionsRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {user?.email}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Newsletters */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Newspaper className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Recent Newsletters</h2>
          </div>
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <div key={newsletter.id} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium">{newsletter.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(newsletter.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Resources */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Book className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Latest Resources</h2>
          </div>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline"
                >
                  View Resource →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Your Subscriptions</h2>
          </div>
          <div className="space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between">
                  <span>{sub.category}</span>
                  <button
                    onClick={() => {/* Handle unsubscribe */}}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Unsubscribe
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No active subscriptions. Visit the newsletters page to subscribe.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}