// src/routes/team/+page.server.ts
import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/firebase/admin';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	const userDoc = await adminDB.collection('users').doc(locals.user.uid).get();
	const user = userDoc.data();

	// If already in a team, send them to /play
	if (user?.team) {
		throw redirect(302, '/play');
	}

	// Otherwise show the join/create team UI
	return {};
};
