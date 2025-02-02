import { ObjectId } from 'mongodb';

export interface User {
	_id?: ObjectId;
	email: string;
	password: string;
	username: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	role: 'user' | 'admin' | 'superuser';
	createdAt: Date;
}

export interface Newsletter {
	_id?: ObjectId;
	title: string;
	content: string;
	categoryId?: ObjectId;
	status: 'draft' | 'scheduled' | 'sent';
	scheduledFor?: Date;
	createdBy: ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface Category {
	_id?: ObjectId;
	name: string;
	description?: string;
	createdBy: ObjectId;
	createdAt: Date;
}

export interface Subscription {
	_id?: ObjectId;
	userId: ObjectId;
	categoryId: ObjectId;
	createdAt: Date;
}