// fixTeams.ts
import 'dotenv/config';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (getApps().length === 0) {
	initializeApp({
		credential: cert({
			projectId: process.env.FB_PROJECT_ID,
			clientEmail: process.env.FB_CLIENT_EMAIL,
			privateKey: process.env.FB_PRIVATE_KEY
		})
	});
}

const db = getFirestore();

async function fixTeams() {
	const teamsSnap = await db.collection('teams').get();

	for (const teamDoc of teamsSnap.docs) {
		const data = teamDoc.data();

		let needsFix = false;
		let parsedMembers: string[] = [];

		// Fix members if stored as malformed string
		if (typeof data.members === 'string') {
			try {
				const parsed = JSON.parse(data.members);
				if (Array.isArray(parsed)) {
					parsedMembers = parsed.flat(); // flatten if it's an array of arrays
					needsFix = true;
				}
			} catch (e) {
				console.error(`Failed to parse members for ${teamDoc.id}:`, data.members);
			}
		} else if (Array.isArray(data.members)) {
			parsedMembers = data.members.flat();
		}

		if (needsFix) {
			console.log(`Fixing team: ${teamDoc.id}...`);
			await teamDoc.ref.update({
				members: parsedMembers
			});
		}

		// Optional: fix team name field if needed
		if (!data.teamName && data.name) {
			await teamDoc.ref.update({ teamName: data.name });
			console.log(`Updated teamName for ${teamDoc.id}`);
		}
	}
	console.log('✅ Fix completed.');
}

fixTeams().catch((err) => {
	console.error('❌ Failed to fix teams:', err);
});
