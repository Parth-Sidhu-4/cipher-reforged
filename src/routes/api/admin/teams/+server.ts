import { json } from '@sveltejs/kit';
import { adminDB, adminAuth } from '$lib/firebase/admin';

export const GET = async () => {
	try {
		const snapshot = await adminDB.collection('teams').get();

		const teams = await Promise.all(
			snapshot.docs.map(async (doc) => {
				const data = doc.data();
				const members = await Promise.all(
					(data.members ?? []).map(async (uid: string) => {
						try {
							const userRecord = await adminAuth.getUser(uid);
							return userRecord.email ?? uid;
						} catch (e) {
							console.warn('User not found for UID:', uid);
							return uid;
						}
					})
				);
				return {
					id: doc.id,
					name: data.name ?? null,
					banned: data.banned ?? false,
					members
				};
			})
		);

		return json({ teams });
	} catch (error) {
		console.error('Error fetching teams:', error);
		return json({ error: 'Failed to fetch teams' }, { status: 500 });
	}
};
