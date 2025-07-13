import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth');

	const userDoc = await adminDB.collection('users').doc(locals.user.uid).get();
	const userData = userDoc.data();

	if (!userData?.team) {
		throw redirect(302, '/team'); // No team yet
	}

	const teamDoc = await adminDB.collection('teams').doc(userData.team).get();
	const teamData = teamDoc.data();

	if (!teamData) {
		throw redirect(302, '/team');
	}

	// Fetch all members' display names and check if they are leader
	const memberDocs = await Promise.all(
		(teamData.members || []).map((uid: string) => adminDB.collection('users').doc(uid).get())
	);

	const members = memberDocs
		.map((doc) => {
			const data = doc.data();
			if (!data) return null;

			return {
				uid: doc.id,
				displayName: data.displayName ?? 'Unnamed',
				isLeader: doc.id === teamData.leaderId
			};
		})
		.filter(Boolean); // remove nulls if any doc was missing

	return {
		teamName: teamData.teamName,
		code: teamData.code,
		gsv: teamData.gsv_verified ?? false, 
		members
	};
};
