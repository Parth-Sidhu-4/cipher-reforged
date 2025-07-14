// src/routes/api/admin/users/update-ban/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { uid, banned } = await request.json();

		if (!uid || typeof banned !== 'boolean') {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		await adminDB.collection('users').doc(uid).update({ banned });

		return json({ success: true });
	} catch (err) {
		console.error('Error updating ban status:', err);
		return json({ error: 'Failed to update user' }, { status: 500 });
	}
};
