import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/firebase/admin';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const snapshot = await adminDB
			.collection('teams')
			.orderBy('level', 'desc')
			.orderBy('last_change', 'asc')
			.get();

		const leaderboard = snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				teamName: data.teamName,
				score: (data.level ?? 1) * 100,
				members: data.members?.length ?? 0,
				lastChange: data.last_change?.toDate?.().toISOString?.() ?? null
			};
		});

		return {
			leaderboard
		};
	} catch (err) {
		console.error('🔥 Error loading leaderboard:', err);
		throw error(500, 'Could not load leaderboard');
	}
};
