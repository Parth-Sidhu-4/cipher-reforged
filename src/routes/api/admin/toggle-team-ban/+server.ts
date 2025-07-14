// src/routes/api/admin/toggle-team-ban/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const POST: RequestHandler = async ({ request }) => {
	const { teamId, banned } = await request.json();

	if (!teamId || typeof banned !== 'boolean') {
		return json({ error: 'Invalid payload' }, { status: 400 });
	}

	try {
		await adminDB.collection('teams').doc(teamId).update({ banned });
		return json({ success: true });
	} catch (err) {
		console.error('Error updating team:', err);
		return json({ error: 'Failed to update team' }, { status: 500 });
	}
};
