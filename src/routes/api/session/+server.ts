import { adminAuth, adminDB } from '$lib/firebase/admin';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { idToken } = await request.json();

	if (!idToken) throw error(400, 'Missing ID token');

	const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
	const decodedToken = await adminAuth.verifyIdToken(idToken);

	// Create a session cookie
	const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
	cookies.set('__session', sessionCookie, {
		httpOnly: true,
		secure: true,
		path: '/',
		maxAge: expiresIn
	});

	// Add user to Firestore if not already there
	const userRef = adminDB.collection('users').doc(decodedToken.uid);
	const doc = await userRef.get();
	if (!doc.exists) {
		await userRef.set({
			uid: decodedToken.uid,
			email: decodedToken.email,
			name: decodedToken.name,
			photoURL: decodedToken.picture,
			created: new Date()
		});
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('__session', { path: '/' });
	return json({ success: true });
};
