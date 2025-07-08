import type { RequestHandler } from './$types';
import { adminDB } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { displayName } = await request.json();
	if (!displayName || typeof displayName !== 'string') {
		return json({ error: 'Invalid name' }, { status: 400 });
	}

	await adminDB.collection('users').doc(locals.user.uid).set({ displayName }, { merge: true });

	return json({ success: true });
};
