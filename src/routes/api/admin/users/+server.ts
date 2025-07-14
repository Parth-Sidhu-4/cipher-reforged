// src/routes/api/admin/users/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		const snapshot = await adminDB.collection('users').get();
		const users = snapshot.docs.map((doc) => ({
			uid: doc.id,
			...doc.data()
		}));

		return json({ users });
	} catch (err) {
		console.error('Error fetching users:', err);
		return json({ error: 'Failed to fetch users' }, { status: 500 });
	}
};
