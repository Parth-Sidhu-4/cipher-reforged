import { adminDB } from '$lib/firebase/admin';

export async function updateTeamGSVStatus(teamSlug: string) {
	const teamRef = adminDB.collection('teams').doc(teamSlug);
	const teamSnap = await teamRef.get();
	const teamData = teamSnap.data();

	if (!teamData || !teamData.members) return;

	const userDocs = await Promise.all(
		teamData.members.map((uid: string) => adminDB.collection('users').doc(uid).get())
	);

	const hasGSV = userDocs.some((doc) => doc.exists && doc.data()?.email?.endsWith('@gsv.ac.in'));

	await teamRef.update({
		gsv_verified: hasGSV
	});
}
