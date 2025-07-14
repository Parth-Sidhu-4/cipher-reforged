import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

const ALLOWED_UIDS = ['ZYVuKTPMO4Ydahd3UZqhZeBbZ3z2', 'jpjCQNrc4qevc7mtuiKnxtmGaJg1'];

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;

	if (!user || !ALLOWED_UIDS.includes(user.uid)) {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const { id, prompt, level, hint, images, answer } = await request.json();

		// 🔹 Validation block
		if (
			!id ||
			typeof id !== 'string' ||
			!prompt ||
			typeof prompt !== 'string' ||
			typeof level !== 'number' ||
			!answer ||
			typeof answer !== 'string'
		) {
			return json({ error: 'Missing or invalid fields' }, { status: 400 });
		}

		const docRef = adminDB.collection('questions').doc(id);
		const doc = await docRef.get();

		if (!doc.exists) {
			return json({ error: `No question found with ID "${id}"` }, { status: 404 });
		}

		await docRef.update({
			prompt,
			level,
			hint: hint || '',
			images: images || [],
			answer: answer.trim().toLowerCase(),
			updatedAt: new Date()
		});

		return json({ success: true });
	} catch (err) {
		console.error('Error updating question:', err);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
