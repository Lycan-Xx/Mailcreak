import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Clock, Mail, Archive, Undo, Delete, ArrowLeft, Upload } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import mockData from './mock-newsletter.json';

// Status Badge Component
const StatusBadge = ({ status }) => {
	const statusColors = {
		draft: 'bg-gray-600 text-gray-100',
		published: 'bg-green-600 text-green-100',
		scheduled: 'bg-blue-600 text-blue-100',
		sent: 'bg-purple-600 text-purple-100'
	};

	return (
		<span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
			{status}
		</span>
	);
};

// Newsletter List Item Component
const NewsletterItem = ({
	newsletter,
	onEdit,
	onDelete,
	onSend,
	onRestore,
	onPermaDelete,
	isTrash
}) => {
	const formatDate = (dateString) =>
		new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

	return (
		<div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors gap-4">
			<div className="flex-1 min-w-0 w-full">
				<div className="flex flex-wrap items-center gap-3 mb-2">
					<h3 className="text-gray-100 font-medium truncate">{newsletter.title}</h3>
					{!isTrash && <StatusBadge status={newsletter.status} />}
					{newsletter.originalSentId && (
						<span className="text-xs text-gray-400 w-full sm:w-auto">
							Derived from: {formatDate(newsletter.originalSentDate)}
						</span>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
					<span>{formatDate(isTrash ? newsletter.deletedAt : newsletter.updatedAt)}</span>
					{newsletter.scheduledAt && <span>• Scheduled: {formatDate(newsletter.scheduledAt)}</span>}
				</div>
			</div>

			<div className="flex items-center gap-3 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
				{!isTrash ? (
					<>
						{newsletter.status !== 'sent' && (
							<>
								<button onClick={() => onEdit(newsletter.id)} className="text-gray-400 hover:text-blue-400">
									<Edit size={18} />
								</button>
								<button onClick={() => onDelete(newsletter.id)} className="text-gray-400 hover:text-red-400">
									<Trash2 size={18} />
								</button>
							</>
						)}
						{newsletter.status === 'published' && (
							<button
								onClick={() => onSend(newsletter.id)}
								className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
							>
								Send
							</button>
						)}
					</>
				) : (
					<>
						<button onClick={() => onRestore(newsletter.id)} className="text-gray-400 hover:text-green-400">
							<Undo size={18} />
						</button>
						<button onClick={() => onPermaDelete(newsletter.id)} className="text-gray-400 hover:text-red-400">
							<Delete size={18} />
						</button>
					</>
				)}
			</div>
		</div>
	);
};

// Add this before the NewsletterEditor component
const imageHandler = () => {
	const input = document.createElement('input');
	input.setAttribute('type', 'file');
	input.setAttribute('accept', 'image/*');
	input.click();

	input.onchange = async () => {
		const file = input.files[0];
		const formData = new FormData();
		formData.append('image', file);

		// In a real app, you'd upload to a server and get back a URL
		// For demo, we'll use a local URL
		const url = URL.createObjectURL(file);

		const quill = document.querySelector('.ql-editor');
		const range = document.getSelection().getRangeAt(0);

		// Insert image with default size and alignment classes
		const img = document.createElement('img');
		img.src = url;
		img.className = 'w-1/2 mx-auto'; // Default: 50% width, centered
		range.insertNode(img);
	};
};

// Newsletter Editor Component
const NewsletterEditor = ({ isNew = false, newsletters = [], onSave }) => {
	const navigate = useNavigate();
	const { id } = useParams();

	const [formData, setFormData] = useState({
		title: '',
		content: '',
		status: 'draft',
		scheduledAt: null
	});

	useEffect(() => {
		if (!isNew && id) {
			const newsletter = newsletters.find(n => n.id === parseInt(id));
			if (newsletter) {
				setFormData(newsletter);
			}
		}
	}, [id, isNew, newsletters]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const newsletterData = {
			...formData,
			updatedAt: new Date().toISOString(),
			...(isNew && { createdAt: new Date().toISOString() }),
		};

		onSave(newsletterData);
		toast.success(`Newsletter ${isNew ? 'created' : 'updated'} successfully!`);
		navigate('/newsletters');
	};

	const modules = {
		toolbar: {
			container: [
				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
				['bold', 'italic', 'underline', 'strike'],
				[{ 'color': [] }, { 'background': [] }],
				[{ 'align': [] }],
				[{ 'list': 'ordered' }, { 'list': 'bullet' }],
				['link', 'image'],
				['clean']
			],
			handlers: {
				image: imageHandler
			}
		}
	};

	const formats = [
		'header',
		'bold', 'italic', 'underline', 'strike',
		'color', 'background',
		'align',
		'list', 'bullet',
		'link', 'image'
	];

	// Add image controls component
	const ImageControls = ({ editor }) => {
		const adjustImage = (size) => {
			const selected = editor.getSelection();
			if (selected) {
				const [leaf] = editor.getLeaf(selected.index);
				if (leaf.domNode.tagName === 'IMG') {
					const img = leaf.domNode;
					// Remove existing size classes
					img.className = img.className
						.replace(/w-\d+\/\d+/g, '')
						.replace(/mx-auto/g, '')
						.replace(/float-(left|right)/g, '');

					// Apply new size/position
					switch (size) {
						case 'small':
							img.className += ' w-1/4 mx-auto';
							break;
						case 'medium':
							img.className += ' w-1/2 mx-auto';
							break;
						case 'large':
							img.className += ' w-3/4 mx-auto';
							break;
						case 'left':
							img.className += ' w-1/3 float-left mr-4';
							break;
						case 'right':
							img.className += ' w-1/3 float-right ml-4';
							break;
					}
				}
			}
		};

		return (
			<div className="flex gap-2 mt-2">
				<button
					type="button"
					onClick={() => adjustImage('small')}
					className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
				>
					Small
				</button>
				<button
					type="button"
					onClick={() => adjustImage('medium')}
					className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
				>
					Medium
				</button>
				<button
					type="button"
					onClick={() => adjustImage('large')}
					className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
				>
					Large
				</button>
				<button
					type="button"
					onClick={() => adjustImage('left')}
					className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
				>
					Left
				</button>
				<button
					type="button"
					onClick={() => adjustImage('right')}
					className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
				>
					Right
				</button>
			</div>
		);
	};

	return (
		<div className="max-w-4xl mx-auto p-4 sm:p-6">
			<div className="flex items-center gap-4 mb-6 sm:mb-8">
				<button
					onClick={() => navigate('/newsletters')}
					className="text-gray-400 hover:text-white"
				>
					<ArrowLeft size={24} />
				</button>
				<h1 className="text-2xl font-bold text-white">
					{isNew ? 'Create Newsletter' : 'Edit Newsletter'}
				</h1>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
					<input
						type="text"
						value={formData.title}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
					<ReactQuill
						theme="snow"
						value={formData.content}
						onChange={(content) => setFormData({ ...formData, content })}
						modules={modules}
						formats={formats}
						className="bg-gray-800 rounded-lg"
					/>
					<ImageControls editor={ReactQuill.current} />
				</div>

				<div className="flex flex-col gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
						<select
							value={formData.status}
							onChange={(e) => setFormData({ ...formData, status: e.target.value })}
							className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
							<option value="scheduled">Scheduled</option>
						</select>
					</div>

					{formData.status === 'scheduled' && (
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Schedule Date & Time
							</label>
							<DatePicker
								selected={formData.scheduledAt ? new Date(formData.scheduledAt) : null}
								onChange={(date) => setFormData({ ...formData, scheduledAt: date })}
								showTimeSelect
								dateFormat="Pp"
								className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
							/>
						</div>
					)}
				</div>

				<div className="flex flex-col sm:flex-row justify-end gap-4">
					<button
						type="button"
						onClick={() => navigate('/newsletters')}
						className="w-full sm:w-auto px-4 py-2 text-gray-300 hover:text-white"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						{formData.status === 'draft' ? 'Save Draft' : 'Publish'}
					</button>
				</div>
			</form>
		</div>
	);
};

// Main Newsletters Component
const Newsletters = () => {
	const navigate = useNavigate();
	const [newsletters, setNewsletters] = useState(mockData.newsletters);
	const [activeTab, setActiveTab] = useState('active');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Newsletter state management functions
	const handleSave = (newsletter) => {
		setNewsletters(prev => {
			const existing = prev.find(n => n.id === newsletter.id);
			return existing
				? prev.map(n => n.id === newsletter.id ? newsletter : n)
				: [...prev, { ...newsletter, id: Date.now() }];
		});
	};

	const handleDelete = (id) => {
		setNewsletters(prev =>
			prev.map(n =>
				n.id === id ? { ...n, deletedAt: new Date().toISOString() } : n
			)
		);
	};

	const handlePermanentDelete = (id) => {
		setNewsletters(prev => prev.filter(n => n.id !== id));
	};

	const handleRestore = (id) => {
		setNewsletters(prev =>
			prev.map(n =>
				n.id === id ? { ...n, deletedAt: null } : n
			)
		);
	};

	const handleSend = (id) => {
		setNewsletters(prev =>
			prev.map(newsletter =>
				newsletter.id === id
					? {
						...newsletter,
						status: 'sent',
						sentAt: new Date().toISOString()
					}
					: newsletter
			)
		);
		toast.success('Newsletter sent successfully!');
	};

	// Filter newsletters based on current tab
	const filteredNewsletters = newsletters.filter(n => {
		if (activeTab === 'active') return !n.deletedAt && n.status !== 'sent';
		if (activeTab === 'sent') return n.status === 'sent';
		if (activeTab === 'trash') return n.deletedAt;
	});

	// Pagination
	const paginatedNewsletters = filteredNewsletters.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<Routes>
			<Route
				path="/"
				element={
					<div className="p-4 sm:p-8">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
							<h1 className="text-2xl sm:text-3xl font-bold text-white">Newsletters</h1>
							<button
								onClick={() => navigate('/newsletters/new')} // Use navigate here
								className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#4fd1c5] text-[#13151a] rounded-lg hover:bg-[#38b2ac] transition-colors"
							>
								<Plus className="w-5 h-5" />
								Create Newsletter
							</button>
						</div>

						<div className="flex gap-4 mb-6 border-b border-gray-700 overflow-x-auto">
							{['active', 'sent', 'trash'].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-4 py-2 ${activeTab === tab
										? 'border-b-2 border-blue-500 text-white'
										: 'text-gray-400 hover:text-white'
										}`}
								>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>

						<div className="grid gap-4 sm:gap-6">
							{paginatedNewsletters.map(newsletter => (
								<NewsletterItem
									key={newsletter.id}
									newsletter={newsletter}
									onEdit={(id) => navigate(`/newsletters/edit/${id}`)}
									onDelete={handleDelete}
									onRestore={handleRestore}
									onPermaDelete={handlePermanentDelete}
									onSend={handleSend}
									isTrash={activeTab === 'trash'}
								/>
							))}
						</div>

						{/* Pagination Controls */}
						<div className="flex justify-center gap-2 mt-6 sm:mt-8 overflow-x-auto">
							{Array.from({ length: Math.ceil(filteredNewsletters.length / itemsPerPage) }).map((_, i) => (
								<button
									key={i}
									onClick={() => setCurrentPage(i + 1)}
									className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
										}`}
								>
									{i + 1}
								</button>
							))}
						</div>
					</div>
				}
			/>
			<Route
				path="/new"
				element={
					<NewsletterEditor
						isNew={true}
						newsletters={newsletters} // Pass newsletters prop
						onSave={handleSave}
					/>
				}
			/>
			<Route
				path="/edit/:id"
				element={
					<NewsletterEditor
						isNew={false}
						newsletters={newsletters} // Pass newsletters prop
						onSave={handleSave}
					/>
				}
			/>
		</Routes>
	);
};

export default Newsletters;