import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/');

	try {
		const userDocSnap = await adminDB.collection('users').doc(locals.user.uid).get();
		const userData = userDocSnap.data();

		if (!userData) throw redirect(302, '/auth');
		if (!userData.team) throw redirect(302, '/team');

		const displayName = userData.displayName ?? userData.email ?? 'Anonymous';

		const teamDocSnap = await adminDB.collection('teams').doc(userData.team).get();
		const teamData = teamDocSnap.data();
		if (!teamData) throw redirect(302, '/team');

		const completed = teamData.completedLevels ?? [];

		const questionsSnap = await adminDB.collection('questions').orderBy('level').get();
		const allQuestions = questionsSnap.docs.map((doc) => {
			const data = doc.data();
			return {
				uid: doc.id,
				prompt: data?.prompt ?? '(No prompt)',
				level: data?.level ?? 0,
				hint: data?.hint ?? null // 👈 INCLUDE THIS LINE
			};
		});

		// ✅ Filter: only show completed + current question
		const nextLevel = completed.length + 1;
		const questions = allQuestions.filter(
			(q) => completed.includes(q.uid) || q.level === nextLevel
		);

		const logsSnap = await adminDB.collection('logs').doc(userData.team).get();
		const logsRaw = logsSnap.data()?.logs ?? [];

		const logs = logsRaw.map((log: any) => ({
			...log,
			timestamp: log.timestamp?.toDate?.().toISOString?.() ?? null
		}));

		return {
			user: locals.user,
			displayName,
			questions,
			completed,
			logs
		};
	} catch (err) {
		console.error('🔥 Error in /play load:', err);
		throw error(500, 'Failed to load play data.');
	}
};
