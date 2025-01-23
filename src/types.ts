export interface User {
	id: string;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	role: 'user' | 'admin' | 'superuser';
	created_at: string;
}

export interface Newsletter {
	id: string;
	title: string;
	content: string;
	scheduled_for: string | null;
	created_at: string;
	created_by: string;
	status: 'draft' | 'scheduled' | 'sent';
}

export interface Subscription {
	id: string;
	user_id: string;
	category: string;
	created_at: string;
}

export interface Resource {
	id: string;
	title: string;
	description: string;
	url: string;
	access_level: 'public' | 'user' | 'admin';
	created_at: string;
}