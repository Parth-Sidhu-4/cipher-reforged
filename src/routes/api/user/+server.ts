import type { RequestHandler } from './$types';
import { adminDB } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return json({ hasTeam: false });

	const userDoc = await adminDB.collection('users').doc(locals.user.uid).get();
	const hasTeam = !!userDoc.data()?.team;

	return json({ hasTeam });
};
