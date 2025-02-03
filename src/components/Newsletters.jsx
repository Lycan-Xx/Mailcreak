import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Send, Eye, ArrowLeft } from 'lucide-react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function NewsletterList() {
  const navigate = useNavigate();
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this newsletter?')) {
      setNewsletters(newsletters.filter(n => n.id !== id));
      toast.success('Newsletter deleted successfully!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-900 text-yellow-200';
      case 'published':
        return 'bg-green-900 text-green-200';
      case 'scheduled':
        return 'bg-blue-900 text-blue-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

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

      <div className="grid gap-6">
        {newsletters.map((newsletter) => (
          <div key={newsletter.id} className="bg-[#1e2128] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{newsletter.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">Created: {newsletter.createdAt}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(newsletter.status)}`}>
                    {newsletter.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
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
                {newsletter.status === 'published' && (
                  <button
                    onClick={() => {
                      toast.success('Newsletter sent to all subscribers!');
                      setNewsletters(newsletters.map(n => 
                        n.id === newsletter.id 
                          ? {...n, status: 'sent'} 
                          : n
                      ));
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4fd1c5] text-[#13151a] rounded-lg hover:bg-[#38b2ac] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                )}
              </div>
            </div>
            
            {newsletter.status === 'published' && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterEditor({ isNew = false }) {
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState({
    title: '',
    content: '',
    status: 'draft'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(isNew ? 'Newsletter created successfully!' : 'Newsletter updated successfully!');
    navigate('/newsletters');
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/newsletters')}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-white">
          {isNew ? 'Create Newsletter' : 'Edit Newsletter'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={newsletter.title}
            onChange={(e) => setNewsletter({...newsletter, title: e.target.value})}
            className="w-full px-4 py-2 bg-[#282c34] text-white rounded-lg border border-gray-700 focus:border-[#4fd1c5] focus:outline-none"
            placeholder="Enter newsletter title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content
          </label>
          <textarea
            value={newsletter.content}
            onChange={(e) => setNewsletter({...newsletter, content: e.target.value})}
            className="w-full h-64 px-4 py-2 bg-[#282c34] text-white rounded-lg border border-gray-700 focus:border-[#4fd1c5] focus:outline-none resize-none"
            placeholder="Write your newsletter content here..."
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/newsletters')}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#4fd1c5] text-[#13151a] rounded-lg hover:bg-[#38b2ac] transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => {
              setNewsletter({...newsletter, status: 'published'});
              toast.success('Newsletter published successfully!');
              navigate('/newsletters');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}

function Newsletters() {
  return (
    <Routes>
      <Route path="/" element={<NewsletterList />} />
      <Route path="/new" element={<NewsletterEditor isNew={true} />} />
      <Route path="/edit/:id" element={<NewsletterEditor />} />
    </Routes>
  );
}

export default Newsletters;