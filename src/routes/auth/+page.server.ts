import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return;

	const userDoc = await adminDB.collection('users').doc(locals.user.uid).get();
	const teamId = userDoc.data()?.team;

	if (teamId) throw redirect(302, '/auth');
	else throw redirect(302, '/team');
};
