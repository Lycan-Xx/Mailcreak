import { db } from '../mongodb';

export async function initializeDatabase() {
	try {
		// Create collections with validation
		await db.createCollection('users', {
			validator: {
				$jsonSchema: {
					bsonType: 'object',
					required: ['email', 'password', 'role'],
					properties: {
						email: {
							bsonType: 'string',
							pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
						},
						password: { bsonType: 'string' },
						username: { bsonType: 'string' },
						first_name: { bsonType: 'string' },
						last_name: { bsonType: 'string' },
						phone_number: { bsonType: 'string' },
						role: { enum: ['user', 'admin', 'superuser'] },
						created_at: { bsonType: 'date' }
					}
				}
			}
		});

		await db.createCollection('newsletters', {
			validator: {
				$jsonSchema: {
					bsonType: 'object',
					required: ['title', 'content', 'created_by'],
					properties: {
						title: { bsonType: 'string' },
						content: { bsonType: 'string' },
						category_id: { bsonType: 'objectId' },
						status: { enum: ['draft', 'scheduled', 'sent'] },
						scheduled_for: { bsonType: ['date', 'null'] },
						created_by: { bsonType: 'objectId' },
						created_at: { bsonType: 'date' }
					}
				}
			}
		});

		// Create indexes
		await db.collection('users').createIndex({ email: 1 }, { unique: true });
		await db.collection('users').createIndex({ username: 1 }, { unique: true });
		await db.collection('newsletters').createIndex({ created_at: -1 });
		await db.collection('categories').createIndex({ name: 1 }, { unique: true });

		console.log('Database initialized successfully');
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
}