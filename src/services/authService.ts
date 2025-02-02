import { db } from '../lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '../types/mongodb';

export class AuthService {
	private static collection = db.collection<User>('users');

	static async register(userData: Omit<User, '_id' | 'role' | 'createdAt'>) {
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const newUser = {
			...userData,
			password: hashedPassword,
			role: 'user',
			createdAt: new Date()
		};

		const result = await this.collection.insertOne(newUser);
		return { ...newUser, _id: result.insertedId };
	}

	static async login(email: string, password: string) {
		const user = await this.collection.findOne({ email });
		if (!user) throw new Error('User not found');

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) throw new Error('Invalid password');

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET || 'your-secret-key',
			{ expiresIn: '24h' }
		);

		return { user, token };
	}
}