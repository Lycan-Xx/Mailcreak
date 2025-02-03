import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

function NewsletterEditor({ isNew = false, onSave, newsletters = [] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState({
    title: '',
    content: '',
    status: 'draft',
    stats: { opens: 0, clicks: 0, bounces: 0 }
  });

  useEffect(() => {
    if (!isNew && id) {
      const existingNewsletter = newsletters.find(n => n.id === parseInt(id));
      if (existingNewsletter) {
        setNewsletter(existingNewsletter);
      }
    }
  }, [id, isNew, newsletters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newsletter);
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
              onSave({...newsletter, status: 'published'});
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

export default NewsletterEditor;
