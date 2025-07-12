import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';
import admin from 'firebase-admin';

export const POST: RequestHandler = async ({ locals }) => {
	// Type guard for auth
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const userId = locals.user.uid;

	// Get user document
	const userRef = adminDB.collection('users').doc(userId);
	const userSnap = await userRef.get();
	const userData = userSnap.data();

	if (!userData?.team) {
		return json({ error: 'You are not in any team.' }, { status: 400 });
	}

	const teamSlug = userData.team;
	const teamRef = adminDB.collection('teams').doc(teamSlug);
	const teamSnap = await teamRef.get();

	if (!teamSnap.exists) {
		return json({ error: 'Team does not exist.' }, { status: 404 });
	}

	const teamData = teamSnap.data();
	if (!teamData) {
		return json({ error: 'Team data could not be retrieved.' }, { status: 500 });
	}

	const updatedMembers = (teamData.members || []).filter((id: string) => id !== userId);

	const batch = adminDB.batch();
	batch.update(teamRef, { members: updatedMembers });
	batch.update(userRef, { team: admin.firestore.FieldValue.delete() });

	// If the user was the leader and no one is left, delete the team
	if (teamData.leaderId === userId && updatedMembers.length === 0) {
		batch.delete(teamRef);
	}

	await batch.commit();

	return json({ success: true, message: 'You have successfully left the team.' });
};
