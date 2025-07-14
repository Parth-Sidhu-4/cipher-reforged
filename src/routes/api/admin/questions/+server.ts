import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const GET = async () => {
	try {
		const snapshot = await adminDB.collection('questions').get();
		const questions = snapshot.docs.map((doc) => ({
			uid: doc.id,
			...doc.data()
		}));
		return json({ questions });
	} catch (error) {
		console.error('Error fetching questions:', error);
		return json({ error: 'Failed to fetch questions' }, { status: 500 });
	}
};
