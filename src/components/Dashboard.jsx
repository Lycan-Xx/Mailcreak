import React from 'react';
import { Users, Mail, Send, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, change, changeType }) {
  const isPositive = changeType === 'positive';
  const Arrow = isPositive ? ArrowUp : ArrowDown;
  
  return (
    <div className="bg-[#1e2128] p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#4fd1c5] p-3 rounded-lg">
          <Icon className="w-6 h-6 text-[#13151a]" />
        </div>
        <span className={`flex items-center gap-1 ${isPositive ? 'text-[#4fd1c5]' : 'text-red-400'}`}>
          <Arrow className="w-4 h-4" />
          {change}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm">{label}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { id: 1, type: 'subscriber', message: 'New subscriber joined', time: '2 minutes ago' },
    { id: 2, type: 'newsletter', message: 'March Tech Updates published', time: '1 hour ago' },
    { id: 3, type: 'subscriber', message: '5 subscribers opened newsletter', time: '3 hours ago' },
  ];

  return (
    <div className="bg-[#1e2128] p-6 rounded-xl mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 text-gray-300">
            <div className={`w-2 h-2 rounded-full ${
              activity.type === 'subscriber' ? 'bg-[#4fd1c5]' : 'bg-purple-500'
            }`} />
            <p className="flex-1">{activity.message}</p>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterMetrics() {
  const metrics = [
    { label: 'Open Rate', value: '45%' },
    { label: 'Click Rate', value: '12%' },
    { label: 'Bounce Rate', value: '0.8%' },
  ];

  return (
    <div className="bg-[#1e2128] p-6 rounded-xl mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Newsletter Metrics</h2>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="text-2xl font-bold text-[#4fd1c5]">{metric.value}</p>
            <p className="text-sm text-gray-400">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-[#1e2128] p-6 rounded-xl mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/newsletters/new"
          className="flex items-center justify-center gap-2 p-3 bg-[#4fd1c5] text-[#13151a] rounded-lg hover:bg-[#38b2ac] transition-colors"
        >
          <Mail className="w-5 h-5" />
          Create Newsletter
        </Link>
        <Link
          to="/subscribers"
          className="flex items-center justify-center gap-2 p-3 bg-[#282c34] text-white rounded-lg hover:bg-[#323842] transition-colors"
        >
          <Users className="w-5 h-5" />
          Manage Subscribers
        </Link>
      </div>
    </div>
  );
}

function Dashboard() {
  const stats = [
    { icon: Users, label: 'Total Subscribers', value: '1,234', change: '12%', changeType: 'positive' },
    { icon: Mail, label: 'Newsletters Sent', value: '45', change: '8%', changeType: 'positive' },
    { icon: Send, label: 'Delivery Rate', value: '98%', change: '2%', changeType: 'positive' },
    { icon: TrendingUp, label: 'Open Rate', value: '45%', change: '5%', changeType: 'negative' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <RecentActivity />
          <QuickActions />
        </div>
        <div>
          <NewsletterMetrics />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;