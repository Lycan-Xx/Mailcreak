import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = 'mongodb+srv://mossaicmw:TgIWvAzfVG6CJc0O@cluster-test.nfw4a.mongodb.net/';
const client = new MongoClient(uri);

async function initializeDatabase() {
	try {
		await client.connect();
		console.log('Connected to MongoDB');

		const db = client.db('mailcreak');

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
						role: { enum: ['user', 'admin'] },
						username: { bsonType: 'string' },
						firstName: { bsonType: 'string' },
						lastName: { bsonType: 'string' },
						phoneNumber: { bsonType: 'string' },
						createdAt: { bsonType: 'date' }
					}
				}
			}
		});

		await db.createCollection('newsletters', {
			validator: {
				$jsonSchema: {
					bsonType: 'object',
					required: ['title', 'content', 'createdBy'],
					properties: {
						title: { bsonType: 'string' },
						content: { bsonType: 'string' },
						status: { enum: ['draft', 'scheduled', 'sent'] },
						scheduledFor: { bsonType: 'date' },
						createdBy: { bsonType: 'objectId' },
						createdAt: { bsonType: 'date' }
					}
				}
			}
		});

		// Create indexes
		await db.collection('users').createIndex({ email: 1 }, { unique: true });
		await db.collection('users').createIndex({ username: 1 }, { unique: true });
		await db.collection('newsletters').createIndex({ createdBy: 1 });
		await db.collection('newsletters').createIndex({ status: 1 });

		console.log('Database initialized successfully');
	} catch (error) {
		console.error('Error initializing database:', error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

initializeDatabase();