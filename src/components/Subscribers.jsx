import React, { useState } from 'react';
import { Search, Plus, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Switch from '@mui/material/Switch';

function Subscribers() {
  const [subscribers, setSubscribers] = useState([
    { id: 1, email: 'john@example.com', name: 'John Doe', status: 'active', joinedDate: '2024-03-15', lastOpened: '2024-03-15', openRate: '85%' },
    { id: 2, email: 'jane@example.com', name: 'Jane Smith', status: 'active', joinedDate: '2024-03-14', lastOpened: '2024-03-14', openRate: '92%' },
    { id: 3, email: 'bob@example.com', name: 'Bob Johnson', status: 'inactive', joinedDate: '2024-03-13', lastOpened: '2024-03-10', openRate: '45%' },
    { id: 4, email: 'sarah@example.com', name: 'Sarah Wilson', status: 'active', joinedDate: '2024-03-12', lastOpened: '2024-03-15', openRate: '78%' },
    { id: 5, email: 'mike@example.com', name: 'Mike Thompson', status: 'inactive', joinedDate: '2024-03-11', lastOpened: '2024-03-13', openRate: '63%' },
    { id: 6, email: 'emma@example.com', name: 'Emma Davis', status: 'active', joinedDate: '2024-03-10', lastOpened: '2024-03-14', openRate: '91%' },
    { id: 7, email: 'alex@example.com', name: 'Alex Brown', status: 'inactive', joinedDate: '2024-03-09', lastOpened: '2024-03-11', openRate: '32%' },
    { id: 8, email: 'lisa@example.com', name: 'Lisa Chen', status: 'active', joinedDate: '2024-03-08', lastOpened: '2024-03-15', openRate: '88%' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '' });
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || subscriber.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddSubscriber = (e) => {
    e.preventDefault();
    const subscriber = {
      id: subscribers.length + 1,
      ...newSubscriber,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      lastOpened: '-',
      openRate: '0%'
    };
    setSubscribers([...subscribers, subscriber]);
    setNewSubscriber({ email: '', name: '' });
    setShowAddModal(false);
    toast.success('Subscriber added successfully!');
  };

  const handleDeleteSubscriber = (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      toast.success('Subscriber removed successfully!');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Joined Date', 'Last Opened', 'Open Rate'];
    const csvContent = [
      headers.join(','),
      ...filteredSubscribers.map(sub => 
        [sub.name, sub.email, sub.status, sub.joinedDate, sub.lastOpened, sub.openRate].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Subscribers exported successfully!');
  };

  const handleToggle = (id) => {
    setSubscribers(
      subscribers.map(subscriber => {
        if (subscriber.id === id) {
          return {
            ...subscriber,
            status: subscriber.status === 'active' ? 'inactive' : 'active'
          };
        }
        return subscriber;
      })
    );
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Subscribers</h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 text-sm sm:text-base bg-[#282c34] text-white rounded-lg hover:bg-[#323842] transition-colors"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 text-sm sm:text-base bg-[#4fd1c5] text-[#13151a] rounded-lg hover:bg-[#38b2ac] transition-colors"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Subscriber
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#1e2128] text-white rounded-lg border border-gray-700 focus:border-[#4fd1c5] focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#1e2128] text-white rounded-lg border border-gray-700 focus:border-[#4fd1c5] focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table Section - with horizontal scroll for mobile */}
      <div className="bg-[#1e2128] rounded-xl overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#13151a]">
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">Name</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">Email</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">Joined Date</th>
              <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">Last Opened</th>
              <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">Open Rate</th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-[#282c34] transition-colors">
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">{subscriber.name}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">{subscriber.email}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    subscriber.status === 'active' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {subscriber.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">{subscriber.joinedDate}</td>
                <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">{subscriber.lastOpened}</td>
                <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">{subscriber.openRate}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                  <div className="flex items-center justify-end gap-2 sm:gap-4">
                    <Switch
                      size="small"
                      checked={subscriber.status === 'active'}
                      onChange={() => handleToggle(subscriber.id)}
                      inputProps={{ 'aria-label': 'Toggle subscriber status' }}
                    />
                    <button
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal with responsive design */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e2128] p-4 sm:p-6 rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">Add New Subscriber</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newSubscriber.name}
                  onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-[#282c34] text-white rounded-lg border border-gray-700 focus:border-[#4fd1c5] focus:outline-none"
                  placeholder="Enter subscriber's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newSubscriber.email}
                  onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-[#282c34] text-white rounded-lg border border-gray-700 focus:border-[#4fd1c5] focus:outline-none"
                  placeholder="Enter subscriber's email"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm bg-[#4fd1c5] text-[#13151a] rounded-lg hover:bg-[#38b2ac] transition-colors order-1 sm:order-2"
                >
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscribers;
