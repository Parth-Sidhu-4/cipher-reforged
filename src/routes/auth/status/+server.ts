// src/routes/auth/status/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ user: null });
	}

	// 🔥 Fetch the user's team status
	const userDoc = await adminDB.collection('users').doc(locals.user.uid).get();
	const userData = userDoc.data();

	return json({
		user: {
			uid: locals.user.uid,
			email: locals.user.email,
			name: locals.user.name,
			hasTeam: !!userData?.team // 👈 include this
		}
	});
};
