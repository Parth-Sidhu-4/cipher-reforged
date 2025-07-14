import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { adminAuth } from '$lib/firebase/admin';

const ALLOWED_UIDS = ['ZYVuKTPMO4Ydahd3UZqhZeBbZ3z2', 'jpjCQNrc4qevc7mtuiKnxtmGaJg1'];

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user || !ALLOWED_UIDS.includes(user.uid)) {
		throw redirect(303, '/unauthorized');
	}

	return {};
};
