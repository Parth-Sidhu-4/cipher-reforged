import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';

export const load: PageServerLoad = async ({ locals }) => {
	// ✅ Redirect unauthenticated users to the auth page
	if (!locals.user) throw redirect(302, '/auth');

	try {
		// ✅ Game access control via config
		const configSnap = await adminDB.collection('config').doc('gameStatus').get();
		const configData = configSnap.data();
		const now = new Date();

		const forceClosed = configData?.forceClosed === true;
		const activeFrom = configData?.activeFrom?.toDate?.();
		const activeUntil = configData?.activeUntil?.toDate?.();

		if (forceClosed || !activeFrom || !activeUntil || now < activeFrom || now > activeUntil) {
			return { blocked: true };
		}

		// ✅ Get user document
		const userDocSnap = await adminDB.collection('users').doc(locals.user.uid).get();
		const userData = userDocSnap.data();

		if (!userData) throw redirect(302, '/auth');
		if (userData?.banned) throw error(986, 'banned');
		if (!userData.team) throw redirect(302, '/team');

		const displayName = userData.displayName ?? userData.email ?? 'Anonymous';

		// ✅ Get team document
		const teamDocSnap = await adminDB.collection('teams').doc(userData.team).get();
		const teamData = teamDocSnap.data();

		if (!teamData) throw redirect(302, '/team');
		if (teamData?.banned) throw error(987, 'banned');

		const completed = teamData.completedLevels ?? [];

		// ✅ Fetch all questions
		const questionsSnap = await adminDB.collection('questions').orderBy('level').get();
		const allQuestions = questionsSnap.docs.map((doc) => {
			const data = doc.data();
			return {
				uid: doc.id,
				prompt: data?.prompt ?? '(No prompt)',
				level: data?.level ?? 0,
				hint: data?.hint ?? null
			};
		});

		const nextLevel = completed.length + 1;
		const questions = allQuestions.filter(
			(q) => completed.includes(q.uid) || q.level === nextLevel
		);

		// ✅ Load logs
		const logsSnap = await adminDB.collection('logs').doc(userData.team).get();
		const logsRaw = logsSnap.data()?.logs ?? [];

		const logs = logsRaw.map((log: any) => ({
			...log,
			timestamp: log.timestamp?.toDate?.().toISOString?.() ?? null
		}));

		return {
			blocked: false,
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
