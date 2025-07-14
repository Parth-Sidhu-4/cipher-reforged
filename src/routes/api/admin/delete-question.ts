// src/routes/api/admin/delete-question.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await request.json(); // Extract ID from request body

		if (!id || typeof id !== 'string') {
			return json({ error: 'Invalid ID' }, { status: 400 });
		}

		await adminDB.collection('questions').doc(id).delete();
		return json({ success: true });
	} catch (e) {
		console.error('Error deleting question:', e);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
