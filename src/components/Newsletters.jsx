import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Send } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NewsletterEditor from './NewsletterEditor';

function NewsletterList({ newsletters, onDelete, onUpdate }) {
  const navigate = useNavigate();

  const sentNewsletters = newsletters.filter(n => n.status === 'sent');
  const activeNewsletters = newsletters.filter(n => n.status !== 'sent');

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-900 text-yellow-200';
      case 'published':
        return 'bg-green-900 text-green-200';
      case 'scheduled':
        return 'bg-blue-900 text-blue-200';
      case 'sent':
        return 'bg-purple-900 text-purple-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this newsletter?')) {
      onDelete(id);
      toast.success('Newsletter deleted successfully');
    }
  };

  const renderNewsletterItem = (newsletter) => (
    <div key={newsletter.id} className="bg-[#1e2128] p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{newsletter.title}</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Created: {formatDateTime(newsletter.createdAt)}
            </span>
            {newsletter.sentAt && (
              <span className="text-sm text-gray-400">
                Sent: {formatDateTime(newsletter.sentAt)}
              </span>
            )}
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(newsletter.status)}`}>
              {newsletter.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {newsletter.status !== 'sent' && (
            <>
              <button
                onClick={() => navigate(`edit/${newsletter.id}`)}
                className="p-2 text-gray-400 hover:text-[#4fd1c5] transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(newsletter.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
          {newsletter.status === 'published' && (
            <button
              onClick={() => {
                toast.success('Newsletter sent to all subscribers!');
                onUpdate(newsletter.id, { 
                  ...newsletter, 
                  status: 'sent',
                  sentAt: new Date().toISOString() 
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#4fd1c5] text-[#13151a] rounded-lg hover:bg-[#38b2ac] transition-colors"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-[#4fd1c5]">{newsletter.stats.opens}</p>
            <p className="text-sm text-gray-400">Opens</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-[#4fd1c5]">{newsletter.stats.clicks}</p>
            <p className="text-sm text-gray-400">Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-[#4fd1c5]">{newsletter.stats.bounces}</p>
            <p className="text-sm text-gray-400">Bounces</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSentNewsletterItem = (newsletter) => (
    <div key={newsletter.id} 
         className="bg-[#1e2128] p-3 rounded-lg flex items-center justify-between hover:bg-[#262932] transition-colors">
      <div className="flex-1">
        <h4 className="text-white font-medium text-sm">{newsletter.title}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatDateTime(newsletter.sentAt)}</span>
          <span>•</span>
          <span>{newsletter.stats.opens} opens</span>
          <span>•</span>
          <span>{newsletter.stats.clicks} clicks</span>
        </div>
      </div>
      <button
        onClick={() => handleDelete(newsletter.id)}
        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Newsletters</h1>
        <button
          onClick={() => navigate('new')}
          className="flex items-center gap-2 px-4 py-2 bg-[#4fd1c5] text-[#13151a] rounded-lg hover:bg-[#38b2ac] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Newsletter
        </button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Active Newsletters</h2>
        {activeNewsletters.length > 0 ? (
          <div className="grid gap-6">
            {activeNewsletters.map(renderNewsletterItem)}
          </div>
        ) : (
          <p className="text-gray-400">No active newsletters</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Sent Newsletters</h2>
        {sentNewsletters.length > 0 ? (
          <div className="grid gap-2">
            {sentNewsletters.map(renderSentNewsletterItem)}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No sent newsletters</p>
        )}
      </div>
    </div>
  );
}

function Newsletters() {
  const [newsletters, setNewsletters] = useState([
    {
      id: 1,
      title: 'March Tech Updates',
      status: 'draft',
      createdAt: '2024-03-15',
      content: 'Welcome to our March newsletter...',
      stats: {
        opens: 0,
        clicks: 0,
        bounces: 0
      }
    },
    {
      id: 2,
      title: 'Product Launch Announcement',
      status: 'published',
      createdAt: '2024-03-14',
      content: "We're excited to announce...",
      stats: {
        opens: 245,
        clicks: 89,
        bounces: 3
      }
    }
  ]);

  const handleAddOrUpdateNewsletter = (newsletter) => {
    setNewsletters((prevNewsletters) => {
      const existingIndex = prevNewsletters.findIndex(n => n.id === newsletter.id);
      const currentTime = new Date().toISOString();
      
      const newsletterData = {
        ...newsletter,
        stats: newsletter.stats || { opens: 0, clicks: 0, bounces: 0 },
        createdAt: newsletter.createdAt || currentTime,
        sentAt: newsletter.status === 'sent' ? currentTime : newsletter.sentAt
      };

      if (existingIndex !== -1) {
        const updatedNewsletters = [...prevNewsletters];
        updatedNewsletters[existingIndex] = newsletterData;
        return updatedNewsletters;
      } else {
        return [...prevNewsletters, { 
          ...newsletterData, 
          id: prevNewsletters.length + 1
        }];
      }
    });
  };

  const handleDeleteNewsletter = (id) => {
    setNewsletters((prevNewsletters) => prevNewsletters.filter(n => n.id !== id));
  };

  return (
    <Routes>
      <Route path="/" element={<NewsletterList newsletters={newsletters} onDelete={handleDeleteNewsletter} onUpdate={handleAddOrUpdateNewsletter} />} />
      <Route path="/new" element={<NewsletterEditor isNew={true} onSave={handleAddOrUpdateNewsletter} />} />
      <Route path="/edit/:id" element={<NewsletterEditor onSave={handleAddOrUpdateNewsletter} newsletters={newsletters} />} />
    </Routes>
  );
}

export default Newsletters;