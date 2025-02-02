import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';

config();

const uri = 'mongodb+srv://mossaicmw:TgIWvAzfVG6CJc0O@cluster-test.nfw4a.mongodb.net/';

export const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

export const db = client.db('mailcreak');

// Collections
export const collections = {
	users: db.collection('users'),
	newsletters: db.collection('newsletters'),
	categories: db.collection('categories'),
	subscriptions: db.collection('subscriptions'),
	resources: db.collection('resources')
};