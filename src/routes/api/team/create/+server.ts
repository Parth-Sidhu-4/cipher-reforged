import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function generateCode(length = 6) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let code = '';
	for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
	return code;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { teamName } = await request.json();

	if (!teamName || typeof teamName !== 'string') {
		return json({ error: 'Team name is required' }, { status: 400 });
	}

	const slug = teamName.toLowerCase().replace(/[^a-z0-9]/g, '');

	// Ensure unique team name
	const existing = await adminDB.collection('teams').doc(slug).get();
	if (existing.exists) {
		return json({ error: 'Team name already exists. Try something else.' }, { status: 409 });
	}

	const code = generateCode();

	try {
		// Save team
		await adminDB
			.collection('teams')
			.doc(slug)
			.set({
				teamName,
				code,
				leaderId: locals.user.uid,
				members: [locals.user.uid],
				level: 1,
				completed: [],
				banned: false, // 🔒 default
				created: FieldValue.serverTimestamp()
			});

		// Save code mapping (optional, for reverse lookup)
		await adminDB.collection('teamCodes').doc(code).set({
			slug,
			created: FieldValue.serverTimestamp()
		});

		// Update user doc
		await adminDB.collection('users').doc(locals.user.uid).set(
			{
				team: slug
			},
			{ merge: true }
		);

		return json({ success: true, teamName, code });
	} catch (err) {
		console.error('🔥 Error creating team:', err);
		return json({ error: 'Failed to create team. Please try again.' }, { status: 500 });
	}
};
