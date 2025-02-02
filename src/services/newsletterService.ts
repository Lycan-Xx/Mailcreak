import { db } from '../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Newsletter } from '../types/mongodb';

export class NewsletterService {
	private static collection = db.collection<Newsletter>('newsletters');

	static async create(data: Omit<Newsletter, '_id' | 'createdAt' | 'updatedAt'>) {
		const newsletter = {
			...data,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		const result = await this.collection.insertOne(newsletter);
		return { ...newsletter, _id: result.insertedId };
	}

	static async getAll(userId: string) {
		return this.collection
			.find({ createdBy: new ObjectId(userId) })
			.sort({ createdAt: -1 })
			.toArray();
	}
}