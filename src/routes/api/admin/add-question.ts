// src/routes/api/admin/add-question.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { prompt, level, hint, images } = await request.json();

	if (!prompt || typeof level !== 'number') {
		return json({ error: 'Missing prompt or level' }, { status: 400 });
	}

	try {
		await adminDB.collection('questions').add({
			prompt,
			level,
			hint: hint || '',
			images: images || []
		});

		return json({ success: true });
	} catch (e) {
		console.error('Error adding question:', e);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
