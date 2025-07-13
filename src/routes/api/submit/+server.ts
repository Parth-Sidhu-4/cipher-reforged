import type { RequestHandler } from './$types';
import { adminDB } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const { answer, questionId, userId } = await request.json();

	// Normalize input and answer
	const doc = await adminDB.collection('questions').doc(questionId).get();
	const correctAnswer = doc
		.data()
		?.answer?.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
	const given = answer?.toLowerCase().replace(/[^a-z0-9]/g, '');
	const correct = given === correctAnswer;

	// Get user's team
	const userDoc = await adminDB.collection('users').doc(userId).get();
	const teamId = userDoc.data()?.team;

	// Log individual attempt
	await adminDB
		.collection('logs')
		.doc(userId)
		.set(
			{
				logs: FieldValue.arrayUnion({
					questionId,
					entered: given,
					correct,
					timestamp: new Date()
				})
			},
			{ merge: true }
		);

	// Log team attempt (always, correct or not)
	if (teamId) {
		await adminDB
			.collection('logs')
			.doc(teamId)
			.set(
				{
					logs: FieldValue.arrayUnion({
						questionId,
						entered: given,
						correct,
						userId,
						timestamp: new Date()
					})
				},
				{ merge: true }
			);
	}

	if (correct) {
		// Update user progress
		await adminDB
			.collection('users')
			.doc(userId)
			.set(
				{
					completed: FieldValue.arrayUnion(questionId)
				},
				{ merge: true }
			);

		// Update team progress
		if (teamId) {
			await adminDB
				.collection('teams')
				.doc(teamId)
				.set(
					{
						completed: FieldValue.arrayUnion(questionId),
						completedLevels: FieldValue.arrayUnion(questionId),
						last_change: FieldValue.serverTimestamp(),
						level: FieldValue.increment(1)
					},
					{ merge: true }
				);
		}
	}

	return json({ correct });
};
