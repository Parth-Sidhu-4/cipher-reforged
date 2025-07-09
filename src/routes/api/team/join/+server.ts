// src/routes/api/team/join/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const MAX_TEAM_SIZE = 3;

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { code } = await request.json();

	if (!code || typeof code !== 'string') {
		return json({ error: 'Team code is required' }, { status: 400 });
	}

	try {
		// 1. Look up the team slug from the code
		const codeDoc = await adminDB.collection('teamCodes').doc(code).get();

		if (!codeDoc.exists) {
			return json({ error: 'Invalid team code' }, { status: 404 });
		}

		const slug = codeDoc.data()?.slug;
		const teamRef = adminDB.collection('teams').doc(slug);
		const teamDoc = await teamRef.get();

		if (!teamDoc.exists) {
			return json({ error: 'Team not found' }, { status: 404 });
		}

		const teamData = teamDoc.data()!;

		if (teamData.members?.includes(locals.user.uid)) {
			return json({ error: 'You are already a member of this team' }, { status: 400 });
		}

		if (teamData.members?.length >= MAX_TEAM_SIZE) {
			return json(
				{ error: `Team is already full (max ${MAX_TEAM_SIZE} members)` },
				{ status: 403 }
			);
		}

		// 2. Add user to team
		await teamRef.update({
			members: FieldValue.arrayUnion(locals.user.uid)
		});

		// 3. Update user doc to link to this team
		await adminDB.collection('users').doc(locals.user.uid).set({ team: slug }, { merge: true });

		return json({ success: true, teamName: teamData.teamName });
	} catch (err) {
		console.error('🔥 Error joining team:', err);
		return json({ error: 'Failed to join team. Please try again.' }, { status: 500 });
	}
};
