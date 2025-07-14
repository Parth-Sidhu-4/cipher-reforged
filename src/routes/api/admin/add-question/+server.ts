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
		const body = await request.json();
		const { prompt, level, hint, images, answer } = body;

		if (
			!prompt ||
			typeof prompt !== 'string' ||
			typeof level !== 'number' ||
			!answer ||
			typeof answer !== 'string'
		) {
			return json({ error: 'Invalid input' }, { status: 400 });
		}

		const docId = `level${level}`;
		const docRef = adminDB.collection('questions').doc(docId);
		const existing = await docRef.get();

		if (existing.exists) {
			return json(
				{ error: `A question already exists for ${docId}. Use edit instead.` },
				{ status: 409 }
			);
		}

		await docRef.set({
			prompt,
			level,
			hint: hint || '',
			images: images || [],
			answer: answer.trim().toLowerCase(),
			createdAt: new Date()
		});

		return json({ success: true, id: docId });
	} catch (error) {
		console.error('Error adding question:', error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
