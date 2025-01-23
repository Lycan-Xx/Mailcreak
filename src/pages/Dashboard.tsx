import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminPanel from './AdminPanel';
import NewsletterManager from './NewsletterManager';
import ResourceLibrary from './ResourceLibrary';
import { User, Settings, Mail, Book, Layout } from 'lucide-react';

export default function Dashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('dashboard');

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user, navigate]);

	if (!user) {
		return null;
	}

	const tabs = [
		{ id: 'dashboard', label: 'Dashboard', icon: Layout },
		{ id: 'newsletters', label: 'Newsletters', icon: Mail },
		{ id: 'resources', label: 'Resources', icon: Book },
		...(user.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Settings }] : []),
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case 'newsletters':
				return <NewsletterManager />;
			case 'resources':
				return <ResourceLibrary />;
			case 'admin':
				return user.role === 'admin' ? <AdminPanel /> : null;
			default:
				return (
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-2xl font-semibold mb-6">User Profile</h2>
						<div className="grid grid-cols-2 gap-6">
							<div>
								<p className="text-gray-600">Username</p>
								<p className="text-lg font-medium">{user.username}</p>
							</div>
							<div>
								<p className="text-gray-600">Full Name</p>
								<p className="text-lg font-medium">{`${user.first_name} ${user.last_name}`}</p>
							</div>
							<div>
								<p className="text-gray-600">Email</p>
								<p className="text-lg font-medium">{user.email}</p>
							</div>
							<div>
								<p className="text-gray-600">Phone Number</p>
								<p className="text-lg font-medium">{user.phone_number}</p>
							</div>
							<div>
								<p className="text-gray-600">Role</p>
								<p className="text-lg font-medium capitalize">{user.role}</p>
							</div>
							<div>
								<p className="text-gray-600">Member Since</p>
								<p className="text-lg font-medium">
									{new Date(user.created_at).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>
				);
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					Welcome, {user.username}!
				</h1>
			</div>

			<div className="mb-6">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8">
						{tabs.map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() => setActiveTab(id)}
								className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === id
										? 'border-primary text-primary'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}
                `}
							>
								<Icon className={`
                  h-5 w-5 mr-2
                  ${activeTab === id
										? 'text-primary'
										: 'text-gray-400 group-hover:text-gray-500'
									}
                `} />
								{label}
							</button>
						))}
					</nav>
				</div>
			</div>

			<div className="mt-6">
				{renderTabContent()}
			</div>
		</div>
	);
}